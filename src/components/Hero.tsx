
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-[80vh] flex items-center">
      <div 
        className="absolute inset-0 z-10"
        style={{ 
          backgroundImage: "linear-gradient(to right, rgba(88, 28, 135, 0.85), rgba(88, 28, 135, 0.6)), url('https://images.unsplash.com/photo-1629359017944-3c1bef3adad8?q=80&w=2070')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container relative z-20 px-4 md:px-6">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in">
            Révélez Votre Beauté Avec Nos Perruques d'Exception
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '200ms' }}>
            Des perruques de qualité supérieure pour une confiance et un style incomparables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button asChild size="lg" className="text-base bg-white text-plum-900 hover:bg-cream-100">
              <Link to="/products">Découvrir la Collection</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base border-white text-white hover:bg-white/20">
              <Link to="/about">Notre Histoire</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
