import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart';
import { DiscountService } from '../../services/discount';
import { UiButton } from '../../shared/components/ui-button/ui-button';
import { UiCard } from '../../shared/components/ui-card/ui-card';
import { CartItem } from '../../models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, UiButton, UiCard],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
      <h1 class="text-3xl font-bold text-secondary mb-8">Your Cart</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" *ngIf="cartService.cartItems().length > 0; else emptyCart">
        
        <!-- Left Column: Cart Items + Extra Options -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Cart Items List -->
          <div class="space-y-4">
            <app-ui-card *ngFor="let item of cartService.cartItems()" [padding]="true">
            <div class="flex flex-col sm:flex-row items-center gap-4 w-full">
              <div class="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <img [src]="item.product.imageUrl" [alt]="item.product.name" class="w-full h-full object-cover">
              </div>
              
              <div class="flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full">
                <div class="mb-4 sm:mb-0">
                  <h3 class="font-bold text-secondary">{{item.product.name}}</h3>
                  <p class="text-sm text-gray-500 line-clamp-1">{{item.product.description}}</p>
                  <div class="font-bold text-secondary mt-1">₹{{item.product.price}}</div>
                </div>
                
                <div class="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                  <button (click)="decreaseQuantity(item)" class="w-8 h-8 flex items-center justify-center text-primary hover:bg-orange-100 rounded-md transition-colors">
                    <mat-icon class="text-sm">remove</mat-icon>
                  </button>
                  <span class="font-bold text-secondary w-4 text-center">{{item.quantity}}</span>
                  <button (click)="increaseQuantity(item)" class="w-8 h-8 flex items-center justify-center text-primary hover:bg-orange-100 rounded-md transition-colors">
                    <mat-icon class="text-sm">add</mat-icon>
                  </button>
                </div>
              </div>
            </div>
            </app-ui-card>
          </div>

          <!-- Extra Options -->
          <div class="space-y-4">
            <!-- Suggestions -->
          <app-ui-card [padding]="true">
            <div class="flex items-start gap-3 w-full">
              <mat-icon class="text-gray-400 mt-1" style="transform: scaleX(-1);">format_quote</mat-icon>
              <textarea placeholder="Any suggestions? We will pass it on..." class="w-full bg-transparent border-none focus:ring-0 resize-none h-8 text-gray-700 placeholder-gray-400 outline-none"></textarea>
            </div>
          </app-ui-card>

          <!-- No Contact Delivery -->
          <div class="bg-white rounded-3xl p-4 shadow-luxury flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors" (click)="optInNoContact = !optInNoContact">
            <div class="mt-1 shrink-0">
              <div class="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center transition-colors" [class.bg-primary]="optInNoContact" [class.border-primary]="optInNoContact">
                <mat-icon *ngIf="optInNoContact" class="text-white font-bold" style="font-size: 14px; width: 14px; height: 14px;">check</mat-icon>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-gray-800">Opt in for No-contact Delivery</h4>
              <p class="text-sm text-gray-500 mt-1 leading-relaxed">
                Unwell, or avoiding contact? Please select no-contact delivery. Partner will safely place the order outside your door (not for COD)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
        <div class="lg:col-span-1">
          <app-ui-card class="sticky top-24" [padding]="true">
            <h2 class="text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
            
            <!-- Coupon Section -->
            <div class="flex gap-2 mb-6">
              <input type="text" placeholder="Enter coupon code" class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm uppercase">
              <app-ui-button variant="outline">Apply</app-ui-button>
            </div>

            <!-- Bill Details -->
            <div class="space-y-3 text-sm text-gray-600 mb-6">
              <div class="flex justify-between">
                <span>Item Total</span>
                <span class="font-medium text-secondary">₹{{cartService.cartSummary().subtotal | number:'1.2-2'}}</span>
              </div>
              <div class="flex justify-between text-green-600" *ngIf="cartService.cartSummary().discount > 0">
                <span>Item Discount</span>
                <span class="font-medium">-₹{{cartService.cartSummary().discount | number:'1.2-2'}}</span>
              </div>
              <div class="flex justify-between">
                <span>Taxes (5%)</span>
                <span class="font-medium text-secondary">₹{{cartService.cartSummary().taxes | number:'1.2-2'}}</span>
              </div>
              <div class="flex justify-between">
                <span>Delivery Charge</span>
                <span class="font-medium text-secondary">₹{{cartService.cartSummary().deliveryCharge | number:'1.2-2'}}</span>
              </div>
              <div class="flex justify-between pb-3 border-b border-gray-100">
                <span>Packaging Charge</span>
                <span class="font-medium text-secondary">₹{{cartService.cartSummary().packageCharge | number:'1.2-2'}}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-secondary pt-2">
                <span>To Pay</span>
                <span>₹{{cartService.cartSummary().total | number:'1.2-2'}}</span>
              </div>
            </div>

            <!-- Savings Banner -->
            <div *ngIf="cartService.cartSummary().savedAmount > 0" class="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-center gap-2 mb-6 shadow-sm">
              <span class="text-green-700 font-extrabold text-sm uppercase tracking-wide">You saved ₹{{cartService.cartSummary().savedAmount | number:'1.0-0'}} on this order! 🎉</span>
            </div>

            <app-ui-button variant="primary" [fullWidth]="true" routerLink="/checkout">Proceed to Checkout</app-ui-button>
          </app-ui-card>
        </div>
      </div>

      <!-- Empty Cart -->
      <ng-template #emptyCart>
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <mat-icon style="font-size: 120px; width: 120px; height: 120px;" class="text-gray-300">remove_shopping_cart</mat-icon>
          </div>
          <h2 class="text-2xl font-bold text-secondary mb-2">Your cart is empty</h2>
          <p class="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our top restaurants and dishes!</p>
          <app-ui-button variant="primary" routerLink="/products">Browse Menu</app-ui-button>
        </div>
      </ng-template>
    </div>
  `
})
export class Cart {
  cartService = inject(CartService);
  discountService = inject(DiscountService);
  optInNoContact = false;

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }
}
