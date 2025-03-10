
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Heart, 
  Share2
} from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { useCart } from '@/hooks/use-cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FeaturedProducts from '@/components/FeaturedProducts';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { getProductById, isLoading } = useProducts();
  const { addToCart } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedCapSize, setSelectedCapSize] = useState('');
  
  const product = productId ? getProductById(productId) : null;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container px-4 py-8 md:py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted-foreground/10 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted-foreground/10 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-10 bg-muted-foreground/10 rounded w-3/4"></div>
                <div className="h-6 bg-muted-foreground/10 rounded w-1/4"></div>
                <div className="h-24 bg-muted-foreground/10 rounded w-full"></div>
                <div className="h-10 bg-muted-foreground/10 rounded w-full"></div>
                <div className="h-12 bg-muted-foreground/10 rounded w-full"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <p className="text-muted-foreground mb-8">
            Désolé, le produit que vous recherchez n'existe pas ou a été retiré.
          </p>
          <Button asChild>
            <Link to="/products">Voir tous les produits</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:py-12">
          <div className="mb-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center">
              <ChevronLeft size={16} className="mr-1" />
              Retour
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="bg-secondary/20 rounded-lg overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                      className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.reviews} avis
                </span>
              </div>
              
              <p className="text-2xl font-bold text-plum-700 mb-4">
                {product.price.toFixed(2)} €
              </p>
              
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
              
              {/* Cap Size Selector */}
              {product.capSize && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Taille du bonnet:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.capSize.map(size => (
                      <Button
                        key={size}
                        variant={selectedCapSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCapSize(size)}
                        className="min-w-[80px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Quantité:</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    disabled={selectedQuantity <= 1}
                  >
                    -
                  </Button>
                  <span className="mx-4 min-w-[30px] text-center">{selectedQuantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button 
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  Ajouter au panier
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart size={20} />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 size={20} />
                </Button>
              </div>
              
              {/* Shipping & Returns */}
              <div className="border rounded-lg p-4 space-y-3 bg-secondary/10">
                <div className="flex gap-3">
                  <Truck size={20} className="text-plum-700 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Livraison gratuite</h4>
                    <p className="text-sm text-muted-foreground">
                      Pour les commandes supérieures à 100€
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <RotateCcw size={20} className="text-plum-700 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Retours sous 30 jours</h4>
                    <p className="text-sm text-muted-foreground">
                      Satisfait ou remboursé
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck size={20} className="text-plum-700 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Garantie qualité</h4>
                    <p className="text-sm text-muted-foreground">
                      Produits contrôlés et testés
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Accordion */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="details">
                <AccordionTrigger>Détails du produit</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Caractéristiques:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Matière: {product.material}</li>
                        <li>Longueur: {product.length}</li>
                        <li>Type de bonnet: Disponible en plusieurs tailles</li>
                        <li>Densité: Moyenne à élevée</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Entretien:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Laver délicatement à l'eau tiède</li>
                        <li>Utiliser des produits spécifiques pour perruques</li>
                        <li>Sécher à l'air libre sur un porte-perruque</li>
                        <li>Éviter l'utilisation excessive d'outils chauffants</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="shipping">
                <AccordionTrigger>Livraison et retours</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Livraison:</h4>
                      <p className="text-muted-foreground">
                        Livraison standard (3-5 jours ouvrés): 5.95€<br />
                        Livraison express (1-2 jours ouvrés): 12.95€<br />
                        Livraison gratuite pour les commandes supérieures à 100€
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Politique de retour:</h4>
                      <p className="text-muted-foreground">
                        Vous pouvez retourner votre article dans les 30 jours suivant la réception pour un remboursement complet.
                        Les perruques doivent être non portées, non lavées et dans leur emballage d'origine avec toutes les étiquettes.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="reviews">
                <AccordionTrigger>Avis clients ({product.reviews})</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 rounded-full bg-plum-100 flex items-center justify-center">
                          <span className="font-medium text-plum-700">ML</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium">Marie L.</h4>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">Il y a 2 semaines</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill="currentColor" 
                              className="text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">
                          Excellente qualité, très naturelle et confortable à porter. Je la recommande vivement.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 rounded-full bg-plum-100 flex items-center justify-center">
                          <span className="font-medium text-plum-700">SD</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium">Sophie D.</h4>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">Il y a 1 mois</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(4)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill="currentColor" 
                              className="text-yellow-400"
                            />
                          ))}
                          {[...Array(1)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className="text-gray-300"
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">
                          Très belle perruque, mais un peu plus brillante que ce que je pensais. Malgré tout, je l'aime beaucoup.
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Voir tous les {product.reviews} avis
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        {/* You May Also Like */}
        <div className="py-12 bg-secondary/30">
          <div className="container px-4">
            <h2 className="text-2xl font-bold mb-8">Vous pourriez aussi aimer</h2>
            <FeaturedProducts />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
