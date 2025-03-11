
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, ChevronLeft, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { generateOrderPDF } from '@/utils/pdf-utils';
import { toast } from '@/hooks/use-toast';

const OrderDetail = () => {
  const { orderId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user && orderId) {
      fetchOrderDetails();
    }
  }, [user, loading, orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .single();

      if (orderError) {
        throw orderError;
      }

      if (!orderData) {
        throw new Error('Commande non trouvée');
      }

      setOrder(orderData as Order);

      // Fetch order items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            id, 
            name, 
            description,
            product_images (
              image_url,
              is_primary
            )
          )
        `)
        .eq('order_id', orderId);

      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        // Continue anyway to show at least the order without items
      }

      // Initialize ratings for each item
      const initialRatings: Record<string, number> = {};
      if (itemsData) {
        itemsData.forEach(item => {
          if (item.products?.id) {
            initialRatings[item.products.id] = 0;
          }
        });
      }
      
      setRatings(initialRatings);
      setOrderItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Impossible de charger les détails de la commande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (order && orderItems) {
      const success = generateOrderPDF(order, orderItems);
      if (!success) {
        toast({
          title: "Erreur",
          description: "Impossible de générer la facture PDF",
          variant: "destructive"
        });
      }
    }
  };

  const submitRating = async (productId: string, rating: number) => {
    try {
      if (!user) return;
      
      // Mettre à jour le rating du produit dans la base de données
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('rating, reviews')
        .eq('id', productId)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      const currentRating = product?.rating || 0;
      const currentReviews = product?.reviews || 0;
      
      // Calculer la nouvelle moyenne
      const newReviews = currentReviews + 1;
      const newRating = ((currentRating * currentReviews) + rating) / newReviews;
      
      const { error: updateError } = await supabase
        .from('products')
        .update({
          rating: newRating,
          reviews: newReviews
        })
        .eq('id', productId);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Merci pour votre avis !",
        description: "Votre évaluation a été enregistrée avec succès.",
      });
      
      // Réinitialiser le rating pour ce produit
      setRatings(prev => ({
        ...prev,
        [productId]: 0
      }));
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre évaluation.",
        variant: "destructive"
      });
    }
  };

  const handleRatingChange = (productId: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <Skeleton className="h-8 w-64 mb-6" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">Détails de la commande</h1>
          </div>

          {error ? (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center py-4">
                  <p className="text-red-500">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => navigate('/dashboard')}
                  >
                    Retour au tableau de bord
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : order ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Commande #{order.id.substring(0, 8)}</CardTitle>
                      <CardDescription>
                        Placée le {format(new Date(order.created_at), 'dd MMMM yyyy', { locale: fr })}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadInvoice}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger la facture
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium mb-2">Statut de la commande</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' ? 'Livrée' : 
                         order.status === 'processing' ? 'En cours' : 
                         'En attente'}
                      </span>
                      <h3 className="font-medium mt-4 mb-2">Paiement</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment_status === 'completed' ? 'Payé' : 'En attente'}
                      </span>
                      <p className="mt-2">Méthode: {order.payment_method || 'Carte bancaire'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Adresse de livraison</h3>
                      <p>{order.shipping_address || 'Non spécifiée'}</p>
                      <p>{order.shipping_city || ''} {order.shipping_postal_code || ''}</p>
                      <p>{order.shipping_country || ''}</p>
                    </div>
                  </div>

                  <h3 className="font-medium mb-4">Articles commandés</h3>
                  {orderItems.length > 0 ? (
                    <div className="space-y-4">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row border-b pb-4">
                          <div className="h-20 w-20 rounded-md overflow-hidden bg-secondary/20 flex-shrink-0">
                            <img 
                              src={item.products?.product_images && item.products.product_images.length > 0
                                ? item.products.product_images.find((img: any) => img.is_primary)?.image_url 
                                  || item.products.product_images[0].image_url
                                : 'https://images.unsplash.com/photo-1605980625600-88d6716a8a21?q=80&w=1974'
                              } 
                              alt={item.products?.name || 'Produit'}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-0 sm:ml-4 flex-1 mt-2 sm:mt-0">
                            <h4 className="font-medium">{item.products?.name || 'Produit'}</h4>
                            <p className="text-sm text-muted-foreground">{item.products?.description?.substring(0, 100) || 'Description du produit'}</p>
                            <div className="flex justify-between mt-2">
                              <span>Quantité: {item.quantity}</span>
                              <span className="font-medium">{Number(item.unit_price).toFixed(2)} € x {item.quantity} = {Number(item.total_price).toFixed(2)} €</span>
                            </div>
                            
                            {/* Section d'évaluation */}
                            {item.products?.id && (
                              <div className="mt-3 border-t pt-3">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                  <span className="text-sm">Évaluer ce produit:</span>
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(item.products.id, star)}
                                        className="focus:outline-none"
                                      >
                                        <Star
                                          className={`h-5 w-5 ${
                                            star <= (ratings[item.products.id] || 0)
                                              ? 'text-yellow-400 fill-yellow-400'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                  
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => submitRating(item.products.id, ratings[item.products.id] || 0)}
                                    disabled={!ratings[item.products.id]}
                                  >
                                    Soumettre
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between pt-4 font-medium">
                        <span>Total</span>
                        <span>{Number(order.total_amount).toFixed(2)} €</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucun article trouvé pour cette commande.</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-4">
                  <p>Commande non trouvée.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => navigate('/dashboard')}
                  >
                    Retour au tableau de bord
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
