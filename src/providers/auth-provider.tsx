
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/auth-context';
import { signUpUser, signInUser, signOutUser } from '@/utils/auth-utils';
import { syncUserData } from '@/utils/profile-utils';

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
    const { error } = await signUpUser(email, password, fullName);
    
    if (!error) {
      toast({
        title: "Compte créé avec succès",
        description: "Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter",
      });
      
      // Store email in localStorage for resending verification if needed
      localStorage.setItem('pendingVerificationEmail', email);
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await signInUser(email, password);
    
    if (!error) {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      
      // Remove pending verification email from localStorage if it exists
      localStorage.removeItem('pendingVerificationEmail');
      
      // Sync cart and favorites from localStorage to database
      await syncUserData(user);
      
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
  };

  const signOut = async () => {
    await signOutUser();
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
