import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show()" class="fixed bottom-0 left-0 right-0 z-[999] p-4 sm:p-6 animate-fade-in-up pointer-events-none">
      <div class="max-w-[1200px] mx-auto bg-[#0F172A] border border-gray-800 rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col xl:flex-row items-start xl:items-center gap-6 pointer-events-auto">
        
        <!-- Left Side: Icon & Text -->
        <div class="flex-1 flex items-start gap-4">
          <div class="min-w-[48px] h-12 bg-[#1E293B] rounded-xl flex items-center justify-center border border-gray-700/50 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <h3 class="text-white font-bold text-lg mb-1 tracking-tight">We Value Your Privacy</h3>
            <p class="text-gray-400 text-sm leading-relaxed max-w-4xl mb-3">
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic,
              and personalize content. By clicking "Accept All", you consent to our use of cookies. You can
              customize your preferences by clicking "Manage Preferences".
            </p>
            <a href="#" class="text-orange-500 text-sm font-semibold hover:text-orange-400 hover:underline transition-colors flex items-center gap-1 w-max">
              Learn more about our cookie policy
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Right Side: Buttons -->
        <div class="flex flex-wrap items-center justify-end gap-3 w-full xl:w-auto mt-2 xl:mt-0">
          <button (click)="accept()" class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-gray-700 bg-transparent hover:bg-gray-800 text-gray-300 text-sm font-bold transition-colors">Manage Preferences</button>
          <button (click)="accept()" class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-gray-700 bg-transparent hover:bg-gray-800 text-gray-300 text-sm font-bold transition-colors">Reject All</button>
          <button (click)="accept()" class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5">Accept All</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class CookieConsentComponent implements OnInit {
  show = signal(false);

  ngOnInit() {
    const consent = localStorage.getItem('ownbites_cookie_consent');
    if (!consent) {
      setTimeout(() => this.show.set(true), 500);
    }
  }

  accept() {
    localStorage.setItem('ownbites_cookie_consent', 'true');
    this.show.set(false);
  }
}
