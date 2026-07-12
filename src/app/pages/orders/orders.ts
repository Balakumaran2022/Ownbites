import { Component, inject, OnInit, signal, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/order';
import { WebSocketService } from '../../services/websocket';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    :host { font-family: 'Inter', sans-serif; }

    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes slideInLeft {
      from { transform:translateX(-100%); }
      to   { transform:translateX(0); }
    }
    @keyframes backdropIn {
      from { opacity:0; }
      to   { opacity:1; }
    }

    .order-card  { animation: fadeInUp 0.35s ease both; }
    .drawer      { animation: slideInLeft 0.28s cubic-bezier(0.22,1,0.36,1) both; }
    .backdrop    { animation: backdropIn 0.22s ease both; }
    
    @keyframes modalPop {
      from { transform: scale(0.9); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }
    .modal-card { animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

    /* dotted vertical timeline */
    .timeline-wrap { position: relative; padding-left: 28px; }
    .timeline-wrap::before {
      content: '';
      position: absolute;
      left: 9px; top: 24px; bottom: 24px;
      border-left: 1.5px dashed #d1d5db;
    }

    .dashed { border-top: 1px dashed #e5e7eb; }
    .solid  { border-top: 2px solid #111827; }

    /* Bill row */
    .bill-row { display:flex; justify-content:space-between; align-items:center; padding: 5px 0; font-size:13.5px; }
  `],
  template: `
<div class="min-h-screen" style="background:#f9f9f9; font-family:'Inter',sans-serif;">
  <div class="max-w-2xl mx-auto px-0 sm:px-4 py-0 sm:py-6">

    <!-- Page header -->
    <div style="background:#fff;" class="px-5 py-4 border-b border-gray-100 sm:rounded-2xl sm:mb-4 sm:border sm:shadow-sm flex items-center gap-3 mb-px">
      <mat-icon class="text-gray-800" style="font-size:20px;">receipt_long</mat-icon>
      <h1 style="font-size:18px; font-weight:900; color:#111827; letter-spacing:-0.3px;">Order History</h1>
    </div>

    <!-- Loader -->
    <div *ngIf="loading()" class="flex flex-col items-center py-24 gap-3">
      <div class="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style="border-color:#f97316; border-top-color:transparent;"></div>
      <p style="color:#9ca3af; font-size:13px;">Loading your orders…</p>
    </div>

    <ng-container *ngIf="!loading()">

      <!-- Order list -->
      <div *ngIf="orders().length > 0; else noOrders" class="space-y-0 sm:space-y-3">
        <div
          *ngFor="let order of orders(); let i = index"
          class="order-card"
          [style.animation-delay]="i*60+'ms'"
          style="background:#fff; border-bottom:1px solid #f3f4f6; overflow:hidden;"
          [style.border-radius]="'0'"
          [class.sm:rounded-2xl]="true"
        >
          <div style="padding:16px;">
            <div style="display:flex; gap:14px; align-items:flex-start;">

              <!-- Icon -->
              <div style="width:72px;height:72px;flex-shrink:0;border-radius:14px;
                background:linear-gradient(135deg,#f97316,#dc2626);
                display:flex;flex-direction:column;align-items:center;justify-content:center;
                box-shadow:0 4px 12px rgba(249,115,22,0.3);">
                <mat-icon style="color:#fff;font-size:28px;width:28px;height:28px;">restaurant</mat-icon>
                <span style="color:#fff;font-size:7px;font-weight:800;letter-spacing:1.5px;margin-top:3px;">OWNBITES</span>
              </div>

              <!-- Info -->
              <div style="flex:1;min-width:0;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                  <div>
                    <div style="font-weight:800;font-size:15px;color:#111827;line-height:1.3;">
                      {{getOutletName(order)}}
                    </div>
                    <div style="font-size:11px;color:#9ca3af;margin-top:2px;">{{getAddress(order)}}</div>
                    <div style="font-size:11px;color:#6b7280;margin-top:5px;">
                      <span style="font-weight:700;">ORDER #{{getOrderId(order)}}</span>
                      &nbsp;·&nbsp;
                      {{(order.createdAt||order.date)|date:'d MMM y, h:mm a'}}
                    </div>
                  </div>
                  <!-- Status -->
                  <div style="flex-shrink:0;text-align:right;">
                    <span *ngIf="getStatus(order)==='Delivered'"
                      style="display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:#16a34a;">
                      <span style="text-align:right;line-height:1.4;">Delivered<br>
                        {{(order.createdAt||order.date)|date:'d MMM, h:mm a'}}
                      </span>
                      <span style="width:22px;height:22px;background:#16a34a;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <mat-icon style="color:#fff;font-size:13px;width:13px;height:13px;">check</mat-icon>
                      </span>
                    </span>
                    <span *ngIf="getStatus(order)!=='Delivered'"
                      style="font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;display:inline-block;"
                      [style.background]="statusBg(order)"
                      [style.color]="statusColor(order)">
                      {{getStatus(order)|titlecase}}
                    </span>
                  </div>
                </div>

                <div style="display:flex;align-items:center;gap:16px;margin-top:10px;">
                  <button
                    (click)="openDetail(order)"
                    style="font-size:12px;font-weight:800;color:#f97316;
                      text-transform:uppercase;letter-spacing:0.8px;background:none;border:none;
                      cursor:pointer;padding:0;transition:color 0.15s;"
                    onmouseover="this.style.color='#ea580c'"
                    onmouseout="this.style.color='#f97316'">
                    VIEW DETAILS
                  </button>
                  <button *ngIf="hasReward(order)"
                    (click)="openRewardModal(order)"
                    style="font-size:12px;font-weight:850;color:#16a34a;
                      text-transform:uppercase;letter-spacing:0.8px;background:none;border:none;
                      cursor:pointer;padding:0;transition:color 0.15s;display:flex;align-items:center;gap:3.5px;"
                    onmouseover="this.style.color='#15803d'"
                    onmouseout="this.style.color='#16a34a'">
                    <mat-icon style="font-size:16px;width:16px;height:16px;">redeem</mat-icon>
                    VIEW REWARD
                  </button>
                </div>
              </div>
            </div>

            <!-- Item summary + total -->
            <div class="dashed" style="margin-top:14px;padding-top:12px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <span style="font-size:13px;color:#374151;font-weight:500;">{{getItemSummary(order)}}</span>
              <span style="font-size:13px;font-weight:800;color:#111827;white-space:nowrap;">
                Total Paid: ₹{{getTotal(order)|number:'1.2-2'}}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <ng-template #noOrders>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:96px 32px;background:#fff;border-radius:20px;text-align:center;">
          <mat-icon style="font-size:64px;width:64px;height:64px;color:#e5e7eb;margin-bottom:16px;">receipt_long</mat-icon>
          <h2 style="font-size:20px;font-weight:900;color:#111827;margin-bottom:8px;">No orders yet</h2>
          <p style="font-size:13px;color:#9ca3af;margin-bottom:28px;">Place your first order and it will appear here.</p>
          <a routerLink="/"
            style="background:#f97316;color:#fff;font-weight:800;padding:12px 36px;border-radius:12px;font-size:13px;text-decoration:none;letter-spacing:0.5px;">
            Order Now
          </a>
        </div>
      </ng-template>
    </ng-container>
  </div>
</div>


<!-- ═══════════════ LEFT DRAWER ═══════════════ -->
<ng-container *ngIf="selectedOrder()">

  <!-- Backdrop -->
  <div class="backdrop" (click)="closeDetail()"
    style="position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:40;"></div>

  <!-- Panel -->
  <div class="drawer"
    style="position:fixed;left:0;top:0;bottom:0;z-index:50;
      width:100%;max-width:420px;
      background:#fff;overflow-y:auto;
      box-shadow:8px 0 40px rgba(0,0,0,0.18);
      font-family:'Inter',sans-serif;">

    <!-- ── Sticky header ── -->
    <div style="position:sticky;top:0;z-index:10;background:#fff;
      border-bottom:1px solid #f3f4f6;padding:16px 20px;
      display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:15px;font-weight:900;color:#111827;letter-spacing:-0.2px;">
        Order #{{getOrderId(selectedOrder())}}
      </span>
      <button (click)="closeDetail()"
        style="width:34px;height:34px;border-radius:50%;border:none;background:#f3f4f6;cursor:pointer;
          display:flex;align-items:center;justify-content:center;transition:background 0.15s;"
        onmouseover="this.style.background='#e5e7eb'"
        onmouseout="this.style.background='#f3f4f6'">
        <mat-icon style="font-size:18px;width:18px;height:18px;color:#374151;">close</mat-icon>
      </button>
    </div>

    <div style="padding:20px;">

      <!-- ── Location timeline ── -->
      <div class="timeline-wrap" style="margin-bottom:20px;">

        <!-- Restaurant -->
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:18px;">
          <div style="width:20px;height:20px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
            margin-left:-10px;">
            <mat-icon style="font-size:18px;width:18px;height:18px;color:#4b5563;">location_on</mat-icon>
          </div>
          <div>
            <div style="font-weight:800;font-size:14px;color:#111827;">{{getOutletName(selectedOrder())}}</div>
            <div style="font-size:12px;color:#9ca3af;margin-top:2px;">{{getAddress(selectedOrder())}}</div>
          </div>
        </div>

        <!-- Delivery address -->
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:18px;">
          <div style="width:20px;height:20px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
            margin-left:-10px;">
            <mat-icon style="font-size:18px;width:18px;height:18px;color:#4b5563;">home</mat-icon>
          </div>
          <div>
            <div style="font-weight:800;font-size:14px;color:#111827;">
              {{selectedOrder()?.orderType || 'Delivery'}}
            </div>
            <div style="font-size:12px;color:#9ca3af;margin-top:2px;line-height:1.5;">
              {{selectedOrder()?.customerAddress || 'Address not available'}}
            </div>
          </div>
        </div>

        <!-- Status check -->
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:20px;height:20px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
            margin-left:-10px;">
            <mat-icon style="font-size:18px;width:18px;height:18px;color:#16a34a;">check_circle</mat-icon>
          </div>
          <div style="flex:1;display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <div style="font-size:12px;color:#374151;line-height:1.5;">
              {{getStatus(selectedOrder())|titlecase}} on<br>
              {{(selectedOrder()?.createdAt||selectedOrder()?.date)|date:'EEE, MMM d, y, h:mm a'}}
            </div>
            <span *ngIf="getStatus(selectedOrder())==='Delivered'"
              style="font-size:10px;font-weight:900;background:#7c3aed;color:#fff;
                padding:3px 8px;border-radius:4px;letter-spacing:0.5px;white-space:nowrap;">
              ON TIME
            </span>
          </div>
        </div>
      </div>

      <!-- separator -->
      <div class="dashed" style="margin-bottom:20px;"></div>

      <!-- ── Items ── -->
      <div style="margin-bottom:6px;">
        <div style="font-size:10px;font-weight:800;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:12px;">
          {{getItems(selectedOrder()).length}} ITEM{{getItems(selectedOrder()).length!==1?'S':''}}
        </div>
        <div *ngFor="let item of getItems(selectedOrder())"
          style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
          <span style="font-weight:800;font-size:14px;color:#111827;">
            {{getItemName(item)}} × {{item.quantity||1}}
          </span>
          <span style="font-weight:700;font-size:14px;color:#111827;">
            ₹{{getItemTotal(item)|number:'1.0-0'}}
          </span>
        </div>
        <div *ngIf="!getItems(selectedOrder()).length"
          style="font-size:12px;color:#9ca3af;font-style:italic;">No item details</div>
      </div>

      <div class="dashed" style="margin:16px 0;"></div>

      <!-- ── Bill breakdown ── -->
      <div>
        <!-- Item Total -->
        <div class="bill-row" style="font-weight:700;color:#111827;">
          <span>Item Total</span>
          <span>₹{{getItemsSubtotal(selectedOrder())|number:'1.2-2'}}</span>
        </div>

        <!-- Delivery -->
        <div class="bill-row" style="color:#4b5563;">
          <span>Delivery Fee</span>
          <span *ngIf="getDeliveryCharge(selectedOrder())>0">₹{{getDeliveryCharge(selectedOrder())|number:'1.2-2'}}</span>
          <span *ngIf="getDeliveryCharge(selectedOrder())===0"
            style="color:#16a34a;font-weight:600;">FREE</span>
        </div>

        <!-- Taxes -->
        <div class="bill-row" style="color:#4b5563;" *ngIf="getTax(selectedOrder())>0">
          <span>Taxes &amp; GST</span>
          <span>₹{{getTax(selectedOrder())|number:'1.2-2'}}</span>
        </div>

        <!-- Discount -->
        <div class="bill-row" style="color:#16a34a;font-weight:600;" *ngIf="getDiscount(selectedOrder())>0">
          <span>Discount Applied <span *ngIf="getCouponCode(selectedOrder())">({{getCouponCode(selectedOrder())}})</span></span>
          <span>-₹{{getDiscount(selectedOrder())|number:'1.2-2'}}</span>
        </div>

        <!-- Saved amount (if different from discount) -->
        <div class="bill-row" style="color:#16a34a;font-weight:600;" *ngIf="getSaved(selectedOrder())>0 && getSaved(selectedOrder())!==getDiscount(selectedOrder())">
          <span>Savings</span>
          <span>-₹{{getSaved(selectedOrder())|number:'1.2-2'}}</span>
        </div>
      </div>

      <!-- ── Bill total ── -->
      <div class="solid" style="margin-top:14px;padding-top:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:11px;color:#9ca3af;margin-bottom:2px;">
              Paid via {{selectedOrder()?.paymentMode||'COD'}}
            </div>
            <div style="font-size:15px;font-weight:900;color:#111827;letter-spacing:-0.2px;text-transform:uppercase;">
              Bill Total
            </div>
          </div>
          <div style="font-size:22px;font-weight:900;color:#111827;letter-spacing:-0.5px;">
            ₹{{getTotal(selectedOrder())|number:'1.2-2'}}
          </div>
        </div>
      </div>

      <!-- Earned Reward Coupon Info inside Details Drawer -->
      <div *ngIf="hasReward(selectedOrder())" 
        style="margin-top:20px; padding:14px; border-radius:16px; background:linear-gradient(135deg,#fef9c3,#fef3c7); border:1.5px dashed #d97706; text-align:center;">
        <div style="font-size:10px;font-weight:800;color:#92400e;display:flex;align-items:center;justify-content:center;gap:5px;letter-spacing:0.5px;">
          <mat-icon style="font-size:15px;width:15px;height:15px;">redeem</mat-icon>
          REWARD EARNED FROM THIS ORDER
        </div>
        <div style="font-size:18px;font-weight:900;color:#d97706;margin-top:6px;letter-spacing:2.5px;">
          {{ getScratchCouponCodeForOrder(selectedOrder()) }}
        </div>
        <div style="font-size:10.5px;color:#b45309;margin-top:4px;font-weight:600;">
          Use this code at checkout for ₹20.00 OFF
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════
         REWARD MODAL (Custom Scratch Card popup)
    ═══════════════════════════════ -->
    <div *ngIf="showRewardModal()"
      class="backdrop fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      
      <div class="modal-card w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl relative"
        style="max-width:350px;">
        
        <!-- Close button -->
        <button (click)="showRewardModal.set(false)"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all border-none cursor-pointer z-10">
          <mat-icon style="font-size:18px;width:18px;height:18px;">close</mat-icon>
        </button>

        <div style="background:linear-gradient(135deg,#1c1917,#292524); padding:24px 20px; text-align:center;">
          
          <!-- Scratchable card layout (unrevealed state) -->
          <div *ngIf="!scratchRevealed()">
            <div style="font-size:11px;font-weight:800;letter-spacing:2px;color:#a16207;margin-bottom:6px;">🎁 YOU EARNED A REWARD</div>
            <div style="font-size:13px;font-weight:700;color:#d4d4d4;margin-bottom:16px;">Scratch to reveal your next order coupon!</div>

            <!-- Scratch canvas container -->
            <div style="position:relative;width:100%;height:120px;border-radius:14px;overflow:hidden;margin-bottom:12px;"
              (mousedown)="startScratch($event)" (mousemove)="doScratch($event)" (mouseup)="stopScratch()"
              (touchstart)="startScratch($event)" (touchmove)="doScratch($event)" (touchend)="stopScratch()">

              <!-- Prize underneath -->
              <div style="position:absolute;inset:0;display:flex;flex-direction:column;
                align-items:center;justify-content:center;
                background:linear-gradient(135deg,#fef9c3,#fef3c7);">
                <div style="font-size:32px;font-weight:900;color:#d97706;letter-spacing:-1px;">₹20 OFF</div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin-top:5px;">Code: {{ scratchCoupon()?.code }}</div>
                <div style="font-size:9px;color:#b45309;margin-top:2px;">Valid for 7 days · Next order</div>
              </div>

              <!-- Canvas scratch layer -->
              <canvas #modalCanvas
                width="300" height="120"
                style="position:absolute;inset:0;width:100%;height:100%;border-radius:14px;cursor:crosshair;touch-action:none;"></canvas>
            </div>
            <div style="font-size:11px;color:#78716c;">✋ Scratch with finger or mouse to reveal</div>
          </div>

          <!-- Revealed State -->
          <div *ngIf="scratchRevealed()" class="animate-fade-in"
            style="background:linear-gradient(135deg,#fef9c3,#fef3c7); border-radius:14px; padding:20px 16px;">
            <div style="font-size:13px;font-weight:800;color:#92400e;margin-bottom:8px;">🎉 Congratulations!</div>
            <div style="font-size:32px;font-weight:900;color:#d97706;letter-spacing:-1px;margin-bottom:12px;">₹20 OFF</div>

            <!-- Code + Copy button -->
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px;">
              <div style="background:#d97706;color:#fff;font-weight:900;
                font-size:14px;letter-spacing:3px;padding:8px 16px;border-radius:10px;">{{ scratchCoupon()?.code }}</div>
              <button (click)="copyCoupon()"
                style="width:36px;height:36px;border-radius:10px;border:2px solid #d97706;
                  background:couponCopied() ? '#d97706' : '#fff';
                  color:couponCopied() ? '#fff' : '#d97706';
                  display:flex;align-items:center;justify-content:center;
                  cursor:pointer;transition:all .2s;flex-shrink:0;"
                [style.background]="couponCopied() ? '#d97706' : '#fff'"
                [style.color]="couponCopied() ? '#fff' : '#d97706'">
                <mat-icon style="font-size:16px;width:16px;height:16px;">
                  {{couponCopied() ? 'check' : 'content_copy'}}
                </mat-icon>
              </button>
            </div>
            <div *ngIf="couponCopied()" style="font-size:10px;color:#16a34a;font-weight:700;margin-bottom:6px;">✅ Copied!</div>

            <div style="font-size:11px;color:#92400e;font-weight:600;line-height:1.5;">
              Use this code at checkout for ₹20 off!<br>
              <span style="color:#b45309;font-size:10px;">Valid for 7 days</span>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</ng-container>
  `
})
export class Orders implements OnInit, OnDestroy {
  orderService  = inject(OrderService);
  webSocketService = inject(WebSocketService);

  orders       = signal<any[]>([]);
  loading      = signal(true);
  selectedOrder = signal<any>(null);
  private sub: Subscription | null = null;

  // Scratch card modal signals and properties
  @ViewChild('modalCanvas') modalCanvasRef!: ElementRef<HTMLCanvasElement>;
  showRewardModal = signal(false);
  activeRewardOrder = signal<any>(null);
  scratchCoupon = signal<any>(null);
  scratchRevealed = signal(false);
  couponCopied = signal(false);

  private scratchCtx: CanvasRenderingContext2D | null = null;
  private isScratching = false;
  private scratchInitDone = false;
  private readonly SCRATCH_KEY = 'ownbites_scratch_coupon';

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        const mapped = (res || []).map((o: any) => {
          const id = o._id || o.id || o.orderId;
          const saved = sessionStorage.getItem(`order_status_${id}`);
          return saved ? { ...o, status: saved } : o;
        });
        this.orders.set(mapped);
        this.loading.set(false);
      },
      error: () => {
        this.orders.set(this.orderService.getLocalOrders());
        this.loading.set(false);
      }
    });

    this.sub = this.webSocketService.orderUpdates$.subscribe(upd => {
      this.orders.update(list => list.map((o: any) =>
        (o._id || o.id || o.orderId) === upd.orderId ? { ...o, status: upd.status } : o
      ));
      if (this.selectedOrder()) {
        const sid = this.selectedOrder()._id || this.selectedOrder().orderId;
        if (sid === upd.orderId) this.selectedOrder.update(o => ({ ...o, status: upd.status }));
      }
    });
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  openDetail(o: any)  { this.selectedOrder.set(o); }
  closeDetail()        { this.selectedOrder.set(null); }

  // ── helpers ──────────────────────────────────────────
  getOrderId(o: any)    { return o?.orderId || o?._id || o?.id || ''; }
  getOutletName(o: any) { return o?.outletDetails?.outletName || o?.outlet?.name || 'OwnBites Store'; }
  getAddress(o: any)    { return o?.outletDetails?.address || o?.outlet?.address || ''; }
  getStatus(o: any)     { return this.orderService.normalizeStatus(o?.status || 'Pending'); }
  getItems(o: any)      { return o?.items || o?.orderDetails || o?.orderItems || []; }
  getItemName(i: any)   { return i.name || i.product?.name || i.productName || 'Item'; }

  getItemTotal(i: any): number {
    // Prefer item_price × qty (unit price from backend product lookup — usually correct)
    if (i.item_price != null && +i.item_price > 0) return +i.item_price * +(i.quantity || 1);
    // Fall back to price field (frontend-stored unit price)
    if (i.price != null && +i.price > 0) return +i.price * +(i.quantity || 1);
    // Last resort: backend itemTotal (may be wrong due to DB price mismatch)
    if (i.itemTotal != null && +i.itemTotal > 0) return +i.itemTotal;
    return 0;
  }

  getItemsSubtotal(o: any): number {
    const items = this.getItems(o);
    return items.length
      ? items.reduce((s: number, i: any) => s + this.getItemTotal(i), 0)
      : +(o?.orderTotal || o?.totalAmount || 0);
  }

  // Calculate dynamically from items to bypass wrong backend total fields
  getTotal(o: any): number {
    if (o?.total != null && +o.total > 0) return +o.total;
    const subtotal = this.getItemsSubtotal(o);
    const tax = this.getTax(o);
    const delivery = this.getDeliveryCharge(o);
    const discount = this.getDiscount(o);
    return Math.max(0, subtotal + tax + delivery - discount);
  }
  getDeliveryCharge(o: any) { return +(o?.deliveryCharge || o?.summary?.deliveryCharge || 0); }
  getTax(o: any)            { return +(o?.taxes || o?.totalTax || o?.summary?.taxes || 0); }
  getDiscount(o: any)       { return +(o?.discount || o?.cartDiscountDetails?.totalDiscount || o?.summary?.discount || 0); }
  getSaved(o: any)          { return +(o?.savedAmount || 0); }
  getCouponCode(o: any): string {
    return o?.couponCode || o?.cartDiscountDetails?.couponCode || o?.summary?.couponCode || '';
  }
  getScratchCouponCodeForOrder(o: any): string {
    try {
      const raw = localStorage.getItem(this.SCRATCH_KEY);
      if (raw) {
        const sc = JSON.parse(raw);
        const orderId = this.getOrderId(o);
        if (sc.orderId === orderId) {
          return sc.code;
        }
      }
    } catch { /* ignore */ }
    return '';
  }

  getItemSummary(o: any): string {
    const items = this.getItems(o);
    if (!items.length) return 'Order details';
    const main = items.slice(0, 2).map((i: any) => `${this.getItemName(i)} × ${i.quantity || 1}`).join(', ');
    return items.length > 2 ? `${main} +${items.length - 2} more` : main;
  }

  statusBg(o: any): string {
    const s = this.getStatus(o);
    if (s === 'Preparing') return '#eff6ff';
    if (s === 'Ready')     return '#fff7ed';
    if (s === 'Cancelled') return '#fef2f2';
    return '#fefce8'; // Pending
  }
  statusColor(o: any): string {
    const s = this.getStatus(o);
    if (s === 'Preparing') return '#1d4ed8';
    if (s === 'Ready')     return '#c2410c';
    if (s === 'Cancelled') return '#b91c1c';
    return '#92400e'; // Pending
  }

  // ── Reward modal methods ──────────────────────────────────────────
  hasReward(o: any): boolean {
    try {
      const raw = localStorage.getItem(this.SCRATCH_KEY);
      if (raw) {
        const sc = JSON.parse(raw);
        const orderId = this.getOrderId(o);
        return sc.orderId === orderId && sc.amount > 0;
      }
    } catch { /* ignore */ }
    return false;
  }

  openRewardModal(order: any) {
    this.activeRewardOrder.set(order);
    try {
      const raw = localStorage.getItem(this.SCRATCH_KEY);
      if (raw) {
        const sc = JSON.parse(raw);
        this.scratchCoupon.set(sc);
        this.scratchRevealed.set(sc.revealed);
        this.couponCopied.set(false);
        this.showRewardModal.set(true);
        this.scratchInitDone = false;
        
        if (!sc.revealed) {
          setTimeout(() => this.initModalCanvas(), 120);
        }
      }
    } catch { /* ignore */ }
  }

  private initModalCanvas() {
    if (this.scratchRevealed() || this.scratchInitDone) return;
    const canvas = this.modalCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.scratchCtx = ctx;
    this.scratchInitDone = true;

    // Draw gold cover
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0,   '#b45309');
    grad.addColorStop(0.3, '#d97706');
    grad.addColorStop(0.5, '#fbbf24');
    grad.addColorStop(0.7, '#d97706');
    grad.addColorStop(1,   '#b45309');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SCRATCH HERE ✦', canvas.width / 2, canvas.height / 2 + 4);
  }

  startScratch(e: MouseEvent | TouchEvent) {
    this.isScratching = true;
    this.eraseScratch(e);
  }
  doScratch(e: MouseEvent | TouchEvent) {
    if (!this.isScratching) return;
    this.eraseScratch(e);
  }
  stopScratch() {
    this.isScratching = false;
    this.checkReveal();
  }

  private eraseScratch(e: MouseEvent | TouchEvent) {
    const ctx = this.scratchCtx;
    const canvas = this.modalCanvasRef?.nativeElement;
    if (!ctx || !canvas) return;
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if (e instanceof MouseEvent) {
      clientX = e.clientX; clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top)  * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  private checkReveal() {
    const canvas = this.modalCanvasRef?.nativeElement;
    const ctx = this.scratchCtx;
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }
    const total = pixels.length / 4;
    const pct   = (transparent / total) * 100;

    if (pct >= 55) {
      this.reveal();
    }
  }

  private reveal() {
    if (this.scratchRevealed()) return;
    const ctx = this.scratchCtx;
    const canvas = this.modalCanvasRef?.nativeElement;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    try {
      const existing = localStorage.getItem(this.SCRATCH_KEY);
      if (existing) {
        const sc = JSON.parse(existing);
        sc.revealed = true;
        localStorage.setItem(this.SCRATCH_KEY, JSON.stringify(sc));
        this.scratchCoupon.set(sc);
      }
    } catch { /* ignore */ }

    setTimeout(() => this.scratchRevealed.set(true), 400);
  }

  copyCoupon() {
    const code = this.scratchCoupon()?.code || 'SCRATCH20';
    navigator.clipboard.writeText(code).then(() => {
      this.couponCopied.set(true);
      try {
        localStorage.setItem('ownbites_copied_coupon', code);
      } catch { /* ignore */ }
      setTimeout(() => this.couponCopied.set(false), 2000);
    });
  }
}
