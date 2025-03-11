
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Order, OrderItem, Product, Profile, Promotion, ProductPromotion } from '@/types';

export const useAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // États pour les formulaires d'édition
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  // Récupération des produits
  const { 
    data: products = [], 
    isLoading: isLoadingProducts,
    error: productsError 
  } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            image_url,
            is_primary
          )
        `);
      
      if (error) throw error;
      
      return data.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1605980625600-88d6716a8a21?q=80&w=1974',
        description: product.description,
        category: product.category,
        featured: product.featured,
        inStock: product.in_stock,
        rating: Number(product.rating),
        reviews: product.reviews,
        colors: product.colors,
        length: product.length,
        material: product.material,
        capSize: product.cap_size,
        product_images: product.product_images
      })) as Product[];
    }
  });

  // Récupération des commandes avec détails
  const { 
    data: orders = [], 
    isLoading: isLoadingOrders,
    error: ordersError 
  } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      const ordersWithItems: Order[] = ordersData;
      
      // Récupérer les items pour chaque commande
      for (const order of ordersWithItems) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (*)
          `)
          .eq('order_id', order.id);
        
        if (itemsError) {
          console.error(`Erreur lors de la récupération des items pour la commande ${order.id}:`, itemsError);
          continue;
        }
        
        // Récupérer les informations du client
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', order.user_id)
          .single();
        
        if (profileError && !profileError.message.includes('No rows returned')) {
          console.error(`Erreur lors de la récupération du profil pour la commande ${order.id}:`, profileError);
        }
        
        // Ajouter les items et le profil client à l'objet commande
        (order as any).items = itemsData;
        (order as any).customer = profileData;
      }
      
      return ordersWithItems as OrderWithItems[];
    }
  });

  // Récupération des utilisateurs/clients
  const { 
    data: customers = [], 
    isLoading: isLoadingCustomers,
    error: customersError 
  } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as Profile[];
    }
  });

  // Récupération des promotions
  const { 
    data: promotions = [], 
    isLoading: isLoadingPromotions,
    error: promotionsError 
  } = useQuery({
    queryKey: ['admin', 'promotions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as Promotion[];
    }
  });

  // Récupération des associations produit-promotion
  const { 
    data: productPromotions = [], 
    isLoading: isLoadingProductPromotions,
    error: productPromotionsError 
  } = useQuery({
    queryKey: ['admin', 'productPromotions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_promotions')
        .select(`
          *,
          products (*),
          promotions (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data as ProductPromotion[];
    }
  });

  // Mutation pour créer/mettre à jour un produit
  const createUpdateProductMutation = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const isUpdate = !!product.id;
      
      const { data, error } = isUpdate 
        ? await supabase
            .from('products')
            .update({
              name: product.name,
              price: product.price,
              description: product.description,
              category: product.category,
              featured: product.featured,
              in_stock: product.inStock,
              rating: product.rating,
              reviews: product.reviews,
              colors: product.colors,
              length: product.length,
              material: product.material,
              cap_size: product.capSize,
              updated_at: new Date().toISOString()
            })
            .eq('id', product.id)
            .select()
            .single()
        : await supabase
            .from('products')
            .insert({
              name: product.name,
              price: product.price,
              description: product.description,
              category: product.category,
              featured: product.featured || false,
              in_stock: product.inStock || true,
              rating: product.rating || 0,
              reviews: product.reviews || 0,
              colors: product.colors || [],
              length: product.length,
              material: product.material,
              cap_size: product.capSize || []
            })
            .select()
            .single();
      
      if (error) throw error;
      
      // Si une imageUrl est fournie, mettre à jour ou créer une image produit
      if (product.imageUrl && data) {
        // Vérifier si une image existe déjà
        const { data: existingImages, error: imageError } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', data.id);
        
        if (imageError) throw imageError;
        
        if (existingImages && existingImages.length > 0) {
          // Mettre à jour l'image existante
          const { error: updateError } = await supabase
            .from('product_images')
            .update({
              image_url: product.imageUrl,
              is_primary: true
            })
            .eq('id', existingImages[0].id);
          
          if (updateError) throw updateError;
        } else {
          // Créer une nouvelle image
          const { error: insertError } = await supabase
            .from('product_images')
            .insert({
              product_id: data.id,
              image_url: product.imageUrl,
              is_primary: true
            });
          
          if (insertError) throw insertError;
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setEditingProduct(null);
      toast({
        title: "Succès",
        description: "Le produit a été enregistré",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la sauvegarde du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le produit",
        variant: "destructive",
      });
    }
  });

  // Mutation pour supprimer un produit
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast({
        title: "Succès",
        description: "Le produit a été supprimé",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    }
  });

  // Mutation pour mettre à jour le statut d'une commande
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast({
        title: "Succès",
        description: "Le statut de la commande a été mis à jour",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du statut de la commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
        variant: "destructive",
      });
    }
  });

  // Mutation pour créer/mettre à jour une promotion
  const createUpdatePromotionMutation = useMutation({
    mutationFn: async (promotion: Partial<Promotion>) => {
      const isUpdate = !!promotion.id;
      
      const { data, error } = isUpdate 
        ? await supabase
            .from('promotions')
            .update({
              name: promotion.name,
              description: promotion.description,
              discount_percentage: promotion.discount_percentage,
              active: promotion.active,
              start_date: promotion.start_date,
              end_date: promotion.end_date,
              updated_at: new Date().toISOString()
            })
            .eq('id', promotion.id)
            .select()
            .single()
        : await supabase
            .from('promotions')
            .insert({
              name: promotion.name,
              description: promotion.description,
              discount_percentage: promotion.discount_percentage,
              active: promotion.active || true,
              start_date: promotion.start_date,
              end_date: promotion.end_date
            })
            .select()
            .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
      setEditingPromotion(null);
      toast({
        title: "Succès",
        description: "La promotion a été enregistrée",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la sauvegarde de la promotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la promotion",
        variant: "destructive",
      });
    }
  });

  // Mutation pour supprimer une promotion
  const deletePromotionMutation = useMutation({
    mutationFn: async (promotionId: string) => {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId);
      
      if (error) throw error;
      
      return promotionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promotions'] });
      toast({
        title: "Succès",
        description: "La promotion a été supprimée",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression de la promotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la promotion",
        variant: "destructive",
      });
    }
  });

  // Mutation pour associer un produit à une promotion
  const createProductPromotionMutation = useMutation({
    mutationFn: async ({ productId, promotionId }: { productId: string; promotionId: string }) => {
      const { data, error } = await supabase
        .from('product_promotions')
        .insert({
          product_id: productId,
          promotion_id: promotionId
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'productPromotions'] });
      toast({
        title: "Succès",
        description: "Le produit a été associé à la promotion",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'association du produit à la promotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'associer le produit à la promotion",
        variant: "destructive",
      });
    }
  });

  // Mutation pour supprimer une association produit-promotion
  const deleteProductPromotionMutation = useMutation({
    mutationFn: async (productPromotionId: string) => {
      const { error } = await supabase
        .from('product_promotions')
        .delete()
        .eq('id', productPromotionId);
      
      if (error) throw error;
      
      return productPromotionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'productPromotions'] });
      toast({
        title: "Succès",
        description: "L'association produit-promotion a été supprimée",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression de l\'association produit-promotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'association produit-promotion",
        variant: "destructive",
      });
    }
  });

  return {
    // États
    editingProduct,
    setEditingProduct,
    editingPromotion,
    setEditingPromotion,
    
    // Données
    products,
    isLoadingProducts,
    productsError,
    
    orders,
    isLoadingOrders,
    ordersError,
    
    customers,
    isLoadingCustomers,
    customersError,
    
    promotions,
    isLoadingPromotions,
    promotionsError,
    
    productPromotions,
    isLoadingProductPromotions,
    productPromotionsError,
    
    // Mutations
    createUpdateProduct: createUpdateProductMutation.mutate,
    isCreatingUpdatingProduct: createUpdateProductMutation.isPending,
    
    deleteProduct: deleteProductMutation.mutate,
    isDeletingProduct: deleteProductMutation.isPending,
    
    updateOrderStatus: updateOrderStatusMutation.mutate,
    isUpdatingOrderStatus: updateOrderStatusMutation.isPending,
    
    createUpdatePromotion: createUpdatePromotionMutation.mutate,
    isCreatingUpdatingPromotion: createUpdatePromotionMutation.isPending,
    
    deletePromotion: deletePromotionMutation.mutate,
    isDeletingPromotion: deletePromotionMutation.isPending,
    
    createProductPromotion: createProductPromotionMutation.mutate,
    isCreatingProductPromotion: createProductPromotionMutation.isPending,
    
    deleteProductPromotion: deleteProductPromotionMutation.mutate,
    isDeletingProductPromotion: deleteProductPromotionMutation.isPending
  };
};

export type OrderWithItems = Order & {
  items?: OrderItem[];
  customer?: Profile;
};
