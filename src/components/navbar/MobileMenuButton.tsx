
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenuButton = ({ isMenuOpen, toggleMenu }: MobileMenuButtonProps) => {
  return (
    <Button variant="ghost" size="icon" onClick={toggleMenu} className="mr-2">
      {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
    </Button>
  );
};

export default MobileMenuButton;
