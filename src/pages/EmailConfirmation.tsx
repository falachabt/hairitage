
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Envelope, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const EmailConfirmation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-6 text-center">
          <div className="mb-6">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Envelope className="h-12 w-12 text-primary" />
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
                ou essayez de vous reconnecter pour recevoir un nouvel email.
              </p>
            </div>
            
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
