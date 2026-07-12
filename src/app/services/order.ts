import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

  /** Cached orders observable — reset by invalidateOrdersCache() after a new order is placed */
  private ordersCache$: Observable<any[]> | null = null;
  private readonly LOCAL_ORDERS_KEY = 'ownbites_recent_orders';

  constructor() {}

  setOrderType(type: OrderType) {
    this.orderType.set(type);
  }

  /** Save a placed order to localStorage so it shows in My Orders immediately */
  saveOrderLocally(order: any) {
    if (!order) return;
    const existing = this.getLocalOrders();
    const id = order._id || order.id || order.orderId;
    // Deduplicate — don't add if already saved
    if (id && existing.some((o: any) => (o._id || o.id || o.orderId) === id)) return;
    existing.unshift(order);
    try {
      localStorage.setItem(this.LOCAL_ORDERS_KEY, JSON.stringify(existing.slice(0, 20)));
    } catch { /* storage full, ignore */ }
  }

  /** Read locally-saved orders from localStorage */
  getLocalOrders(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.LOCAL_ORDERS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  createOrder(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/cart/create`, payload)
      .pipe(
        tap(res => console.log('[Order] cart/create raw response:', JSON.stringify(res))),
        map(res => res.data || res)
      );
  }

  placeOrder(payload: any): Observable<any> {
    this.ordersCache$ = null;
    return this.createOrder(payload).pipe(
      tap(res => {
        const orderObj = res?.order || res;
        if (orderObj) {
          // Attach address from payload so drawer can display it
          if (!orderObj.customerAddress && payload.address1) {
            const parts = [payload.address1, payload.city, payload.state, payload.pincode]
              .filter(Boolean);
            orderObj._displayAddress = parts.join(', ');
          }
          if (!orderObj.orderType && payload.orderType) {
            orderObj.orderType = payload.orderType;
          }
          this.saveOrderLocally(orderObj);
        }
      })
    );
  }

  /** Invalidate the local orders cache (call after placing a new order) */
  invalidateOrdersCache() {
    this.ordersCache$ = null;
  }

  /** Normalize backend status strings like "Order Pending" → "Pending" */
  normalizeStatus(status: string): string {
    if (!status) return 'Pending';
    return status
      .replace(/^Order /i, '')
      .replace(/^Cart /i, '');
  }

  getOrders(): Observable<any[]> {
    if (this.ordersCache$) {
      return this.ordersCache$;
    }

    const customer = this.customerService.currentUser();
    const rawPhone = customer?.phone || '';
    const formattedPhone = (rawPhone.length === 10) ? `91${rawPhone}` : rawPhone;

    const payload = {
      belongsTo: environment.belongsTo,
      customerId: customer?.id || (customer as any)?._id,
      customerPhoneNo: formattedPhone
    };

    const localOrders = this.getLocalOrders();

    this.ordersCache$ = this.http
      .post<any>(`${environment.apiUrl}/order/get-all-order-by-customer?page=1&limit=20`, payload)
      .pipe(
        tap(res => console.log('[Orders] get-all-order-by-customer raw response:', JSON.stringify(res))),
        map(res => {
          const dataObj = res?.data || res;
          let backendOrders: any[] = [];
          if (dataObj && Array.isArray(dataObj)) backendOrders = dataObj;
          else if (dataObj?.orders && Array.isArray(dataObj.orders)) backendOrders = dataObj.orders;
          else if (dataObj?.data && Array.isArray(dataObj.data)) backendOrders = dataObj.data;

          // Normalize statuses from backend (e.g. "Order Pending" → "Pending")
          backendOrders = backendOrders.map(o => ({
            ...o,
            status: this.normalizeStatus(o.status)
          }));

          // Merge: add locally-saved orders that aren't in backend response yet
          const backendIds = new Set(backendOrders.map((o: any) => o._id || o.id || o.orderId));
          const missingLocal = localOrders
            .filter((o: any) => {
              const id = o._id || o.id || o.orderId;
              return id && !backendIds.has(id);
            })
            .map((o: any) => ({ ...o, status: this.normalizeStatus(o.status) }));

          const allOrders = [...missingLocal, ...backendOrders];
          const clearTime = Number(localStorage.getItem('ownbites_orders_clear_time') || '0');
          return allOrders.filter(o => {
            const orderTime = new Date(o.createdAt || o.date || Date.now()).getTime();
            return orderTime > clearTime;
          });
        }),
        shareReplay(1)
      );

    return this.ordersCache$;
  }
}
