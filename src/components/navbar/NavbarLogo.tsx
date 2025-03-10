
import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-xl font-bold text-primary">Hairitage</span>
    </Link>
  );
};

export default NavbarLogo;
