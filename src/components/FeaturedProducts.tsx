
import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const { featuredProducts, isLoading } = useProducts();

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Perruques Populaires</h2>
          <Button asChild variant="ghost" className="mt-4 md:mt-0">
            <Link to="/products">Voir Toute la Collection →</Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted-foreground/10"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-muted-foreground/10 rounded w-2/3"></div>
                  <div className="h-4 bg-muted-foreground/10 rounded w-1/3"></div>
                  <div className="h-8 bg-muted-foreground/10 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
