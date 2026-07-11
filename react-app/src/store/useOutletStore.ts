import { create } from 'zustand';
import { Outlet, Category } from '../models';
import { environment } from '../environment';

interface OutletState {
  outlets: Outlet[];
  categories: Category[];
  loadingOutlets: boolean;
  loadingCategories: boolean;
  fetchOutlets: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useOutletStore = create<OutletState>((set) => ({
  outlets: [],
  categories: [],
  loadingOutlets: false,
  loadingCategories: false,

  fetchOutlets: async () => {
    set({ loadingOutlets: true });
    try {
      const res = await fetch(`${environment.apiUrl}/organization/outlets/get-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          belongsTo: environment.belongsTo,
          lat: 10.777,
          lng: 79.634,
          locationSorting: true
        })
      });
      const resData = await res.json();
      const rawOutlets = (resData.data && resData.data.outlets) ? resData.data.outlets : [];
      
      const mappedOutlets = rawOutlets.map((o: any, index: number) => {
        let img = o.outletDetails?.image;
        if (!img || img === 'https://storage.googleapis.com/ownchat/uploads/images/common_image.jpg') {
           const fallbacks = [
             'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
             'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
             'https://images.unsplash.com/photo-1590846406792-0adc7f928a18?w=800&q=80',
             'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'
           ];
           img = fallbacks[index % fallbacks.length];
        }
        
        return {
          id: o._id,
          name: o.outletName || o.outletDetails?.outletName || '',
          rating: 4.5,
          distance: Math.round(Math.random() * 5 + 1),
          deliveryTime: Math.round(Math.random() * 30 + 15),
          isOpen: o.storeStatus === true,
          overrideMessage: o.storeStatus ? '' : 'Closed',
          imageUrl: img
        };
      });

      set({ outlets: mappedOutlets, loadingOutlets: false });
    } catch (error) {
      set({ loadingOutlets: false });
    }
  },

  fetchCategories: async () => {
    set({ loadingCategories: true });
    try {
      const res = await fetch(`${environment.apiUrl}/catalog/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outletId: environment.outletId })
      });
      const data = await res.json();
      set({ categories: data.categories || [], loadingCategories: false });
    } catch (error) {
      set({ loadingCategories: false });
    }
  }
}));
