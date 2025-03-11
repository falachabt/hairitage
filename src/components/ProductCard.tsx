
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, ShoppingBag, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { Product } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const existingCartItem = cart.find(item => item.id === product.id);
  const isInCart = !!existingCartItem;
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  const handleIncreaseQuantity = () => {
    if (existingCartItem) {
      updateQuantity(product.id, existingCartItem.quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (existingCartItem && existingCartItem.quantity > 1) {
      updateQuantity(product.id, existingCartItem.quantity - 1);
    } else if (existingCartItem) {
      removeFromCart(product.id);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1974';
  
  return (
    <Card className={cn(
      "product-card group overflow-hidden h-full flex flex-col",
      product.discountPercentage ? "bg-white hover:shadow-xl hover:shadow-primary/10" : "bg-white"
    )}>
      <div className="product-card-img-container relative">
        <Link to={`/product/${product.id}`}>
          <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
            
            {hasError ? (
              <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-4">
                <ImageOff size={48} className="mb-4 text-primary/50" />
                <span className="text-base text-center font-medium text-primary">{product.name}</span>
              </div>
            ) : (
              <img
                src={product.imageUrl || fallbackImage}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  isLoading ? "opacity-0" : "opacity-100",
                  "group-hover:scale-110"
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </div>
        </Link>
        
        {product.discountPercentage && (
          <div className="absolute top-3 left-3 bg-primary text-white text-sm font-bold px-4 py-2 rounded-full">
            -{product.discountPercentage}%
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full h-10 w-10 z-10 transition-transform duration-300 shadow-sm"
          onClick={handleToggleFavorite}
        >
          <Heart 
            size={18} 
            className={cn(
              "transition-colors duration-300",
              isFavorite(product.id) ? "fill-primary text-primary" : "text-slate-700"
            )}
          />
        </Button>
      </div>
      
      <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
        <Link 
          to={`/product/${product.id}`} 
          className="text-xl font-medium hover:text-primary transition-colors line-clamp-2 text-left"
        >
          {product.name}
        </Link>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col items-start">
            <p className="text-xl font-bold text-primary">
              {product.price.toFixed(2)} €
            </p>
            {product.discountPercentage && (
              <p className="text-sm line-through text-muted-foreground">
                {(product.price * (1 + product.discountPercentage/100)).toFixed(2)} €
              </p>
            )}
          </div>
          
          {isInCart ? (
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-md hover:bg-primary hover:text-white border-slate-200"
                onClick={handleDecreaseQuantity}
              >
                <Minus size={16} />
              </Button>
              <span className="w-8 text-center font-medium">{existingCartItem.quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-md hover:bg-primary hover:text-white border-slate-200"
                onClick={handleIncreaseQuantity}
              >
                <Plus size={16} />
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddToCart}
              className="rounded-md hover:bg-primary hover:text-white border-slate-200 h-9"
            >
              <ShoppingBag className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
