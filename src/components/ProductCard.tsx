import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, ShoppingBag, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { Product } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const existingCartItem = cart.find(item => item.id === product.id);
  const isInCart = !!existingCartItem;
  
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

  const hasValidImage = product.imageUrl && 
    !product.imageUrl.includes('undefined') && 
    !product.imageUrl.includes('null') && 
    product.imageUrl.trim() !== '';
  
  return (
    <Card className="product-card group overflow-hidden h-full bg-gradient-to-br from-white to-secondary/5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
      <div className="product-card-img-container relative">
        <Link to={`/product/${product.id}`}>
          {hasValidImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-primary/5 to-secondary/10 flex flex-col items-center justify-center p-4">
              <ImageOff size={48} className="mb-4 text-primary/50" />
              <span className="text-base text-center font-medium text-primary/70">{product.name}</span>
            </div>
          )}
        </Link>
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
          <p className="text-lg font-semibold text-primary">{product.price.toFixed(2)} €</p>
          
          {isInCart ? (
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 hover:bg-primary hover:text-white transition-colors"
                onClick={handleDecreaseQuantity}
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center font-medium">{existingCartItem.quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 hover:bg-primary hover:text-white transition-colors"
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
              className="text-xs hover:bg-primary hover:text-white transition-colors"
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
