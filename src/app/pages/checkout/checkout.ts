import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { AddressService } from '../../services/address';
import { HttpClient } from '@angular/common/http';
import { UiButton } from '../../shared/components/ui-button/ui-button';
import { UiCard } from '../../shared/components/ui-card/ui-card';
import { PaymentMode, Order } from '../../models';
import { CustomerService } from '../../services/customer';
import { OutletService } from '../../services/outlet';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, UiButton, UiCard],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
      <h1 class="text-3xl font-bold text-secondary mb-8">Checkout</h1>
      
      <div class="flex flex-col gap-6">
        <!-- Delivery Address -->
        <app-ui-card *ngIf="orderService.orderType() === 'Door Delivery'" [padding]="true" class="block">
          <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
            <h2 class="text-xl font-bold text-secondary flex items-center gap-2"><mat-icon class="text-primary">home</mat-icon> Delivery Address</h2>
          </div>
          <div class="flex items-start gap-3" *ngIf="addressService.currentAddress(); else noAddress">
            <mat-icon class="text-gray-400 mt-1">location_on</mat-icon>
            <div>
              <h3 class="font-bold text-secondary">{{ addressService.currentAddress()?.type }}</h3>
              <p class="text-gray-500 text-sm mt-1">{{ addressService.currentAddress()?.street }}, {{ addressService.currentAddress()?.city }}<br>{{ addressService.currentAddress()?.state }} {{ addressService.currentAddress()?.zip }}</p>
            </div>
          </div>
          <ng-template #noAddress>
            <div class="text-red-500 text-sm font-medium">Please select a delivery address from the top bar before placing an order.</div>
          </ng-template>
        </app-ui-card>

        <!-- Pickup Schedule (Only for Pickup) -->
        <app-ui-card *ngIf="orderService.orderType() === 'Pickup'" [padding]="true" class="block">
          <h2 class="text-xl font-bold text-secondary mb-4 border-b border-gray-100 pb-4 flex items-center gap-2">
            <mat-icon class="text-primary">schedule</mat-icon> Pickup Timing
          </h2>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Select Time</label>
            <input type="time" [(ngModel)]="pickupTime" class="w-full sm:w-auto p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-secondary font-medium">
            <p class="text-xs text-gray-500">Please choose when you'd like to pick up your order.</p>
          </div>
        </app-ui-card>

        <!-- Payment Mode -->
        <app-ui-card [padding]="true" class="block">
          <h2 class="text-xl font-bold text-secondary mb-4 border-b border-gray-100 pb-4 flex items-center gap-2"><mat-icon class="text-primary">payment</mat-icon> Payment Method</h2>
          
          <div class="space-y-3">
            <ng-container *ngIf="paymentMethods().length > 0; else loadingPayments">
              <ng-container *ngFor="let pm of paymentMethods()">
                <label *ngIf="shouldShowPaymentMethod(pm)" class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all" [class.border-primary]="paymentMode === pm.id" [class.bg-orange-50]="paymentMode === pm.id">
                  <input type="radio" name="payment" [checked]="paymentMode === pm.id" (change)="paymentMode = pm.id" class="text-primary focus:ring-primary h-5 w-5">
                  <div class="flex-1">
                    <span class="font-medium text-secondary">{{pm.name}}</span>
                  </div>
                  <mat-icon class="text-gray-400">{{pm.icon || 'payment'}}</mat-icon>
                </label>
              </ng-container>
            </ng-container>
            <ng-template #loadingPayments>
              <div class="animate-pulse flex flex-col gap-3">
                <div class="h-12 bg-gray-100 rounded-lg w-full"></div>
                <div class="h-12 bg-gray-100 rounded-lg w-full"></div>
              </div>
            </ng-template>
          </div>
        </app-ui-card>

        <!-- Place Order -->
        <div class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <div class="text-sm text-gray-500">Total to pay</div>
            <div class="text-2xl font-bold text-secondary">₹{{cartService.cartSummary().total | number:'1.2-2'}}</div>
          </div>
          <app-ui-button variant="primary" class="px-8" (click)="placeOrder()">Place Order</app-ui-button>
        </div>
      </div>
    </div>
  `
})
export class Checkout implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  router = inject(Router);
  http = inject(HttpClient);
  customerService = inject(CustomerService);
  outletService = inject(OutletService);
  addressService = inject(AddressService);

  paymentMode: any = 'Online';
  paymentMethods = signal<{id: string, name: string, type: string, icon: string}[]>([]);
  pickupTime: string = '';

  ngOnInit() {
    this.fetchPaymentMethods();
    
    // Default to the next nearest 15-minute mark for pickup time
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
    this.pickupTime = now.toTimeString().substring(0, 5);
  }

  shouldShowPaymentMethod(pm: any): boolean {
    const type = this.orderService.orderType();
    // For Pickup and Takeaway, only show Online payments (no COD)
    if ((type === 'Pickup' || type === 'Takeaway') && pm.id === 'COD') {
      return false;
    }
    return true;
  }

  fetchPaymentMethods() {
    // Simulate fetching from backend to avoid 404 console errors since the endpoint doesn't exist yet
    of([
      { id: 'Online', name: 'Credit / Debit Card / UPI', type: 'Online', icon: 'credit_card' },
      { id: 'COD', name: 'Cash on Delivery', type: 'COD', icon: 'payments' }
    ]).pipe(delay(500)).subscribe(methods => {
      this.paymentMethods.set(methods);
      
      // Auto-select Online if COD is restricted
      const type = this.orderService.orderType();
      if (type === 'Pickup' || type === 'Takeaway') {
        this.paymentMode = 'Online';
      } else {
        this.paymentMode = methods[0].id;
      }
    });
  }

  setFallbackPaymentMethods() {
    this.paymentMethods.set([
      { id: 'Online', name: 'Credit / Debit Card / UPI', type: 'Online', icon: 'credit_card' },
      { id: 'COD', name: 'Cash on Delivery', type: 'COD', icon: 'payments' }
    ]);
    this.paymentMode = 'Online';
  }

  placeOrder() {
    const customer = this.customerService.currentUser();
    const outlet = this.outletService.selectedOutlet();
    
    let mappedDeliveryType = 'Door Delivery';
    const currentType = this.orderService.orderType();
    if (currentType === 'Pickup' || currentType === 'Takeaway' || currentType === 'Self Pickup' as any) {
      mappedDeliveryType = 'Self Pickup';
    }
    
    const mappedItems = this.cartService.cartItems().map(item => ({
      product: item.product?.id || (item.product as any)?._id || item.product,
      productId: item.product?.id || (item.product as any)?._id,
      itemId: item.product?.id || (item.product as any)?._id,
      quantity: item.quantity,
      price: item.product?.price,
      selectedAddons: item.selectedAddons || [],
      selectedVariation: item.selectedVariation || null
    }));

    if (mappedItems.length === 0) {
      alert('Your cart is empty! Please add some items to your cart before placing an order.');
      return;
    }

    let finalOutletId = outlet?.id || environment.outletId;
    if (finalOutletId.startsWith('mock_')) {
      finalOutletId = environment.outletId; // Ensure it's a valid MongoId
    }

    const payload = {
      customerPhoneNo: customer?.phone,
      customerName: customer?.name || 'Guest',
      outletId: finalOutletId,
      orderItems: mappedItems,
      orderDetails: mappedItems,
      cartItems: mappedItems,
      items: mappedItems, 
      summary: this.cartService.cartSummary(),
      totalAmount: this.cartService.cartSummary().total,
      addressId: this.addressService.currentAddress()?.id,
      address: { 
        address1: this.addressService.currentAddress()?.street || 'Store Pickup', 
        address2: 'Store Pickup', 
        city: this.addressService.currentAddress()?.city || 'Local', 
        state: this.addressService.currentAddress()?.state || 'Local', 
        country: 'India', 
        pincode: this.addressService.currentAddress()?.zip || '000000', 
        latitude: 0,
        longitude: 0
      },
      paymentMode: this.paymentMode,
      paymentType: this.paymentMode,
      deliveryType: mappedDeliveryType,
      status: 'Pending',
      date: new Date(),
      pickupTime: currentType === 'Pickup' ? this.pickupTime : undefined
    };
    
    console.log('Sending checkout payload:', payload);

    this.orderService.placeOrder(payload).subscribe({
      next: () => {
        this.cartService.clearCart();
        // Pass orderType to the success page to show token if it was Takeaway
        this.router.navigate(['/order-success'], { queryParams: { type: this.orderService.orderType() } });
      },
      error: (err) => {
        console.error('Order placement failed:', err);
        const errorMsg = err.error ? JSON.stringify(err.error) : err.message;
        alert('Backend Error Details:\\n' + errorMsg);
      }
    });
  }
}
