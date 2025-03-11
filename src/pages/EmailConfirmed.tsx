
import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmailConfirmed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // If this page is accessed with a token, it means we're coming from the email confirmation
    const confirmEmailChange = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (token && type === 'email_confirm') {
        try {
          // Handle the email confirmation
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email'
          });
          
          if (error) {
            toast({
              title: "Erreur de confirmation",
              description: "Impossible de confirmer votre email. Veuillez réessayer.",
              variant: "destructive",
            });
            console.error('Error confirming email:', error);
          } else {
            toast({
              title: "Email confirmé",
              description: "Votre email a été confirmé avec succès!",
            });
          }
        } catch (error) {
          console.error('Error during confirmation:', error);
          toast({
            title: "Erreur de confirmation",
            description: "Une erreur s'est produite lors de la confirmation. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      }
    };
    
    confirmEmailChange();
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-6 text-center">
          <div className="mb-6">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Email Confirmé !</h1>
          <p className="text-muted-foreground mb-6">
            Votre adresse email a été confirmée avec succès. 
            Vous pouvez maintenant vous connecter à votre compte.
          </p>
          
          <Link to="/login">
            <Button className="w-full">
              Se connecter
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailConfirmed;
