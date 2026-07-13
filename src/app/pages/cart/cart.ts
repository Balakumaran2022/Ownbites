import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart';
import { DiscountService } from '../../services/discount';
import { OrderService } from '../../services/order';
import { CustomerService } from '../../services/customer';
import { ProductService } from '../../services/product';
import { UiButton } from '../../shared/components/ui-button/ui-button';
import { UiCard } from '../../shared/components/ui-card/ui-card';
import { CartItem } from '../../models';
import { environment } from '../../../environments/environment';
import { OrganizationService } from '../../services/organization';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule, UiButton, UiCard],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32 min-h-[60vh]">
      <h1 class="text-3xl font-extrabold text-secondary mb-8">Your Cart</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" *ngIf="cartService.cartItems().length > 0; else emptyCart">
        
        <!-- Left Column: Cart Items + Extra Options -->
        <div class="lg:col-span-7 space-y-6">

          <!-- First User Welcome Promo Banner (Left Column) -->
          <div *ngIf="isFirstUser() && cartService.selectedCoupon()?.code !== 'WELCOME50'"
               class="bg-gradient-to-r from-orange-500 to-[#f4811f] text-white p-5 rounded-3xl shadow-luxury-hover border border-orange-100/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
            <div class="flex items-start gap-3">
              <mat-icon class="text-white text-3xl">celebration</mat-icon>
              <div>
                <h3 class="font-extrabold text-base sm:text-lg">Welcome to {{orgService.org().name}}! 🎉</h3>
                <p class="text-white/95 text-xs sm:text-sm mt-0.5 font-medium leading-relaxed">
                  As a first-time user, you get a special flat 50% discount (up to ₹150) on this order!
                </p>
              </div>
            </div>
            <button (click)="applyCoupon(coupons[0])"
                    class="bg-white text-orange-600 hover:bg-orange-50 font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow transition-all hover:scale-105 active:scale-95 shrink-0 self-start sm:self-center">
              Apply 50% Coupon
            </button>
          </div>
          
          <!-- Cart Items List -->
          <div class="space-y-4">
            <app-ui-card *ngFor="let item of cartService.cartItems()" [padding]="true" class="block">
              <div class="flex flex-col sm:flex-row items-center gap-4 w-full">
                <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <img [src]="item.product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'" [alt]="item.product.name" class="w-full h-full object-cover">
                </div>
                
                <div class="flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full">
                  <div class="mb-4 sm:mb-0">
                    <h3 class="font-extrabold text-secondary text-base">{{item.product.name}}</h3>
                    <p class="text-sm text-gray-500 line-clamp-1 mt-0.5">{{item.product.description}}</p>
                    <div class="font-extrabold text-secondary mt-1">₹{{item.product.price}}</div>
                  </div>
                  
                  <div class="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <button (click)="decreaseQuantity(item)" class="w-8 h-8 flex items-center justify-center text-primary hover:bg-orange-100 rounded-md transition-colors">
                      <mat-icon class="text-sm">remove</mat-icon>
                    </button>
                    <span class="font-extrabold text-secondary w-4 text-center">{{item.quantity}}</span>
                    <button (click)="increaseQuantity(item)" class="w-8 h-8 flex items-center justify-center text-primary hover:bg-orange-100 rounded-md transition-colors">
                      <mat-icon class="text-sm">add</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </app-ui-card>
          </div>

          <!-- Suggestions -->
          <app-ui-card [padding]="true" class="block">
            <div class="flex items-start gap-3 w-full">
              <mat-icon class="text-gray-400 mt-1" style="transform: scaleX(-1);">format_quote</mat-icon>
              <textarea placeholder="Any suggestions? We will pass it on..." class="w-full bg-transparent border-none focus:ring-0 resize-none h-8 text-gray-700 placeholder-gray-400 outline-none"></textarea>
            </div>
          </app-ui-card>

          <!-- No Contact Delivery -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors" (click)="optInNoContact = !optInNoContact">
            <div class="mt-1 shrink-0">
              <div class="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center transition-colors" [class.bg-[#f4811f]]="optInNoContact" [class.border-[#f4811f]]="optInNoContact">
                <mat-icon *ngIf="optInNoContact" class="text-white font-bold" style="font-size: 12px; width: 12px; height: 12px;">check</mat-icon>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-extrabold text-gray-800 text-sm">Opt in for No-contact Delivery</h4>
              <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Unwell, or avoiding contact? Please select no-contact delivery. Partner will safely place the order outside your door (not for COD)
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column: Summary + Coupon Section -->
        <div class="lg:col-span-5 space-y-6">

          <app-ui-card [padding]="true" class="block">
            <h2 class="text-lg font-bold text-secondary mb-4 border-b border-gray-100 pb-2.5 flex items-center gap-2">
              <mat-icon class="text-primary" style="font-size: 20px; width: 20px; height: 20px;">receipt</mat-icon> Order Summary
            </h2>

            <!-- Dynamic Offer Guide / Intimation Banner (Inline Glowing Bold) -->
            <div *ngIf="intimationMessage() as msg" 
                 class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4 shadow-[0_0_12px_rgba(244,129,31,0.25)] border-orange-400/40 animate-pulse-subtle flex flex-col gap-3">
              <div class="flex items-start gap-2.5">
                <mat-icon class="text-[#f4811f] shrink-0" style="font-size: 18px; width: 18px; height: 18px; margin-top: 1px;">info</mat-icon>
                <div class="flex-1 min-w-0">
                  <p class="text-[#f4811f] text-[11px] font-black tracking-wide leading-normal uppercase">
                    {{msg.text}}
                  </p>
                </div>
              </div>

              <!-- Dynamic Quick Add recommendations for faster threshold completion -->
              <div *ngIf="quickAddRecommendations().length > 0" class="border-t border-orange-200/50 pt-2.5 space-y-2">
                <span class="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">⚡ Quick Add to unlock discount:</span>
                <div class="flex flex-col gap-2">
                  <div *ngFor="let rec of quickAddRecommendations()" 
                       class="flex items-center justify-between bg-white rounded-xl p-2 border border-orange-100 shadow-sm">
                    <div class="flex items-center gap-2 min-w-0">
                      <img [src]="rec.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80'" 
                           [alt]="rec.name" 
                           class="w-8 h-8 rounded-lg object-cover border border-orange-50 shrink-0">
                      <div class="min-w-0">
                        <div class="font-extrabold text-gray-800 text-xs truncate leading-tight">{{rec.name}}</div>
                        <div class="text-[10px] text-primary font-black mt-0.5">₹{{rec.price}}</div>
                      </div>
                    </div>
                    <button (click)="quickAddProduct(rec)" 
                            class="bg-[#f4811f] hover:bg-orange-600 text-white font-black px-3.5 py-1.5 rounded-lg text-[9.5px] uppercase tracking-wider shadow-sm transition-all active:scale-95 flex items-center gap-1 shrink-0">
                      <span>Add</span>
                      <mat-icon style="font-size: 10px; width: 10px; height: 10px;" class="text-white">add</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Unlocked Coupons Quick-Apply Banners -->
            <div *ngIf="getUnlockedCoupons().length > 0" class="mb-4 space-y-2">
              <div *ngFor="let c of getUnlockedCoupons()" 
                class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between shadow-[0_4px_16px_rgba(16,185,129,0.08)] border-emerald-300/50">
                <div class="flex items-center gap-2">
                  <span class="text-base">🎉</span>
                  <div class="min-w-0">
                    <div class="font-extrabold text-emerald-800 text-xs tracking-wide uppercase">{{ c.code }} Unlocked!</div>
                    <div class="text-[10px] text-emerald-600 mt-0.5 max-w-[160px] truncate leading-tight">{{ c.desc }}</div>
                  </div>
                </div>
                <button (click)="applyCoupon(c)"
                  class="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-1.5 rounded-lg text-[9.5px] tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer">
                  APPLY
                </button>
              </div>
            </div>
            
            <!-- Coupon Code Entry -->
            <div class="flex gap-2 mb-4">
              <input type="text" 
                     placeholder="ENTER COUPON CODE" 
                     [(ngModel)]="couponInput"
                     class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm uppercase font-bold text-secondary">
              <button (click)="applyTypedCoupon()" 
                      class="bg-gradient-to-r from-[#f4811f] to-orange-500 text-white font-extrabold px-4 py-1.5 rounded-lg text-xs uppercase shadow-sm hover:scale-105 active:scale-95 transition-all">
                Apply
              </button>
            </div>

            <!-- Collapsible Available Coupons Header -->
            <div (click)="showCouponsList.set(!showCouponsList())"
                 class="flex items-center justify-between cursor-pointer py-2.5 border-t border-b border-gray-100/80 mb-3 select-none hover:bg-gray-50/50 transition-colors">
              <span class="text-xs font-black text-gray-500 uppercase tracking-wider">Available Coupons</span>
              <mat-icon class="text-gray-400 transition-transform duration-300"
                        [class.rotate-180]="showCouponsList()">
                keyboard_arrow_down
              </mat-icon>
            </div>

            <!-- List of Coupons inside Cart (Collapsible) -->
            <div *ngIf="showCouponsList()" class="space-y-2 mb-4 animate-fade-in">
              <ng-container *ngFor="let coupon of coupons">
                <!-- Only show WELCOME50 card if they are a first-time user -->
                <div *ngIf="coupon.code !== 'WELCOME50' || isFirstUser()"
                     [class]="cartService.selectedCoupon()?.code === coupon.code
                       ? 'border-2 border-green-500 bg-green-50/20'
                       : isEligible(coupon)
                         ? 'border border-orange-100 bg-orange-50/5 hover:border-orange-300'
                         : 'border border-gray-100 opacity-60 bg-gray-50/20'"
                     class="p-2.5 rounded-xl flex items-center justify-between transition-all select-none">
                  
                  <div class="flex-1 min-w-0 pr-2">
                    <div class="flex items-center gap-1.5">
                      <span class="bg-[#f4811f]/10 text-[#f4811f] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {{coupon.code}}
                      </span>
                      <span *ngIf="cartService.selectedCoupon()?.code === coupon.code" class="text-[9px] text-green-600 font-extrabold flex items-center gap-0.5">
                        <mat-icon style="font-size:11px;width:11px;height:11px;">check_circle</mat-icon> APPLIED
                      </span>
                    </div>
                    <h4 class="font-extrabold text-secondary text-[11px] mt-0.5">{{coupon.title}} - {{coupon.label}}</h4>
                    <p class="text-[9px] text-gray-400 truncate mt-0.5">{{coupon.desc}}</p>
                  </div>

                  <button *ngIf="cartService.selectedCoupon()?.code !== coupon.code"
                          [disabled]="!isEligible(coupon)"
                          (click)="applyCoupon(coupon)"
                          [class]="isEligible(coupon)
                            ? 'text-orange-500 font-extrabold hover:text-orange-700'
                            : 'text-gray-300 cursor-not-allowed font-medium'"
                          class="text-[11px] uppercase tracking-wider shrink-0 px-1.5 py-0.5">
                    Apply
                  </button>
                  <button *ngIf="cartService.selectedCoupon()?.code === coupon.code"
                          (click)="removeCoupon()"
                          class="text-[11px] text-red-500 hover:text-red-700 font-extrabold uppercase tracking-wider shrink-0 px-1.5 py-0.5">
                    Remove
                  </button>
                </div>
              </ng-container>
            </div>

            <!-- Bill Details -->
            <div class="space-y-2 text-xs text-gray-600 mb-4 border-t border-gray-100 pt-3">
              <div class="flex justify-between">
                <span>Item Subtotal</span>
                <span class="font-bold text-secondary">₹{{subtotal() | number:'1.2-2'}}</span>
              </div>
              <div class="flex flex-col text-green-600 animate-fade-in" *ngIf="cartService.cartSummary().discount > 0">
                <div class="flex justify-between font-bold">
                  <span class="flex items-center gap-0.5">
                    <mat-icon style="font-size:14px;width:14px;height:14px;" class="mt-0.5">local_offer</mat-icon>
                    Coupon Savings ({{cartService.selectedCoupon()?.code}})
                  </span>
                  <span>-₹{{cartService.cartSummary().discount | number:'1.2-2'}}</span>
                </div>
                <span class="text-[10px] text-green-600/80 font-bold ml-4.5 mt-0.5">*valid only 4 days</span>
              </div>
              <div class="flex justify-between">
                <span>Taxes (5%)</span>
                <span class="font-bold text-secondary">₹{{cartService.cartSummary().taxes | number:'1.2-2'}}</span>
              </div>
              <div class="flex justify-between">
                <span>Delivery Charge</span>
                <span class="font-bold text-secondary">₹{{cartService.cartSummary().deliveryCharge | number:'1.2-2'}}</span>
              </div>
              <div class="flex justify-between pb-2.5 border-b border-gray-100">
                <span>Packaging Charge</span>
                <span class="font-bold text-secondary">₹{{cartService.cartSummary().packageCharge | number:'1.2-2'}}</span>
              </div>
              <div class="flex justify-between text-base font-black text-secondary pt-1.5">
                <span>To Pay</span>
                <span class="text-[#f4811f] text-lg">₹{{cartService.cartSummary().total | number:'1.2-2'}}</span>
              </div>
            </div>

            <app-ui-button variant="primary" [fullWidth]="true" routerLink="/checkout" class="block w-full mt-4 mb-2">
              Proceed to Checkout
            </app-ui-button>
          </app-ui-card>
        </div>
      </div>

      <!-- Empty Cart -->
      <ng-template #emptyCart>
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
            <mat-icon style="font-size: 80px; width: 80px; height: 80px;" class="text-gray-300">remove_shopping_cart</mat-icon>
          </div>
          <h2 class="text-2xl font-extrabold text-secondary mb-2">Your cart is empty</h2>
          <p class="text-gray-500 mb-8 max-w-sm text-sm">Looks like you haven't added anything to your cart yet. Explore our delicious categories!</p>
          <app-ui-button variant="primary" routerLink="/">Browse Categories</app-ui-button>
        </div>
      </ng-template>
    </div>
  `
})
export class Cart implements OnInit {
  cartService = inject(CartService);
  discountService = inject(DiscountService);
  orderService = inject(OrderService);
  customerService = inject(CustomerService);
  productService = inject(ProductService);
  orgService = inject(OrganizationService);

  optInNoContact = false;
  couponInput: string = '';
  isFirstUser = signal<boolean>(false);
  showCouponsList = signal<boolean>(false);
  allProducts = signal<any[]>([]);

  // Coupons data list
  coupons = [
    { code: 'WELCOME50', label: 'New User', title: '50% OFF', desc: 'Enjoy 50% off up to ₹150 on your very first order', type: 'percentage', value: 50, max: 150, min: 0 },
    { code: 'FLAT80', label: 'Valid Now', title: '₹80 OFF', desc: 'Enjoy a flat ₹80 discount when you place an order of ₹300 or more', type: 'flat', value: 80, min: 300 },
    { code: 'TREND100', label: 'Trending', title: '₹100 OFF', desc: 'Get a fantastic ₹100 discount on all orders exceeding ₹500', type: 'flat', value: 100, min: 500 },
    { code: 'FEAST200', label: 'Premium', title: '₹200 OFF', desc: 'Instant ₹200 savings! Treat yourself to a grand feast for orders above ₹1500', type: 'flat', value: 200, min: 1500 }
  ];

  subtotal = computed(() => this.cartService.cartSummary().subtotal);

  // Dynamic intimation guide banner helper
  intimationMessage = computed(() => {
    const sub = this.subtotal();
    // Priority 1: First-time users should only see WELCOME50, do not prompt for subtotal thresholds
    if (sub === 0 || this.isFirstUser()) return null;
    
    // 1. Check FLAT80 (min: 300)
    if (sub < 300) {
      const diff = 300 - sub;
      return { text: `Add ₹${diff.toFixed(2)} more to avail ₹80 OFF (FLAT80)!`, diff, nextVal: 80, nextCode: 'FLAT80' };
    }
    // 2. Check TREND100 (min: 500)
    if (sub < 500) {
      const diff = 500 - sub;
      return { text: `Add ₹${diff.toFixed(2)} more to avail ₹100 OFF (TREND100)!`, diff, nextVal: 100, nextCode: 'TREND100' };
    }
    // 3. Check FEAST200 (min: 1500)
    if (sub < 1500) {
      const diff = 1500 - sub;
      return { text: `Add ₹${diff.toFixed(2)} more to avail ₹200 OFF (FEAST200)!`, diff, nextVal: 200, nextCode: 'FEAST200' };
    }
    return null;
  });

  quickAddRecommendations = computed(() => {
    const msg = this.intimationMessage();
    if (!msg) return [];
    
    const diff = msg.diff;
    const items = this.allProducts();
    const cartItemIds = new Set(this.cartService.cartItems().map(i => i.product.id));
    
    // Filter items: in stock, not already in cart
    let eligible = items.filter(p => p.inStock && !cartItemIds.has(p.id));
    if (eligible.length === 0) {
      eligible = items.filter(p => p.inStock);
    }
    
    // Sort by price: prefer items that are >= diff so a single add unlocks the coupon,
    // or items that are closest to diff.
    eligible.sort((a, b) => {
      const diffA = a.price - diff;
      const diffB = b.price - diff;
      
      if (diffA >= 0 && diffB < 0) return -1;
      if (diffB >= 0 && diffA < 0) return 1;
      
      return Math.abs(diffA) - Math.abs(diffB);
    });
    
    return eligible.slice(0, 3);
  });

  ngOnInit() {
    this.checkUserOrderHistory();

    // Fetch all products for dynamic threshold recommendations
    this.productService.getProductsByOutlet(environment.outletId).subscribe({
      next: (res) => this.allProducts.set(res || []),
      error: (err) => console.error('Error loading products for recommendations:', err)
    });
  }

  checkUserOrderHistory() {
    const customer = this.customerService.currentUser();
    if (!customer) {
      this.isFirstUser.set(true);
      return;
    }

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        if (!orders || orders.length === 0) {
          this.isFirstUser.set(true);
        } else {
          this.isFirstUser.set(false);
          // If a WELCOME50 coupon was previously applied but user is not first-time, remove it
          if (this.cartService.selectedCoupon()?.code === 'WELCOME50') {
            this.removeCoupon();
          }
        }
      },
      error: () => {
        this.isFirstUser.set(true);
      }
    });
  }

  isEligible(coupon: any): boolean {
    const sub = this.subtotal();
    if (coupon.code === 'WELCOME50') {
      return this.isFirstUser();
    }
    if (coupon.code === 'FLAT80') {
      return sub >= 300 && sub < 500;
    }
    if (coupon.code === 'TREND100') {
      return sub >= 500 && sub < 1500;
    }
    if (coupon.code === 'FEAST200') {
      return sub >= 1500;
    }
    return sub >= (coupon.min || 0);
  }

  applyCoupon(coupon: any) {
    if (coupon.code === 'WELCOME50' && !this.isFirstUser()) {
      alert('The WELCOME50 coupon is only eligible for first-time users.');
      return;
    }

    if (!this.isEligible(coupon)) {
      if (coupon.code === 'FLAT80') {
        alert('FLAT80 coupon is only eligible for orders between ₹300 and ₹500.');
      } else if (coupon.code === 'TREND100') {
        alert('TREND100 coupon is only eligible for orders between ₹500 and ₹1500.');
      } else if (coupon.code === 'FEAST200') {
        alert('FEAST200 coupon is only eligible for orders of ₹1500 or more.');
      } else {
        alert(`Minimum order value of ₹${coupon.min} required to apply this coupon.`);
      }
      return;
    }

    let discount = 0;
    if (coupon.type === 'flat') {
      discount = coupon.value;
    } else if (coupon.type === 'percentage') {
      discount = (this.subtotal() * coupon.value) / 100;
      if (coupon.max) {
        discount = Math.min(discount, coupon.max);
      }
    }

    this.cartService.selectedCoupon.set(coupon);
    this.cartService.discountAmount.set(discount);
    this.couponInput = coupon.code;
    this.showCouponsList.set(false); // Collapse the list after applying
  }

  applyTypedCoupon() {
    const code = this.couponInput.trim().toUpperCase();
    if (!code) return;

    // Direct check for custom generated scratch reward coupon manually
    try {
      const raw = localStorage.getItem('ownbites_scratch_coupon');
      if (raw) {
        const sc = JSON.parse(raw);
        if (sc.revealed && sc.code && sc.amount > 0 && sc.expiry > Date.now()) {
          if (code === sc.code.toUpperCase()) {
            const tempCoupon = {
              code: sc.code,
              label: 'Scratch Reward',
              title: '₹20 OFF',
              desc: 'Scratch card reward discount',
              type: 'flat',
              value: sc.amount,
              min: 0
            };
            this.applyCoupon(tempCoupon);
            return;
          }
        }
      }
    } catch { /* ignore */ }

    const coupon = this.coupons.find(c => c.code === code);
    if (!coupon) {
      alert('Invalid coupon code entered.');
      return;
    }

    this.applyCoupon(coupon);
  }

  removeCoupon() {
    this.cartService.selectedCoupon.set(null);
    this.cartService.discountAmount.set(0);
    this.couponInput = '';
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    this.recalculateDiscount();
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    this.recalculateDiscount();
  }

  recalculateDiscount() {
    const active = this.cartService.selectedCoupon();
    if (active) {
      if (!this.isEligible(active)) {
        // No longer eligible due to subtotal range change
        this.removeCoupon();
      } else {
        // Re-apply to update calculation
        this.applyCoupon(active);
      }
    }
  }

  getUnlockedCoupons(): any[] {
    const sub = this.subtotal();
    const applied = this.cartService.selectedCoupon();
    const isNew = this.isFirstUser();

    // Priority check: find the single eligible subtotal-based coupon for non-new users
    let eligibleSubtotalCouponCode = '';
    if (!isNew) {
      if (sub >= 300 && sub < 500) {
        eligibleSubtotalCouponCode = 'FLAT80';
      } else if (sub >= 500 && sub < 1500) {
        eligibleSubtotalCouponCode = 'TREND100';
      } else if (sub >= 1500) {
        eligibleSubtotalCouponCode = 'FEAST200';
      }
    }

    return this.coupons.filter(c => {
      // Ignore if already applied
      if (applied && applied.code === c.code) return false;

      // WELCOME50 is priority 1, only for new users
      if (c.code === 'WELCOME50') {
        return isNew;
      }

      // Subtotal coupons are only shown if they match the active range eligibility code
      return c.code === eligibleSubtotalCouponCode;
    });
  }
  quickAddProduct(product: any) {
    const msg = this.intimationMessage();
    const targetCouponCode = msg?.nextCode;

    this.cartService.addToCart(product);

    // If adding this item crossed the threshold for the target coupon, apply it automatically!
    if (targetCouponCode) {
      const coupon = this.coupons.find(c => c.code === targetCouponCode);
      if (coupon && this.isEligible(coupon)) {
        this.applyCoupon(coupon);
        return;
      }
    }

    this.recalculateDiscount();
  }
}
