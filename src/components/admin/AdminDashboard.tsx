
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/hooks/use-admin';
import { Activity, ShoppingBag, Users, Tag, Package, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminDashboard = () => {
  const { 
    products, 
    orders, 
    customers, 
    promotions,
    isLoadingProducts,
    isLoadingOrders,
    isLoadingCustomers,
    isLoadingPromotions 
  } = useAdmin();

  // Calcul des statistiques
  const totalOrderAmount = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const totalProductsCount = products.length;
  const activePromotionsCount = promotions.filter(
    promo => promo.active && new Date(promo.end_date) > new Date()
  ).length;
  const customersCount = customers.length;
  
  // Dernières commandes pour affichage
  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 5);

  // Produits populaires (ici basé sur les évaluations, mais pourrait être basé sur les ventes)
  const popularProducts = [...products].sort(
    (a, b) => b.rating - a.rating
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Carte de revenus */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenus totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              {isLoadingOrders ? (
                <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
              ) : (
                <span className="text-2xl font-bold">{totalOrderAmount.toFixed(2)} €</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Carte de commandes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              {isLoadingOrders ? (
                <div className="h-5 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                <span className="text-2xl font-bold">{orders.length}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Carte de clients */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {isLoadingCustomers ? (
                <div className="h-5 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                <span className="text-2xl font-bold">{customersCount}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Carte de promotions actives */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Promotions actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {isLoadingPromotions ? (
                <div className="h-5 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                <span className="text-2xl font-bold">{activePromotionsCount}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dernières commandes */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Dernières commandes</CardTitle>
            <CardDescription>Les 5 commandes les plus récentes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded">
                    <div>
                      <p className="font-medium">#{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.created_at), 'Pp', { locale: fr })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-3">{Number(order.total_amount).toFixed(2)} €</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'processing' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' 
                          ? 'Livrée' 
                          : order.status === 'processing' 
                          ? 'En cours' 
                          : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune commande récente</p>
            )}
          </CardContent>
        </Card>

        {/* Produits populaires */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
            <CardDescription>Les 5 produits les mieux notés</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            ) : popularProducts.length > 0 ? (
              <div className="space-y-3">
                {popularProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-muted/50 overflow-hidden mr-3">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Circle className="h-3 w-3 fill-current text-amber-500 stroke-0" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun produit disponible</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
