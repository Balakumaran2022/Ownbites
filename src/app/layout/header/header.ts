import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart';
import { CustomerService } from '../../services/customer';
import { AddressService } from '../../services/address';
import { OrderService } from '../../services/order';
import { OutletService } from '../../services/outlet';
import { OrganizationService } from '../../services/organization';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatBadgeModule],
  template: `
    <header class="sticky top-0 z-50 glass bg-white/70 backdrop-blur-xl border-b border-gray-100/50 py-3 px-4 sm:px-6 lg:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
          <div class="w-10 h-10 rounded-xl overflow-hidden shadow-luxury hover:scale-105 transition-transform border border-gray-100 bg-white flex items-center justify-center">
            <img [src]="orgService.org().logoUrl" [alt]="orgService.org().name" class="w-full h-full object-contain p-0.5" />
          </div>
          <span class="text-xl font-bold tracking-tight text-secondary hidden sm:block">{{orgService.org().name}}</span>
        </div>

        <div class="flex items-center gap-4 hidden md:flex">
          <!-- Outlet Selector (Desktop) -->
          <div (click)="changeAddress.emit()" class="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition-colors border-r border-gray-200 pr-5">
            <mat-icon class="text-primary">location_on</mat-icon>
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-gray-500 uppercase">{{(orderService.orderType() === 'Pickup' || orderService.orderType() === 'Takeaway') ? 'Pickup from' : 'Deliver to'}}</span>
              <ng-container *ngIf="orderService.orderType() !== 'Pickup' && orderService.orderType() !== 'Takeaway'; else otherTypes">
                <span class="text-sm font-medium text-secondary truncate max-w-[150px]" *ngIf="addressService.currentAddress() as addr">{{addr.type}} - {{addr.street}}</span>
                <span class="text-sm font-medium text-secondary truncate max-w-[150px]" *ngIf="!addressService.currentAddress()">Select Address</span>
              </ng-container>
              <ng-template #otherTypes>
                <span class="text-sm font-medium text-secondary truncate max-w-[150px]" *ngIf="outletService.selectedOutlet() as out">{{out.name}}</span>
                <span class="text-sm font-medium text-gray-400 truncate max-w-[150px]" *ngIf="!outletService.selectedOutlet()">Select Store</span>
              </ng-template>
            </div>
            <mat-icon class="text-gray-400">expand_more</mat-icon>
          </div>

          <!-- Order Type Selector (Desktop) -->
          <div (click)="changeOrderType.emit()" class="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer transition-colors">
            <mat-icon class="text-primary">
              {{orderService.orderType() === 'Pickup' ? 'storefront' : (orderService.orderType() === 'Takeaway' ? 'takeout_dining' : 'list_alt')}}
            </mat-icon>
            <div class="flex flex-col">
              <span class="text-xs font-semibold text-gray-500 uppercase">Order Type</span>
              <span class="text-sm font-medium text-secondary truncate">{{orderService.orderType() || 'Select Type'}}</span>
            </div>
            <mat-icon class="text-gray-400">expand_more</mat-icon>
          </div>
        </div>

        <!-- Spacer for Layout -->
        <div class="hidden lg:block flex-1"></div>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a routerLink="/offers" class="hover:text-primary transition-colors flex items-center gap-1"><mat-icon class="text-sm">local_offer</mat-icon> Offers</a>
          <a routerLink="/orders" class="hover:text-primary transition-colors flex items-center gap-1"><mat-icon class="text-sm">receipt_long</mat-icon> Orders</a>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <!-- Cart -->
          <button routerLink="/cart" class="relative p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-colors flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <span *ngIf="cartService.cartItems().length > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4">{{cartService.cartItems().length}}</span>
          </button>
          
          <!-- Profile -->
          <button routerLink="/profile" class="p-2 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-full transition-colors hidden sm:flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>

          <!-- Hamburger Menu (Mobile) -->
          <button class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <mat-icon>menu</mat-icon>
          </button>
        </div>
      </div>
    </header>
  `
})
export class Header {
  @Output() changeAddress = new EventEmitter<void>();
  @Output() changeOrderType = new EventEmitter<void>();
  
  cartService = inject(CartService);
  customerService = inject(CustomerService);
  addressService = inject(AddressService);
  orderService = inject(OrderService);
  outletService = inject(OutletService);
  orgService = inject(OrganizationService);
}
