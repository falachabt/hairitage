
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import CartDrawer from './CartDrawer';
import NavbarLogo from './navbar/NavbarLogo';
import MobileMenuButton from './navbar/MobileMenuButton';
import DesktopNavigation from './navbar/DesktopNavigation';
import SearchForm from './navbar/SearchForm';
import NavbarActions from './navbar/NavbarActions';
import MobileMenu from './navbar/MobileMenu';

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

  const mainNavItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Tous nos produits', path: '/products' },
    { name: 'Notre Histoire', path: '/notre-histoire' },
  ];

  return (
    <header className="fixed top-0 z-40 w-full bg-background shadow-sm border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          {isMobile && (
            <MobileMenuButton 
              isMenuOpen={isMenuOpen} 
              toggleMenu={toggleMenu} 
            />
          )}
          <NavbarLogo />
        </div>

        <DesktopNavigation 
          mainNavItems={mainNavItems} 
          categories={categories} 
        />

        <div className="flex items-center gap-2">
          <div className="hidden md:block mr-2">
            <SearchForm className="hidden md:flex items-center relative" />
          </div>
          <NavbarActions toggleCart={toggleCart} />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isMenuOpen={isMenuOpen}
        mainNavItems={mainNavItems}
        categories={categories}
        closeMenu={() => setIsMenuOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </header>
  );
};

export default Navbar;
