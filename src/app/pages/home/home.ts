import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { OutletService } from '../../services/outlet';
import { CategoryService } from '../../services/category';
import { SkeletonLoader } from '../../shared/components/skeleton-loader/skeleton-loader';
import { UiCard } from '../../shared/components/ui-card/ui-card';
import { Category, Outlet, Product } from '../../models';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, SkeletonLoader, UiCard],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <!-- Hero Banner -->
      <section class="relative rounded-3xl overflow-hidden h-64 md:h-96 shadow-luxury group">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80" alt="Delicious Food" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div class="absolute inset-0 bg-black/30 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/60 to-transparent flex flex-col justify-end p-8 md:p-12">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-md tracking-tight">Craving Something <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Special?</span></h1>
          <p class="text-lg md:text-xl text-gray-200 mb-8 max-w-xl font-medium drop-shadow-md">Experience culinary excellence delivered straight to your door.</p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-2xl mt-4 w-full">
            <div class="relative flex-1">
              <input #searchInput (keyup.enter)="onSearch(searchInput.value)" type="text" placeholder="Search for luxury dining or dishes..." class="w-full bg-white/95 backdrop-blur-xl border-none rounded-2xl pl-14 pr-6 py-5 focus:ring-4 focus:ring-primary/30 focus:bg-white transition-all shadow-luxury text-gray-900 text-lg placeholder-gray-400">
              <mat-icon class="absolute left-5 top-1/2 -translate-y-1/2 text-primary text-3xl">search</mat-icon>
            </div>
            <button (click)="onSearch(searchInput.value)" class="bg-[#f4811f] hover:bg-orange-600 shrink-0 text-white px-10 py-5 rounded-2xl font-bold whitespace-nowrap shadow-luxury transition-all hover:shadow-luxury-hover hover:-translate-y-1 flex items-center justify-center tracking-wide uppercase text-sm">
              Explore
            </button>
          </div>
        </div>
      </section>

      <!-- Quick Categories -->
      <section *ngIf="categories().length > 0 || loadingCategories()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-secondary">What's on your mind?</h2>
        </div>
        
        <div class="relative w-full overflow-x-auto hide-scrollbar pb-6 pt-2 snap-x">
          <ng-container *ngIf="loadingCategories(); else cats">
            <div class="flex gap-8 w-max">
              <div *ngFor="let i of [1,2,3,4,5,6]" class="flex flex-col items-center gap-4 min-w-[100px] shrink-0">
                <app-skeleton-loader type="circle" widthClass="w-28" heightClass="h-28"></app-skeleton-loader>
                <app-skeleton-loader widthClass="w-20" heightClass="h-4"></app-skeleton-loader>
              </div>
            </div>
          </ng-container>
          <ng-template #cats>
            <div class="flex gap-8 w-max">
              <div *ngFor="let cat of categories()" class="flex flex-col items-center gap-4 min-w-[100px] cursor-pointer group shrink-0 snap-start" (click)="goToCategory(cat.id)">
                <div class="w-28 h-28 rounded-full overflow-hidden shadow-luxury group-hover:shadow-luxury-hover transition-all duration-500 group-hover:-translate-y-2 relative">
                  <img [src]="cat.imageUrl" [alt]="cat.name" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                </div>
                <span class="font-bold text-gray-700 group-hover:text-primary transition-colors text-center px-1 w-32 tracking-wide text-sm leading-snug">{{cat.name}}</span>
              </div>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- Filters and View Toggles -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pt-4 border-t border-gray-100">
        <!-- Left Side: Veg/Non-Veg Toggles -->
        <div class="flex items-center gap-3">
          <button (click)="filterState.set(filterState() === 'veg' ? 'all' : 'veg')" 
                  [class]="filterState() === 'veg' ? 'bg-orange-50 border-orange-500 shadow-md' : 'bg-white border-gray-200 shadow-sm'"
                  class="flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer hover:shadow-md">
            <div class="w-4 h-4 border-2 border-green-600 flex items-center justify-center bg-white rounded-sm"><div class="w-2 h-2 rounded-full bg-green-600"></div></div>
            <span class="text-sm font-bold" [class.text-gray-800]="filterState() !== 'veg'" [class.text-orange-700]="filterState() === 'veg'">Veg</span>
          </button>
          <button (click)="filterState.set(filterState() === 'non-veg' ? 'all' : 'non-veg')"
                  [class]="filterState() === 'non-veg' ? 'bg-orange-50 border-orange-500 shadow-md' : 'bg-white border-gray-200 shadow-sm'"
                  class="flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer hover:shadow-md">
            <div class="w-4 h-4 border-2 border-red-600 flex items-center justify-center bg-white rounded-sm"><div class="w-2 h-2 rounded-full bg-red-600"></div></div>
            <span class="text-sm font-bold" [class.text-gray-800]="filterState() !== 'non-veg'" [class.text-orange-700]="filterState() === 'non-veg'">Non-Veg</span>
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

      <!-- Menu Accordion -->
      <div class="space-y-4">
        <ng-container *ngIf="loadingMenu()">
           <app-skeleton-loader widthClass="w-full" heightClass="h-20" *ngFor="let i of [1,2,3,4,5]"></app-skeleton-loader>
        </ng-container>
        
        <div *ngFor="let group of filteredMenuGroups()" [id]="'category-' + group.category.id" class="bg-white rounded-3xl shadow-luxury border-none overflow-hidden transition-all duration-300 mb-6">
          
          <div (click)="toggleCategory(group.category.id)" class="p-8 flex items-center justify-between cursor-pointer hover:bg-[#FAF9F6] transition-colors">
            <h3 class="text-2xl font-extrabold text-secondary tracking-tight">{{group.category.name}} <span class="text-gray-400 font-medium text-lg ml-2">({{group.items.length}})</span></h3>
            <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary transition-transform duration-500" [class.rotate-180]="isExpanded(group.category.id)">
              <mat-icon>expand_more</mat-icon>
            </div>
          </div>
          
          <div *ngIf="isExpanded(group.category.id)" class="px-6 pb-6 space-y-6">
             <div class="w-full h-px bg-gray-100 mb-6"></div>
             
             <!-- Items Container -->
             <div [class]="viewMode() === 'list' ? 'space-y-0' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'">
               
               <!-- List View -->
               <ng-container *ngIf="viewMode() === 'list'">
                 <div *ngFor="let item of group.items" class="flex items-start justify-between gap-8 py-6 border-b border-gray-100/50 last:border-0 group">
                   <div class="flex-1 pr-4">
                     <div class="flex items-center gap-2 mb-3">
                       <div [class]="item.isVeg ? 'w-4 h-4 border-2 border-green-600 flex items-center justify-center rounded-sm shadow-sm' : 'w-4 h-4 border-2 border-red-600 flex items-center justify-center rounded-sm shadow-sm'">
                         <div [class]="item.isVeg ? 'w-1.5 h-1.5 rounded-full bg-green-600' : 'w-1.5 h-1.5 rounded-full bg-red-600'"></div>
                       </div>
                     </div>
                     <h4 class="text-xl font-bold text-secondary tracking-tight">{{item.name}}</h4>
                     <div class="flex items-center gap-3 mt-2">
                       <span class="font-extrabold text-xl text-primary">₹{{item.price}}</span>
                       <span *ngIf="item.originalPrice" class="text-sm text-gray-400 line-through font-medium">₹{{item.originalPrice}}</span>
                     </div>
                     <p class="text-gray-500 mt-4 line-clamp-2 leading-relaxed font-medium">{{item.description}}</p>
                   </div>
                   
                   <div class="relative shrink-0 w-44 h-44">
                     <div class="w-full h-full rounded-2xl overflow-hidden bg-[#FAF9F6] shadow-luxury border-none">
                       <img *ngIf="item.imageUrl" [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                     <ng-container *ngIf="getCartQuantity(item.id) === 0; else qtyControlList">
                       <button (click)="cartService.addToCart(item); $event.stopPropagation()" class="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-orange-600 text-white font-extrabold px-10 py-3 rounded-full shadow-luxury-hover hover:shadow-lg transition-all hover:-translate-y-1 uppercase text-sm tracking-widest">
                         ADD
                       </button>
                     </ng-container>
                     <ng-template #qtyControlList>
                       <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white border-2 border-orange-100 flex items-center justify-between rounded-full shadow-luxury-hover overflow-hidden" style="width: 110px;" (click)="$event.stopPropagation()">
                         <button (click)="decrementQuantity(item.id, $event)" class="w-10 h-10 flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-colors font-extrabold text-xl">-</button>
                         <span class="font-extrabold text-secondary text-lg">{{getCartQuantity(item.id)}}</span>
                         <button (click)="incrementQuantity(item.id, $event)" class="w-10 h-10 flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-colors font-extrabold text-xl">+</button>
                       </div>
                     </ng-template>
                   </div>
                 </div>
               </ng-container>

               <!-- Grid View -->
               <ng-container *ngIf="viewMode() === 'grid'">
                 <div *ngFor="let item of group.items" class="bg-[#FAF9F6] border-none rounded-3xl p-5 flex flex-col gap-4 group shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1 transition-all relative">
                   <div class="w-full h-56 rounded-2xl overflow-hidden bg-white relative shadow-sm">
                     <img *ngIf="item.imageUrl" [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div class="absolute top-3 left-3">
                       <div [class]="item.isVeg ? 'w-6 h-6 bg-white/90 backdrop-blur rounded-md shadow-sm border-2 border-green-600 flex items-center justify-center' : 'w-6 h-6 bg-white/90 backdrop-blur rounded-md shadow-sm border-2 border-red-600 flex items-center justify-center'">
                         <div [class]="item.isVeg ? 'w-3 h-3 rounded-full bg-green-600' : 'w-3 h-3 rounded-full bg-red-600'"></div>
                       </div>
                     </div>
                   </div>
                   <div class="flex-1 flex flex-col pt-2">
                     <h4 class="text-xl font-bold text-secondary line-clamp-1 tracking-tight">{{item.name}}</h4>
                     <p class="text-gray-500 mt-2 line-clamp-2 min-h-[44px] flex-grow font-medium leading-relaxed">{{item.description}}</p>
                     <div class="flex items-center justify-between mt-6">
                       <div class="flex flex-col">
                         <span class="font-extrabold text-2xl text-primary">₹{{item.price}}</span>
                         <span *ngIf="item.originalPrice" class="text-sm text-gray-400 line-through font-medium mt-1">₹{{item.originalPrice}}</span>
                       </div>
                       <ng-container *ngIf="getCartQuantity(item.id) === 0; else qtyControlGrid">
                         <button (click)="cartService.addToCart(item); $event.stopPropagation()" class="bg-gradient-to-r from-primary to-orange-600 text-white font-extrabold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-1 uppercase text-sm tracking-widest">
                           ADD
                         </button>
                       </ng-container>
                       <ng-template #qtyControlGrid>
                         <div class="bg-white border-2 border-orange-100 flex items-center justify-between rounded-full shadow-md overflow-hidden h-[48px]" style="width: 100px;" (click)="$event.stopPropagation()">
                           <button (click)="decrementQuantity(item.id, $event)" class="flex-1 h-full flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-colors font-extrabold text-xl">-</button>
                           <span class="font-extrabold text-secondary text-lg">{{getCartQuantity(item.id)}}</span>
                           <button (click)="incrementQuantity(item.id, $event)" class="flex-1 h-full flex items-center justify-center text-orange-600 hover:bg-orange-50 transition-colors font-extrabold text-xl">+</button>
                         </div>
                       </ng-template>
                     </div>
                   </div>
                 </div>
               </ng-container>
               
             </div>
             
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials (Full Width) -->
    <section class="bg-orange-50 p-8 md:p-12 relative overflow-hidden mt-12 w-full">
        <div class="absolute top-0 right-0 w-64 h-64 bg-orange-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div class="relative z-10">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <h2 class="text-3xl font-extrabold text-secondary mb-4">What Our Foodies Say</h2>
            <p class="text-gray-600">Don't just take our word for it. Here's what our happy customers have to say about their dining experience.</p>
          </div>
          
          <div class="relative w-full overflow-hidden pb-8" (mouseenter)="pauseTestimonials = true" (mouseleave)="pauseTestimonials = false">
            <div class="flex gap-8 w-max animate-marquee-slow" [class.paused]="pauseTestimonials">
              <!-- First Set -->
              <div *ngFor="let testimonial of testimonials" class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative w-80 whitespace-normal">
                <mat-icon class="absolute top-6 right-6 text-orange-200 text-4xl rotate-180 opacity-50">format_quote</mat-icon>
                <div class="flex gap-1 text-primary mb-4">
                  <mat-icon class="text-sm" *ngFor="let s of [1,2,3,4,5]">star</mat-icon>
                </div>
                <p class="text-gray-600 mb-6 relative z-10 italic leading-relaxed">"{{testimonial.text}}"</p>
                <div class="flex items-center gap-4">
                  <img [src]="testimonial.avatar" [alt]="testimonial.name" class="w-12 h-12 rounded-full object-cover border-2 border-orange-100" />
                  <div>
                    <h4 class="font-bold text-gray-900">{{testimonial.name}}</h4>
                    <p class="text-xs text-gray-500">{{testimonial.role}}</p>
                  </div>
                </div>
              </div>
              <!-- Second Set -->
              <div *ngFor="let testimonial of testimonials" class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative w-80 whitespace-normal">
                <mat-icon class="absolute top-6 right-6 text-orange-200 text-4xl rotate-180 opacity-50">format_quote</mat-icon>
                <div class="flex gap-1 text-primary mb-4">
                  <mat-icon class="text-sm" *ngFor="let s of [1,2,3,4,5]">star</mat-icon>
                </div>
                <p class="text-gray-600 mb-6 relative z-10 italic leading-relaxed">"{{testimonial.text}}"</p>
                <div class="flex items-center gap-4">
                  <img [src]="testimonial.avatar" [alt]="testimonial.name" class="w-12 h-12 rounded-full object-cover border-2 border-orange-100" />
                  <div>
                    <h4 class="font-bold text-gray-900">{{testimonial.name}}</h4>
                    <p class="text-xs text-gray-500">{{testimonial.role}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Floating Menu Button -->
      <button *ngIf="filteredMenuGroups().length > 0" (click)="showMenuSheet.set(true)" 
              class="fixed bottom-28 right-6 z-30 bg-gradient-to-r from-primary to-orange-600 text-white shadow-luxury-hover hover:shadow-lg transition-all hover:-translate-y-1 rounded-full px-6 py-4 flex items-center gap-2 font-extrabold tracking-widest text-sm uppercase">
        <mat-icon style="font-size: 20px; width: 20px; height: 20px;">restaurant_menu</mat-icon>
        MENU
      </button>

      <!-- Menu Categories Sheet/Modal -->
      <ng-container *ngIf="showMenuSheet()">
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4" (click)="showMenuSheet.set(false)">
          <div class="bg-white w-full sm:w-[400px] rounded-t-[2rem] sm:rounded-3xl shadow-2xl animate-fade-in-up max-h-[70vh] flex flex-col" (click)="$event.stopPropagation()">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 class="text-xl font-bold text-secondary tracking-tight">Browse Menu</h3>
              <button (click)="showMenuSheet.set(false)" class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="overflow-y-auto custom-scrollbar p-2">
              <button *ngFor="let group of filteredMenuGroups()" (click)="scrollToCategory(group.category.id)" class="w-full text-left px-6 py-4 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0 flex items-center justify-between group rounded-xl">
                <span class="font-bold text-gray-700 group-hover:text-primary transition-colors">{{group.category.name}}</span>
                <span class="text-sm font-extrabold text-gray-400">{{group.items.length}}</span>
              </button>
            </div>
          </div>
        </div>
      </ng-container>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .animate-marquee {
      animation: marquee 35s linear infinite;
    }
    .animate-marquee-slow {
      animation: marquee 50s linear infinite;
    }
    .animate-marquee.paused, .animate-marquee-slow.paused {
      animation-play-state: paused;
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 16px)); } /* -50% width minus half of the gap */
    }
  `]
})
export class Home implements OnInit {
  outletService = inject(OutletService);
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  cartService = inject(CartService);
  router = inject(Router);

  categories = signal<Category[]>([]);
  menuGroups = signal<{category: any, items: Product[]}[]>([]);
  showMenuSheet = signal<boolean>(false);
  
  loadingCategories = signal(true);
  loadingMenu = signal(true);
  pauseTestimonials = false;
  
  viewMode = signal<'list' | 'grid'>('list');
  filterState = signal<'all' | 'veg' | 'non-veg'>('all');
  priceSort = signal<'none' | 'asc' | 'desc'>('none');
  expandedCategories = signal<Set<string>>(new Set());

  filteredMenuGroups = computed(() => {
    const state = this.filterState();
    const sort = this.priceSort();
    
    let groups = this.menuGroups();
    
    if (state !== 'all') {
      groups = groups.map(group => ({
        ...group,
        items: group.items.filter(item => {
          if (state === 'veg') return item.isVeg;
          if (state === 'non-veg') return item.isNonVeg;
          return true;
        })
      })).filter(group => group.items.length > 0);
    }
    
    if (sort !== 'none') {
      let allItems: Product[] = [];
      groups.forEach(g => {
        allItems = [...allItems, ...g.items];
      });
      
      allItems.sort((a, b) => sort === 'asc' ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price));
      
      return [{
        category: { id: 'sorted', name: sort === 'asc' ? 'All Items (Low to High)' : 'All Items (High to Low)' },
        items: allItems
      }];
    }
    
    return groups;
  });

  testimonials = [
    {
      name: 'Karthikeyan',
      role: 'Food Enthusiast',
      text: 'The food is absolutely amazing. Reminds me of authentic home-cooked meals from Madurai!',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Meenakshi Iyer',
      role: 'Regular Customer',
      text: 'Delivery is incredibly fast! The Murugan Idli Kadai selection is just unparalleled. Best app in TN!',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Surya Sivakumar',
      role: 'Local Guide',
      text: 'The user interface is so clean. I found exactly what I was craving in seconds. Awesome experience.',
      avatar: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Divya Bharathi',
      role: 'Food Blogger',
      text: 'Piping hot food every single time. The packaging is premium and the taste is out of this world.',
      avatar: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Muthu Kumar',
      role: 'Student',
      text: 'Very affordable and the offers are great. I order my dinner from here almost every day.',
      avatar: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=150&h=150&fit=crop&q=80'
    },
    {
      name: 'Anitha Raj',
      role: 'Working Professional',
      text: 'Lifesaver for my busy schedule. Authentic Tamil Nadu flavors delivered right to my office.',
      avatar: 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?w=150&h=150&fit=crop&q=80'
    }
  ];

  ngOnInit() {
    this.categoryService.getCategories(environment.outletId).subscribe({
      next: (res) => {
        this.categories.set(res.categories || []);
        this.loadingCategories.set(false);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.loadingCategories.set(false);
      }
    });

    this.productService.getProductsGroupedByCategory(environment.outletId).subscribe({
      next: (groups) => {
        this.menuGroups.set(groups || []);
        this.loadingMenu.set(false);
        // Auto expand all categories
        if (groups && groups.length > 0) {
          const expanded = new Set<string>();
          groups.forEach((g: any) => expanded.add(g.category.id));
          this.expandedCategories.set(expanded);
        }
      },
      error: (err) => {
        console.error('Error fetching menu:', err);
        this.loadingMenu.set(false);
      }
    });
  }

  isExpanded(categoryId: string): boolean {
    if (categoryId === 'sorted') return true;
    return this.expandedCategories().has(categoryId);
  }

  toggleCategory(categoryId: string) {
    const current = new Set(this.expandedCategories());
    if (current.has(categoryId)) {
      current.delete(categoryId);
    } else {
      current.add(categoryId);
    }
    this.expandedCategories.set(current);
  }

  goToCategory(categoryId: string) {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: query.trim() } });
    }
  }

  scrollToCategory(categoryId: string) {
    this.showMenuSheet.set(false);
    
    // Ensure the category is expanded
    const current = new Set(this.expandedCategories());
    current.add(categoryId);
    this.expandedCategories.set(current);
    
    // Give Angular a tick to render if it was collapsed
    setTimeout(() => {
      const element = document.getElementById('category-' + categoryId);
      if (element) {
        // Offset by 100px to account for the sticky header
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
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
