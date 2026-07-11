import { create } from 'zustand';
import { Address } from '../models';
import { environment } from '../environment';

interface AddressState {
  currentAddress: Address | null;
  savedAddresses: Address[];
  loading: boolean;
  selectAddress: (address: Address) => void;
  loadAddress: () => void;
  getAddresses: (customerPhoneNo: string) => Promise<Address[]>;
  createAddress: (addressData: Partial<Address>) => Promise<Address>;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'Home',
    street: '72a, North St, Thanjai Salai, Vasan Nagar, Madappuram',
    city: 'Thiruvarur',
    state: 'Tamil Nadu',
    zip: '610001',
    isDefault: true
  },
  {
    id: '2',
    type: 'Office',
    street: 'Santhamangalam, KTR Nagar',
    city: 'Thiruvarur',
    state: 'Tamil Nadu',
    zip: '610001',
    isDefault: false
  },
  {
    id: '3',
    type: 'Other',
    street: 'Chennai Beach, Rajaji Rd, George Town',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zip: '600001',
    isDefault: false
  },
  {
    id: '4',
    type: 'Other',
    street: 'Nehru Stadium Gate 1, 37QC+Q2V, Periamet, Kannappar Thidal',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zip: '600003',
    isDefault: false
  }
];

export const useAddressStore = create<AddressState>((set) => ({
  currentAddress: null,
  savedAddresses: mockAddresses,
  loading: false,

  selectAddress: (address: Address) => {
    localStorage.setItem('foodie_address', JSON.stringify(address));
    set({ currentAddress: address });
  },

  loadAddress: () => {
    const stored = localStorage.getItem('foodie_address');
    if (stored) {
      try {
        set({ currentAddress: JSON.parse(stored) });
      } catch (e) {}
    }
  },

  getAddresses: async (customerPhoneNo: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${environment.apiUrl}/customer/get-addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerPhoneNo })
      });
      const data = await res.json();
      set({ loading: false });
      return data.data;
    } catch (err) {
      set({ loading: false });
      return mockAddresses; // fallback to mock on error like Angular did implicitly
    }
  },

  createAddress: async (addressData: Partial<Address>) => {
    set({ loading: true });
    try {
      const res = await fetch(`${environment.apiUrl}/customer/create-address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData)
      });
      const data = await res.json();
      set({ loading: false });
      return data.data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  }
}));
