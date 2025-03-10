import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Fetch products from Supabase
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (
        image_url,
        is_primary
      )
    `);

  if (error) {
    console.error('Error fetching products from Supabase, using mock data:', error);
    return getMockProducts();
  }

  // Transform database products to match frontend Product type
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
  }));
};

// Fetch mock products if Supabase fetch fails
const getMockProducts = (): Product[] => {
  return [
    {
      id: 'wig1',
      name: 'Élégance Naturelle',
      price: 249.99,
      imageUrl: 'https://images.unsplash.com/photo-1605980625600-88d6716a8a21?q=80&w=1974',
      description: 'Perruque mi-longue en cheveux humains, légère et confortable. Finition lace front pour un aspect naturel.',
      category: 'medium',
      featured: true,
      inStock: true,
      rating: 4.8,
      reviews: 124,
      length: 'Mi-longue',
      material: 'Cheveux humains',
      capSize: ['Petite', 'Moyenne', 'Grande']
    },
    {
      id: 'wig2',
      name: 'Cascade Ondulée',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1974',
      description: 'Perruque longue avec de belles ondulations. Cheveux synthétiques premium de haute qualité.',
      category: 'long',
      featured: true,
      inStock: true,
      rating: 4.7,
      reviews: 95,
      length: 'Longue',
      material: 'Synthétique premium',
      capSize: ['Moyenne', 'Grande']
    },
    {
      id: 'wig3',
      name: 'Pixie Moderne',
      price: 179.99,
      imageUrl: 'https://images.unsplash.com/photo-1595591569984-d4d660144a03?q=80&w=1974',
      description: 'Coupe courte et dynamique, parfaite pour un style moderne et sans effort.',
      category: 'short',
      featured: true,
      inStock: true,
      rating: 4.9,
      reviews: 87,
      length: 'Courte',
      material: 'Mélange synthétique et humain',
      capSize: ['Petite', 'Moyenne']
    },
    {
      id: 'wig4',
      name: 'Diva Glamour',
      price: 329.99,
      imageUrl: 'https://images.unsplash.com/photo-1592442399874-3fbf971594a3?q=80&w=1974',
      description: 'Perruque full lace volumineuse avec boucles somptueuses. Idéale pour les occasions spéciales.',
      category: 'full-lace',
      featured: true,
      inStock: true,
      rating: 4.6,
      reviews: 76,
      length: 'Longue',
      material: 'Cheveux humains Remy',
      capSize: ['Moyenne', 'Grande']
    },
    {
      id: 'wig5',
      name: 'Naturel Lisse',
      price: 259.99,
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961',
      description: 'Perruque lace front avec cheveux lisses naturels. Style polyvalent et élégant.',
      category: 'lace-front',
      featured: false,
      inStock: true,
      rating: 4.5,
      reviews: 68,
      length: 'Mi-longue',
      material: 'Cheveux humains',
      capSize: ['Petite', 'Moyenne', 'Grande']
    },
    {
      id: 'wig6',
      name: 'Carré Parisien',
      price: 219.99,
      imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974',
      description: 'Carré élégant et sophistiqué, inspiré par le style parisien intemporel.',
      category: 'medium',
      featured: false,
      inStock: true,
      rating: 4.4,
      reviews: 52,
      length: 'Mi-longue',
      material: 'Synthétique haute qualité',
      capSize: ['Petite', 'Moyenne']
    },
    {
      id: 'wig7',
      name: 'Tresses Africaines',
      price: 289.99,
      imageUrl: 'https://images.unsplash.com/photo-1568127683119-a531e9436af2?q=80&w=1974',
      description: 'Magnifique perruque avec tresses africaines, parfaite pour un style authentique et protecteur.',
      category: 'braided',
      featured: false,
      inStock: true,
      rating: 4.8,
      reviews: 44,
      length: 'Longue',
      material: 'Synthétique premium',
      capSize: ['Moyenne', 'Grande']
    },
    {
      id: 'wig8',
      name: 'Bob Classique',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=1974',
      description: 'Bob classique et intemporel, parfait pour un look professionnel et élégant.',
      category: 'short',
      featured: false,
      inStock: true,
      rating: 4.7,
      reviews: 39,
      length: 'Courte',
      material: 'Mélange synthétique et humain',
      capSize: ['Petite', 'Moyenne']
    }
  ];
};

export const useProducts = () => {
  const [categories, setCategories] = useState<string[]>([]);
  
  // Use React Query to fetch products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Extract unique categories
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = Array.from(
        new Set(products.map(product => product.category))
      );
      setCategories(uniqueCategories);
    }
  }, [products]);

  const getProductById = (productId: string) => {
    return products.find(product => product.id === productId) || null;
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  return {
    products,
    categories,
    isLoading,
    error: error ? (error as Error).message : null,
    getProductById,
    getProductsByCategory,
    featuredProducts: getFeaturedProducts(),
  };
};
