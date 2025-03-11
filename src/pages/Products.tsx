
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/use-products';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, X, ChevronLeft } from 'lucide-react';

const Products = () => {
  const { products, isLoading } = useProducts();
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique categories from products
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );
  
  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesPrice && matchesCategory;
  });
  
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => 
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setPriceRange([0, 400]);
    setSelectedCategories([]);
  };
  
  const formatCategory = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="bg-plum-50 py-12 pt-28">
          <div className="container px-4 md:px-6">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ChevronLeft size={16} className="mr-1" />
              Retour à l'accueil
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Nos Perruques</h1>
            <p className="text-muted-foreground">Découvrez notre collection de perruques de qualité</p>
          </div>
        </div>
        
        <div className="container px-4 md:px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold mr-2">
                {filteredProducts.length} {filteredProducts.length > 1 ? 'produits' : 'produit'}
              </h2>
              {selectedCategories.length > 0 && (
                <div className="hidden md:flex items-center gap-2 ml-4">
                  <span className="text-sm text-muted-foreground">Filtres:</span>
                  {selectedCategories.map(cat => (
                    <span key={cat} className="text-xs bg-secondary px-2 py-1 rounded-full flex items-center">
                      {formatCategory(cat)}
                      <button 
                        onClick={() => toggleCategory(cat)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Effacer tous
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter size={16} className="mr-2" />
              Filtres
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters - desktop */}
            <div className="hidden md:block space-y-6">
              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  <SlidersHorizontal size={18} className="mr-2" />
                  Filtres
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Prix (€)</h4>
                    <Slider
                      defaultValue={[0, 400]}
                      value={priceRange}
                      max={400}
                      step={10}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>{priceRange[0]}€</span>
                      <span>{priceRange[1]}€</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-3">Catégories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`cat-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <label 
                            htmlFor={`cat-${category}`}
                            className="text-sm cursor-pointer"
                          >
                            {formatCategory(category)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile filters drawer */}
            {showFilters && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden">
                <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-medium">Filtres</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                      <X size={18} />
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Prix (€)</h4>
                      <Slider
                        defaultValue={[0, 400]}
                        value={priceRange}
                        max={400}
                        step={10}
                        onValueChange={setPriceRange}
                        className="mb-2"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span>{priceRange[0]}€</span>
                        <span>{priceRange[1]}€</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Catégories</h4>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mobile-cat-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <label 
                              htmlFor={`mobile-cat-${category}`}
                              className="text-sm cursor-pointer"
                            >
                              {formatCategory(category)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button className="w-full" onClick={() => setShowFilters(false)}>
                        Appliquer les filtres
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2" 
                        onClick={clearFilters}
                      >
                        Effacer les filtres
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Products grid */}
            <div className="col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-muted-foreground/10 rounded-lg mb-3"></div>
                      <div className="h-5 bg-muted-foreground/10 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-muted-foreground/10 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Aucun produit ne correspond à vos critères de recherche.</p>
                  <Button onClick={clearFilters}>Effacer les filtres</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
