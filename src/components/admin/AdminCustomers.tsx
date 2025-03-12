
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
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Mail, Phone, MapPin } from 'lucide-react';
import { Profile } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminCustomers = () => {
  const { 
    customers, 
    isLoadingCustomers,
    orders
  } = useAdmin();
  
  const [viewingCustomer, setViewingCustomer] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrer les clients par recherche
  const filteredCustomers = customers.filter(customer => 
    (customer.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCustomer = (customer: Profile) => {
    setViewingCustomer(customer);
  };

  // Obtenir les commandes d'un client
  const getCustomerOrders = (customerId: string) => {
    return orders.filter(order => order.user_id === customerId);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des clients</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un client..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingCustomers ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : filteredCustomers.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.full_name || 'Non renseigné'}</TableCell>
                      <TableCell>{customer.email || 'Non renseigné'}</TableCell>
                      <TableCell>{customer.phone || 'Non renseigné'}</TableCell>
                      <TableCell>
                        <Badge variant={customer.role === 'admin' ? 'destructive' : 'secondary'}>
                          {customer.role === 'admin' ? 'Administrateur' : 'Client'}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(customer.created_at), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleViewCustomer(customer)}
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
              <p className="text-muted-foreground">Aucun client correspondant à votre recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour voir les détails d'un client */}
      <Dialog open={!!viewingCustomer} onOpenChange={(open) => !open && setViewingCustomer(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Profil client
            </DialogTitle>
            <DialogDescription>
              Détails et historique des commandes
            </DialogDescription>
          </DialogHeader>
          
          {viewingCustomer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Informations personnelles</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-0.5">
                      <Mail size={14} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{viewingCustomer.email || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-0.5">
                      <Phone size={14} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Téléphone</p>
                      <p className="text-sm">{viewingCustomer.phone || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-0.5">
                      <MapPin size={14} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Adresse</p>
                      <div className="text-sm">
                        <p>{viewingCustomer.address || 'Non renseignée'}</p>
                        <p>
                          {viewingCustomer.postal_code && viewingCustomer.city 
                            ? `${viewingCustomer.postal_code} ${viewingCustomer.city}`
                            : 'Ville non renseignée'}
                        </p>
                        <p>{viewingCustomer.country || 'Pays non renseigné'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Informations compte</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>ID :</strong> {viewingCustomer.id}</p>
                  <p><strong>Rôle :</strong> {viewingCustomer.role === 'admin' ? 'Administrateur' : 'Client'}</p>
                  <p><strong>Date d'inscription :</strong> {format(new Date(viewingCustomer.created_at), 'Pp', { locale: fr })}</p>
                  <p><strong>Dernière mise à jour :</strong> {format(new Date(viewingCustomer.updated_at), 'Pp', { locale: fr })}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold mb-2">Historique des commandes</h3>
                {(() => {
                  const customerOrders = getCustomerOrders(viewingCustomer.id);
                  return customerOrders.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Paiement</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customerOrders.map(order => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                              <TableCell>{format(new Date(order.created_at), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                              <TableCell>{Number(order.total_amount).toFixed(2)} €</TableCell>
                              <TableCell>
                                <Badge variant={
                                  order.status === 'completed' 
                                    ? 'default' 
                                    : order.status === 'processing' 
                                      ? 'default' 
                                      : 'secondary'
                                } className={
                                  order.status === 'completed' ? 'bg-green-500 text-white' : ''
                                }>
                                  {order.status === 'completed' 
                                    ? 'Livrée' 
                                    : order.status === 'processing' 
                                      ? 'En cours' 
                                      : 'En attente'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={order.payment_status === 'paid' ? 'outline' : 'destructive'}>
                                  {order.payment_status === 'paid' ? 'Payée' : 'En attente'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Ce client n'a pas encore passé de commande.</p>
                  );
                })()}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingCustomer(null)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomers;
