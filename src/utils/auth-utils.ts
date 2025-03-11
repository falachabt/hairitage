
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

export const signUpUser = async (email: string, password: string, fullName: string) => {
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
    
    return { error };
  } catch (error) {
    console.error('Error during signup:', error);
    return { error: error as AuthError };
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  } catch (error) {
    console.error('Error during signin:', error);
    return { error: error as AuthError };
  }
};

export const signOutUser = async () => {
  return await supabase.auth.signOut();
};
