
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
