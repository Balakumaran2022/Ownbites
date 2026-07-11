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
  isNonVeg: boolean;
  inStock: boolean;
  variations?: Variation[];
  addons?: Addon[];
  nutrition?: Nutrition;
  ingredients?: string[];
}

export interface Outlet {
  id: string;
  name: string;
  storeStatus: boolean;
  latitude: number;
  longitude: number;
  address: string;
  contact: string;
  distance: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAddons?: Addon[];
  selectedVariation?: Variation;
  productName?: string;
  price?: number;
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
  _id?: string;
  status: OrderStatus | string;
  items: CartItem[];
  orderDetails?: CartItem[];
  summary: CartSummary;
  totalAmount?: number;
  address: Address;
  paymentMode: PaymentMode | string;
  paymentType?: string;
  date: Date | string;
  createdAt?: string;
  outlet?: { name: string };
  outletDetails?: { outletName: string };
}

export interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
}
