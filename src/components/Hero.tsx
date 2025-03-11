
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 z-10 bg-gradient-to-r from-primary/95 to-primary/90"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1629359017944-3c1bef3adad8?q=80&w=2070')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      />
      
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 z-20" />
      
      <div className="container relative z-30 px-4 md:px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white [text-shadow:_0_1px_20px_rgb(0_0_0_/_20%)] animate-fade-in">
            Hairitage: Révélez Votre Beauté Avec Nos Perruques d'Exception
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 [text-shadow:_0_1px_10px_rgb(0_0_0_/_20%)] animate-fade-in" style={{ animationDelay: '200ms' }}>
            Des perruques de qualité supérieure pour une confiance et un style incomparables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button asChild size="lg" className="text-base bg-white text-primary hover:bg-cream-100 transition-colors duration-300">
              <Link to="/products">Découvrir la Collection</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-base border-white text-white hover:bg-white hover:text-primary transition-colors duration-300"
            >
              <Link to="/about">Notre Histoire</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
};

export default Hero;
