
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

interface AddressAutocompleteProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (address: {
    fullAddress: string;
    city?: string;
    postalCode?: string;
    country?: string;
  }) => void;
  placeholder?: string;
  error?: boolean;
  required?: boolean;
}

const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  id,
  label,
  value,
  onChange,
  onAddressSelect,
  placeholder = "Entrez votre adresse",
  error = false,
  required = false,
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside the suggestions dropdown to close it
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${NOMINATIM_API}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=fr,be,ch,lu,mc`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Debounce the search
    if (searchTimeout) {
      window.clearTimeout(searchTimeout);
    }

    if (inputValue.length >= 3) {
      const timeout = window.setTimeout(() => {
        searchAddress(inputValue);
      }, 300);
      setSearchTimeout(timeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    onChange(suggestion.display_name);
    setShowSuggestions(false);

    if (onAddressSelect) {
      const city = suggestion.address.city || suggestion.address.town || suggestion.address.village || '';
      onAddressSelect({
        fullAddress: suggestion.display_name,
        city,
        postalCode: suggestion.address.postcode,
        country: suggestion.address.country,
      });
    }
  };

  return (
    <div className="relative space-y-2">
      <Label htmlFor={id} className="flex items-center">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`${error ? 'border-destructive' : ''} pr-10`}
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <MapPin size={16} />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg"
        >
          <ul className="py-1 max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li 
                key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
