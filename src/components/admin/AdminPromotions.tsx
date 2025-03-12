
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
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Search, Plus, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Promotion } from '@/types';

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  discount_percentage: z.coerce.number().min(1).max(100),
  active: z.boolean().default(true),
  start_date: z.date({
    required_error: "La date de début est requise",
  }),
  end_date: z.date({
    required_error: "La date de fin est requise",
  }).refine(date => date > new Date(), {
    message: "La date de fin doit être dans le futur",
  })
}).refine(data => data.start_date < data.end_date, {
  message: "La date de fin doit être postérieure à la date de début",
  path: ["end_date"],
});

type FormValues = z.infer<typeof formSchema>;

const AdminPromotions = () => {
  const { 
    promotions,
    isLoadingPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    isUpdatingPromotion
  } = useAdmin();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      discount_percentage: 10,
      active: true,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
    }
  });

  // Filtrer les promotions par recherche
  const filteredPromotions = promotions.filter(promotion => 
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (promotion.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    form.reset();
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.reset({
      name: promotion.name,
      description: promotion.description || '',
      discount_percentage: promotion.discount_percentage,
      active: promotion.active,
      start_date: new Date(promotion.start_date),
      end_date: new Date(promotion.end_date),
    });
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingPromotion(null);
  };

  const onSubmit = async (data: FormValues) => {
    if (editingPromotion) {
      await updatePromotion({
        id: editingPromotion.id,
        ...data,
      });
    } else {
      await addPromotion(data);
    }
    closeDialog();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion?')) {
      await deletePromotion(id);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Gestion des promotions</CardTitle>
          <Button onClick={handleOpenAddDialog} size="sm" className="flex items-center gap-1">
            <Plus size={16} />
            <span>Ajouter</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une promotion..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoadingPromotions ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : filteredPromotions.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Remise</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.map(promotion => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{promotion.name}</div>
                          {promotion.description && (
                            <div className="text-xs text-muted-foreground">{promotion.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{promotion.discount_percentage}%</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Du {format(new Date(promotion.start_date), 'dd/MM/yyyy', { locale: fr })}</div>
                          <div>Au {format(new Date(promotion.end_date), 'dd/MM/yyyy', { locale: fr })}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={promotion.active ? "default" : "secondary"}>
                          {promotion.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleOpenEditDialog(promotion)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(promotion.id)}
                          >
                            <Trash2 size={14} />
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
              <p className="text-muted-foreground">Aucune promotion trouvée.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour ajouter/modifier une promotion */}
      <Dialog 
        open={isAddDialogOpen || !!editingPromotion} 
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPromotion ? 'Modifier la promotion' : 'Ajouter une nouvelle promotion'}
            </DialogTitle>
            <DialogDescription>
              {editingPromotion 
                ? 'Modifiez les détails de la promotion existante' 
                : 'Créez une nouvelle promotion pour vos produits'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Soldes d'été" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description de la promotion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="discount_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourcentage de remise</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="100" {...field} />
                    </FormControl>
                    <FormDescription>
                      Entrez un pourcentage entre 1 et 100
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de début</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de fin</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date() || 
                              (form.getValues().start_date && date < form.getValues().start_date)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Promotion active
                      </FormLabel>
                      <FormDescription>
                        Décochez pour désactiver temporairement la promotion
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isUpdatingPromotion}>
                  {editingPromotion ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPromotions;
