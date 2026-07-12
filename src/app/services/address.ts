import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Address, AddressType } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  
  currentAddress = signal<Address | null>(null);

  // Mock saved addresses for now
  savedAddresses = signal<Address[]>([
    {
      id: '1',
      type: 'Home',
      street: '72a, North St, Thanjai Salai, Vasan Nagar, Madappuram',
      city: 'Thiruvarur',
      state: 'Tamil Nadu',
      zip: '610001',
      isDefault: true
    },
    {
      id: '2',
      type: 'Office',
      street: 'Santhamangalam, KTR Nagar',
      city: 'Thiruvarur',
      state: 'Tamil Nadu',
      zip: '610001',
      isDefault: false
    },
    {
      id: '3',
      type: 'Other',
      street: 'Chennai Beach, Rajaji Rd, George Town',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zip: '600001',
      isDefault: false
    },
    {
      id: '4',
      type: 'Other',
      street: 'Nehru Stadium Gate 1, 37QC+Q2V, Periamet, Kannappar Thidal',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zip: '600003',
      isDefault: false
    }
  ]);

  constructor() {
  }

  selectAddress(address: Address) {
    this.currentAddress.set(address);
  }

  private mapBackendAddressToFrontend(raw: any): Address {
    if (!raw) {
      return {
        id: '',
        type: 'Other',
        street: '',
        city: '',
        state: '',
        zip: '',
        isDefault: false
      };
    }
    let type: AddressType = 'Other';
    const rawType = (raw.type || '').toLowerCase();
    if (rawType === 'home') {
      type = 'Home';
    } else if (rawType === 'office' || rawType === 'work') {
      type = 'Office';
    }
    
    return {
      id: raw._id || raw.id || '',
      type: type,
      street: raw.address || (raw.address1 ? `${raw.address1}, ${raw.address2 || ''}`.trim() : raw.street || ''),
      city: raw.city || '',
      state: raw.state || '',
      zip: raw.pincode || raw.zip || '',
      isDefault: raw.isDefault || false
    };
  }

  getAddresses(customerPhoneNo: string): Observable<Address[]> {
    return this.http.post<{status: string, data: any[]}>(`${environment.apiUrl}/customer/get-addresses`, {
      customerPhoneNo: customerPhoneNo
    }).pipe(
      map(res => {
        const rawList = res.data || [];
        return rawList.map(item => this.mapBackendAddressToFrontend(item));
      })
    );
  }

  createAddress(addressData: Partial<Address> & { latitude?: number; longitude?: number }): Observable<Address> {
    const backendPayload = {
      address1: addressData.street || '',
      address2: '',
      city: addressData.city || '',
      state: addressData.state || '',
      country: 'India',
      pincode: addressData.zip || '',
      latitude: addressData.latitude || 0,
      longitude: addressData.longitude || 0,
      landMark: '',
      type: addressData.type === 'Office' ? 'work' : addressData.type === 'Home' ? 'home' : 'other'
    };

    return this.http.post<{status: string, data: any}>(`${environment.apiUrl}/customer/create-address`, backendPayload)
      .pipe(map(res => this.mapBackendAddressToFrontend(res.data)));
  }
}
