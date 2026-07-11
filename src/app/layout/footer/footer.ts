import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <footer class="bg-gray-900 text-gray-300 border-t-4 border-primary mt-12">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <!-- Left Side: Logo & Copyright -->
        <div class="flex flex-col items-center md:items-start gap-2">
          <div class="flex items-center gap-2 cursor-pointer group">
            <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <mat-icon class="text-white">shopping_cart</mat-icon>
            </div>
            <span class="text-xl font-extrabold text-white tracking-tight">Own<span class="text-primary">Bites</span></span>
          </div>
          <span class="text-gray-500 text-sm font-medium">&copy; 2026 OwnBites Limited</span>
        </div>

        <!-- Right Side: Available Cities -->
        <div class="flex flex-col items-center md:items-end gap-1">
          <span class="text-gray-500 text-xs font-bold uppercase tracking-widest">Available in now only</span>
          <button (click)="changeAddress.emit()" class="text-gray-300 hover:text-primary transition-colors font-medium flex items-center gap-1 group">
            <mat-icon class="text-primary group-hover:scale-110 transition-transform">location_on</mat-icon>
            Chennai, Tiruvarur
            <mat-icon class="text-sm text-gray-500 group-hover:text-primary transition-colors">expand_more</mat-icon>
          </button>
        </div>
        
      </div>
    </footer>
    <div class="bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
      <span class="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left tracking-tight">For better experience, download the OwnBites app now</span>
      <div class="flex items-center gap-4">
        <!-- Apple App Store -->
        <a href="#" class="h-12 hover:opacity-80 transition-opacity cursor-pointer">
           <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" class="h-full">
        </a>
        <!-- Google Play -->
        <a href="#" class="h-12 hover:opacity-80 transition-opacity cursor-pointer">
           <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" class="h-full">
        </a>
      </div>
    </div>
  `
})
export class Footer {
  @Output() changeAddress = new EventEmitter<void>();
}
