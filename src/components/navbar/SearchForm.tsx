
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchFormProps {
  initialQuery?: string;
  className?: string;
  onSearch?: () => void;
}

const SearchForm = ({ initialQuery = '', className = '', onSearch }: SearchFormProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      if (onSearch) onSearch();
    }
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
          <Search size={18} />
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
