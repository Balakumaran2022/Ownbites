import { create } from 'zustand';
import { User } from '../models';
import { environment } from '../environment';

interface CustomerState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (phone: string) => Promise<string>;
  verifyOtp: (phone: string, otp: string) => Promise<{ token: string; customer: User }>;
  logout: () => void;
  initialize: () => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  currentUser: null,
  loading: false,
  error: null,
  
  initialize: () => {
    const stored = localStorage.getItem('foodie_customer');
    if (stored) {
      try {
        set({ currentUser: JSON.parse(stored) });
      } catch (e) {
        localStorage.removeItem('foodie_customer');
      }
    }
  },

  login: async (phone: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${environment.apiUrl}/customer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          belongsTo: environment.belongsTo,
          mode: 'otp'
        })
      });
      const data = await res.json();
      if (!res.ok || data.status === 'error') throw new Error(data.message || 'Login failed');
      set({ loading: false });
      return data.message;
    } catch (err: any) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  verifyOtp: async (phone: string, otp: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${environment.apiUrl}/customer/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp,
          belongsTo: environment.belongsTo
        })
      });
      const { status, data } = await res.json();
      
      if (status === 'success' && data) {
        const user: User = {
          id: data.customer?._id || '',
          name: data.customer?.name || 'Guest',
          phone: data.customer?.phone || phone,
          email: data.customer?.email || ''
        };
        localStorage.setItem('foodie_customer', JSON.stringify(user));
        localStorage.setItem('foodie_token', data.token);
        
        set({ currentUser: user, loading: false });
        return { token: data.token, customer: user };
      }
      throw new Error('Invalid OTP');
    } catch (err: any) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('foodie_customer');
    localStorage.removeItem('foodie_token');
    set({ currentUser: null });
  }
}));
