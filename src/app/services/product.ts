import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProductsByOutlet(outletId: string): Observable<Product[]> {
    return this.http.post<{status: string, data: any[]}>(`${environment.apiUrl}/category/getCategory`, {
      belongsTo: environment.belongsTo,
      outletId: outletId === 'all' ? environment.outletId : outletId
    }).pipe(map(res => {
      const items: Product[] = [];
      const rawData = res.data || [];
      rawData.forEach(cat => {
        if (cat.items && Array.isArray(cat.items)) {
          cat.items.forEach((item: any) => {
            const rawImg = item.image || item.imageUrl || item.itemImage || '';
            const imgUrl = Array.isArray(rawImg) ? (rawImg.length > 0 ? rawImg[0] : '') : rawImg;
            
            items.push({
              id: item._id,
              categoryId: cat._id,
              name: item.name || item.itemName || '',
              description: item.description || '',
              imageUrl: imgUrl,
              price: item.sellingPrice || item.basePrice || item.price || 0,
              originalPrice: item.basePrice || item.originalPrice || undefined,
              isVeg: item.dietryType === 'veg' || item.isVeg === true,
              isNonVeg: item.dietryType === 'non-veg' || item.isVeg === false,
              inStock: item.inStock !== false && item.stockStatus !== false
            });
          });
        }
      });
      return items;
    }));
  }

  getProductsGroupedByCategory(outletId: string): Observable<{ category: any, items: Product[] }[]> {
    return this.http.post<{status: string, data: any[]}>(`${environment.apiUrl}/category/getCategory`, {
      belongsTo: environment.belongsTo,
      outletId: outletId === 'all' ? environment.outletId : outletId
    }).pipe(map(res => {
      const grouped: { category: any, items: Product[] }[] = [];
      const rawData = res.data || [];
      rawData.forEach(cat => {
        const catItems: Product[] = [];
        if (cat.items && Array.isArray(cat.items)) {
          cat.items.forEach((item: any) => {
            const rawImg = item.image || item.imageUrl || item.itemImage || '';
            const imgUrl = Array.isArray(rawImg) ? (rawImg.length > 0 ? rawImg[0] : '') : rawImg;
            
            catItems.push({
              id: item._id,
              categoryId: cat._id,
              name: item.name || item.itemName || '',
              description: item.description || '',
              imageUrl: imgUrl,
              price: item.sellingPrice || item.basePrice || item.price || 0,
              originalPrice: item.basePrice || item.originalPrice || undefined,
              isVeg: item.dietryType === 'veg' || item.isVeg === true,
              isNonVeg: item.dietryType === 'non-veg' || item.isVeg === false,
              inStock: item.inStock !== false && item.stockStatus !== false
            });
          });
        }
        if (catItems.length > 0) {
          grouped.push({
            category: {
              id: cat._id,
              name: cat.categoryName || cat.name || '',
              description: cat.description || '',
              imageUrl: cat.imageUrl || ''
            },
            items: catItems
          });
        }
      });
      return grouped;
    }));
  }

  getProductById(itemId: string, outletId: string): Observable<Product> {
    return this.http.post<{status: string, data: any}>(`${environment.apiUrl}/item/getItemDetail`, {
      itemId: itemId,
      outletId: outletId
    }).pipe(map(res => {
      const item = res.data;
      const rawImg = item.image || item.imageUrl || item.itemImage || '';
      const imgUrl = Array.isArray(rawImg) ? (rawImg.length > 0 ? rawImg[0] : '') : rawImg;
      
      return {
        id: item.itemid || item._id,
        categoryId: '',
        name: item.itemname || item.name || '',
        description: item.description || '',
        imageUrl: imgUrl,
        price: item.sellingPrice || item.basePrice || item.price || 0,
        originalPrice: item.basePrice || item.originalPrice || undefined,
        isVeg: item.dietryType === 'veg' || item.isVeg === true,
        isNonVeg: item.dietryType === 'non-veg' || item.isVeg === false,
        inStock: item.stockStatus !== false && item.inStock !== false
      };
    }));
  }
}
