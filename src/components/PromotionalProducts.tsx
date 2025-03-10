
import React from 'react';
import { useProducts } from '@/hooks/use-products';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PromotionalProducts = () => {
  const { products, isLoading } = useProducts();

  // For the demo, let's consider some products as promotional (in a real app this would be a property in the product data)
  const promotionalProducts = products.slice(0, 4).map(product => ({
    ...product,
    originalPrice: product.price * 1.25, // Simulate that the current price is discounted
    discountPercentage: 20,
  }));

  if (isLoading) {
    return (
      <div className="mt-16 container">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              <Percent className="mr-2 text-primary" size={24} />
              Promotions Spéciales
            </h2>
            <p className="text-muted-foreground mt-2">
              Profitez de nos offres exclusives pour un temps limité
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 sm:mt-0">
            <Link to="/products" className="flex items-center">
              Voir tous les produits
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotionalProducts.map((product) => (
            <div key={product.id} className="relative">
              <div className="absolute top-4 left-4 z-10 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                -{product.discountPercentage}%
              </div>
              <ProductCard product={product} />
              <div className="mt-2 pl-4">
                <span className="text-sm line-through text-muted-foreground">
                  {product.originalPrice.toFixed(2)} €
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalProducts;
