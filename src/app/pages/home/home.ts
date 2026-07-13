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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <!-- Hero Banner -->
      <section class="relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-luxury group">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80" alt="Delicious Food" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div class="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 drop-shadow-md tracking-tight leading-tight">
            Craving Something <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#f4811f] font-extrabold">Special?</span>
          </h1>
          <div class="max-w-xl w-full mt-4">
            <div class="flex items-center bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-luxury-hover border border-white/20 focus-within:ring-4 focus-within:ring-[#f4811f]/20 transition-all duration-300">
              <div class="flex-1 flex items-center pl-4 gap-2.5">
                <mat-icon class="text-[#f4811f]" style="font-size:20px;width:20px;height:20px;">search</mat-icon>
                <input #searchInput (keyup.enter)="onSearch(searchInput.value)" 
                       type="text" 
                       placeholder="Search for delicious food..." 
                       class="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 text-sm font-semibold">
              </div>
              <button (click)="onSearch(searchInput.value)" 
                      class="bg-gradient-to-r from-[#f4811f] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow transition-all duration-200 hover:scale-102 active:scale-98 flex items-center gap-1.5">
                <span>Search</span>
                <mat-icon style="font-size:14px;width:14px;height:14px;">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Categories — Slim Circles -->
      <section *ngIf="categories().length > 0 || loadingCategories()">
        <div class="flex flex-col mb-4">
          <h2 class="text-2xl md:text-3xl font-black text-secondary tracking-tight">
            What's on your <span class="text-primary relative inline-block">mind?</span>
          </h2>
          <div class="w-16 h-1 bg-gradient-to-r from-primary to-[#f4811f] rounded-full mt-2"></div>
        </div>
        
        <div class="relative w-full overflow-x-auto hide-scrollbar pb-2 pt-1 snap-x">
          <ng-container *ngIf="loadingCategories(); else cats">
            <div class="flex gap-6 w-max">
              <div *ngFor="let i of [1,2,3,4,5,6]" class="flex flex-col items-center gap-2 min-w-[96px] shrink-0">
                <app-skeleton-loader type="circle" widthClass="w-24" heightClass="h-24"></app-skeleton-loader>
                <app-skeleton-loader widthClass="w-20" heightClass="h-3"></app-skeleton-loader>
              </div>
            </div>
          </ng-container>
          <ng-template #cats>
            <div class="flex gap-6 w-max">
              <div *ngFor="let cat of categories(); let i = index" class="flex flex-col items-center gap-2 min-w-[96px] cursor-pointer group shrink-0 snap-start" (click)="goToCategory(cat.id, i)">
                <div class="w-24 h-24 rounded-full overflow-hidden shadow hover:shadow-md transition-all duration-500 group-hover:-translate-y-1 relative">
                  <img [src]="cat.imageUrl" [alt]="cat.name" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                </div>
                <span class="font-bold text-gray-700 group-hover:text-primary transition-colors text-center px-0.5 w-28 tracking-wide text-xs truncate leading-snug">{{cat.name}}</span>
              </div>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- Professional Filter Bar (Static) -->
      <div class="py-3 mb-4 border-b border-gray-100/60">
        <div class="flex items-center gap-2">

          <!-- Veg Filter Pill -->
          <button (click)="filterState.set(filterState() === 'veg' ? 'all' : 'veg')"
                  [class]="filterState() === 'veg'
                    ? 'bg-green-600 text-white border-green-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700'"
                  class="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap">
            <div [class]="filterState() === 'veg'
                  ? 'w-3.5 h-3.5 border-2 border-white flex items-center justify-center rounded-sm'
                  : 'w-3.5 h-3.5 border-2 border-green-600 flex items-center justify-center rounded-sm'">
              <div [class]="filterState() === 'veg' ? 'w-1.5 h-1.5 rounded-full bg-white' : 'w-1.5 h-1.5 rounded-full bg-green-600'"></div>
            </div>
            Veg
          </button>

          <!-- Non-Veg Filter Pill -->
          <button (click)="filterState.set(filterState() === 'non-veg' ? 'all' : 'non-veg')"
                  [class]="filterState() === 'non-veg'
                    ? 'bg-red-600 text-white border-red-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-700'"
                  class="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap">
            <div [class]="filterState() === 'non-veg'
                  ? 'w-3.5 h-3.5 border-2 border-white flex items-center justify-center rounded-sm'
                  : 'w-3.5 h-3.5 border-2 border-red-600 flex items-center justify-center rounded-sm'">
              <div [class]="filterState() === 'non-veg' ? 'w-1.5 h-1.5 rounded-full bg-white' : 'w-1.5 h-1.5 rounded-full bg-red-600'"></div>
            </div>
            Non-Veg
          </button>

          <!-- Divider -->
          <div class="flex-1"></div>

          <!-- Sort Pill -->
          <button (click)="togglePriceSort()"
                  [class]="priceSort() !== 'none'
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-600'"
                  class="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap">
            <mat-icon class="text-[16px] w-4 h-4">sort</mat-icon>
            <span>{{priceSort() === 'asc' ? 'Price ↑' : priceSort() === 'desc' ? 'Price ↓' : 'Sort'}}</span>
          </button>

        </div>
      </div>

      <!-- Category Cards Grid — 3 per row -->
      <div>
        <!-- Skeleton -->
        <ng-container *ngIf="loadingMenu()">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div *ngFor="let i of [1,2,3,4,5,6]">
              <app-skeleton-loader widthClass="w-full" heightClass="h-56"></app-skeleton-loader>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="!loadingMenu()">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div *ngFor="let group of filteredMenuGroups(); let idx = index"
                 class="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group/cat select-none hover:-translate-y-1"
                 (click)="goToCategoryPage(group.category.id, idx)">

              <!-- Image + Overlay -->
              <div class="relative w-full h-56 md:h-64 overflow-hidden bg-gray-900">
                <img [src]="group.category.imageUrl || group.items[0]?.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'"
                     [alt]="group.category.name"
                     class="w-full h-full object-cover group-hover/cat:scale-105 transition-transform duration-700 opacity-85" />
                <!-- Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  
                 <!-- Item count badge top-left -->
                 <div class="absolute top-2 left-2">
                   <span class="bg-[#f4811f] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide shadow">
                     {{group.items.length}} items
                   </span>
                 </div>

                 <!-- Arrow icon top-right -->
                 <div class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                   <mat-icon class="text-white" style="font-size:16px;width:16px;height:16px;">arrow_forward</mat-icon>
                 </div>

                 <!-- Category name + veg counts + offer text at bottom -->
                 <div class="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8">
                   <!-- Swiggy style: bold orange offer text directly above category name, no white background -->
                   <div class="text-[#f4811f] font-black text-sm uppercase tracking-wide drop-shadow mb-0.5">
                     {{getOfferText(idx)}}
                   </div>
                   <h3 class="text-white font-extrabold text-base leading-snug drop-shadow-md">
                     {{group.category.name}}
                   </h3>
                   <div class="flex items-center gap-2 mt-1">
                     <span class="flex items-center gap-1 text-xs text-white/80">
                       <span class="w-1.5 h-1.5 rounded-sm bg-green-400 inline-block"></span>{{countVeg(group.items)}} Veg
                     </span>
                     <span class="flex items-center gap-1 text-xs text-white/80">
                       <span class="w-1.5 h-1.5 rounded-sm bg-red-400 inline-block"></span>{{countNonVeg(group.items)}} Non-veg
                     </span>
                   </div>
                 </div>
                </div>
              </div>

            </div>
          </div>
        </ng-container>
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

      <!-- Floating Menu Button — right-edge vertical tab -->
      <button *ngIf="filteredMenuGroups().length > 0" (click)="showMenuSheet.set(true)"
              class="fixed top-1/2 -translate-y-1/2 right-0 z-30
                     bg-gradient-to-b from-primary to-orange-600
                     text-white shadow-luxury-hover hover:shadow-lg
                     transition-all hover:-translate-x-1
                     rounded-l-2xl px-2.5 py-6
                     flex flex-col items-center gap-2
                     font-extrabold tracking-widest text-[11px] uppercase">
        <mat-icon style="font-size: 20px; width: 20px; height: 20px;">restaurant_menu</mat-icon>
        <span style="writing-mode: vertical-rl; transform: rotate(180deg); letter-spacing: 0.14em;">MENU</span>
      </button>

      <!-- Menu Sheet/Drawer — shows categories + their items -->
      <ng-container *ngIf="showMenuSheet()">
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-end sm:items-start sm:justify-end" (click)="showMenuSheet.set(false)">
          <div class="bg-white w-full sm:w-[400px] sm:h-full rounded-t-[2rem] sm:rounded-none sm:rounded-l-3xl shadow-2xl animate-fade-in-up max-h-[90vh] sm:max-h-full flex flex-col" (click)="$event.stopPropagation()">
            
            <!-- Drawer Header -->
            <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-orange-50 to-white">
              <div class="flex items-center gap-3">
                <mat-icon class="text-primary text-2xl">restaurant_menu</mat-icon>
                <h3 class="text-xl font-extrabold text-secondary tracking-tight">Full Menu</h3>
              </div>
              <button (click)="showMenuSheet.set(false)" class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <!-- Accordion Categories with Items -->
            <div class="overflow-y-auto custom-scrollbar flex-1">
              <div *ngFor="let group of filteredMenuGroups()" class="border-b border-gray-100 last:border-0">
                
                <!-- Category Header (closed by default, click to expand) -->
                <button (click)="toggleMenuSheetCategory(group.category.id)"
                        class="w-full flex items-center justify-between px-6 py-4 hover:bg-orange-50 transition-colors group">
                  <div class="flex items-center gap-3">
                    <span class="font-extrabold text-secondary text-base group-hover:text-primary transition-colors">{{group.category.name}}</span>
                    <span class="text-xs bg-orange-100 text-orange-600 font-bold px-2.5 py-0.5 rounded-full">{{group.items.length}}</span>
                  </div>
                  <mat-icon class="text-gray-400 transition-transform duration-300"
                            [class.rotate-180]="isMenuSheetCatExpanded(group.category.id)">
                    expand_more
                  </mat-icon>
                </button>

                <!-- Items List (hidden until header clicked) -->
                <div *ngIf="isMenuSheetCatExpanded(group.category.id)" class="bg-gray-50/70 pb-2">
                  <div *ngFor="let item of group.items"
                       (click)="scrollToCategory(group.category.id)"
                       class="flex items-center justify-between px-6 py-3 hover:bg-orange-50 cursor-pointer transition-colors group/item border-t border-gray-100">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <!-- Veg / Non-veg indicator -->
                      <div [class]="item.isVeg
                            ? 'w-4 h-4 border-2 border-green-600 flex items-center justify-center rounded-sm shrink-0'
                            : 'w-4 h-4 border-2 border-red-600 flex items-center justify-center rounded-sm shrink-0'">
                        <div [class]="item.isVeg ? 'w-2 h-2 rounded-full bg-green-600' : 'w-2 h-2 rounded-full bg-red-600'"></div>
                      </div>
                      <span class="text-[15px] text-gray-700 group-hover/item:text-primary transition-colors font-medium truncate">{{item.name}}</span>
                    </div>
                    <span class="text-[15px] font-extrabold text-primary shrink-0 ml-3">₹{{item.price}}</span>
                  </div>
                </div>

              </div>
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
  
  viewMode = signal<'list' | 'grid'>('grid');
  filterState = signal<'all' | 'veg' | 'non-veg'>('all');
  priceSort = signal<'none' | 'asc' | 'desc'>('none');
  expandedCategories = signal<Set<string>>(new Set());
  menuSheetExpandedCategories = signal<Set<string>>(new Set());

  filteredMenuGroups = computed(() => {
    const sort = this.priceSort();
    let groups = this.menuGroups();
    
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
        // Both main cards and sheet drawer start COLLAPSED — user clicks to open
        this.expandedCategories.set(new Set<string>());
        this.menuSheetExpandedCategories.set(new Set<string>());
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

  toggleMenuSheetCategory(categoryId: string) {
    const current = new Set(this.menuSheetExpandedCategories());
    if (current.has(categoryId)) {
      current.delete(categoryId);
    } else {
      current.add(categoryId);
    }
    this.menuSheetExpandedCategories.set(current);
  }

  isMenuSheetCatExpanded(categoryId: string): boolean {
    return this.menuSheetExpandedCategories().has(categoryId);
  }

  goToCategory(categoryId: string, index: number) {
    const offer = this.getOfferText(index);
    const diet = this.filterState();
    this.router.navigate(['/products'], { queryParams: { category: categoryId, offer: offer, diet: diet } });
  }

  goToCategoryPage(categoryId: string, index: number) {
    const offer = this.getOfferText(index);
    const diet = this.filterState();
    this.router.navigate(['/products'], { queryParams: { category: categoryId, offer: offer, diet: diet } });
  }

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: query.trim() } });
    }
  }

  scrollToCategory(categoryId: string) {
    this.showMenuSheet.set(false);
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
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

  countVeg(items: any[]): number {
    return items.filter(i => i.isVeg).length;
  }

  countNonVeg(items: any[]): number {
    return items.filter(i => i.isNonVeg || !i.isVeg).length;
  }

  getOfferText(index: number): string {
    const offers = [
      '₹80 OFF ABOVE ₹300',
      '₹100 OFF ABOVE ₹500',
      '₹200 OFF ABOVE ₹1500'
    ];
    return offers[index % offers.length];
  }

}
