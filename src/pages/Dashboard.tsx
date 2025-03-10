
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Order, Product, UserFavorite } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Heart, User, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      fetchUserData();
    }
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      if (profileData) {
        setProfile(profileData as Profile);
      }

      // Fetch user orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;
      
      if (orderData) {
        setOrders(orderData as Order[]);
      }

      // Fetch user favorites
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('user_favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (favoriteError) throw favoriteError;
      
      if (favoriteData && favoriteData.length > 0) {
        // Get product details for each favorite
        const productIds = favoriteData.map(fav => fav.product_id);
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (productsError) throw productsError;
        
        if (productsData) {
          // Transform data to match Product type
          const products: Product[] = productsData.map(product => ({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.image_url || 'https://images.unsplash.com/photo-1605980625600-88d6716a8a21?q=80&w=1974',
            description: product.description || '',
            category: product.category || '',
            featured: Boolean(product.featured),
            inStock: Boolean(product.in_stock),
            rating: Number(product.rating || 0),
            reviews: Number(product.reviews || 0),
            colors: product.colors as string[] || [],
            length: product.length || '',
            material: product.material || '',
            capSize: product.cap_size as string[] || [],
          }));
          setFavorites(products);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileInfo = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p><strong>Nom :</strong> {profile?.full_name || 'Non renseigné'}</p>
        <p><strong>Email :</strong> {user?.email || 'Non renseigné'}</p>
        <p><strong>Téléphone :</strong> {profile?.phone || 'Non renseigné'}</p>
        <p><strong>Adresse :</strong> {profile?.address || 'Non renseignée'}</p>
        <p><strong>Ville :</strong> {profile?.city || 'Non renseignée'}</p>
        <p><strong>Code postal :</strong> {profile?.postal_code || 'Non renseigné'}</p>
        <p><strong>Pays :</strong> {profile?.country || 'Non renseigné'}</p>
      </div>
    );
  };

  const renderOrdersTab = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Vous n'avez pas encore passé de commande</p>
          <Button className="mt-4" asChild>
            <Link to="/products">Parcourir nos produits</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Commande #{order.id.substring(0, 8)}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status === 'completed' ? 'Livrée' : 
                   order.status === 'processing' ? 'En cours' : 
                   'En attente'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Date : {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </p>
              <p className="font-medium mt-2">Total : {Number(order.total_amount).toFixed(2)} €</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderFavoritesTab = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4 mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (favorites.length === 0) {
      return (
        <div className="text-center py-8">
          <Heart size={48} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Vous n'avez pas encore ajouté de favoris</p>
          <Button className="mt-4" asChild>
            <Link to="/products">Parcourir nos produits</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex">
              <div className="h-24 w-24 rounded-md bg-secondary/20 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="dashboard-product-image"
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="font-medium mt-2">{product.price.toFixed(2)} €</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/product/${product.id}`}>Voir</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
          
          <Tabs defaultValue="profile" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span>Profil</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag size={16} />
                <span>Commandes</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart size={16} />
                <span>Favoris</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>Vos informations de contact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderProfileInfo()}
                    <div className="mt-6">
                      <Button asChild>
                        <Link to="/profile">Modifier mon profil</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Résumé</CardTitle>
                    <CardDescription>Aperçu de votre activité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-md">
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={18} />
                          <span>Commandes</span>
                        </div>
                        <span className="font-medium">{isLoading ? '-' : orders.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-md">
                        <div className="flex items-center gap-2">
                          <Heart size={18} />
                          <span>Favoris</span>
                        </div>
                        <span className="font-medium">{isLoading ? '-' : favorites.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Mes commandes</CardTitle>
                  <CardDescription>Historique de vos commandes</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderOrdersTab()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Mes favoris</CardTitle>
                  <CardDescription>Les produits que vous avez ajoutés à vos favoris</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderFavoritesTab()}
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
