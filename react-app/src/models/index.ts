export type AddressType = 'Home' | 'Office' | 'Other';
export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
export type PaymentMode = 'COD' | 'Online' | 'Loyalty';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Address {
  id: string;
  type: AddressType;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Variation {
  name: string;
  price: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface Nutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isVeg: boolean;
  inStock: boolean;
  variations?: Variation[];
  addons?: Addon[];
  nutrition?: Nutrition;
  ingredients?: string[];
}

export interface Outlet {
  id: string;
  name: string;
  rating: number;
  distance: number;
  deliveryTime: number; // in minutes
  isOpen: boolean;
  overrideMessage?: string; // "Temporarily Closed"
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAddons?: Addon[];
  selectedVariation?: Variation;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  taxes: number;
  deliveryCharge: number;
  packageCharge: number;
  total: number;
  savedAmount: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountAmount: number;
  minOrderValue: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: CartItem[];
  summary: CartSummary;
  address: Address;
  paymentMode: PaymentMode;
  date: Date;
}

export interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
}
