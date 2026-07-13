import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  public currentUser = signal<User | null>(null);

  constructor() {
    // Force reset old sessions from backend2 to prevent "User no longer exists" on backend3
    if (!localStorage.getItem('ownbites_backend3_session_reset_v1')) {
      localStorage.removeItem('foodie_customer');
      localStorage.removeItem('foodie_token');
      localStorage.setItem('ownbites_backend3_session_reset_v1', 'true');
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

  login(phone: string): Observable<string> {
    const formattedPhone = phone.startsWith('91') && phone.length > 10 ? phone : `91${phone}`;
    return this.http.post<{status: string, message: string}>(`${environment.apiUrl}/customer/login`, {
      phone: formattedPhone,
      belongsTo: environment.belongsTo,
      mode: 'otp'
    }).pipe(map(res => res.message));
  }

  verifyOtp(phone: string, otp: string): Observable<{token: string, customer: User}> {
    const formattedPhone = phone.startsWith('91') && phone.length > 10 ? phone : `91${phone}`;
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
  }
}
