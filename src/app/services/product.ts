import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models';
import { environment } from '../../environments/environment';

const categoryImages: {[key: string]: string} = {
  'Thalugai': '/images/thalugai.jpg',
  'Murugan Idli Kadai': '/images/murugan-idli.png',
  'Idly Variety': '/images/idly-variety.png',
  'Fresh Fillet Wraps': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80',
  'Wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80',
  'Fresh Fillet Burgers': '/images/burger.png',
  'Burger': '/images/burger.png',
  'Infused Roasted Chicken': '/images/roasted-chicken.png',
  'Chat Items': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
  'Combos': 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400&q=80',
  'Signature Rice Bowls': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
  'Dosa Corner': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80',
  'Accompaniments': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80',
  'Falooda': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&q=80',
  'Fried Rice & Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80',
  'Fries': '/images/fries.png',
  'Gravies': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',
  'Hot Beverages': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80',
  'Icecreams': '/images/icecream.png',
  'Snacks & Ice Creams': '/images/icecream.png',
  'Lassi': '/images/lassi.png',
  'Lunch': '/images/lunch.png',
  'Maggi': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80',
  'Milkshakes': '/images/milkshake.png',
  'Mojito': 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80',
  'Momos': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&q=80',
  'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
  'Pulao Variety': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
  'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  'Sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
  'Smoothie': '/images/smoothie.png',
  'Soups': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
  'Starter': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80',
  'Tandoori Bread': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
  'Tandoori Starter': '/images/tandoori.png',
  'Uthappam Variety': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80'
};

function getMappedCategoryImage(catName: string, rawImageUrl: string): string {
  if (rawImageUrl === 'https://storage.googleapis.com/ownchat/uploads/images/common_image.jpg' || !rawImageUrl) {
    return categoryImages[catName] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80';
  }
  return rawImageUrl;
}

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
        const catName = cat.categoryName || cat.name || '';
        const mappedCatImg = getMappedCategoryImage(catName, cat.imageUrl);
        
        if (cat.items && Array.isArray(cat.items)) {
          cat.items.forEach((item: any) => {
            const rawImg = item.image || item.imageUrl || item.itemImage || '';
            const imgUrl = Array.isArray(rawImg) ? (rawImg.length > 0 ? rawImg[0] : '') : rawImg;
            
            const vegStatus = resolveVegStatus(item);
            items.push({
              id: item._id,
              categoryId: cat._id,
              name: item.name || item.itemName || '',
              description: item.description || '',
              imageUrl: imgUrl,
              price: item.basePrice || item.sellingPrice || item.price || 0,
              originalPrice: undefined,
              isVeg: vegStatus,
              isNonVeg: !vegStatus,
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
        const catName = cat.categoryName || cat.name || '';
        const mappedCatImg = getMappedCategoryImage(catName, cat.imageUrl);
        const catItems: Product[] = [];
        
        if (cat.items && Array.isArray(cat.items)) {
          cat.items.forEach((item: any) => {
            const rawImg = item.image || item.imageUrl || item.itemImage || '';
            const imgUrl = Array.isArray(rawImg) ? (rawImg.length > 0 ? rawImg[0] : '') : rawImg;
            
            const vegStatus = resolveVegStatus(item);
            catItems.push({
              id: item._id,
              categoryId: cat._id,
              name: item.name || item.itemName || '',
              description: item.description || '',
              imageUrl: imgUrl,
              price: item.basePrice || item.sellingPrice || item.price || 0,
              originalPrice: undefined,
              isVeg: vegStatus,
              isNonVeg: !vegStatus,
              inStock: item.inStock !== false && item.stockStatus !== false
            });
          });
        }
        if (catItems.length > 0) {
          grouped.push({
            category: {
              id: cat._id,
              name: catName,
              description: cat.description || '',
              imageUrl: mappedCatImg
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
      let imgUrl = Array.isArray(rawImg) ? (rawImg.length > 0 ? rawImg[0] : '') : rawImg;
      if (!imgUrl || imgUrl === 'https://storage.googleapis.com/ownchat/uploads/images/common_image.jpg') {
        imgUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
      }
      const vegStatus = resolveVegStatus(item);
      return {
        id: item.itemid || item._id,
        categoryId: '',
        name: item.itemname || item.name || '',
        description: item.description || '',
        imageUrl: imgUrl,
        price: item.basePrice || item.sellingPrice || item.price || 0,
        originalPrice: undefined,
        isVeg: vegStatus,
        isNonVeg: !vegStatus,
        inStock: item.stockStatus !== false && item.inStock !== false
      };
    }));
  }
}

function resolveVegStatus(item: any): boolean {
  const dtype = (item.dietryType || item.dietaryType || item.foodType ||
                 item.food_type || item.foodPreference || item.food_preference || '').toLowerCase();
  if (dtype === 'veg' || dtype === 'vegetarian' || dtype === 'pure-veg') return true;
  if (dtype === 'non-veg' || dtype === 'nonveg' || dtype === 'non_veg' || dtype === 'chicken' ||
      dtype === 'mutton' || dtype === 'egg' || dtype === 'seafood' || dtype === 'fish') return false;

  if (item.isVeg === true)  return true;
  if (item.isVeg === false) {
    const name = (item.name || item.itemName || '').toLowerCase();
    if (isVegName(name)) return true;
    return false;
  }
  if (item.isNonVeg === true) return false;

  const name = (item.name || item.itemName || '').toLowerCase();
  if (isNonVegName(name)) return false;
  return true;
}

const NON_VEG_KEYWORDS = [
  'chicken','mutton','fish','prawn','shrimp','crab','egg','beef','pork',
  'meat','biryani non','lamb','turkey','keema','kheema','seafood','tuna',
  'salmon','squid','lobster','duck'
];
const VEG_KEYWORDS = [
  'veg','paneer','tofu','mushroom','aloo','potato','millet','granola',
  'muesli','dal','dhal','sambar','rasam','idli','dosa','uttapam',
  'pongal','upma','poha','rava','corn','gobi','cauliflower','broccoli',
  'spinach','palak','rajma','chana','chole','soya','soy','fruit',
  'salad','juice','lassi','buttermilk','curd','yogurt','sweet',
  'halwa','ladoo','gulab','kheer','payasam','candy','chocolate',
  'cake','pastry','cookie','biscuit','bread','toast','sandwich veg'
];

function isVegName(name: string): boolean {
  return VEG_KEYWORDS.some(k => name.includes(k));
}
function isNonVegName(name: string): boolean {
  return NON_VEG_KEYWORDS.some(k => name.includes(k));
}
