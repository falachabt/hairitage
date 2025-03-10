
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
  
  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage', error);
      }
    }
  }, []);
  
  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const addToFavorites = (product: Product) => {
    if (!isFavorite(product.id)) {
      setFavorites(prev => [...prev, product]);
      toast({
        title: "Ajouté aux favoris",
        description: `${product.name} a été ajouté à vos favoris`,
      });
    }
  };
  
  const removeFromFavorites = (productId: string) => {
    const productToRemove = favorites.find(item => item.id === productId);
    setFavorites(prev => prev.filter(item => item.id !== productId));
    
    if (productToRemove) {
      toast({
        title: "Retiré des favoris",
        description: `${productToRemove.name} a été retiré de vos favoris`,
      });
    }
  };
  
  const clearFavorites = () => {
    setFavorites([]);
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
