import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OrderService, OrderType } from '../../../services/order';

@Component({
  selector: 'app-order-type-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[2rem] w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in-up relative flex flex-col max-h-[85vh]">
        
        <!-- Header -->
        <div class="p-6 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 class="text-xl font-bold text-gray-900">How would you like your order?</h2>
          <!-- We don't provide a close button because this is a mandatory step -->
        </div>

        <div class="p-6 space-y-4">
          <!-- Door Delivery -->
          <div 
            (click)="selectType('Door Delivery')"
            class="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <mat-icon>delivery_dining</mat-icon>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">Door Delivery</h3>
              <p class="text-sm text-gray-500">Get it delivered hot and fresh to your location.</p>
            </div>
          </div>

          <!-- Pickup -->
          <div 
            (click)="selectType('Pickup')"
            class="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <mat-icon>store_front</mat-icon>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">Pickup</h3>
              <p class="text-sm text-gray-500">Order ahead and pick it up yourself.</p>
            </div>
          </div>

          <!-- Takeaway -->
          <div 
            (click)="selectType('Takeaway')"
            class="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <mat-icon>shopping_bag</mat-icon>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-lg">Takeaway</h3>
              <p class="text-sm text-gray-500">Grab it in a sealed package to go.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class OrderTypeModalComponent {
  @Output() typeSelected = new EventEmitter<OrderType>();
  orderService = inject(OrderService);

  selectType(type: OrderType) {
    this.orderService.setOrderType(type);
    this.typeSelected.emit(type);
  }
}
