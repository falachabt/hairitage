
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useFavorites } from '@/hooks/use-favorites';
import SearchForm from './SearchForm';

interface NavigationItem {
  name: string;
  path: string;
}

interface MobileMenuProps {
  isMenuOpen: boolean;
  mainNavItems: NavigationItem[];
  categories: NavigationItem[];
  closeMenu: () => void;
}

const MobileMenu = ({ isMenuOpen, mainNavItems, categories, closeMenu }: MobileMenuProps) => {
  const { user } = useAuth();
  const { favoritesCount } = useFavorites();

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-30 bg-background md:hidden transition-opacity duration-200",
        isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <nav className="flex flex-col p-4 bg-background h-full border-t overflow-y-auto">
        <SearchForm
          className="mb-4"
          onSearch={closeMenu}
        />
        
        {mainNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="py-3 text-base font-medium border-b border-border hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            {item.name}
          </Link>
        ))}
        
        <div className="py-3 text-base font-medium border-b border-border">
          Catégories
        </div>
        
        <div className="pl-4">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="py-2 text-sm font-medium block text-muted-foreground hover:text-primary transition-colors"
              onClick={closeMenu}
            >
              {category.name}
            </Link>
          ))}
        </div>
        
        <div className="flex gap-4 mt-4">
          <Button variant="outline" asChild className="flex-1">
            <Link to="/favorites" onClick={closeMenu}>
              <Heart size={18} className="mr-2" />
              Favoris
              {favoritesCount > 0 && (
                <span className="ml-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
        <Button variant="outline" asChild className="mt-2">
          <Link to={user ? "/dashboard" : "/login"} onClick={closeMenu}>
            <User size={18} className="mr-2" />
            {user ? "Mon Compte" : "Connexion"}
          </Link>
        </Button>
      </nav>
    </div>
  );
};

export default MobileMenu;
