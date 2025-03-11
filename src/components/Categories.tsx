
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  {
    id: 'short',
    name: 'Perruques Courtes',
    description: 'Style élégant et pratique',
    image: 'https://images.unsplash.com/photo-1595272568891-123402d0fb3b?q=80&w=1974'
  },
  {
    id: 'medium',
    name: 'Perruques Moyennes',
    description: 'L\'équilibre parfait',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1974'
  },
  {
    id: 'long',
    name: 'Perruques Longues',
    description: 'Glamour et polyvalence',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1974'
  },
  {
    id: 'lace-front',
    name: 'Lace Front',
    description: 'Finition naturelle',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961'
  }
];

// Images de secours pour chaque catégorie
const fallbackImages = {
  'short': 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=1974',
  'medium': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1974',
  'long': 'https://images.unsplash.com/photo-1595272568891-123402d0fb3b?q=80&w=1974',
  'lace-front': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1974',
  'default': 'https://images.unsplash.com/photo-1613967193490-1d17b930c1a1?q=80&w=1974'
};

const CategoryImage = ({ category, image }: { category: string, image: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  // Sélectionner l'image de secours spécifique à la catégorie ou l'image par défaut
  const fallbackImage = fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.default;
  
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden">
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
      
      <img 
        src={hasError ? fallbackImage : image} 
        alt={`Catégorie de perruques`}
        className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

const Categories = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Catégories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link 
              to={`/category/${category.id}`} 
              key={category.id}
              className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <CategoryImage 
                  category={category.id} 
                  image={category.image} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 p-4 text-white">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
