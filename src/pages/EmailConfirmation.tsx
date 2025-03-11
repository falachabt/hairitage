
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmailConfirmation = () => {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  
  const resendVerificationEmail = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: localStorage.getItem('pendingEmail') || '',
      });
      
      if (error) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible d'envoyer l'email de vérification",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email envoyé",
          description: "Un nouvel email de vérification a été envoyé à votre adresse",
        });
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de l'email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-6 text-center">
          <div className="mb-6">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Vérifiez votre email</h1>
          <p className="text-muted-foreground mb-6">
            Un lien de confirmation a été envoyé à votre adresse email.
            Veuillez consulter votre boîte de réception et cliquer sur le lien pour activer votre compte.
          </p>
          
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm">
                <strong>Vous ne voyez pas l'email?</strong> Vérifiez votre dossier spam 
                ou cliquez ci-dessous pour recevoir un nouvel email.
              </p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mb-3"
              onClick={resendVerificationEmail}
              disabled={isResending}
            >
              {isResending ? 'Envoi en cours...' : 'Renvoyer le lien de confirmation'}
            </Button>
            
            <Link to="/login">
              <Button className="w-full">
                Aller à la page de connexion
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailConfirmation;
