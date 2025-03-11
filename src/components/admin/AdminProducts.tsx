
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash, Search } from 'lucide-react';
import { Product } from '@/types';

const AdminProducts = () => {
  const { 
    products, 
    isLoadingProducts, 
    createUpdateProduct, 
    deleteProduct,
    isCreatingUpdatingProduct,
    isDeletingProduct,
    editingProduct,
    setEditingProduct
  } = useAdmin();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: '',
    imageUrl: '',
    inStock: true,
    featured: false,
    material: '',
    length: '',
    capSize: [],
    colors: []
  });
  
  // Liste des catégories disponibles (à compléter selon les besoins)
  const categories = [
    'short',
    'medium',
    'long',
    'braided',
    'lace-front',
    'full-lace'
  ];

  // Valeurs possibles pour capSize
  const capSizes = ['Petite', 'Moyenne', 'Grande'];
  
  // Couleurs disponibles (à compléter selon les besoins)
  const availableColors = [
    'Noir', 'Brun', 'Blond', 'Roux', 'Gris', 'Blanc', 'Coloré'
  ];

  // Filtrer les produits par recherche
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
      featured: product.featured,
      material: product.material || '',
      length: product.length || '',
      capSize: product.capSize || [],
      colors: product.colors || []
    });
    setIsDialogOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      description: '',
      category: '',
      imageUrl: '',
      inStock: true,
      featured: false,
      material: '',
      length: '',
      capSize: [],
      colors: []
    });
    setIsDialogOpen(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: 'capSize' | 'colors', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price || !formData.category) {
      return; // Validation basique
    }
    
    createUpdateProduct(formData);
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Gestion des produits</CardTitle>
            <Button onClick={handleNewProduct} className="flex items-center">
              <Plus size={16} className="mr-2" />
              Ajouter un produit
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un produit..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingProducts ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>En stock</TableHead>
                    <TableHead>Mise en avant</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price.toFixed(2)} €</TableCell>
                      <TableCell>
                        <span className={`inline-flex h-2 w-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex h-2 w-2 rounded-full ${product.featured ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditProduct(product)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash size={14} />
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
              <p className="text-muted-foreground">Aucun produit correspondant à votre recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour ajouter/modifier un produit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Modifiez les informations du produit ci-dessous.' 
                : 'Remplissez les informations pour ajouter un nouveau produit.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleFormChange('name', e.target.value)} 
                placeholder="Nom du produit"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€) *</Label>
              <Input 
                id="price" 
                type="number" 
                value={formData.price} 
                onChange={(e) => handleFormChange('price', parseFloat(e.target.value))} 
                placeholder="Prix"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleFormChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de l'image</Label>
              <Input 
                id="imageUrl" 
                value={formData.imageUrl} 
                onChange={(e) => handleFormChange('imageUrl', e.target.value)} 
                placeholder="URL de l'image"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => handleFormChange('description', e.target.value)} 
                placeholder="Description du produit"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Matériau</Label>
              <Input 
                id="material" 
                value={formData.material} 
                onChange={(e) => handleFormChange('material', e.target.value)} 
                placeholder="Matériau"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Longueur</Label>
              <Input 
                id="length" 
                value={formData.length} 
                onChange={(e) => handleFormChange('length', e.target.value)} 
                placeholder="Longueur"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Tailles de bonnet disponibles</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {capSizes.map(size => (
                  <div key={size} className="flex items-center gap-2">
                    <Checkbox 
                      id={`cap-size-${size}`} 
                      checked={(formData.capSize || []).includes(size)}
                      onCheckedChange={() => handleArrayToggle('capSize', size)}
                    />
                    <label 
                      htmlFor={`cap-size-${size}`}
                      className="text-sm cursor-pointer"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Couleurs disponibles</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {availableColors.map(color => (
                  <div key={color} className="flex items-center gap-2">
                    <Checkbox 
                      id={`color-${color}`} 
                      checked={(formData.colors || []).includes(color)}
                      onCheckedChange={() => handleArrayToggle('colors', color)}
                    />
                    <label 
                      htmlFor={`color-${color}`}
                      className="text-sm cursor-pointer"
                    >
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="inStock" 
                  checked={formData.inStock}
                  onCheckedChange={(checked) => handleFormChange('inStock', !!checked)}
                />
                <label 
                  htmlFor="inStock"
                  className="text-sm cursor-pointer"
                >
                  En stock
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="featured" 
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleFormChange('featured', !!checked)}
                />
                <label 
                  htmlFor="featured"
                  className="text-sm cursor-pointer"
                >
                  Mettre en avant
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveProduct} disabled={isCreatingUpdatingProduct}>
              {isCreatingUpdatingProduct 
                ? 'Enregistrement...' 
                : editingProduct 
                  ? 'Mettre à jour' 
                  : 'Ajouter'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setProductToDelete(null)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteProduct}
              disabled={isDeletingProduct}
            >
              {isDeletingProduct ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
