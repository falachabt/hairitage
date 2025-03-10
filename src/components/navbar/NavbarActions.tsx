
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/hooks/use-auth';

interface NavbarActionsProps {
  toggleCart: () => void;
}

const NavbarActions = ({ toggleCart }: NavbarActionsProps) => {
  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { user } = useAuth();
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild className="hidden md:flex relative">
        <Link to="/favorites">
          <Heart size={20} />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild className="hidden md:flex">
        <Link to={user ? "/dashboard" : "/login"}>
          <User size={20} />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
        <ShoppingBag size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Button>
    </div>
  );
};

export default NavbarActions;
