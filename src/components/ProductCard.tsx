
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, ShoppingBag, ImageOff } from 'lucide-react';
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

  const hasValidImage = product.imageUrl && !product.imageUrl.includes('undefined') && !product.imageUrl.includes('null');
  
  return (
    <Card className="product-card overflow-hidden">
      <div className="product-card-img-container relative">
        <Link to={`/product/${product.id}`}>
          {hasValidImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover product-card-img"
              onError={(e) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.parentElement?.classList.add('product-img-fallback');
                e.currentTarget.style.display = 'none';
                const icon = document.createElement('div');
                icon.innerHTML = `<div class="flex flex-col items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><line x1="2" x2="22" y1="2" y2="22"></line><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path><line x1="13.5" x2="6.5" y1="13.5" y2="20.5"></line><path d="M14 14v6"></path><path d="M18 18h-4"></path><path d="M14 3v4"></path><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path></svg>
                  <span>${product.name}</span>
                </div>`;
                e.currentTarget.parentElement?.appendChild(icon.firstChild as Node);
              }}
            />
          ) : (
            <div className="product-img-fallback w-full h-64 flex flex-col items-center justify-center">
              <ImageOff size={48} className="mb-2" />
              <span className="text-sm text-center px-2">{product.name}</span>
            </div>
          )}
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
