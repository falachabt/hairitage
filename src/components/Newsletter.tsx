
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Inscription réussie!",
        description: "Merci de vous être inscrit à notre newsletter.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-12 bg-plum-700 text-white">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Restez à jour avec nos dernières collections</h2>
          <p className="text-plum-100 mb-6">
            Inscrivez-vous à notre newsletter pour recevoir des offres exclusives, des conseils coiffure et être informé de nos nouvelles perruques.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-plum-400"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-plum-700 hover:bg-cream-100"
            >
              {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
            </Button>
          </form>
          
          <p className="text-sm text-plum-200 mt-4">
            En vous inscrivant, vous acceptez de recevoir des emails de notre part. Vous pouvez vous désinscrire à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
