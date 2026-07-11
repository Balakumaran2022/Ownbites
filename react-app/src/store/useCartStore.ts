import { create } from 'zustand';
import { CartItem, Product } from '../models';
import { environment } from '../environment';

interface CartState {
  items: CartItem[];
  loading: boolean;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addToCart: (product: Product) => void;
  getCart: (customerPhoneNo: string, outletId: string) => Promise<any>;
  updateCart: (customerPhoneNo: string, outletId: string, deliveryType: string) => Promise<any>;
  cartSummary: () => {
    subtotal: number;
    discount: number;
    taxes: number;
    deliveryCharge: number;
    packageCharge: number;
    savedAmount: number;
    total: number;
    grandTotal: number;
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  clearCart: () => set({ items: [] }),

  updateQuantity: (productId: string, quantity: number) => {
    const { items } = get();
    if (quantity <= 0) {
      set({ items: items.filter(i => i.product.id !== productId) });
    } else {
      set({
        items: items.map(i => i.product.id === productId ? { ...i, quantity } : i)
      });
    }
  },

  addToCart: (product: Product) => {
    const { items } = get();
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      set({
        items: items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }
  },

  getCart: async (customerPhoneNo: string, outletId: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${environment.apiUrl}/cart/get-cart-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerPhoneNo, outletId })
      });
      const data = await res.json();
      set({ items: data.data?.items || [], loading: false });
      return data.data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  updateCart: async (customerPhoneNo: string, outletId: string, deliveryType: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${environment.apiUrl}/cart/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPhoneNo,
          outletId,
          items: get().items,
          deliveryType
        })
      });
      const data = await res.json();
      set({ loading: false });
      return data.data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  cartSummary: () => {
    const items = get().items;
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const taxes = subtotal * 0.05;
    const deliveryCharge = 50;
    const discount = 0;
    return {
      subtotal,
      discount,
      taxes,
      deliveryCharge,
      packageCharge: 0,
      savedAmount: discount,
      total: subtotal + taxes + deliveryCharge - discount,
      grandTotal: subtotal + taxes + deliveryCharge - discount
    };
  }
}));
