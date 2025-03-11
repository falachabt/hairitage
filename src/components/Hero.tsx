
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1595272568891-123402d0fb3b?q=80&w=2832&auto=format&fit=crop',
      title: 'Hairitage: Votre Beauté, Notre Passion',
      subtitle: 'Une collection exclusive de perruques conçues pour vous sublimer'
    },
    {
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2838&auto=format&fit=crop',
      title: 'Style & Naturel',
      subtitle: 'Des perruques qui s\'adaptent parfaitement à votre personnalité'
    },
    {
      image: 'https://images.unsplash.com/photo-1613967193490-1d17b930c1a1?q=80&w=2787&auto=format&fit=crop',
      title: 'Excellence & Qualité',
      subtitle: 'Découvrez nos perruques premium pour un résultat exceptionnel'
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="container relative z-30 h-full flex items-center px-4 md:px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {slides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button asChild size="lg" className="text-base font-medium bg-white text-primary hover:bg-cream-100">
              <Link to="/products">Découvrir la Collection</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-base font-medium border-white text-white hover:bg-white/10"
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
          className="rounded-full hover:bg-white/20 text-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute bottom-1/2 translate-y-1/2 right-4 z-30">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/20 text-white"
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
    </section>
  );
};

export default Hero;
