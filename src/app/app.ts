import { Component, inject, signal } from '@angular/core';
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
      class="min-h-screen flex-col bg-background" 
      [style.display]="(!customerService.currentUser() || !orderService.orderType() || (orderService.orderType() === 'Door Delivery' && !addressService.currentAddress()) || (orderService.orderType() !== 'Door Delivery' && !outletService.selectedOutlet())) ? 'none' : 'flex'"
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

    <!-- Sticky View Cart Banner -->
    <div *ngIf="cartService.cartItems().length > 0 && !router.url.includes('/cart') && !router.url.includes('/checkout')" 
         class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl z-40 animate-fade-in-up">
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
export class AppComponent {
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
}
