
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Mock product data
    const products = [
      {
        name: 'Élégance Naturelle',
        description: 'Perruque mi-longue en cheveux humains, légère et confortable. Finition lace front pour un aspect naturel.',
        price: 249.99,
        category: 'medium',
        material: 'Cheveux humains',
        length: 'Mi-longue',
        cap_size: ['Petite', 'Moyenne', 'Grande'],
        colors: ['Noir', 'Brun', 'Blond'],
        in_stock: true,
        stock_quantity: 15,
        featured: true,
        rating: 4.8,
        reviews: 124
      },
      {
        name: 'Cascade Ondulée',
        description: 'Perruque longue avec de belles ondulations. Cheveux synthétiques premium de haute qualité.',
        price: 299.99,
        category: 'long',
        material: 'Synthétique premium',
        length: 'Longue',
        cap_size: ['Moyenne', 'Grande'],
        colors: ['Noir', 'Brun foncé', 'Auburn'],
        in_stock: true,
        stock_quantity: 10,
        featured: true,
        rating: 4.7,
        reviews: 95
      },
      {
        name: 'Pixie Moderne',
        description: 'Coupe courte et dynamique, parfaite pour un style moderne et sans effort.',
        price: 179.99,
        category: 'short',
        material: 'Mélange synthétique et humain',
        length: 'Courte',
        cap_size: ['Petite', 'Moyenne'],
        colors: ['Noir', 'Gris argenté', 'Blond platine'],
        in_stock: true,
        stock_quantity: 12,
        featured: true,
        rating: 4.9,
        reviews: 87
      },
      {
        name: 'Diva Glamour',
        description: 'Perruque full lace volumineuse avec boucles somptueuses. Idéale pour les occasions spéciales.',
        price: 329.99,
        category: 'full-lace',
        material: 'Cheveux humains Remy',
        length: 'Longue',
        cap_size: ['Moyenne', 'Grande'],
        colors: ['Noir', 'Brun', 'Ombré'],
        in_stock: true,
        stock_quantity: 8,
        featured: true,
        rating: 4.6,
        reviews: 76
      }
    ];

    // Product images (URLs to placeholder images)
    const productImages = [
      'https://images.unsplash.com/photo-1605980625600-88d6716a8a21?q=80&w=1974',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1974',
      'https://images.unsplash.com/photo-1595591569984-d4d660144a03?q=80&w=1974',
      'https://images.unsplash.com/photo-1592442399874-3fbf971594a3?q=80&w=1974'
    ];

    console.log('Starting to seed initial products...');

    // Insert each product and create an entry for its primary image
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageUrl = productImages[i % productImages.length];

      // Insert the product
      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert(product)
        .select('id')
        .single();

      if (productError) {
        console.error(`Error inserting product ${product.name}:`, productError);
        continue;
      }

      // Insert the primary image for the product
      const { error: imageError } = await supabase
        .from('product_images')
        .insert({
          product_id: insertedProduct.id,
          image_url: imageUrl,
          is_primary: true
        });

      if (imageError) {
        console.error(`Error inserting image for product ${product.name}:`, imageError);
      }

      console.log(`Seeded product: ${product.name}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Initial products seeded successfully' }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Error in seed-data function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
        status: 500
      }
    );
  }
});
