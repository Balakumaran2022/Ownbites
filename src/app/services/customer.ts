import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models';
import { environment } from '../../environments/environment';

// ─── Demo / Test user configuration ──────────────────────────────────────────
// Phone: 9385452868 | OTP: 123456
// This user bypasses SMS and backend authentication entirely.
// Order placement is simulated locally — no real backend call is made.
const DEMO_PHONE    = '919385452868';
const DEMO_OTP      = '123456';
const DEMO_USER_KEY = 'ownbites_is_demo_user';

export const DEMO_USER: User = {
  id:    'demo_user_local',
  name:  'Safina',
  phone: '919385452868',
  email: 'demo@ownbites.com'
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  public currentUser = signal<User | null>(null);

  /** True when the logged-in user is the local demo account */
  get isDemoUser(): boolean {
    return localStorage.getItem(DEMO_USER_KEY) === 'true';
  }

  constructor() {
    // v2: Force-clear any stale/expired sessions (backend2 leftovers or expired backend3 tokens)
    if (!localStorage.getItem('ownbites_backend3_session_reset_v2')) {
      localStorage.removeItem('foodie_customer');
      localStorage.removeItem('foodie_token');
      localStorage.removeItem('ownbites_backend3_session_reset_v1');
      localStorage.setItem('ownbites_backend3_session_reset_v2', 'true');
    }

    // Load from local storage on boot
    const stored = localStorage.getItem('foodie_customer');
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('foodie_customer');
      }
    }
  }

  /** Call this when the backend returns 401 Session expired — forces re-login */
  forceLogout() {
    this.currentUser.set(null);
    localStorage.removeItem('foodie_customer');
    localStorage.removeItem('foodie_token');
    localStorage.removeItem(DEMO_USER_KEY);
    localStorage.removeItem('ownbites_backend3_session_reset_v2');
  }

  login(phone: string): Observable<string> {
    const formattedPhone = phone.startsWith('91') && phone.length > 10 ? phone : `91${phone}`;

    // Demo user: skip SMS entirely
    if (formattedPhone === DEMO_PHONE) {
      return of('OTP sent to your mobile number');
    }

    return this.http.post<{status: string, message: string}>(`${environment.apiUrl}/customer/login`, {
      phone: formattedPhone,
      belongsTo: environment.belongsTo,
      mode: 'otp'
    }).pipe(map(res => res.message));
  }

  verifyOtp(phone: string, otp: string): Observable<{token: string, customer: User}> {
    const formattedPhone = phone.startsWith('91') && phone.length > 10 ? phone : `91${phone}`;

    // Demo user: accept 123456 and log in locally without hitting the backend
    if (formattedPhone === DEMO_PHONE && otp === DEMO_OTP) {
      this.currentUser.set(DEMO_USER);
      localStorage.setItem('foodie_customer', JSON.stringify(DEMO_USER));
      localStorage.setItem(DEMO_USER_KEY, 'true');
      // No real token — demo user skips backend-authenticated routes
      localStorage.removeItem('foodie_token');
      return of({ token: '', customer: DEMO_USER });
    }

    return this.http.post<{status: string, data: any}>(`${environment.apiUrl}/customer/verify-otp`, {
      phone: formattedPhone,
      otp: otp,
      belongsTo: environment.belongsTo
    }).pipe(
      map(res => {
        if (res.status === 'success' && res.data) {
          const rawName = res.data.customer?.name || '';
          // Backend sometimes returns the phone number as name — detect and ignore it
          const isPhoneAsName = /^\d{7,}$/.test(rawName.replace(/\s/g, ''));
          const user: User = {
            id: res.data.customer?._id || '',
            name: (rawName && !isPhoneAsName) ? rawName : 'Guest',
            phone: res.data.customer?.phone || formattedPhone,
            email: res.data.customer?.email || ''
          };
          this.currentUser.set(user);
          localStorage.setItem('foodie_customer', JSON.stringify(user));
          localStorage.setItem('foodie_token', res.data.token);
          localStorage.removeItem(DEMO_USER_KEY);
          return { token: res.data.token, customer: user };
        }
        throw new Error('Invalid OTP');
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('foodie_customer');
    localStorage.removeItem('foodie_token');
    localStorage.removeItem(DEMO_USER_KEY);
  }
}
