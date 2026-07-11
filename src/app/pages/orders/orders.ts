import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order';
import { UiCard } from '../../shared/components/ui-card/ui-card';
import { Order } from '../../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatIconModule, UiCard, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-secondary">My Orders</h1>
      </div>
      
      <div *ngIf="loading()" class="flex justify-center py-12">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <ng-container *ngIf="!loading()">
        <div *ngIf="orders() && orders().length > 0; else noOrders" class="space-y-6">
          <app-ui-card *ngFor="let order of orders()" [padding]="true">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-4 mb-4">
              <div>
                <div class="text-sm font-extrabold text-secondary mb-1">{{order.outletDetails?.outletName || order.outlet?.name || 'OwnBites Store'}}</div>
                <div class="text-xs text-gray-500 font-medium">Order ID: #{{order._id || order.id || 'N/A'}}</div>
                <div class="text-xs text-gray-500 mt-1">{{(order.createdAt || order.date) | date:'medium'}}</div>
              </div>
              <div class="mt-2 sm:mt-0">
                <span class="px-3 py-1 rounded-full text-sm font-bold shadow-sm" [ngClass]="{
                  'bg-yellow-100 text-yellow-800': order.status === 'Pending',
                  'bg-blue-100 text-blue-800': order.status === 'Preparing',
                  'bg-orange-100 text-primary': order.status === 'Ready',
                  'bg-green-100 text-green-800': order.status === 'Delivered',
                  'bg-red-100 text-red-800': order.status === 'Cancelled'
                }">{{order.status}}</span>
              </div>
            </div>
            
            <div class="space-y-3">
              <div *ngFor="let item of order.items || order.orderDetails" class="flex items-center gap-3 text-sm">
                <span class="font-bold text-gray-600">{{item.quantity || 1}}x</span>
                <span class="text-secondary font-medium flex-1">{{item.product?.name || item.productName || 'Unknown Item'}}</span>
                <span class="text-gray-500">₹{{(item.product?.price || item.price || 0) * (item.quantity || 1)}}</span>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span class="text-gray-500 text-sm font-medium">Total Paid ({{order.paymentMode || order.paymentType || 'COD'}})</span>
              <span class="font-extrabold text-lg text-secondary">₹{{(order.summary?.total || order.totalAmount || 0) | number:'1.2-2'}}</span>
            </div>
          </app-ui-card>
        </div>

        <ng-template #noOrders>
          <div class="text-center py-12">
            <mat-icon style="font-size: 60px; width: 60px; height: 60px;" class="text-gray-300 mb-4 drop-shadow-sm">receipt_long</mat-icon>
            <h2 class="text-2xl font-extrabold text-secondary tracking-tight mb-2">No Orders Yet</h2>
            <p class="text-gray-500 font-medium mb-8">Looks like you haven't placed any orders with us.</p>
            <a routerLink="/" class="bg-gradient-to-r from-primary to-orange-600 text-white font-extrabold py-3.5 px-10 rounded-full shadow-luxury transition-all hover:-translate-y-1 hover:shadow-luxury-hover inline-block uppercase tracking-widest text-sm">
              Start Ordering
            </a>
          </div>
        </ng-template>
      </ng-container>
    </div>
  `
})
export class Orders implements OnInit {
  orderService = inject(OrderService);
  orders = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders.set(res || []);
        this.loading.set(false);
      },
      error: () => {
        this.orders.set([]);
        this.loading.set(false);
      }
    });
  }
}
