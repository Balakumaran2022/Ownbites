import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Order } from '../models';
import { environment } from '../../environments/environment';
import { CustomerService } from './customer';

export type OrderType = 'Door Delivery' | 'Pickup' | 'Takeaway';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private customerService = inject(CustomerService);
  
  orderType = signal<OrderType | null>(null);

  constructor() {
  }

  setOrderType(type: OrderType) {
    this.orderType.set(type);
  }

  createOrder(payload: any): Observable<Order> {
    return this.http.post<{success: boolean, data: Order}>(`${environment.apiUrl}/cart/create`, payload)
      .pipe(map(res => res.data));
  }

  placeOrder(payload: any): Observable<Order> {
    return this.createOrder(payload);
  }

  getOrders(): Observable<any[]> {
    const customer = this.customerService.currentUser();
    const payload = customer ? { customerId: customer.id } : {};
    
    console.log('Fetching orders with POST request...');
    return this.http.post<{success: boolean, data: any}>(`${environment.apiUrl}/order/get-all-order-by-customer?page=1&limit=20`, payload)
      .pipe(map(res => {
        if (res.data && res.data.orders) {
          return res.data.orders;
        }
        return res.data || [];
      }));
  }
}
