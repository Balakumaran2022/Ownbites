import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UiCard } from '../../shared/components/ui-card/ui-card';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, MatIconModule, UiCard],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="text-center max-w-2xl mx-auto mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-primary mb-4 shadow-sm">
          <mat-icon style="font-size: 32px; width: 32px; height: 32px;">local_offer</mat-icon>
        </div>
        <h1 class="text-4xl font-extrabold text-secondary tracking-tight mb-4">Exclusive <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Offers</span></h1>
        <p class="text-lg text-gray-500 font-medium">Apply these exciting coupons at checkout and enjoy delicious savings on your favorite meals!</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Offer 1 -->
        <div class="relative bg-gradient-to-br from-orange-50 to-white rounded-3xl overflow-hidden shadow-luxury border border-orange-100/50 group hover:-translate-y-2 transition-all duration-300 hover:shadow-luxury-hover flex flex-col h-full z-10">
          <div class="absolute top-0 right-0 w-32 h-32 bg-orange-200/40 blur-3xl rounded-full -z-10"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 blur-2xl rounded-full -z-10"></div>
          
          <div class="p-8 flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <span class="bg-green-100 text-green-700 text-xs font-extrabold px-3 py-1 uppercase tracking-widest rounded-full">Valid Now</span>
              <mat-icon class="text-orange-200 text-4xl opacity-50 drop-shadow-sm">card_giftcard</mat-icon>
            </div>
            
            <div class="mb-6 flex-1">
              <h2 class="text-4xl font-black text-secondary tracking-tight mb-2">₹80 OFF</h2>
              <p class="text-gray-500 font-medium text-lg leading-relaxed">Enjoy a flat ₹80 discount when you place an order of ₹300 or more.</p>
            </div>
          </div>
        </div>

        <!-- Offer 2 -->
        <div class="relative bg-gradient-to-br from-red-50 to-white rounded-3xl overflow-hidden shadow-luxury border border-red-100/50 group hover:-translate-y-2 transition-all duration-300 hover:shadow-luxury-hover flex flex-col h-full z-10">
          <div class="absolute top-0 right-0 w-32 h-32 bg-red-200/40 blur-3xl rounded-full -z-10"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-red-400/10 blur-2xl rounded-full -z-10"></div>
          
          <div class="p-8 flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <span class="bg-red-100 text-red-700 text-xs font-extrabold px-3 py-1 uppercase tracking-widest rounded-full">Trending</span>
              <mat-icon class="text-red-200 text-4xl opacity-50 drop-shadow-sm">stars</mat-icon>
            </div>
            
            <div class="mb-6 flex-1">
              <h2 class="text-4xl font-black text-secondary tracking-tight mb-2">₹100 OFF</h2>
              <p class="text-gray-500 font-medium text-lg leading-relaxed">Get a fantastic ₹100 discount on all orders exceeding ₹500.</p>
            </div>
          </div>
        </div>

        <!-- Offer 3 -->
        <div class="relative bg-gradient-to-br from-yellow-50 to-white rounded-3xl overflow-hidden shadow-luxury border border-yellow-100/50 group hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl flex flex-col h-full z-10">
          <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-300/30 blur-3xl rounded-full -z-10"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-yellow-500/10 blur-2xl rounded-full -z-10"></div>
          
          <div class="p-8 flex-1 flex flex-col relative z-10">
            <!-- Glow Effect -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full"></div>
            
            <div class="flex items-center justify-between mb-6 relative">
              <span class="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-xs font-extrabold px-3 py-1 uppercase tracking-widest rounded-full">Premium</span>
              <mat-icon class="text-yellow-400 text-4xl drop-shadow-md">workspace_premium</mat-icon>
            </div>
            
            <div class="mb-6 flex-1 relative">
              <h2 class="text-4xl font-black text-secondary tracking-tight mb-2 drop-shadow-sm">₹200 OFF</h2>
              <p class="text-gray-500 font-medium text-lg leading-relaxed">Instant ₹200 savings! Treat yourself to a grand feast for orders above ₹1500.</p>
            </div>
          </div>
        </div>

        <!-- Offer 4 -->
        <div class="relative bg-gradient-to-br from-blue-50 to-white rounded-3xl overflow-hidden shadow-luxury border border-blue-100/50 group hover:-translate-y-2 transition-all duration-300 hover:shadow-luxury-hover flex flex-col h-full z-10">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-200/40 blur-3xl rounded-full -z-10"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full -z-10"></div>
          
          <div class="p-8 flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <span class="bg-blue-100 text-blue-700 text-xs font-extrabold px-3 py-1 uppercase tracking-widest rounded-full">New User</span>
              <mat-icon class="text-blue-200 text-4xl opacity-50 drop-shadow-sm">celebration</mat-icon>
            </div>
            
            <div class="mb-6 flex-1">
              <h2 class="text-4xl font-black text-secondary tracking-tight mb-2">50% OFF</h2>
              <p class="text-gray-500 font-medium text-lg leading-relaxed">Enjoy 50% off up to ₹150 on your very first order with us!</p>
            </div>
          </div>
        </div>

      </div>
      
      <!-- Back to Home Button -->
      <div class="mt-16 text-center">
        <a routerLink="/" class="bg-gradient-to-r from-primary to-orange-600 text-white font-extrabold py-4 px-12 rounded-full shadow-luxury transition-all hover:-translate-y-1 hover:shadow-luxury-hover inline-flex items-center gap-2 uppercase tracking-widest text-sm">
          <mat-icon>arrow_back</mat-icon>
          Back to Home
        </a>
      </div>
    </div>
  `
})
export class Offers {
}
