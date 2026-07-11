import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer';
import { UiCard } from '../../shared/components/ui-card/ui-card';
import { UiButton } from '../../shared/components/ui-button/ui-button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, UiCard, UiButton],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
      <h1 class="text-3xl font-bold text-secondary mb-8">My Profile</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <div class="md:col-span-1 space-y-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-orange-100 to-orange-50 -z-10"></div>
            <div class="w-24 h-24 rounded-full bg-white shadow-sm border-4 border-white flex items-center justify-center mb-4 z-10 mt-2">
              <mat-icon class="text-5xl text-gray-400">account_circle</mat-icon>
            </div>
            <h2 class="font-bold text-secondary text-xl">{{customerService.currentUser()?.name || 'Guest User'}}</h2>
            <p class="text-gray-500 text-sm font-medium mt-1">+91 {{customerService.currentUser()?.phone || 'Not Available'}}</p>
          </div>
          
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <button (click)="activeTab.set('profile')" 
                    [ngClass]="activeTab() === 'profile' ? 'bg-orange-50 text-primary' : 'text-gray-600 hover:bg-gray-50'"
                    class="w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-colors">
              <mat-icon>person</mat-icon> Edit Profile
            </button>
            <button (click)="logout()" class="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors mt-2 border-t border-gray-100">
              <mat-icon>logout</mat-icon> Logout
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="md:col-span-2">
          
          <!-- Profile Tab -->
          <app-ui-card [padding]="true" *ngIf="activeTab() === 'profile'">
            <h2 class="text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Personal Information</h2>
            <form class="space-y-5" (submit)="$event.preventDefault(); saveProfile()">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input type="text" [value]="customerService.currentUser()?.name || ''" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-medium">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" [value]="customerService.currentUser()?.email || ''" placeholder="Enter your email" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none font-medium">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" [value]="'+91 ' + (customerService.currentUser()?.phone || '')" disabled class="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed outline-none font-medium opacity-70">
                <p class="text-xs text-gray-400 mt-2 flex items-center gap-1"><mat-icon style="font-size: 14px; width: 14px; height: 14px;">info</mat-icon> Phone number cannot be changed as it is used for login.</p>
              </div>
              <div class="pt-4">
                <button type="submit" class="bg-gradient-to-r from-primary to-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all w-full sm:w-auto">
                  Save Changes
                </button>
              </div>
            </form>
          </app-ui-card>

        </div>
      </div>
    </div>
    
    <!-- Success Toast -->
    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transition-all duration-300 z-50"
         [class.translate-y-24]="!showToast()" [class.opacity-0]="!showToast()">
      <mat-icon class="text-green-400">check_circle</mat-icon>
      Profile saved successfully!
    </div>
  `
})
export class Profile {
  customerService = inject(CustomerService);
  router = inject(Router);

  activeTab = signal<'profile'>('profile');
  showToast = signal(false);

  saveProfile() {
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 2500);
  }

  logout() {
    this.customerService.logout();
    this.router.navigate(['/']);
  }
}
