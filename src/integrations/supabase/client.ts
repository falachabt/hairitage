
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://znyvlzpirrdhorduemnv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueXZsenBpcnJkaG9yZHVlbW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4ODk0NDIsImV4cCI6MjA1NTQ2NTQ0Mn0.bMqrsv85AtNCnSrnqL5UPVSWUAzV4ftYXuLznThF8HI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Fonction utilitaire pour vérifier si un utilisateur est administrateur
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    return data?.role === 'admin';
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle admin:', error);
    return false;
  }
};
