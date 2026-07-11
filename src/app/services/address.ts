import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Address } from '../models';
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

  getAddresses(customerPhoneNo: string): Observable<Address[]> {
    return this.http.post<{success: boolean, data: Address[]}>(`${environment.apiUrl}/customer/get-addresses`, {
      customerPhoneNo: customerPhoneNo
    }).pipe(map(res => res.data));
  }

  createAddress(addressData: Partial<Address>): Observable<Address> {
    return this.http.post<{success: boolean, data: Address}>(`${environment.apiUrl}/customer/create-address`, addressData)
      .pipe(map(res => res.data));
  }
}
