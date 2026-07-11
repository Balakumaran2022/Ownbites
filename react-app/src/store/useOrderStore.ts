import { create } from 'zustand';
import { Order } from '../models';
import { environment } from '../environment';

interface OrderState {
  orders: Order[];
  loading: boolean;
  createOrder: (payload: any) => Promise<Order>;
  placeOrder: (payload: any) => Promise<Order>;
  getOrders: () => Promise<Order[]>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,

  createOrder: async (payload: any) => {
    set({ loading: true });
    try {
      const res = await fetch(`${environment.apiUrl}/cart/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      set({ loading: false });
      return data.data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  placeOrder: async (payload: any) => {
    set({ loading: true });
    try {
      const res = await fetch(`${environment.apiUrl}/cart/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      set({ loading: false });
      return data.data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  getOrders: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${environment.apiUrl}/order/get-all-order-by-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      set({ orders: data.data || [], loading: false });
      return data.data || [];
    } catch (err) {
      set({ loading: false });
      return [];
    }
  }
}));
