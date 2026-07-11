import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Outlet } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OutletService {
  private http = inject(HttpClient);
  public selectedOutlet = signal<Outlet | null>(null);

  constructor() {
  }

  setSelectedOutlet(outlet: Outlet) {
    this.selectedOutlet.set(outlet);
  }

  getOutlets(): Observable<Outlet[]> {
    return this.http.post<{status: string, data: any}>(`${environment.apiUrl}/organization/outlets/get-all`, {
      belongsTo: environment.belongsTo,
      lat: 10.777,
      lng: 79.634,
      locationSorting: true
    }).pipe(map(res => {
      const rawOutlets = (res.data && res.data.outlets) ? res.data.outlets : [];
      const mappedOutlets = rawOutlets.map((o: any) => {
        return {
          id: o._id,
          name: o.outletName || o.outletDetails?.outletName || '',
          storeStatus: o.storeStatus === true,
          latitude: Number(o.latitude || o.outletDetails?.latitude || 0),
          longitude: Number(o.longitude || o.outletDetails?.longitude || 0),
          address: o.address || o.outletDetails?.address || '',
          contact: o.outletDetails?.contact || '',
          distance: o.distance || 0
        };
      });

      // Add Thiruvarur Mock Outlets for testing
      mappedOutlets.push(
        {
          id: 'mock_tv_1',
          name: 'Thiruvarur Main Branch',
          storeStatus: true,
          latitude: 10.777,
          longitude: 79.634,
          address: '72a, North St, Thanjai Salai, Thiruvarur, Tamil Nadu 610001',
          contact: '919876543210',
          distance: 1.2
        },
        {
          id: 'mock_tv_2',
          name: 'KTR Nagar Express',
          storeStatus: true,
          latitude: 10.780,
          longitude: 79.640,
          address: 'Santhamangalam, KTR Nagar, Thiruvarur, Tamil Nadu 610001',
          contact: '919876543211',
          distance: 3.5
        }
      );

      return mappedOutlets;
    }));
  }

  getOutletStatus(outletId: string): Observable<{success: boolean, data: any}> {
    return this.http.post<{success: boolean, data: any}>(`${environment.apiUrl}/organization/get-store-status/${environment.belongsTo}`, {
      belongsTo: environment.belongsTo,
      outletId: outletId
    });
  }
}
