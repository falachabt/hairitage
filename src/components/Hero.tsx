
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1607246749946-0c1bf6baedb3?q=80&w=2070',
      title: 'Hairitage: Révélez Votre Beauté',
      subtitle: 'Des perruques de qualité supérieure pour une confiance et un style incomparables'
    },
    {
      image: 'https://images.unsplash.com/photo-1516914589923-f105f1535f88?q=80&w=2070',
      title: 'Élégance et Confort',
      subtitle: 'Nos perruques sont conçues pour vous offrir confort et naturel'
    },
    {
      image: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?q=80&w=2070',
      title: 'Qualité Exceptionnelle',
      subtitle: 'Découvrez notre collection exclusive de perruques premium'
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length]);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* Slides */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url('${slide.image}')`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="container relative z-30 h-full flex items-center px-4 md:px-6">
        <div className="max-w-2xl transition-all duration-700 transform translate-y-0 opacity-100">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {slides[currentSlide].subtitle}
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
              <Link to="/notre-histoire">Notre Histoire</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-4 z-30">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/20 hover:bg-white/40 text-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute bottom-1/2 translate-y-1/2 right-4 z-30">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/20 hover:bg-white/40 text-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white w-8' : 'bg-white/40'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
};

export default Hero;
