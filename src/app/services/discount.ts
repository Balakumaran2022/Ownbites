import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coupon } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private http = inject(HttpClient);

  getDiscounts(outletId: string): Observable<Coupon[]> {
    return this.http.post<{success: boolean, data: Coupon[]}>(`${environment.apiUrl}/discount/get-user-discounts`, {
      outletId: outletId
    }).pipe(map(res => res.data));
  }
}
