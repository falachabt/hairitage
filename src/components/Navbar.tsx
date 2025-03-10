
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, Heart, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import CartDrawer from './CartDrawer';
import { useCart } from '@/hooks/use-cart';
import { useFavorites } from '@/hooks/use-favorites';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();
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

  const mainNavItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Tous nos produits', path: '/products' },
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
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  location.pathname === item.path 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 h-auto py-1.5">
                  <span className="text-sm font-medium">Catégories</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.path} asChild>
                    <Link to={category.path}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link to="/search">
              <Search size={20} />
            </Link>
          </Button>
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
            <Link to="/account">
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
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden",
          isMenuOpen ? "flex flex-col" : "hidden"
        )}
      >
        <nav className="flex flex-col p-4">
          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="py-3 text-base font-medium border-b border-border hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
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
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
          
          <div className="flex gap-4 mt-4">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                <Search size={18} className="mr-2" />
                Recherche
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
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
            <Link to="/account" onClick={() => setIsMenuOpen(false)}>
              <User size={18} className="mr-2" />
              Compte
            </Link>
          </Button>
        </nav>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </header>
  );
};

export default Navbar;
