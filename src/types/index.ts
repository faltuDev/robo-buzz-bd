// Auth Types
export interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  phone?: string;
  photoURL?: string;
  emailVerified?: boolean;
}

// Product Types
export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  rating: number;
  freeDelivery: boolean;
  featured: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  image: string;
}

// Offer Types
export interface Offer {
  id: string;
  title: string;
  discount: string;
  description: string;
  image: string;
  validUntil: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Search Types
export interface SearchResult {
  products: Product[];
  query: string;
}