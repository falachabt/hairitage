
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ChevronLeft,
  CreditCard,
  Truck,
  CircleDollarSign,
  CheckCircle
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<'delivery' | 'payment' | 'confirmation'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  
  const deliveryPrice = deliveryMethod === 'standard' ? 5.95 : 12.95;
  const isFreeDelivery = cartTotal > 100;
  const finalDeliveryPrice = isFreeDelivery ? 0 : deliveryPrice;
  const orderTotal = cartTotal + finalDeliveryPrice;
  
  const handleNext = () => {
    if (step === 'delivery') {
      setStep('payment');
    } else if (step === 'payment') {
      // In a real app, you would process payment here
      toast({
        title: "Commande confirmée",
        description: "Votre commande a été traitée avec succès.",
      });
      setStep('confirmation');
      clearCart();
      // In a real app, this would redirect to a confirmation page with order details
    }
  };
  
  const handleGoToHome = () => {
    navigate('/');
  };
  
  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-6">
              Vous n'avez aucun article dans votre panier. Ajoutez des produits pour passer à la caisse.
            </p>
            <Button asChild>
              <Link to="/">Continuer mes achats</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {step !== 'confirmation' && (
            <div className="mb-8">
              <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center text-sm">
                <ChevronLeft size={16} className="mr-1" />
                Continuer mes achats
              </Link>
              
              <h1 className="text-2xl md:text-3xl font-bold mt-6 mb-8">Finaliser votre commande</h1>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 'delivery' ? 'bg-primary text-white' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                    1
                  </div>
                  <span className={`ml-2 ${step === 'delivery' ? 'font-medium' : 'text-muted-foreground'}`}>Livraison</span>
                </div>
                <div className="h-px w-12 bg-border"></div>
                <div className="flex items-center">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 'payment' ? 'bg-primary text-white' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                    2
                  </div>
                  <span className={`ml-2 ${step === 'payment' ? 'font-medium' : 'text-muted-foreground'}`}>Paiement</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {step === 'delivery' && (
              <div className="md:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-lg font-medium mb-4">Informations personnelles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" placeholder="Votre prénom" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" placeholder="Votre nom" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="votre@email.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" placeholder="0612345678" className="mt-1" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-lg font-medium mb-4">Adresse de livraison</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input id="address" placeholder="Numéro et nom de rue" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input id="city" placeholder="Votre ville" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Code Postal</Label>
                        <Input id="zipCode" placeholder="75001" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-lg font-medium mb-4">Méthode de livraison</h2>
                  <RadioGroup value={deliveryMethod} onValueChange={(value) => setDeliveryMethod(value as 'standard' | 'express')}>
                    <div className="flex items-start space-x-3 p-4 border rounded mb-3 cursor-pointer hover:bg-muted/50" onClick={() => setDeliveryMethod('standard')}>
                      <RadioGroupItem value="standard" id="standard" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="standard" className="flex items-center cursor-pointer">
                          <Truck size={18} className="mr-2 text-muted-foreground" />
                          <span>Livraison standard (3-5 jours ouvrés)</span>
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isFreeDelivery ? 'Gratuite' : '5.95€'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 border rounded cursor-pointer hover:bg-muted/50" onClick={() => setDeliveryMethod('express')}>
                      <RadioGroupItem value="express" id="express" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="express" className="flex items-center cursor-pointer">
                          <Truck size={18} className="mr-2 text-muted-foreground" />
                          <span>Livraison express (1-2 jours ouvrés)</span>
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isFreeDelivery ? 'Gratuite' : '12.95€'}
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                  {isFreeDelivery && (
                    <p className="text-sm text-primary mt-3">
                      Livraison gratuite pour les commandes supérieures à 100€
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {step === 'payment' && (
              <div className="md:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-lg font-medium mb-4">Méthode de paiement</h2>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}>
                    <div className="flex items-start space-x-3 p-4 border rounded mb-3 cursor-pointer hover:bg-muted/50" onClick={() => setPaymentMethod('card')}>
                      <RadioGroupItem value="card" id="card" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="card" className="flex items-center cursor-pointer">
                          <CreditCard size={18} className="mr-2 text-muted-foreground" />
                          <span>Carte bancaire</span>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 border rounded cursor-pointer hover:bg-muted/50" onClick={() => setPaymentMethod('paypal')}>
                      <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                          <CircleDollarSign size={18} className="mr-2 text-muted-foreground" />
                          <span>PayPal</span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-lg font-medium mb-4">Informations de paiement</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Nom sur la carte</Label>
                        <Input id="cardName" placeholder="Nom du titulaire" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Date d'expiration</Label>
                          <Input id="expiryDate" placeholder="MM/AA" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <div className="bg-white p-6 rounded-lg border">
                    <p className="text-center text-muted-foreground">
                      Vous serez redirigé vers PayPal pour finaliser votre paiement.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {step === 'confirmation' && (
              <div className="md:col-span-3 text-center py-8">
                <div className="bg-white p-8 rounded-lg border max-w-md mx-auto">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Commande confirmée</h2>
                  <p className="text-muted-foreground mb-6">
                    Merci pour votre achat ! Un email de confirmation a été envoyé à votre adresse.
                  </p>
                  <p className="font-medium mb-6">Numéro de commande: #WIG{Math.floor(Math.random() * 10000)}</p>
                  <Button onClick={handleGoToHome} className="w-full">
                    Retour à la boutique
                  </Button>
                </div>
              </div>
            )}
            
            {step !== 'confirmation' && (
              <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg border sticky top-24">
                  <h2 className="text-lg font-medium mb-4">Résumé de commande</h2>
                  
                  <div className="max-h-80 overflow-y-auto mb-4 space-y-4 pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex border-b pb-3">
                        <div className="w-16 h-16 rounded overflow-hidden bg-secondary/20 flex-shrink-0">
                          <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                          <p className="text-sm">{item.price.toFixed(2)} €</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 py-4 border-t border-b">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{cartTotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span>
                        {isFreeDelivery 
                          ? 'Gratuite' 
                          : `${finalDeliveryPrice.toFixed(2)} €`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-medium text-lg mt-4 mb-6">
                    <span>Total</span>
                    <span>{orderTotal.toFixed(2)} €</span>
                  </div>
                  
                  <Button className="w-full" onClick={handleNext}>
                    {step === 'delivery' ? 'Continuer vers le paiement' : 'Confirmer la commande'}
                  </Button>
                  
                  {step === 'payment' && (
                    <Button variant="outline" className="w-full mt-2" onClick={() => setStep('delivery')}>
                      Retour
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
