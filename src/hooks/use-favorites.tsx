
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
  syncFavoritesWithServer: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      // User is logged in, fetch favorites from server
      fetchFavoritesFromServer();
    } else {
      // User is not logged in, load from localStorage
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Failed to parse favorites from localStorage', error);
        }
      }
    }
  }, [user]);

  // Sync favorites with server when user logs in
  useEffect(() => {
    if (user) {
      syncFavoritesWithServer();
    }
  }, [user]);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchFavoritesFromServer = async () => {
    if (!user) return;

    try {
      const { data: userFavorites, error: favoritesError } = await supabase
        .from('user_favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (favoritesError) throw favoritesError;

      if (userFavorites && userFavorites.length > 0) {
        // Get product details for each favorite
        const productIds = userFavorites.map(fav => fav.product_id);
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            product_images (
              image_url,
              is_primary
            )
          `)
          .in('id', productIds);

        if (productsError) throw productsError;

        if (productsData) {
          setFavorites(productsData.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1605980625600-88d6716a8a21?q=80&w=1974',
            description: product.description,
            category: product.category,
            featured: product.featured,
            inStock: product.in_stock,
            rating: product.rating,
            reviews: product.reviews,
            colors: product.colors,
            length: product.length,
            material: product.material,
            capSize: product.cap_size,
          })));
        }
      } else {
        // No favorites found on server, use local favorites
        setFavorites([]);
      }
    } catch (error) {
      console.error('Failed to fetch favorites from server', error);
    }
  };

  // Function to sync localStorage favorites with server
  const syncFavoritesWithServer = async () => {
    if (!user) return;
    
    try {
      // Get current favorites from localStorage
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      // For each local favorite, check if it exists on the server
      for (const favorite of localFavorites) {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', favorite.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking favorite:', error);
          continue;
        }
        
        // If favorite doesn't exist on server, add it
        if (!data) {
          const { error: insertError } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              product_id: favorite.id
            });
            
          if (insertError) {
            console.error('Error inserting favorite:', insertError);
          }
        }
      }
      
      // Refresh favorites from server
      await fetchFavoritesFromServer();
    } catch (error) {
      console.error('Error syncing favorites with server:', error);
    }
  };
  
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
            
          if (error) throw error;
        } catch (error) {
          console.error('Failed to save favorite to Supabase', error);
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
          
        if (error) throw error;
      } catch (error) {
        console.error('Failed to remove favorite from Supabase', error);
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
          
        if (error) throw error;
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
    favoritesCount,
    syncFavoritesWithServer
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
