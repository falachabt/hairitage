
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'short',
    name: 'Perruques Courtes',
    description: 'Style élégant et pratique',
    image: 'https://images.unsplash.com/photo-1595591569984-d4d660144a03?q=80&w=1974'
  },
  {
    id: 'medium',
    name: 'Perruques Moyennes',
    description: 'L\'équilibre parfait',
    image: 'https://images.unsplash.com/photo-1605980625600-88d6716a8a21?q=80&w=1974'
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
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
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
