import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { CustomerService } from './services/customer';
import { AddressService } from './services/address';
import { LoginModalComponent } from './shared/components/login-modal/login-modal';
import { AddressSelectionModalComponent } from './shared/components/address-selection-modal/address-selection-modal';
import { AddAddressMapComponent } from './shared/components/add-address-map/add-address-map';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent';
import { OrderService } from './services/order';
import { OrderTypeModalComponent } from './shared/components/order-type-modal/order-type-modal';
import { OutletService } from './services/outlet';
import { OutletSelectionModalComponent } from './shared/components/outlet-selection-modal/outlet-selection-modal';
import { CartService } from './services/cart';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink,
    MatIconModule,
    Header, 
    Footer, 
    LoginModalComponent, 
    AddressSelectionModalComponent, 
    AddAddressMapComponent, 
    CookieConsentComponent, 
    OrderTypeModalComponent,
    OutletSelectionModalComponent
  ],
  template: `
    <!-- 
      Main Layout with Router Outlet 
      We keep this in the DOM always so Angular Router works correctly,
      but we visually hide it until the user completes the flow.
    -->
    <div 
      class="h-auto min-h-screen flex flex-col bg-background" 
      [style.display]="(!customerService.currentUser() || !orderService.orderType() || (orderService.orderType() === 'Door Delivery' && !addressService.currentAddress()) || (orderService.orderType() !== 'Door Delivery' && !outletService.selectedOutlet()) || isClosedGateActive()) ? 'none' : 'flex'"
      [class.blur-sm]="showAddressModal() || showMap() || showOutletModal()" 
      [class.pointer-events-none]="showAddressModal() || showMap() || showOutletModal()">
      
      <app-header 
        (changeAddress)="orderService.orderType() === 'Door Delivery' ? showAddressModal.set(true) : showOutletModal.set(true)" 
        (changeOrderType)="showOrderTypeModal.set(true)">
      </app-header>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      <app-footer 
        (changeAddress)="orderService.orderType() === 'Door Delivery' ? showAddressModal.set(true) : showOutletModal.set(true)" 
        (changeOrderType)="showOrderTypeModal.set(true)">
      </app-footer>
    </div>

    <!-- Gate 1: Not Logged In -->
    <ng-container *ngIf="!customerService.currentUser()">
      <div class="fixed inset-0 bg-white z-40"></div>
      <app-login-modal></app-login-modal>
    </ng-container>

    <!-- Gate 2: Logged In, No Order Type Selected -->
    <ng-container *ngIf="customerService.currentUser() && !orderService.orderType()">
      <div class="fixed inset-0 bg-[#FAF9F6] bg-gradient-to-br from-[#FAF9F6] to-orange-50 z-40"></div>
      <app-order-type-modal 
        (typeSelected)="$event">
      </app-order-type-modal>
    </ng-container>

    <!-- Gate 3a: Logged In, Order Type = Door Delivery, No Address Selected -->
    <ng-container *ngIf="customerService.currentUser() && orderService.orderType() === 'Door Delivery' && !addressService.currentAddress()">
      <div class="fixed inset-0 bg-[#FAF9F6] bg-gradient-to-br from-[#FAF9F6] to-orange-50 z-40"></div>
      <app-address-selection-modal 
        *ngIf="!showMap()" 
        (openMap)="showMap.set(true)">
      </app-address-selection-modal>
      <app-add-address-map 
        *ngIf="showMap()" 
        (close)="showMap.set(false)">
      </app-add-address-map>
    </ng-container>

    <!-- Gate 3b: Logged In, Order Type = Pickup/Takeaway, No Outlet Selected -->
    <ng-container *ngIf="customerService.currentUser() && (orderService.orderType() === 'Pickup' || orderService.orderType() === 'Takeaway') && !outletService.selectedOutlet()">
      <div class="fixed inset-0 bg-[#FAF9F6] bg-gradient-to-br from-[#FAF9F6] to-orange-50 z-40"></div>
      <app-outlet-selection-modal 
        [allowClose]="false">
      </app-outlet-selection-modal>
    </ng-container>

    <!-- Gate 4: Store Closed Gate (Styled in Orange Theme) -->
    <ng-container *ngIf="isClosedGateActive()">
      <div class="fixed inset-0 bg-[#FAF9F6] bg-gradient-to-br from-[#FAF9F6] to-orange-50/50 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-[2.5rem] w-full max-w-[450px] overflow-hidden shadow-2xl relative p-8 border border-white flex flex-col items-center text-center animate-fade-in-up">
          
          <!-- Circle Clock Icon -->
          <div class="relative mb-6 group">
            <div class="absolute inset-0 bg-orange-400 blur-xl opacity-40 rounded-full"></div>
            <div class="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 relative z-10 border border-orange-300/30">
              <mat-icon class="text-white text-3xl" style="font-size:36px; width:36px; height:36px;">access_time</mat-icon>
            </div>
          </div>

          <!-- Titles -->
          <h2 class="text-3xl font-black text-gray-900 mb-2 tracking-tight">We're Currently Closed</h2>
          <p class="text-gray-500 font-medium text-sm leading-relaxed mb-6">Sorry, our store is closed right now. We'll be back soon!</p>

          <!-- Opens at Badge -->
          <div class="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/60 rounded-xl px-5 py-2.5 text-orange-700 font-bold text-sm mb-2 shadow-sm">
            <mat-icon style="font-size:16px; width:16px; height:16px;" class="text-orange-500">alarm</mat-icon>
            <span>Opens at 9:00 AM</span>
          </div>

          <!-- Store Hours -->
          <span class="text-xs text-gray-400 font-semibold mb-8">Store hours: 9:00 AM — 9:30 PM</span>

          <!-- Actions -->
          <div class="w-full space-y-3.5">
            <!-- Remind button -->
            <button (click)="remindMe()" 
                    class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
              <mat-icon style="font-size:18px; width:18px; height:18px;">notifications_active</mat-icon>
              <span>Remind me when open</span>
            </button>
            
            <!-- Change Outlet (for Pickup/Takeaway) -->
            <button *ngIf="orderService.orderType() !== 'Door Delivery'"
                    (click)="changeOutlet()" 
                    class="w-full border-2 border-orange-200 hover:border-orange-500 text-orange-600 hover:text-orange-700 font-bold py-3.5 rounded-xl transition-all duration-300 bg-white">
              Change Outlet
            </button>

            <!-- Change Address (for Delivery) -->
            <button *ngIf="orderService.orderType() === 'Door Delivery'"
                    (click)="changeAddress()" 
                    class="w-full bg-orange-50/70 hover:bg-orange-100/80 text-orange-700 font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
              <mat-icon style="font-size:18px; width:18px; height:18px;" class="text-orange-500">location_on</mat-icon>
              <span>Change Address</span>
            </button>
          </div>

          <!-- Footer brand name + selected outlet -->
          <div class="mt-8 flex items-center gap-2 justify-center border-t border-gray-100 pt-5 w-full">
            <div class="w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center overflow-hidden">
              <span class="text-white font-black text-xs">OB</span>
            </div>
            <span class="text-gray-900 font-bold text-sm">OwnBites</span>
            <span class="text-gray-300">•</span>
            <span class="text-gray-500 text-sm font-semibold">{{ getActiveOutletName() }}</span>
          </div>

        </div>
      </div>
    </ng-container>

    <!-- User-Initiated Overlays (e.g. from Header) -->
    <ng-container *ngIf="customerService.currentUser()">
      
      <!-- Explicit Order Type Change -->
      <ng-container *ngIf="showOrderTypeModal() && orderService.orderType()">
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40"></div>
        <app-order-type-modal 
          (typeSelected)="showOrderTypeModal.set(false)">
        </app-order-type-modal>
      </ng-container>

      <!-- Explicit Address Change -->
      <ng-container *ngIf="showAddressModal() && addressService.currentAddress()">
        <app-address-selection-modal 
          (close)="showAddressModal.set(false)"
          (openMap)="showAddressModal.set(false); showMap.set(true)">
        </app-address-selection-modal>
      </ng-container>

      <app-add-address-map 
        *ngIf="showMap() && addressService.currentAddress()" 
        (close)="showMap.set(false)">
      </app-add-address-map>

      <!-- Explicit Outlet Change -->
      <ng-container *ngIf="showOutletModal() && outletService.selectedOutlet()">
        <app-outlet-selection-modal 
          [allowClose]="true"
          (close)="showOutletModal.set(false)">
        </app-outlet-selection-modal>
      </ng-container>

    </ng-container>

    <!-- Global Floating Elements -->
    <app-cookie-consent></app-cookie-consent>

    <!-- Sticky View Cart Banner — sits above cookie consent when both visible -->
    <div *ngIf="cartService.cartItems().length > 0 && !router.url.includes('/cart') && !router.url.includes('/checkout')"
         class="fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md animate-fade-in-up"
         style="bottom:88px; z-index:60;">
      <div class="bg-gradient-to-r from-primary to-orange-600 rounded-2xl shadow-luxury-hover p-4 px-6 flex items-center justify-between cursor-pointer hover:-translate-y-1 transition-all" routerLink="/cart">
        <div class="flex items-center gap-2 text-white">
          <span class="font-extrabold text-lg tracking-tight">{{cartService.cartItems().length}} {{cartService.cartItems().length === 1 ? 'item' : 'items'}} added</span>
        </div>
        <div class="flex items-center gap-2 text-white font-extrabold tracking-widest text-sm uppercase">
          VIEW CART
          <mat-icon style="width: 20px; height: 20px; font-size: 20px;">local_mall</mat-icon>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  customerService = inject(CustomerService);
  addressService = inject(AddressService);
  orderService = inject(OrderService);
  outletService = inject(OutletService);
  cartService = inject(CartService);
  router = inject(Router);
  showMap = signal<boolean>(false);
  showAddressModal = signal<boolean>(false);
  showOrderTypeModal = signal<boolean>(false);
  showOutletModal = signal<boolean>(false);

  ngOnInit() {
    // Clear order history for the user (run once on load)
    if (!localStorage.getItem('ownbites_orders_clear_time')) {
      localStorage.setItem('ownbites_orders_clear_time', Date.now().toString());
      localStorage.removeItem('ownbites_recent_orders');
    }
  }

  isClosedGateActive(): boolean {
    const user = this.customerService.currentUser();
    const type = this.orderService.orderType();
    if (!user || !type) return false;
    
    const hasAddress = this.addressService.currentAddress();
    const hasOutlet = this.outletService.selectedOutlet();
    
    if (type === 'Door Delivery' && !hasAddress) return false;
    if (type !== 'Door Delivery' && !hasOutlet) return false;
    
    // If they are currently editing location or outlet, hide closed gate so they see the modals
    if (this.showAddressModal() || this.showOutletModal() || this.showMap()) {
      return false;
    }
    
    return !this.checkIfStoreIsOpen();
  }

  checkIfStoreIsOpen(): boolean {
    // Time check: strictly 9:00 AM to 9:30 PM (21:30)
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    const openMinutes = 9 * 60; // 9:00 AM
    const closeMinutes = 21 * 60 + 30; // 9:30 PM
    
    const isWithinHours = totalMinutes >= openMinutes && totalMinutes <= closeMinutes;
    if (!isWithinHours) return false;
    
    // Backend outlet check
    const outlet = this.outletService.selectedOutlet();
    if (outlet) {
      return outlet.storeStatus === true;
    }
    
    return true;
  }

  remindMe() {
    alert('We will send you a WhatsApp notification when the store opens at 9:00 AM!');
  }

  changeOutlet() {
    this.showOutletModal.set(true);
  }

  changeAddress() {
    this.showAddressModal.set(true);
  }

  getActiveOutletName(): string {
    const outlet = this.outletService.selectedOutlet();
    return outlet ? outlet.name : 'Safina';
  }
}
