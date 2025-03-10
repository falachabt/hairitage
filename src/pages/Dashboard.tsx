import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  CreditCard, 
  Package, 
  Heart, 
  ShoppingBag, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { CartItem, Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_status: string;
}

const profileSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});

const getFavoriteProducts = async (favorites: any[]) => {
  if (!favorites?.length) return [];
  
  const productIds = favorites.map(fav => fav.product_id);
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      product_images (
        image_url,
        is_primary
      )
    `)
    .in('id', productIds);

  if (!products) return [];

  return products.map(product => ({
    ...product,
    imageUrl: product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1605980625600-88d6716a8a21'
  }));
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState({
    profile: true,
    orders: true,
    favorites: true,
  });
  const [error, setError] = useState({
    profile: null as string | null,
    orders: null as string | null,
    favorites: null as string | null,
  });
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      country: '',
    },
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfile(data);
        form.reset({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
          country: data.country || '',
        });
      } catch (err: any) {
        setError(prev => ({ ...prev, profile: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    fetchProfile();
  }, [user, form]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setOrders(data || []);
      } catch (err: any) {
        setError(prev => ({ ...prev, orders: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, orders: false }));
      }
    };
    
    fetchOrders();
  }, [user]);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      try {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('user_favorites')
          .select('product_id')
          .eq('user_id', user.id);
          
        if (favoritesError) throw favoritesError;
        
        if (favoritesData && favoritesData.length > 0) {
          const productIds = favoritesData.map(fav => fav.product_id);
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);
            
          if (productsError) throw productsError;
          
          const transformedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            imageUrl: p.product_images ? p.product_images[0]?.image_url : 'https://images.unsplash.com/photo-1605980625600-88d6716a8a21?q=80&w=1974',
            description: p.description,
            category: p.category,
            featured: p.featured,
            inStock: p.in_stock,
            rating: Number(p.rating),
            reviews: p.reviews,
            colors: p.colors,
            length: p.length,
            material: p.material,
            capSize: p.cap_size,
          }));
          
          setFavorites(transformedProducts);
        }
      } catch (err: any) {
        setError(prev => ({ ...prev, favorites: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, favorites: false }));
      }
    };
    
    fetchFavorites();
  }, [user]);
  
  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
    }
  };
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="bg-plum-50 py-12">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mon Compte</h1>
            <p className="text-muted-foreground">Gérez vos commandes, favoris et informations personnelles</p>
          </div>
        </div>
        
        <div className="container px-4 md:px-6 py-8">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid grid-cols-3 lg:grid-cols-4 w-full max-w-3xl mx-auto">
              <TabsTrigger value="profile" className="flex gap-2 items-center">
                <User size={16} /> Profil
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex gap-2 items-center">
                <ShoppingBag size={16} /> Commandes
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex gap-2 items-center">
                <Heart size={16} /> Favoris
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles et vos coordonnées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.profile ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error.profile ? (
                    <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <p className="text-destructive text-sm">{error.profile}</p>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Téléphone</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Adresse</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ville</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="postal_code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Code postal</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pays</FormLabel>
                                <FormControl>
                                  <Input {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit">Enregistrer les modifications</Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mes commandes</CardTitle>
                  <CardDescription>
                    Consultez l'historique de vos commandes et leur statut
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.orders ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error.orders ? (
                    <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <p className="text-destructive text-sm">{error.orders}</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Aucune commande</h3>
                      <p className="text-muted-foreground mt-1 mb-6">
                        Vous n'avez pas encore effectué de commande
                      </p>
                      <Button onClick={() => navigate('/products')}>
                        Découvrir nos produits
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div 
                          key={order.id} 
                          className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="font-medium">Commande #{order.id.slice(0, 8)}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex gap-4 mt-2">
                              <span className="text-sm bg-secondary/30 px-2 py-1 rounded">
                                {order.status}
                              </span>
                              <span className="text-sm bg-secondary/30 px-2 py-1 rounded">
                                Paiement: {order.payment_status}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2">
                            <div className="font-medium">
                              {Number(order.total_amount).toFixed(2)} €
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/order/${order.id}`)}
                            >
                              Détails
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mes favoris</CardTitle>
                  <CardDescription>
                    Les produits que vous avez enregistrés dans vos favoris
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading.favorites ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error.favorites ? (
                    <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <p className="text-destructive text-sm">{error.favorites}</p>
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Aucun favori</h3>
                      <p className="text-muted-foreground mt-1 mb-6">
                        Vous n'avez pas encore ajouté de produits à vos favoris
                      </p>
                      <Button onClick={() => navigate('/products')}>
                        Découvrir nos produits
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {favorites.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
