import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-plum-900 text-white">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Hairitage</h3>
            <p className="text-plum-100 mb-4">
              Votre destination pour des perruques de qualité supérieure, offrant style, confiance et confort.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-plum-100 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-plum-100 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-plum-100 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Catégories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/category/new" className="text-plum-100 hover:text-white transition-colors">
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link to="/category/short" className="text-plum-100 hover:text-white transition-colors">
                  Perruques Courtes
                </Link>
              </li>
              <li>
                <Link to="/category/medium" className="text-plum-100 hover:text-white transition-colors">
                  Perruques Moyennes
                </Link>
              </li>
              <li>
                <Link to="/category/long" className="text-plum-100 hover:text-white transition-colors">
                  Perruques Longues
                </Link>
              </li>
              <li>
                <Link to="/category/lace-front" className="text-plum-100 hover:text-white transition-colors">
                  Lace Front
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Informations</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-plum-100 hover:text-white transition-colors">
                  À Propos de Nous
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-plum-100 hover:text-white transition-colors">
                  Livraison
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-plum-100 hover:text-white transition-colors">
                  Retours et Remboursements
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-plum-100 hover:text-white transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-plum-100 hover:text-white transition-colors">
                  Conditions Générales
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span className="text-plum-100">
                  123 Rue de la Mode<br />
                  75001 Paris, France
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span className="text-plum-100">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span className="text-plum-100">contact@wigshopper.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-plum-800 mt-8 pt-8 text-center text-plum-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Hairitage. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
