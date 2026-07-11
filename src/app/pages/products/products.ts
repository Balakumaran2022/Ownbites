import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { UiCard } from '../../shared/components/ui-card/ui-card';
import { SkeletonLoader } from '../../shared/components/skeleton-loader/skeleton-loader';
import { UiButton } from '../../shared/components/ui-button/ui-button';
import { Product } from '../../models';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, UiCard, SkeletonLoader, UiButton],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <!-- Left Side: Veg / Non-Veg Filters -->
        <div class="flex items-center gap-3">
          <button (click)="toggleDietary('veg')" [class.bg-green-50]="dietaryFilter() === 'veg'" [class.border-green-200]="dietaryFilter() === 'veg'" class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm font-bold text-sm text-secondary">
            <div class="w-4 h-4 border-2 border-green-600 flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-green-600"></div>
            </div>
            Veg
          </button>
          <button (click)="toggleDietary('non-veg')" [class.bg-red-50]="dietaryFilter() === 'non-veg'" [class.border-red-200]="dietaryFilter() === 'non-veg'" class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm font-bold text-sm text-secondary">
            <div class="w-4 h-4 border-2 border-red-600 flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-red-600"></div>
            </div>
            Non-Veg
          </button>
        </div>

        <!-- Right Side: Sort & View Modes -->
        <div class="flex items-center gap-2 bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
          <button (click)="togglePriceSort()" [class.bg-orange-50]="priceSort() !== 'none'" [class.text-primary]="priceSort() !== 'none'" class="px-4 py-2 rounded-xl hover:bg-orange-50 text-gray-500 transition-colors flex items-center gap-1 font-bold text-sm" title="Sort by Price">
            <mat-icon class="text-[20px] w-5 h-5">sort</mat-icon>
            <span>{{priceSort() === 'asc' ? 'Price: Low to High' : priceSort() === 'desc' ? 'Price: High to Low' : 'Sort by Price'}}</span>
          </button>
          <div class="w-px h-6 bg-gray-200 mx-1"></div>
          <button (click)="viewMode.set('grid')" [class.bg-orange-50]="viewMode() === 'grid'" [class.text-primary]="viewMode() === 'grid'" class="p-2.5 rounded-xl hover:bg-orange-50 text-gray-400 transition-colors">
            <mat-icon>grid_view</mat-icon>
          </button>
          <button (click)="viewMode.set('list')" [class.bg-orange-50]="viewMode() === 'list'" [class.text-primary]="viewMode() === 'list'" class="p-2.5 rounded-xl hover:bg-orange-50 text-gray-400 transition-colors">
            <mat-icon>view_list</mat-icon>
          </button>
        </div>
      </div>

      <ng-container *ngIf="loading(); else productList">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-ui-card *ngFor="let i of [1,2,3,4,5,6,7,8]" [padding]="false">
            <app-skeleton-loader widthClass="w-full" heightClass="h-48"></app-skeleton-loader>
            <div class="p-4 space-y-3">
              <app-skeleton-loader widthClass="w-3/4" heightClass="h-6"></app-skeleton-loader>
              <app-skeleton-loader widthClass="w-1/4" heightClass="h-4"></app-skeleton-loader>
            </div>
          </app-ui-card>
        </div>
      </ng-container>

      <ng-template #productList>
        <div *ngIf="products().length > 0; else noResults" [ngClass]="viewMode() === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8' : 'flex flex-col gap-4'">
          <app-ui-card *ngFor="let product of products()" [padding]="false" [hoverable]="true" [horizontal]="viewMode() === 'list'" class="group">
            <div [ngClass]="viewMode() === 'list' ? 'w-40 sm:w-56 h-full shrink-0 relative' : 'relative h-56 w-full'">
              <img [src]="product.imageUrl" [alt]="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-2 left-2 bg-white/90 backdrop-blur p-1 rounded shadow-sm">
                <div [class]="product.isVeg ? 'w-4 h-4 border-2 border-green-600 flex items-center justify-center' : 'w-4 h-4 border-2 border-red-600 flex items-center justify-center'">
                  <div [class]="product.isVeg ? 'w-2 h-2 rounded-full bg-green-600' : 'w-2 h-2 rounded-full bg-red-600'"></div>
                </div>
              </div>
            </div>
            
            <div class="p-6 flex flex-col flex-1 justify-between gap-4">
              <div>
                <h3 class="text-xl font-bold text-secondary cursor-pointer tracking-tight hover:text-primary transition-colors line-clamp-1" [routerLink]="['/product', product.id]">{{product.name}}</h3>
                <p class="text-sm text-gray-500 mt-2 font-medium line-clamp-2 leading-relaxed">{{product.description}}</p>
              </div>
              
              <div class="flex items-center justify-between mt-4">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-secondary">₹{{product.price}}</span>
                    <span *ngIf="product.originalPrice" class="text-sm text-gray-400 line-through">₹{{product.originalPrice}}</span>
                  </div>
                </div>
                <ng-container *ngIf="getCartQuantity(product.id) === 0; else qtyControl">
                  <app-ui-button variant="primary" (click)="addToCart(product); $event.stopPropagation()">Add</app-ui-button>
                </ng-container>
                <ng-template #qtyControl>
                  <div class="bg-white border-2 border-orange-100 flex items-center justify-between rounded-full shadow-sm overflow-hidden h-[44px]" style="width: 100px;" (click)="$event.stopPropagation()">
                    <button (click)="decrementQuantity(product.id, $event)" class="flex-1 h-full flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-colors font-extrabold text-xl">-</button>
                    <span class="font-extrabold text-secondary">{{getCartQuantity(product.id)}}</span>
                    <button (click)="incrementQuantity(product.id, $event)" class="flex-1 h-full flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-colors font-extrabold text-xl">+</button>
                  </div>
                </ng-template>
              </div>
            </div>
          </app-ui-card>
        </div>

        <ng-template #noResults>
          <div class="flex flex-col items-center justify-center py-12 text-center mt-8">
            <mat-icon class="text-gray-200 mb-4 drop-shadow-sm" style="font-size: 80px; width: 80px; height: 80px;">search_off</mat-icon>
            <h2 class="text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">Food is not available.</h2>
            <p class="text-lg text-gray-500 mb-8 max-w-md mx-auto">Sorry for the inconvenience. We couldn't find any dishes matching your search.</p>
            <a routerLink="/" class="bg-gradient-to-r from-primary to-orange-600 text-white font-extrabold py-3.5 px-10 rounded-full shadow-luxury transition-all hover:-translate-y-1 hover:shadow-luxury-hover inline-block uppercase tracking-widest text-sm">
              Back to Home
            </a>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `
})
export class Products implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  route = inject(ActivatedRoute);

  allProducts = signal<Product[]>([]);
  loading = signal(true);
  viewMode = signal<'grid' | 'list'>('grid');
  priceSort = signal<'none' | 'asc' | 'desc'>('none');
  dietaryFilter = signal<'all' | 'veg' | 'non-veg'>('all');
  
  queryParams = toSignal(this.route.queryParams);

  products = computed(() => {
    let list = this.allProducts();
    const params = this.queryParams();
    if (!params) return list;
    
    const cat = params['category'];
    const search = params['search'];
    
    if (cat) {
      list = list.filter(p => p.categoryId === cat);
    }
    
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    
    const diet = this.dietaryFilter();
    if (diet === 'veg') {
      list = list.filter(p => p.isVeg);
    } else if (diet === 'non-veg') {
      list = list.filter(p => !p.isVeg);
    }
    
    const sort = this.priceSort();
    if (sort === 'asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    
    return list;
  });

  ngOnInit() {
    this.productService.getProductsByOutlet('all').subscribe(res => {
      this.allProducts.set(res);
      this.loading.set(false);
    });
  }

  togglePriceSort() {
    const current = this.priceSort();
    if (current === 'none') {
      this.priceSort.set('asc');
    } else if (current === 'asc') {
      this.priceSort.set('desc');
    } else {
      this.priceSort.set('none');
    }
  }

  toggleDietary(type: 'veg' | 'non-veg') {
    if (this.dietaryFilter() === type) {
      this.dietaryFilter.set('all'); // toggle off
    } else {
      this.dietaryFilter.set(type);
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  getCartQuantity(productId: string): number {
    const item = this.cartService.cartItems().find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }

  incrementQuantity(productId: string, event: Event) {
    event.stopPropagation();
    const qty = this.getCartQuantity(productId);
    this.cartService.updateQuantity(productId, qty + 1);
  }

  decrementQuantity(productId: string, event: Event) {
    event.stopPropagation();
    const qty = this.getCartQuantity(productId);
    this.cartService.updateQuantity(productId, qty - 1);
  }
}
