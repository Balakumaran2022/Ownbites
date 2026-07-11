import { create } from 'zustand';
import { Product } from '../models';
import { environment } from '../environment';

interface ProductState {
  products: Product[];
  productDetail: Product | null;
  loading: boolean;
  loadingDetail: boolean;
  getProductsByOutlet: (outletId: string) => Promise<void>;
  getProductById: (itemId: string, outletId: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  productDetail: null,
  loading: false,
  loadingDetail: false,

  getProductsByOutlet: async (outletId: string) => {
    set({ loading: true });
    try {
      const res = await fetch(`${environment.apiUrl}/category/getCategory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          belongsTo: environment.belongsTo,
          outletId: outletId === 'all' ? environment.outletId : outletId
        })
      });
      const resData = await res.json();
      
      const items: Product[] = [];
      const rawData = resData.data || [];
      
      rawData.forEach((cat: any) => {
        if (cat.items && Array.isArray(cat.items)) {
          cat.items.forEach((item: any) => {
            items.push({
              id: item._id,
              categoryId: cat._id,
              name: item.name,
              description: item.description || '',
              imageUrl: (item.imageUrl && item.imageUrl.length > 0) ? item.imageUrl[0] : '',
              price: item.sellingPrice || item.basePrice || 0,
              originalPrice: item.basePrice,
              isVeg: item.dietryType === 'veg',
              inStock: item.inStock !== false
            });
          });
        }
      });
      
      set({ products: items, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  getProductById: async (itemId: string, outletId: string) => {
    set({ loadingDetail: true, productDetail: null });
    try {
      const res = await fetch(`${environment.apiUrl}/item/getItemDetail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          outletId
        })
      });
      const resData = await res.json();
      const item = resData.data;
      
      if (item) {
        set({
          productDetail: {
            id: item.itemid || item._id,
            categoryId: '',
            name: item.itemname || item.name,
            description: item.description || '',
            imageUrl: (item.image && item.image.length > 0) ? item.image[0] : ((item.imageUrl && item.imageUrl.length > 0) ? item.imageUrl[0] : ''),
            price: item.sellingPrice || item.basePrice || 0,
            originalPrice: item.basePrice,
            isVeg: item.dietryType === 'veg',
            inStock: item.stockStatus !== false && item.inStock !== false
          },
          loadingDetail: false
        });
      } else {
        set({ loadingDetail: false });
      }
    } catch (error) {
      set({ loadingDetail: false });
    }
  }
}));
