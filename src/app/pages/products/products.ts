import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { CategoryService } from '../../services/category';
import { SkeletonLoader } from '../../shared/components/skeleton-loader/skeleton-loader';
import { Product } from '../../models';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, SkeletonLoader],
  template: `
    <div class="min-h-fit pb-12 bg-[#FAF9F6]">

      <!-- Orange Category Header -->
      <div class="bg-gradient-to-r from-[#f4811f] to-orange-500 text-white shadow-lg sticky top-0 z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <!-- Left Side: Back + Title -->
            <div class="flex items-center gap-3">
              <button routerLink="/"
                      class="w-10 h-10 rounded-full bg-white/25 hover:bg-white/35 flex items-center justify-center transition-all hover:scale-105 shrink-0"
                      title="Back to Home">
                <mat-icon class="text-white">arrow_back</mat-icon>
              </button>
              <div class="min-w-0">
                <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight truncate">
                  {{categoryName() || 'All Items'}}
                </h1>
                <p class="text-white/85 text-xs sm:text-sm mt-0.5 font-medium">
                  {{products().length}} item{{products().length !== 1 ? 's' : ''}} available
                </p>
              </div>
            </div>

            <!-- Right Side: Veg / Non-Veg / Sort pills -->
            <div class="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <button (click)="toggleDietary('veg')"
                      [class]="dietaryFilter() === 'veg'
                        ? 'bg-white text-green-700 font-extrabold shadow-md scale-105'
                        : 'bg-white/15 text-white font-semibold hover:bg-white/25'"
                      class="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs transition-all whitespace-nowrap">
                <div class="w-3.5 h-3.5 border-2 border-green-600 flex items-center justify-center rounded-sm bg-white">
                  <div class="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                </div>
                Veg
              </button>
              <button (click)="toggleDietary('non-veg')"
                      [class]="dietaryFilter() === 'non-veg'
                        ? 'bg-white text-red-700 font-extrabold shadow-md scale-105'
                        : 'bg-white/15 text-white font-semibold hover:bg-white/25'"
                      class="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs transition-all whitespace-nowrap">
                <div class="w-3.5 h-3.5 border-2 border-red-600 flex items-center justify-center rounded-sm bg-white">
                  <div class="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                </div>
                Non-Veg
              </button>

              <!-- Sort -->
              <button (click)="togglePriceSort()"
                      [class]="priceSort() !== 'none'
                        ? 'bg-white text-orange-700 font-extrabold shadow-md scale-105'
                        : 'bg-white/15 text-white font-semibold hover:bg-white/25'"
                      class="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs transition-all whitespace-nowrap">
                <mat-icon style="font-size:16px;width:16px;height:16px;">sort</mat-icon>
                {{priceSort() === 'asc' ? 'Price ↑' : priceSort() === 'desc' ? 'Price ↓' : 'Sort'}}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <!-- Skeleton -->
        <ng-container *ngIf="loading()">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="bg-white rounded-2xl overflow-hidden shadow-md">
              <app-skeleton-loader widthClass="w-full" heightClass="h-48"></app-skeleton-loader>
              <div class="p-3 space-y-2">
                <app-skeleton-loader widthClass="w-3/4" heightClass="h-4"></app-skeleton-loader>
                <app-skeleton-loader widthClass="w-1/2" heightClass="h-3"></app-skeleton-loader>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- No results -->
        <ng-container *ngIf="!loading() && products().length === 0">
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <mat-icon class="text-gray-200 mb-4" style="font-size:80px;width:80px;height:80px;">no_food</mat-icon>
            <h2 class="text-2xl font-extrabold text-gray-700 mb-2">No items found</h2>
            <p class="text-gray-400 mb-8">Try removing a filter or go back to browse more categories.</p>
            <button routerLink="/"
                    class="bg-gradient-to-r from-[#f4811f] to-orange-500 text-white font-extrabold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 uppercase text-sm tracking-widest">
              Back to Home
            </button>
          </div>
        </ng-container>

        <!-- Products -->
        <div *ngIf="!loading() && products().length > 0"
             class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div *ngFor="let product of products()"
               class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col">

            <!-- Image -->
            <div class="relative w-full h-44 overflow-hidden bg-gray-100">
              <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.name"
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <!-- Veg / Non-veg badge -->
              <div class="absolute top-2 left-2"
                   [class]="product.isVeg
                     ? 'w-5 h-5 border-2 border-green-600 bg-white rounded-sm flex items-center justify-center shadow-sm'
                     : 'w-5 h-5 border-2 border-red-600 bg-white rounded-sm flex items-center justify-center shadow-sm'">
                <div [class]="product.isVeg ? 'w-2.5 h-2.5 rounded-full bg-green-600' : 'w-2.5 h-2.5 rounded-full bg-red-600'"></div>
              </div>
              <!-- Original price badge -->
              <div *ngIf="product.originalPrice" class="absolute top-2 right-2">
                <span class="bg-green-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                  {{((product.originalPrice - product.price) / product.originalPrice * 100) | number:'1.0-0'}}% OFF
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 flex flex-col p-3">
              <h3 class="font-extrabold text-gray-900 text-sm line-clamp-1" [routerLink]="['/product', product.id]">
                {{product.name}}
              </h3>
              <p class="text-gray-400 text-[11px] mt-1 line-clamp-2 leading-relaxed flex-grow">{{product.description}}</p>

              <!-- Price + Add -->
              <div class="flex items-center justify-between mt-3">
                <div>
                  <span class="font-extrabold text-[#f4811f] text-base">₹{{product.price}}</span>
                  <span *ngIf="product.originalPrice" class="text-[10px] text-gray-400 line-through ml-1">₹{{product.originalPrice}}</span>
                </div>
                <ng-container *ngIf="getCartQuantity(product.id) === 0; else qtyControl">
                  <button (click)="cartService.addToCart(product); $event.stopPropagation()"
                          class="bg-gradient-to-r from-[#f4811f] to-orange-500 text-white font-extrabold px-4 py-1.5 rounded-full text-xs shadow hover:shadow-md transition-all uppercase tracking-wide">
                    ADD
                  </button>
                </ng-container>
                <ng-template #qtyControl>
                  <div class="flex items-center bg-white border-2 border-orange-200 rounded-full shadow overflow-hidden"
                       style="height:28px;width:80px;" (click)="$event.stopPropagation()">
                    <button (click)="decrementQuantity(product.id, $event)"
                            class="flex-1 h-full flex items-center justify-center text-orange-500 hover:bg-orange-50 font-extrabold text-sm transition-colors">−</button>
                    <span class="font-extrabold text-gray-800 text-xs">{{getCartQuantity(product.id)}}</span>
                    <button (click)="incrementQuantity(product.id, $event)"
                            class="flex-1 h-full flex items-center justify-center text-orange-500 hover:bg-orange-50 font-extrabold text-sm transition-colors">+</button>
                  </div>
                </ng-template>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class Products implements OnInit {
  productService = inject(ProductService);
  cartService    = inject(CartService);
  categoryService = inject(CategoryService);
  route  = inject(ActivatedRoute);
  router = inject(Router);

  allProducts    = signal<Product[]>([]);
  loading        = signal(true);
  priceSort      = signal<'none' | 'asc' | 'desc'>('none');
  dietaryFilter  = signal<'all' | 'veg' | 'non-veg'>('all');
  categoryName   = signal<string>('');
  offerText      = signal<string>('');
  categoryImage  = signal<string>('');

  queryParams = toSignal(this.route.queryParams);

  products = computed(() => {
    let list = this.allProducts();
    const params = this.queryParams();
    if (!params) return list;

    const cat    = params['category'];
    const search = params['search'];

    if (cat)    list = list.filter(p => p.categoryId === cat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    const diet = this.dietaryFilter();
    if (diet === 'veg')     list = list.filter(p => p.isVeg);
    if (diet === 'non-veg') list = list.filter(p => !p.isVeg);

    const sort = this.priceSort();
    if (sort === 'asc')  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);

    return list;
  });

  ngOnInit() {
    window.scrollTo(0, 0);
    this.productService.getProductsByOutlet('all').subscribe(res => {
      this.allProducts.set(res);
      this.loading.set(false);
    });

    // Resolve category name, offer, and diet from query param
    this.route.queryParams.subscribe(params => {
      const catId = params['category'];
      const offer = params['offer'];
      const diet  = params['diet'];
      
      this.offerText.set(offer || '');
      if (diet === 'veg' || diet === 'non-veg') {
        this.dietaryFilter.set(diet);
      } else {
        this.dietaryFilter.set('all');
      }

      if (catId) {
        this.categoryService.getCategories(environment.outletId).subscribe(res => {
          const found = res.categories?.find((c: any) => c.id === catId);
          if (found) {
            this.categoryName.set(found.name);
            this.categoryImage.set(found.imageUrl || '');
          }
        });
      } else {
        this.categoryName.set('');
      }
    });
  }

  togglePriceSort() {
    const c = this.priceSort();
    this.priceSort.set(c === 'none' ? 'asc' : c === 'asc' ? 'desc' : 'none');
  }

  toggleDietary(type: 'veg' | 'non-veg') {
    this.dietaryFilter.set(this.dietaryFilter() === type ? 'all' : type);
  }

  getCartQuantity(productId: string): number {
    return this.cartService.cartItems().find(i => i.product.id === productId)?.quantity ?? 0;
  }

  incrementQuantity(productId: string, event: Event) {
    event.stopPropagation();
    this.cartService.updateQuantity(productId, this.getCartQuantity(productId) + 1);
  }

  decrementQuantity(productId: string, event: Event) {
    event.stopPropagation();
    this.cartService.updateQuantity(productId, this.getCartQuantity(productId) - 1);
  }

  isPlaceholderImage(url: string): boolean {
    if (!url) return true;
    const lower = url.toLowerCase();
    return lower.includes('placeholder') || 
           lower.includes('default') || 
           lower.includes('logo') || 
           lower.includes('no-image') || 
           lower.includes('assets/') || 
           !url.startsWith('http');
  }
}
