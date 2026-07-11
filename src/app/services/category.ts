import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, Product } from '../models'; // Product mapped to Item
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  getCategories(outletId: string): Observable<{ categories: Category[], items: Product[] }> {
    return this.http.post<{status: string, data: any[]}>(`${environment.apiUrl}/category/getCategory`, {
      belongsTo: environment.belongsTo,
      outletId: outletId
    }).pipe(map(res => {
      const rawData = res.data || [];
      const categories: Category[] = [];
      const items: Product[] = [];

      const categoryImages: {[key: string]: string} = {
        'Thalugai': '/images/thalugai.jpg', // Thali
        'Murugan Idli Kadai': '/images/murugan-idli.png', // Idli
        'Idly Variety': '/images/idly-variety.png', // Idli
        'Fresh Fillet Wraps': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', // Wrap
        'Wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', // Wrap
        'Fresh Fillet Burgers': '/images/burger.png', // Burger
        'Burger': '/images/burger.png',
        'Infused Roasted Chicken': '/images/roasted-chicken.png',
        'Chat Items': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', // Samosa/Chat
        'Combos': 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400&q=80', // Salad+Meal
        'Signature Rice Bowls': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
        'Dosa Corner': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80',
        'Accompaniments': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80', // Dips/Sides
        'Falooda': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&q=80',
        'Fried Rice & Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80',
        'Fries': '/images/fries.png',
        'Gravies': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
        'Hot Beverages': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80', // Coffee
        'Icecreams': '/images/icecream.png',
        'Snacks & Ice Creams': '/images/icecream.png',
        'Lassi': '/images/lassi.png',
        'Lunch': '/images/lunch.png',
        'Maggi': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80',
        'Milkshakes': '/images/milkshake.png',
        'Mojito': 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80',
        'Momos': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80',
        'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
        'Pulao Variety': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', // Biryani/Pulao
        'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
        'Sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
        'Smoothie': '/images/smoothie.png',
        'Soups': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
        'Starter': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80',
        'Tandoori Bread': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
        'Tandoori Starter': '/images/tandoori.png', // Tikka
        'Uthappam Variety': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80'
      };

      rawData.forEach(cat => {
        let mappedImage = cat.imageUrl;
        if (cat.imageUrl === 'https://storage.googleapis.com/ownchat/uploads/images/common_image.jpg' || !cat.imageUrl) {
          mappedImage = categoryImages[cat.name] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80';
        }

        if (cat.items && Array.isArray(cat.items) && cat.items.length > 0) {
          categories.push({
            id: cat._id,
            name: cat.name,
            imageUrl: mappedImage
          });
        }

        if (cat.items && Array.isArray(cat.items)) {
          cat.items.forEach((item: any) => {
            let itemImage = (item.imageUrl && item.imageUrl.length > 0) ? item.imageUrl[0] : '';
            if (!itemImage || itemImage === 'https://storage.googleapis.com/ownchat/uploads/images/common_image.jpg') {
               itemImage = mappedImage; // fallback item to its category image
            }
            items.push({
              id: item._id,
              categoryId: cat._id,
              name: item.name,
              description: item.description || '',
              imageUrl: itemImage,
              price: item.sellingPrice || item.basePrice || 0,
              originalPrice: item.basePrice,
              isVeg: item.dietryType === 'veg' || item.isVeg === true,
              isNonVeg: item.dietryType === 'non-veg' || item.isVeg === false,
              inStock: item.inStock !== false
            });
          });
        }
      });

      // Deduplicate categories by name
      const uniqueCategories = [];
      const seenNames = new Set();
      for (const cat of categories) {
        if (!seenNames.has(cat.name)) {
          seenNames.add(cat.name);
          uniqueCategories.push(cat);
        }
      }

      return { categories: uniqueCategories, items };
    }));
  }
}
