import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-orange-50/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity">
      <!-- Modal Container -->
      <div class="bg-gradient-to-br from-white to-orange-50/50 rounded-[2.5rem] w-full max-w-[420px] overflow-hidden shadow-2xl shadow-orange-900/10 animate-fade-in-up relative p-10 border border-white/60">
        
        <div class="flex flex-col items-center">
          <!-- Logo -->
          <div class="relative mb-6 group">
            <div class="absolute inset-0 bg-orange-400 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 rounded-full"></div>
            <div class="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 overflow-hidden relative z-10 border border-orange-300/50 transform group-hover:scale-105 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
            </div>
          </div>
          
          <h1 class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-extrabold text-2xl mb-1 tracking-tight">OwnBites</h1>
          <h2 class="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome Back!</h2>
          <p class="text-gray-500 mb-10 font-medium text-center">Enter your WhatsApp number to continue</p>
        </div>

        <!-- Step 1: Phone -->
        <div *ngIf="step() === 'phone'" class="space-y-5">
          <label class="block text-xs font-bold text-gray-700 tracking-wider uppercase ml-1">WhatsApp Number</label>
          <div class="relative flex items-center bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm" [ngClass]="error() ? 'border-red-400 shadow-red-100' : 'border-gray-100 hover:border-orange-200 focus-within:border-orange-500 focus-within:shadow-orange-100 focus-within:shadow-md'">
            <div class="flex items-center px-4 py-4 bg-gray-50 text-gray-600 font-bold border-r border-gray-100">
              <span class="text-xs uppercase mr-1">IN</span> +91 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 ml-1 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <input 
              type="tel" 
              [(ngModel)]="phone" 
              placeholder="Enter number" 
              class="w-full bg-white pl-4 pr-4 py-4 outline-none text-gray-800 font-bold text-lg placeholder-gray-300"
              maxlength="10"
              (input)="error.set('')"
            />
          </div>
          
          <!-- Error Message -->
          <div *ngIf="error()" class="flex items-center gap-1.5 text-red-500 text-sm font-semibold mt-2 ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {{ error() }}
          </div>

          <button class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none" [disabled]="phone().length !== 10 || loading()" (click)="requestOtp()">
            <span class="text-lg tracking-wide">{{ loading() ? 'Sending...' : 'Get OTP' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <!-- Step 2: OTP -->
        <div *ngIf="step() === 'otp'" class="space-y-8 animate-fade-in">
          <label class="block text-xs font-bold text-gray-500 tracking-widest uppercase text-center mb-4">Enter 6-Digit OTP</label>
          <div class="flex justify-center gap-2 px-1">
            <input 
              *ngFor="let i of [0,1,2,3,4,5]; trackBy: trackByFn"
              type="text" 
              [(ngModel)]="otpValues[i]"
              maxlength="1"
              class="w-12 h-14 text-center text-2xl font-extrabold text-orange-600 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300 shadow-sm hover:border-orange-200"
              (input)="onOtpInput($event, i)"
              (keydown)="onOtpKeydown($event, i)"
              [id]="'otp-input-' + i"
            />
          </div>
          
          <button class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none" [disabled]="!isOtpValid() || loading()" (click)="verifyOtp()">
            <span class="text-lg tracking-wide">{{ loading() ? 'Verifying...' : 'Verify OTP' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 ml-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
          
          <div class="text-center mt-6">
            <button (click)="step.set('phone')" class="text-orange-500 text-sm font-bold hover:text-orange-600 hover:underline transition-colors">Change WhatsApp Number</button>
          </div>
          
          <!-- Error Message -->
          <div *ngIf="error()" class="flex items-center justify-center gap-1 text-red-500 text-sm font-medium mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {{ error() }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    .animate-shake {
      animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `]
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();
  
  customerService = inject(CustomerService);
  
  step = signal<'phone' | 'otp'>('phone');
  phone = signal('');
  otpValues = ['','','','','',''];
  loading = signal(false);
  error = signal('');

  trackByFn(index: number) {
    return index;
  }

  requestOtp() {
    if (this.phone().length !== 10) return;
    this.loading.set(true);
    this.error.set('');
    
    this.customerService.login(this.phone()).subscribe({
      next: () => {
        this.loading.set(false);
        this.step.set('otp');
        setTimeout(() => document.getElementById('otp-input-0')?.focus(), 100);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Failed to send OTP. Try again.');
      }
    });
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 5) {
      document.getElementById("otp-input-" + (index + 1))?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      document.getElementById("otp-input-" + (index - 1))?.focus();
    }
  }

  isOtpValid() {
    return this.otpValues.every(val => val.length === 1);
  }

  verifyOtp() {
    if (!this.isOtpValid()) return;
    this.loading.set(true);
    this.error.set('');
    
    const otp = this.otpValues.join('');
    this.customerService.verifyOtp(this.phone(), otp).subscribe({
      next: () => {
        this.loading.set(false);
        this.close.emit(); // Success, close modal
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Invalid OTP. Please try again.');
        this.otpValues = ['','','',''];
        setTimeout(() => document.getElementById('otp-input-0')?.focus(), 100);
      }
    });
  }
}
