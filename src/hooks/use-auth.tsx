
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/email-confirmed`,
        },
      });
      
      if (!error) {
        toast({
          title: "Compte créé avec succès",
          description: "Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter",
        });
        
        // Store email in localStorage for resending verification if needed
        localStorage.setItem('pendingVerificationEmail', email);
      }

      
      return { error };
    } catch (error) {
      console.error('Error during signup:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        
        // Remove pending verification email from localStorage if it exists
        localStorage.removeItem('pendingVerificationEmail');
        
        // Sync cart and favorites from localStorage to database
        await syncUserData();
        
        navigate('/');
      } else if (error.message.includes('Email not confirmed')) {
        toast({
          title: "Email non confirmé",
          description: "Veuillez vérifier votre boîte de réception et confirmer votre email avant de vous connecter",
          variant: "destructive",
        });
        
        // Store email in localStorage for resending verification if needed
        localStorage.setItem('pendingVerificationEmail', email);
        
        navigate('/email-confirmation');
      }
      
      return { error };
    } catch (error) {
      console.error('Error during signin:', error);
      return { error: error as AuthError };
    }
  };

  const syncUserData = async () => {
    if (!user) return;
    
    try {
      // Sync cart items
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const cartItems = JSON.parse(localCart);
        
        // Here you would implement the logic to merge local cart with server cart
        // This would require modifications to the cart provider and database schema
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
      await createOrUpdateUserProfile();
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  };
  
  const createOrUpdateUserProfile = async () => {
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

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "Vous êtes maintenant déconnecté",
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
