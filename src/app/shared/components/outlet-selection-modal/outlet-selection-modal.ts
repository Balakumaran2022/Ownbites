import { Component, EventEmitter, Output, inject, OnInit, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OutletService } from '../../../services/outlet';
import { Outlet } from '../../../models';

@Component({
  selector: 'app-outlet-selection-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[2rem] w-full max-w-[600px] overflow-hidden shadow-2xl animate-fade-in-up relative flex flex-col max-h-[85vh]">
        
        <!-- Header -->
        <div class="p-6 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 class="text-xl font-bold text-gray-900">Select a Store for Pickup</h2>
          <button *ngIf="allowClose" (click)="close.emit()" class="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar">
          <!-- Loading State -->
          <div *ngIf="loading()" class="flex flex-col items-center justify-center py-12">
            <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-500 font-medium">Finding nearby stores...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error() && !loading()" class="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <mat-icon class="text-4xl text-red-400 mb-2">error_outline</mat-icon>
            <h3 class="font-bold text-red-800 text-lg mb-1">Connection Issue</h3>
            <p class="text-red-600 text-sm mb-4">{{error()}}</p>
            <button (click)="fetchOutlets()" class="bg-white text-red-600 font-bold px-6 py-2 rounded-lg shadow-sm hover:shadow transition-shadow">Try Again</button>
          </div>

          <!-- Outlets List -->
          <div *ngIf="!loading() && !error() && outlets().length > 0" class="space-y-4">
            <div *ngFor="let outlet of outlets()" 
                 (click)="selectOutlet(outlet)"
                 class="bg-white border-2 border-gray-100 rounded-2xl p-5 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all shadow-sm group relative">
              
              <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <mat-icon style="font-size: 16px; width: 16px; height: 16px;">check</mat-icon>
                </div>
              </div>

              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-full bg-orange-50 text-primary flex items-center justify-center shrink-0">
                  <mat-icon>storefront</mat-icon>
                </div>
                <div>
                  <h3 class="font-bold text-secondary text-lg leading-tight">{{outlet.name}}</h3>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="w-2 h-2 rounded-full" [ngClass]="outlet.storeStatus ? 'bg-green-500' : 'bg-red-500'"></span>
                    <span class="text-xs font-bold uppercase tracking-wide" [ngClass]="outlet.storeStatus ? 'text-green-600' : 'text-red-600'">{{outlet.storeStatus ? 'Open Now' : 'Currently Closed'}}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-start gap-2 text-sm">
                  <mat-icon style="font-size: 16px; width: 16px; height: 16px;" class="text-gray-400 mt-0.5 shrink-0">location_on</mat-icon>
                  <span class="text-gray-600 leading-snug">{{outlet.address}}</span>
                </div>
                <div class="flex items-center gap-2 text-sm" *ngIf="outlet.contact">
                  <mat-icon style="font-size: 16px; width: 16px; height: 16px;" class="text-gray-400 shrink-0">phone</mat-icon>
                  <span class="text-gray-600 font-medium">+{{outlet.contact}}</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading() && !error() && outlets().length === 0" class="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
            <mat-icon class="text-5xl text-gray-300 mb-3">store_mall_directory</mat-icon>
            <h3 class="font-bold text-secondary">No stores available</h3>
            <p class="text-gray-500 text-sm mt-1">We couldn't find any active outlets right now.</p>
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
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #E5E7EB;
      border-radius: 20px;
    }
  `]
})
export class OutletSelectionModalComponent implements OnInit {
  @Input() allowClose = true;
  @Output() close = new EventEmitter<void>();
  
  outletService = inject(OutletService);
  
  outlets = signal<Outlet[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit() {
    this.fetchOutlets();
  }

  fetchOutlets() {
    this.loading.set(true);
    this.error.set('');
    
    this.outletService.getOutlets().subscribe({
      next: (res) => {
        this.outlets.set(res || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch outlets:', err);
        this.error.set('Unable to connect to the server to fetch outlets.');
        this.loading.set(false);
      }
    });
  }

  selectOutlet(outlet: Outlet) {
    this.outletService.setSelectedOutlet(outlet);
    this.close.emit();
  }
}
