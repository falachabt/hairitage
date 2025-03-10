
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { Product } from '@/types';
import { Card } from '@/components/ui/card';

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
  
  return (
    <Card className="product-card overflow-hidden">
      <div className="product-card-img-container relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover product-card-img"
          />
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full h-8 w-8"
          onClick={handleToggleFavorite}
        >
          <Heart 
            size={16} 
            className={isFavorite(product.id) ? "fill-primary text-primary" : ""}
          />
        </Button>
      </div>
      <div className="p-4 product-card-body">
        <Link to={`/product/${product.id}`} className="text-lg font-medium hover:text-primary transition-colors product-card-title">
          {product.name}
        </Link>
        <div className="flex justify-between items-center mt-2">
          <p className="text-lg font-semibold product-card-price">{product.price.toFixed(2)} €</p>
          
          {isInCart ? (
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleDecreaseQuantity}
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center">{existingCartItem.quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
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
              className="text-xs"
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
