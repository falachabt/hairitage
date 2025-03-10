
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/use-favorites';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const { favorites, clearFavorites } = useFavorites();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="bg-plum-50 py-12">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mes Favoris</h1>
            <p className="text-muted-foreground">Les perruques que vous avez enregistrées</p>
          </div>
        </div>
        
        <div className="container px-4 md:px-6 py-8">
          {favorites.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <p className="text-lg">{favorites.length} {favorites.length > 1 ? 'articles' : 'article'}</p>
                <Button variant="outline" size="sm" onClick={clearFavorites}>
                  Supprimer tout
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <Heart size={24} className="text-secondary-foreground" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Votre liste de favoris est vide</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Vous n'avez pas encore ajouté de perruques à vos favoris. Explorez notre catalogue et enregistrez vos préférées.
              </p>
              <Button asChild>
                <Link to="/products">Découvrir nos produits</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
