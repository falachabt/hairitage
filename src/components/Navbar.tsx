
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const categories = [
    { name: 'Nouveautés', path: '/category/new' },
    { name: 'Perruques Courtes', path: '/category/short' },
    { name: 'Perruques Moyennes', path: '/category/medium' },
    { name: 'Perruques Longues', path: '/category/long' },
    { name: 'Lace Front', path: '/category/lace-front' },
    { name: 'Full Lace', path: '/category/full-lace' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="mr-2">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          )}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">WigShopper</span>
          </Link>
        </div>

        {!isMobile && (
          <nav className="hidden md:flex items-center gap-6 mx-6">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link to="/search">
              <Search size={20} />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link to="/favorites">
              <Heart size={20} />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link to="/account">
              <User size={20} />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleCart}>
            <ShoppingBag size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden",
          isMenuOpen ? "flex flex-col" : "hidden"
        )}
      >
        <nav className="flex flex-col p-4">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="py-3 text-base font-medium border-b border-border hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {category.name}
            </Link>
          ))}
          <div className="flex gap-4 mt-4">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                <Search size={18} className="mr-2" />
                Recherche
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                <User size={18} className="mr-2" />
                Compte
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </header>
  );
};

export default Navbar;
