
import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

interface CartDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, setIsOpen }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-200",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-background p-6 shadow-lg transition-transform duration-300 flex flex-col border-l",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium flex items-center">
            <ShoppingBag className="mr-2" size={20} />
            Votre Panier
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <ShoppingBag size={64} className="text-muted-foreground/40" />
            <p className="text-muted-foreground text-center">Votre panier est vide</p>
            <Button onClick={() => setIsOpen(false)} className="mt-2">
              Continuer mes achats
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <div className="w-20 h-20 rounded overflow-hidden bg-secondary/20 flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} €</p>
                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 self-start"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X size={15} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span>Sous-total</span>
                <span>{cartTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Livraison</span>
                <span>Calculé à l'étape suivante</span>
              </div>
              <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                <Link to="/checkout">
                  Passer à la caisse
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={() => setIsOpen(false)}
              >
                Continuer mes achats
              </Button>
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-destructive hover:text-destructive" 
                onClick={clearCart}
              >
                Vider le panier
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
