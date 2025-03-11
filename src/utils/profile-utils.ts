
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const createOrUpdateUserProfile = async (user: User | null) => {
  if (!user) return;
  
  try {
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (checkError) {
      // If error is not "No rows returned", then there's an actual error
      if (!checkError.message.includes('No rows returned')) {
        console.error('Error checking profile:', checkError);
        return;
      }
      
      // If error is "No rows returned", then we need to create the profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name || '',
        });
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in profile creation/update:', error);
  }
};

export const syncUserData = async (user: User | null) => {
  if (!user) return;
  
  try {
    // Sync cart items
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      const cartItems = JSON.parse(localCart);
      
      // Here you would implement the logic to merge local cart with server cart
      console.log('Syncing cart items for user', user.id, cartItems);
    }
    
    // Sync favorites
    const localFavorites = localStorage.getItem('favorites');
    if (localFavorites) {
      const favorites = JSON.parse(localFavorites);
      
      // For each favorite, check if it exists in the database, if not add it
      for (const favorite of favorites) {
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
        
        if (!data) {
          // Favorite doesn't exist in database, add it
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
    }
    
    // Create or update user profile
    await createOrUpdateUserProfile(user);
  } catch (error) {
    console.error('Error syncing user data:', error);
  }
};
