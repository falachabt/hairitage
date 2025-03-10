
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };
  
  return (
    <div className="product-card">
      <div className="product-card-img-container">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-card-img"
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
      <div className="product-card-body">
        <Link to={`/product/${product.id}`} className="product-card-title">
          {product.name}
        </Link>
        <div className="flex justify-between items-center">
          <p className="product-card-price">{product.price.toFixed(2)} €</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addToCart(product)}
            className="text-xs"
          >
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
