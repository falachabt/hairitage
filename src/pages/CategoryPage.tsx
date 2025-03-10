
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';

const categoryNames: Record<string, string> = {
  'short': 'Perruques Courtes',
  'medium': 'Perruques Moyennes',
  'long': 'Perruques Longues',
  'lace-front': 'Lace Front',
  'full-lace': 'Full Lace',
  'braided': 'Tresses',
  'new': 'Nouveautés'
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getProductsByCategory, isLoading } = useProducts();
  
  const categoryProducts = categoryId 
    ? (categoryId === 'new' ? useProducts().featuredProducts : getProductsByCategory(categoryId)) 
    : [];
  
  const categoryName = categoryId ? categoryNames[categoryId] || categoryId : '';
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="bg-plum-50 py-12">
          <div className="container px-4">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ChevronLeft size={16} className="mr-1" />
              Retour à l'accueil
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">{categoryName}</h1>
            <p className="text-muted-foreground mt-2">
              {categoryProducts.length} produits disponibles
            </p>
          </div>
        </div>
        
        <div className="container px-4 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
          ) : categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium mb-4">Aucun produit trouvé</h2>
              <p className="text-muted-foreground mb-8">
                Il n'y a actuellement aucun produit disponible dans cette catégorie.
              </p>
              <Button asChild>
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
