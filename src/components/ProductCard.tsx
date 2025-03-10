
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
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
        >
          <Heart size={16} />
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
