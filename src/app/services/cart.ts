import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  
  public cartItems = signal<CartItem[]>([]);
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  // Selected Coupon state
  public selectedCoupon = signal<any | null>(null);
  public discountAmount = signal<number>(0);

  private updateCartState(items: CartItem[]) {
    this.cartSubject.next(items);
    this.cartItems.set(items);
  }

  cartSummary() {
    const items = this.cartItems();
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discount = this.discountAmount();
    const taxableAmount = Math.max(0, subtotal - discount);
    const taxes = taxableAmount * 0.05;
    const deliveryCharge = 50;
    const itemSavings = items.reduce((sum, item) => {
      if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
        return sum + ((item.product.originalPrice - item.product.price) * item.quantity);
      }
      return sum;
    }, 0);
    return {
      subtotal,
      discount,
      taxes,
      deliveryCharge,
      packageCharge: 0,
      savedAmount: discount + itemSavings,
      total: Math.max(0, taxableAmount + taxes + deliveryCharge),
      grandTotal: Math.max(0, taxableAmount + taxes + deliveryCharge)
    };
  }

  clearCart() {
    this.updateCartState([]);
  }

  updateQuantity(productId: string, quantity: number) {
    let current = [...this.cartItems()];
    const item = current.find(i => i.product.id === productId);
    if(item) {
      const oldQty = item.quantity;
      if(quantity <= 0) {
        current = current.filter(i => i.product.id !== productId);
      } else {
        item.quantity = quantity;
      }
      
      // If quantity is reduced, reset coupon!
      if (quantity < oldQty && this.selectedCoupon() !== null) {
        console.log('[CartService] Item count reduced. Resetting coupon.');
        this.selectedCoupon.set(null);
        this.discountAmount.set(0);
      }
      
      this.updateCartState([...current]);
    }
  }

  getCart(customerPhoneNo: string, outletId: string): Observable<any> {
    return this.http.post<{success: boolean, data: any}>(`${environment.apiUrl}/cart/get-cart-details`, {
      customerPhoneNo: customerPhoneNo,
      outletId: outletId
    }).pipe(map(res => {
      this.updateCartState(res.data.items || []);
      return res.data;
    }));
  }

  addToCart(product: any) {
    const current = [...this.cartItems()];
    const existing = current.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      current.push({ product, quantity: 1 });
    }
    this.updateCartState([...current]);
  }

  updateCart(customerPhoneNo: string, outletId: string, items: CartItem[], deliveryType: string): Observable<any> {
    return this.http.post<{success: boolean, data: any}>(`${environment.apiUrl}/cart/update`, {
      customerPhoneNo: customerPhoneNo,
      outletId: outletId,
      items: items,
      deliveryType: deliveryType
    }).pipe(map(res => res.data));
  }
}
