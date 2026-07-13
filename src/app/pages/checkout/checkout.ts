import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { AddressService } from '../../services/address';
import { HttpClient } from '@angular/common/http';
import { UiButton } from '../../shared/components/ui-button/ui-button';
import { UiCard } from '../../shared/components/ui-card/ui-card';
import { PaymentMode, Order } from '../../models';
import { CustomerService } from '../../services/customer';
import { OutletService } from '../../services/outlet';
import { WebSocketService } from '../../services/websocket';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, UiButton, UiCard],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
      <h1 class="text-3xl font-extrabold text-secondary mb-8">Checkout</h1>
      
      <div class="flex flex-col gap-6">
        <!-- Delivery Address -->
        <app-ui-card *ngIf="orderService.orderType() === 'Door Delivery'" [padding]="true" class="block">
          <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
            <h2 class="text-xl font-bold text-secondary flex items-center gap-2"><mat-icon class="text-primary">home</mat-icon> Delivery Address</h2>
          </div>
          <div class="flex items-start gap-3" *ngIf="addressService.currentAddress(); else noAddress">
            <mat-icon class="text-gray-400 mt-1">location_on</mat-icon>
            <div>
              <h3 class="font-bold text-secondary">{{ addressService.currentAddress()?.type }}</h3>
              <p class="text-gray-500 text-sm mt-1">{{ addressService.currentAddress()?.street }}, {{ addressService.currentAddress()?.city }}<br>{{ addressService.currentAddress()?.state }} {{ addressService.currentAddress()?.zip }}</p>
            </div>
          </div>
          <ng-template #noAddress>
            <div class="text-red-500 text-sm font-medium">Please select a delivery address from the top bar before placing an order.</div>
          </ng-template>
        </app-ui-card>



        <!-- Payment Mode -->
        <app-ui-card [padding]="true" class="block">
          <h2 class="text-xl font-bold text-secondary mb-4 border-b border-gray-100 pb-4 flex items-center gap-2"><mat-icon class="text-primary">payment</mat-icon> Payment Method</h2>
          
          <div class="space-y-3">
            <ng-container *ngIf="paymentMethods().length > 0; else loadingPayments">
              <ng-container *ngFor="let pm of paymentMethods()">
                <label *ngIf="shouldShowPaymentMethod(pm)" class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all" [class.border-primary]="paymentMode === pm.id" [class.bg-orange-50]="paymentMode === pm.id">
                  <input type="radio" name="payment" [checked]="paymentMode === pm.id" (change)="paymentMode = pm.id" class="text-primary focus:ring-primary h-5 w-5">
                  <div class="flex-1">
                    <span class="font-medium text-secondary">{{pm.name}}</span>
                  </div>
                  <mat-icon class="text-gray-400">{{pm.icon || 'payment'}}</mat-icon>
                </label>
              </ng-container>
            </ng-container>
            <ng-template #loadingPayments>
              <div class="animate-pulse flex flex-col gap-3">
                <div class="h-12 bg-gray-100 rounded-lg w-full"></div>
                <div class="h-12 bg-gray-100 rounded-lg w-full"></div>
              </div>
            </ng-template>
          </div>
        </app-ui-card>



        <!-- Bill Details Summary -->
        <app-ui-card [padding]="true" class="block">
          <h2 class="text-xl font-bold text-secondary mb-4 border-b border-gray-100 pb-4 flex items-center gap-2">
            <mat-icon class="text-[#f4811f]">receipt</mat-icon> Bill Details
          </h2>
          <div class="space-y-2.5 text-sm">
            <div class="flex items-center justify-between text-gray-600">
              <span>Item Subtotal</span>
              <span class="font-bold text-secondary">₹{{subtotal() | number:'1.2-2'}}</span>
            </div>
            <div class="flex items-center justify-between text-gray-600">
              <span>GST & Restaurant Charges (5%)</span>
              <span class="font-bold text-secondary">₹{{taxes() | number:'1.2-2'}}</span>
            </div>
            <div class="flex items-center justify-between text-gray-600" *ngIf="orderService.orderType() === 'Door Delivery'">
              <span>Delivery Partner Fee</span>
              <span class="font-bold text-secondary">₹{{deliveryCharge() | number:'1.2-2'}}</span>
            </div>
            <div class="flex flex-col text-green-600 font-extrabold" *ngIf="discountAmount() > 0">
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-1">
                  <mat-icon class="text-[18px] w-[18px] h-[18px]">local_offer</mat-icon>
                  <span>Coupon Discount ({{selectedCoupon()?.code}})</span>
                </span>
                <span>-₹{{discountAmount() | number:'1.2-2'}}</span>
              </div>
              <span class="text-[10px] text-green-600/85 font-extrabold ml-5.5 mt-0.5">*valid only 4 days</span>
            </div>
            <div class="h-px bg-gray-100 my-2"></div>
            <div class="flex items-center justify-between text-base font-black text-secondary">
              <span>Grand Total</span>
              <span class="text-[#f4811f]">₹{{totalToPay() | number:'1.2-2'}}</span>
            </div>
            <!-- Pickup Note -->
            <div class="mt-4 p-3 bg-orange-50 border border-orange-200/60 rounded-xl flex items-start gap-2 text-xs text-orange-800 font-bold" *ngIf="orderService.orderType() === 'Self Pickup'">
              <mat-icon class="text-orange-600 mt-0.5" style="font-size:16px; width:16px; height:16px;">info</mat-icon>
              <span>Note: This order is valid for pickup for 30 minutes from the time of order.</span>
            </div>
          </div>
        </app-ui-card>

        <!-- Place Order -->
        <div class="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <div class="text-sm text-gray-500">Total to pay</div>
            <div class="text-2xl font-bold text-[#f4811f]">₹{{totalToPay() | number:'1.2-2'}}</div>
          </div>
          <app-ui-button
            variant="primary"
            class="px-8"
            (click)="placeOrder()"
            [attr.disabled]="isPlacing() ? true : null"
          >
            <span *ngIf="!isPlacing()">Place Order</span>
            <span *ngIf="isPlacing()" class="flex items-center gap-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
              Placing...
            </span>
          </app-ui-button>
        </div>
      </div>
    </div>
  `
})
export class Checkout implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  router = inject(Router);
  http = inject(HttpClient);
  customerService = inject(CustomerService);
  outletService = inject(OutletService);
  addressService = inject(AddressService);
  webSocketService = inject(WebSocketService);

  paymentMode: any = 'Online';
  paymentMethods = signal<{id: string, name: string, type: string, icon: string}[]>([]);
  pickupTime: string = '';
  isPlacing = signal(false);
  
  // Custom Time Dropdown variables
  timeSlots: string[] = [];
  showTimeDropdown = signal(false);

  selectedCoupon = computed(() => this.cartService.selectedCoupon());
  discountAmount = computed(() => this.cartService.discountAmount());
  isFirstUser = signal<boolean>(false);
  
  // Scratch Card coupon state (manual apply)
  scratchCoupon = signal<{code:string;amount:number;expiry:number}|null>(null);
  private readonly SCRATCH_KEY = 'ownbites_scratch_coupon';

  // Computeds for dynamic bill summary
  subtotal = computed(() => this.cartService.cartSummary().subtotal);
  taxes = computed(() => this.cartService.cartSummary().taxes);
  deliveryCharge = computed(() => {
    return this.orderService.orderType() === 'Door Delivery' ? this.cartService.cartSummary().deliveryCharge : 0;
  });
  totalToPay = computed(() => {
    const val = this.subtotal() + this.taxes() + this.deliveryCharge() - this.discountAmount();
    return Math.max(0, val);
  });

  ngOnInit() {
    this.fetchPaymentMethods();
    this.checkUserOrderHistory();

    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
    this.pickupTime = now.toTimeString().substring(0, 5);
    
    // Generate Custom Time Slots dropdown data
    this.generateTimeSlots();

    // Check for scratch card coupon in localStorage (do NOT auto-apply)
    try {
      const raw = localStorage.getItem(this.SCRATCH_KEY);
      if (raw) {
        const sc = JSON.parse(raw);
        if (sc.revealed && sc.amount > 0 && sc.expiry > Date.now()) {
          this.scratchCoupon.set(sc);
        } else if (sc.expiry && sc.expiry <= Date.now()) {
          localStorage.removeItem(this.SCRATCH_KEY);
        }
      }
    } catch { /* ignore */ }
  }

  checkUserOrderHistory() {
    const customer = this.customerService.currentUser();
    if (!customer) {
      // Treat guest as first-time user
      this.isFirstUser.set(true);
      return;
    }

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        if (!orders || orders.length === 0) {
          this.isFirstUser.set(true);
        } else {
          this.isFirstUser.set(false);
        }
      },
      error: () => {
        // Fallback to first time user on backend error
        this.isFirstUser.set(true);
      }
    });
  }

  shouldShowPaymentMethod(pm: any): boolean {
    const type = this.orderService.orderType();
    if (type === 'Self Pickup' && pm.id === 'COD') {
      return false;
    }
    return true;
  }

  fetchPaymentMethods() {
    of([
      { id: 'Online', name: 'Credit / Debit Card / UPI', type: 'Online', icon: 'credit_card' },
      { id: 'COD', name: 'Cash on Delivery', type: 'COD', icon: 'payments' }
    ]).pipe(delay(500)).subscribe(methods => {
      this.paymentMethods.set(methods);
      const type = this.orderService.orderType();
      if (type === 'Self Pickup') {
        this.paymentMode = 'Online';
      } else {
        this.paymentMode = methods[0].id;
      }
    });
  }

  placeOrder() {
    if (this.isPlacing()) return; // prevent double submission
    const customer = this.customerService.currentUser();
    const outlet = this.outletService.selectedOutlet();
    
    let mappedDeliveryType = 'Door Delivery';
    const currentType = this.orderService.orderType();
    if (currentType === 'Self Pickup') {
      mappedDeliveryType = 'Self Pickup';
    }
    
    const mappedItems = this.cartService.cartItems().map(item => {
      const prodId = item.product?.id || (item.product as any)?._id || item.product;
      const addOnDetails = (item.selectedAddons || []).map((addon: any) => ({
        group_id: addon.groupId || addon.group_id || 'default_group',
        addon_item_ids: [addon.id || addon._id || addon]
      }));

      return {
        product: item.product,
        productId: prodId,
        price: item.product?.price,
        selectedAddons: item.selectedAddons || [],
        selectedVariation: item.selectedVariation || null,
        productName: item.product?.name,

        itemId: prodId,
        quantity: item.quantity,
        variationId: (item.selectedVariation as any)?.id || (item.selectedVariation as any)?._id || '',
        addOnDetails: addOnDetails,
        currency: 'INR'
      };
    });

    if (mappedItems.length === 0) {
      alert('Your cart is empty! Please add some items to your cart before placing an order.');
      return;
    }

    let finalOutletId = outlet?.id || environment.outletId;
    if (finalOutletId.startsWith('mock_')) {
      finalOutletId = environment.outletId;
    }

    const orderSummary = {
      subtotal: this.subtotal(),
      discount: this.discountAmount(),
      couponCode: this.selectedCoupon()?.code || '',
      taxes: this.taxes(),
      deliveryCharge: this.deliveryCharge(),
      total: this.totalToPay(),
      grandTotal: this.totalToPay()
    };

    const rawPhone = customer?.phone || '';
    const formattedPhone = (rawPhone.length === 10) ? `91${rawPhone}` : rawPhone;

    const payload: any = {
      belongsTo: environment.belongsTo,
      customerId: customer?.id || (customer as any)?._id,
      customerPhoneNo: formattedPhone,
      customerName: (() => { const n = customer?.name || ''; return (n && !/^\d{7,}$/.test(n.replace(/\s/g,''))) ? n : 'Guest'; })(),
      outletId: finalOutletId,
      orderItems: mappedItems,
      orderDetails: mappedItems,
      cartItems: mappedItems,
      items: mappedItems, 
      summary: orderSummary,
      totalAmount: this.totalToPay(),
      address: { 
        address1: this.addressService.currentAddress()?.street || 'Store Pickup', 
        address2: 'Store Pickup', 
        city: this.addressService.currentAddress()?.city || 'Local', 
        state: this.addressService.currentAddress()?.state || 'Local', 
        country: 'India', 
        pincode: this.addressService.currentAddress()?.zip || '000000', 
        latitude: 0,
        longitude: 0
      },
      paymentMode: this.paymentMode,
      paymentType: this.paymentMode,
      deliveryType: mappedDeliveryType,
      orderType: mappedDeliveryType,
      instruction: '',
      status: 'Pending',
      date: new Date(),
      pickupTime: currentType === 'Self Pickup' ? this.pickupTime : undefined
    };

    if (currentType === 'Door Delivery') {
      const aid = this.addressService.currentAddress()?.id;
      if (aid && /^[0-9a-fA-F]{24}$/.test(aid)) {
        payload.addressId = aid;
      }
    }

    // Populate root-level address fields to satisfy backend validators
    const currentAddress = this.addressService.currentAddress() as any;
    payload.address1 = currentAddress?.street || 'Store Pickup';
    payload.address2 = 'Store Pickup';
    payload.city = currentAddress?.city || 'Local';
    payload.state = currentAddress?.state || 'Local';
    payload.country = 'India';
    payload.pincode = currentAddress?.zip || '000000';
    payload.latitude = Number(currentAddress?.latitude || 0);
    payload.longitude = Number(currentAddress?.longitude || 0);
    
    console.log('Sending checkout payload:', { customerId: payload.customerId, items: mappedItems.length, total: payload.totalAmount });
    this.isPlacing.set(true);
    this.orderService.placeOrder(payload).subscribe({
      next: (res: any) => {
        this.isPlacing.set(false);
        // Clear coupon states in cart
        this.cartService.selectedCoupon.set(null);
        this.cartService.discountAmount.set(0);
        // Clear scratch coupon from storage only if it was actually applied to this order
        const appliedCouponCode = this.selectedCoupon()?.code;
        const storedSc = this.scratchCoupon();
        if (storedSc && appliedCouponCode === storedSc.code) {
          localStorage.removeItem(this.SCRATCH_KEY);
          this.scratchCoupon.set(null);
        }

        // Start order status socket cycle simulation
        const orderObj = res?.order || res?.data?.order || res;
        const orderId = orderObj?.orderId || orderObj?._id || orderObj?.id || 'sim_' + Date.now();
        this.webSocketService.startOrderStatusSimulation(orderId);

        this.cartService.clearCart();

        // ── Build receipt from FRONTEND computed values ──────────────────
        // The backend may store wrong item prices (DB mismatch).
        // We always use what the checkout page showed the user so there is NO mismatch.

        // Customer display: phone when name is Guest/missing
        const custName  = payload.customerName;
        const custPhone = payload.customerPhoneNo || '';
        const displayCustomer = (custName && custName !== 'Guest')
          ? custName
          : (custPhone ? `+${custPhone}` : 'Customer');

        // Item list: use cart items with FRONTEND unit price × quantity
        const frontendItems = this.cartService.cartItems().length
          ? this.cartService.cartItems().map((ci: any) => ({
              name:      ci.product?.name || ci.productName || 'Item',
              quantity:  ci.quantity || 1,
              unitPrice: +(ci.product?.price || ci.price || 0),
              price:     +(ci.product?.price || ci.price || 0) * (ci.quantity || 1)
            }))
          : (payload.cartItems || payload.items || []).map((it: any) => ({
              name:      it.name || it.productName || 'Item',
              quantity:  it.quantity || 1,
              unitPrice: +(it.price || 0),
              price:     +(it.price || 0) * (it.quantity || 1)
            }));

        // Monetary values from checkout computed signals (exact match with what user saw)
        const receiptData = {
          orderId:       orderObj?.orderId || orderObj?._id || orderId,
          internalId:    orderObj?._id || orderId,
          orderType:     this.orderService.orderType(),
          paymentMode:   payload.paymentMode,
          customerName:  displayCustomer,
          customerPhone: custPhone,
          address: payload.address1
            ? `${payload.address1}, ${payload.city}, ${payload.state} - ${payload.pincode}`
            : 'Store Pickup',
          items:         frontendItems,
          subtotal:      this.subtotal(),              // ← frontend signal
          discount:      this.discountAmount(),        // ← frontend signal
          couponCode:    this.selectedCoupon()?.code || payload.summary?.couponCode || '',
          taxes:         this.taxes(),                 // ← frontend signal
          deliveryCharge: this.deliveryCharge(),       // ← frontend signal
          total:         this.totalToPay(),            // ← frontend computed (matches checkout display)
          savedAmount:   +(orderObj?.savedAmount || 0),
          createdAt:     orderObj?.createdAt || new Date().toISOString(),
          tokenNumber:   this.orderService.orderType() === 'Self Pickup'
                           ? Math.floor(100 + Math.random() * 900) : null
        };
        localStorage.setItem('ownbites_last_order', JSON.stringify(receiptData));

        this.router.navigate(['/order-success'], { queryParams: { type: this.orderService.orderType() } });
      },
      error: (err) => {
        this.isPlacing.set(false);
        console.error('Order placement failed:', err);
        const errorMsg = err.error ? JSON.stringify(err.error) : err.message;
        alert('Order failed: ' + errorMsg);
      }
    });
  }

  generateTimeSlots() {
    const slots: string[] = [];
    const now = new Date();
    
    const start = new Date(now);
    const min = start.getMinutes();
    const remainder = min % 15;
    start.setMinutes(min + (15 - remainder));
    start.setSeconds(0);
    start.setMilliseconds(0);

    for (let i = 0; i < 16; i++) {
      const slotTime = new Date(start.getTime() + i * 15 * 60 * 1000);
      let hours = slotTime.getHours();
      const minutes = slotTime.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      slots.push(`${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`);
    }
    this.timeSlots = slots;
  }

  formatTime12h(time24: string): string {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    let hours = parseInt(h);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
  }

  selectSlot(slot12h: string) {
    const [time, ampm] = slot12h.split(' ');
    const [h, m] = time.split(':');
    let hours = parseInt(h);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    this.pickupTime = `${hours.toString().padStart(2, '0')}:${m}`;
    this.showTimeDropdown.set(false);
  }
}
