
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load favorites from localStorage or Supabase depending on authentication status
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        // User is logged in, fetch favorites from Supabase
        try {
          const { data: favoritesData, error: favoritesError } = await supabase
            .from('user_favorites')
            .select('product_id')
            .eq('user_id', user.id);
            
          if (favoritesError) throw favoritesError;
          
          if (favoritesData && favoritesData.length > 0) {
            // Get existing product details from localStorage if available
            const savedFavorites = localStorage.getItem('favorites');
            let localFavorites: Product[] = [];
            
            if (savedFavorites) {
              try {
                localFavorites = JSON.parse(savedFavorites);
              } catch (error) {
                console.error('Failed to parse favorites from localStorage', error);
              }
            }
            
            // Filter local favorites to match the ones in the database
            const productIds = favoritesData.map(fav => fav.product_id);
            const matchingFavorites = localFavorites.filter(
              product => productIds.includes(product.id)
            );
            
            setFavorites(matchingFavorites);
          }
        } catch (error) {
          console.error('Failed to fetch favorites from Supabase', error);
          // Fall back to localStorage
          const savedFavorites = localStorage.getItem('favorites');
          if (savedFavorites) {
            try {
              setFavorites(JSON.parse(savedFavorites));
            } catch (error) {
              console.error('Failed to parse favorites from localStorage', error);
            }
          }
        }
      } else {
        // User is not logged in, use localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          try {
            setFavorites(JSON.parse(savedFavorites));
          } catch (error) {
            console.error('Failed to parse favorites from localStorage', error);
          }
        }
      }
    };
    
    loadFavorites();
  }, [user]);
  
  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const addToFavorites = async (product: Product) => {
    if (!isFavorite(product.id)) {
      // Add to local state first for instant feedback
      setFavorites(prev => [...prev, product]);
      
      // If user is logged in, save to Supabase as well
      if (user) {
        try {
          const { error } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              product_id: product.id
            });
            
          if (error) {
            throw error;
          }
        } catch (error) {
          console.error('Failed to save favorite to Supabase', error);
          // Don't revert the UI change to avoid confusion
        }
      }
      
      toast({
        title: "Ajouté aux favoris",
        description: `${product.name} a été ajouté à vos favoris`,
      });
    }
  };
  
  const removeFromFavorites = async (productId: string) => {
    const productToRemove = favorites.find(item => item.id === productId);
    
    // Remove from local state first for instant feedback
    setFavorites(prev => prev.filter(item => item.id !== productId));
    
    // If user is logged in, remove from Supabase as well
    if (user) {
      try {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Failed to remove favorite from Supabase', error);
        // Don't revert the UI change to avoid confusion
      }
    }
    
    if (productToRemove) {
      toast({
        title: "Retiré des favoris",
        description: `${productToRemove.name} a été retiré de vos favoris`,
      });
    }
  };
  
  const clearFavorites = async () => {
    // Clear local state first
    setFavorites([]);
    
    // If user is logged in, clear from Supabase as well
    if (user) {
      try {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Failed to clear favorites from Supabase', error);
      }
    }
    
    toast({
      title: "Favoris vidés",
      description: "Tous les produits ont été retirés de vos favoris",
    });
  };
  
  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };
  
  const favoritesCount = favorites.length;
  
  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    isFavorite,
    favoritesCount
  };
  
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
