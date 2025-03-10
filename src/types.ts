export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  colors?: string[];
  length?: string;
  material?: string;
  capSize?: string[];
  product_images?: Array<{ image_url: string; is_primary: boolean }>;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  payment_method: string | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}
