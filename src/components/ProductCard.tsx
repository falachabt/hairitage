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
      "product-card group overflow-hidden h-full",
      product.discountPercentage ? "bg-gradient-to-br from-primary/5 to-secondary/10 hover:shadow-xl hover:shadow-primary/10" : "bg-gradient-to-br from-white to-secondary/5"
    )}>
      <div className="product-card-img-container relative">
        <Link to={`/product/${product.id}`}>
          <div className="relative aspect-square w-full overflow-hidden">
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
            
            {hasError ? (
              <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/10 flex flex-col items-center justify-center p-4">
                <ImageOff size={48} className="mb-4 text-primary/50" />
                <span className="text-base text-center font-medium text-primary/70">{product.name}</span>
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
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full animate-bounce">
            -{product.discountPercentage}%
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full h-8 w-8 z-10 transition-transform duration-300 group-hover:scale-110"
          onClick={handleToggleFavorite}
        >
          <Heart 
            size={16} 
            className={cn(
              "transition-colors duration-300",
              isFavorite(product.id) ? "fill-primary text-primary" : ""
            )}
          />
        </Button>
      </div>
      <div className="p-4 product-card-body flex flex-col justify-between flex-grow space-y-4">
        <Link 
          to={`/product/${product.id}`} 
          className="text-lg font-medium hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-primary">
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
                className={cn(
                  "h-8 w-8 transition-colors",
                  product.discountPercentage ? "hover:bg-primary hover:text-white" : "hover:bg-secondary hover:text-secondary-foreground"
                )}
                onClick={handleDecreaseQuantity}
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center font-medium">{existingCartItem.quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className={cn(
                  "h-8 w-8 transition-colors",
                  product.discountPercentage ? "hover:bg-primary hover:text-white" : "hover:bg-secondary hover:text-secondary-foreground"
                )}
                onClick={handleIncreaseQuantity}
              >
                <Plus size={14} />
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddToCart}
              className={cn(
                "text-xs transition-colors",
                product.discountPercentage ? "hover:bg-primary hover:text-white" : "hover:bg-secondary hover:text-secondary-foreground"
              )}
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
