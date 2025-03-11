
import React, { useState } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Clock, Truck, CheckCircle } from 'lucide-react';
import { OrderWithItems } from '@/hooks/use-admin';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminOrders = () => {
  const { 
    orders, 
    isLoadingOrders, 
    updateOrderStatus,
    isUpdatingOrderStatus
  } = useAdmin();
  
  const [viewingOrder, setViewingOrder] = useState<OrderWithItems | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Statuts possibles pour les commandes
  const orderStatuses = [
    { value: 'pending', label: 'En attente', icon: <Clock size={14} /> },
    { value: 'processing', label: 'En cours', icon: <Truck size={14} /> },
    { value: 'completed', label: 'Livrée', icon: <CheckCircle size={14} /> }
  ];

  // Filtrer les commandes par recherche et statut
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shipping_address || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: OrderWithItems) => {
    setViewingOrder(order);
  };

  const handleStatusChange = (orderId: string, status: string) => {
    updateOrderStatus({ orderId, status });
  };

  // Formater le statut de la commande pour affichage
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock size={12} /> En attente</Badge>;
      case 'processing':
        return <Badge variant="default" className="flex items-center gap-1"><Truck size={12} /> En cours</Badge>;
      case 'completed':
        return <Badge variant="success" className="bg-green-500 text-white flex items-center gap-1"><CheckCircle size={12} /> Livrée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gestion des commandes</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une commande..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {orderStatuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      {status.icon}
                      <span>{status.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                      <TableCell>{format(new Date(order.created_at), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                      <TableCell>{order.customer?.full_name || 'Client anonyme'}</TableCell>
                      <TableCell>{Number(order.total_amount).toFixed(2)} €</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <Badge variant={order.payment_status === 'paid' ? 'outline' : 'destructive'}>
                          {order.payment_status === 'paid' ? 'Payée' : 'En attente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Aucune commande correspondant à votre recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour voir les détails d'une commande */}
      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Commande #{viewingOrder?.id.substring(0, 8)}
            </DialogTitle>
            <DialogDescription>
              Créée le {viewingOrder && format(new Date(viewingOrder.created_at), 'Pp', { locale: fr })}
            </DialogDescription>
          </DialogHeader>
          
          {viewingOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Informations client</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Nom :</strong> {viewingOrder.customer?.full_name || 'Non renseigné'}</p>
                  <p><strong>Email :</strong> {viewingOrder.customer?.email || 'Non renseigné'}</p>
                  <p><strong>Téléphone :</strong> {viewingOrder.customer?.phone || 'Non renseigné'}</p>
                </div>

                <h3 className="text-sm font-semibold mt-4 mb-2">Adresse de livraison</h3>
                <div className="space-y-2 text-sm">
                  <p>{viewingOrder.shipping_address || 'Non renseignée'}</p>
                  <p>
                    {viewingOrder.shipping_postal_code} {viewingOrder.shipping_city}
                  </p>
                  <p>{viewingOrder.shipping_country}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Statut de la commande</h3>
                <Select 
                  value={viewingOrder.status} 
                  onValueChange={(value) => handleStatusChange(viewingOrder.id, value)}
                  disabled={isUpdatingOrderStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          {status.icon}
                          <span>{status.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <h3 className="text-sm font-semibold mt-4 mb-2">Méthode de paiement</h3>
                <p className="text-sm">{viewingOrder.payment_method || 'Non renseignée'}</p>
                
                <h3 className="text-sm font-semibold mt-4 mb-2">Statut du paiement</h3>
                <Badge variant={viewingOrder.payment_status === 'paid' ? 'outline' : 'destructive'}>
                  {viewingOrder.payment_status === 'paid' ? 'Payé' : 'En attente'}
                </Badge>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold mb-2">Articles commandés</h3>
                {viewingOrder.items && viewingOrder.items.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead>Prix unitaire</TableHead>
                          <TableHead>Quantité</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewingOrder.items.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {item.product?.product_images?.[0]?.image_url && (
                                  <div className="h-10 w-10 rounded overflow-hidden">
                                    <img 
                                      src={item.product.product_images[0].image_url} 
                                      alt={item.product?.name || 'Produit'} 
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">{item.product?.name || `Produit ID: ${item.product_id}`}</p>
                                  {item.product?.category && (
                                    <p className="text-xs text-muted-foreground">{item.product.category}</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{Number(item.unit_price).toFixed(2)} €</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">{Number(item.total_price).toFixed(2)} €</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                          <TableCell className="text-right font-semibold">{Number(viewingOrder.total_amount).toFixed(2)} €</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun article trouvé pour cette commande.</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingOrder(null)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
