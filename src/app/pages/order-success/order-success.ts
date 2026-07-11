import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UiButton } from '../../shared/components/ui-button/ui-button';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, UiButton],
  template: `
    <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-10 sm:p-12 shadow-luxury text-center max-w-lg w-full animate-fade-in-up">
        
        <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50/50">
          <mat-icon class="text-green-500 !w-12 !h-12 text-[48px]">check_circle</mat-icon>
        </div>
        
        <h1 class="text-3xl font-extrabold text-secondary mb-4 tracking-tight">Order Successful!</h1>
        <p class="text-gray-500 mb-8 text-lg">Your delicious food is being prepared. We will notify you once it's ready.</p>

        <!-- Takeaway Token (Only for Takeaway) -->
        <div *ngIf="orderType === 'Takeaway'" class="mb-8 p-6 bg-orange-50 border border-orange-100 rounded-2xl animate-fade-in">
          <p class="text-sm text-primary font-bold uppercase tracking-widest mb-2">Your Takeaway Token</p>
          <div class="text-5xl font-black text-secondary tracking-tight">#{{tokenNumber}}</div>
          <p class="text-xs text-gray-500 mt-3 font-medium">Please show this token at the counter</p>
        </div>
        
        <div class="flex flex-col gap-4">
          <app-ui-button variant="primary" [fullWidth]="true" routerLink="/orders" class="block">Track Order</app-ui-button>
          <app-ui-button variant="outline" [fullWidth]="true" routerLink="/" class="block">Back to Home</app-ui-button>
        </div>
      </div>
    </div>
  `
})
export class OrderSuccess implements OnInit {
  private route = inject(ActivatedRoute);
  
  orderType: string | null = null;
  tokenNumber: number = 0;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.orderType = params['type'];
      if (this.orderType === 'Takeaway') {
        // Generate a random 3 digit token for display purposes
        this.tokenNumber = Math.floor(100 + Math.random() * 900);
      }
    });
  }
}
