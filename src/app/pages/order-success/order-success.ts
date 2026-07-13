import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UiButton } from '../../shared/components/ui-button/ui-button';
import { OrganizationService } from '../../services/organization';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, UiButton],
  styles: [`
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }
    @keyframes scratchReveal {
      0%   { opacity:0; transform:scale(.8) rotate(-3deg); }
      60%  { transform:scale(1.08) rotate(1deg); }
      100% { opacity:1; transform:scale(1) rotate(0deg); }
    }
    @keyframes cardIn {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .scratch-card-wrap { animation: cardIn .6s ease 3.5s both; }
    .shimmer-gold {
      background: linear-gradient(110deg, #d97706 0%, #fbbf24 30%, #fef3c7 50%, #fbbf24 70%, #d97706 100%);
      background-size: 200% 100%;
      animation: shimmer 2.4s linear infinite;
    }
    .reveal-pop { animation: scratchReveal .5s cubic-bezier(.17,.89,.32,1.28) both; }
    
    /* ── animations ── */
    @keyframes receiptUnroll {
      0%   { max-height:0; clip-path:inset(0 0 100% 0); opacity:0; }
      100% { max-height:2400px; clip-path:inset(0 0 0% 0); opacity:1; }
    }
    @keyframes printerGlow {
      0%,100% { box-shadow:0 0 0 4px #3f3f46, 0 0 24px rgba(249,115,22,.25); }
      50%      { box-shadow:0 0 0 4px #3f3f46, 0 0 42px rgba(249,115,22,.55); }
    }
    @keyframes dotBlink {
      0%,100%{ opacity:1; } 50%{ opacity:.2; }
    }
    @keyframes rollerMove {
      0%  { background-position:0 0; }
      100%{ background-position:40px 0; }
    }
    @keyframes checkPop {
      0%  { transform:scale(0) rotate(-15deg); opacity:0; }
      65% { transform:scale(1.15) rotate(4deg);  opacity:1; }
      100%{ transform:scale(1)   rotate(0deg);  opacity:1; }
    }
    @keyframes fadeUp {
      from{ opacity:0; transform:translateY(18px); }
      to  { opacity:1; transform:translateY(0); }
    }

    .printer-machine { animation: printerGlow 2.2s ease-in-out infinite; }
    .receipt-paper   { animation: receiptUnroll 2s cubic-bezier(.25,.46,.45,.94) .5s both; }
    .dot1 { animation: dotBlink .8s .00s infinite; }
    .dot2 { animation: dotBlink .8s .27s infinite; }
    .dot3 { animation: dotBlink .8s .54s infinite; }
    .roller-active {
      background: repeating-linear-gradient(90deg, #fff 0px, #fff 6px, #9ca3af 6px, #9ca3af 10px);
      animation: rollerMove .25s linear infinite;
    }
    .check-pop  { animation: checkPop .55s cubic-bezier(.17,.89,.32,1.28) 2.7s both; }
    .fade-up    { animation: fadeUp .5s ease 3s both; }

    /* ── receipt font ── */
    .rfont { font-family:'Courier Prime', 'Courier New', monospace; }

    /* dashed separator */
    .rdash { border:none; border-top:1px dashed #d1d5db; margin:8px 0; }

    /* zig-zag using SVG inline background */
    .zigzag-top {
      width:100%;
      height:14px;
      background:
        linear-gradient(135deg, #fff 33.33%, transparent 33.33%) 0 0,
        linear-gradient(225deg, #fff 33.33%, transparent 33.33%) 0 0;
      background-size:12px 14px;
      background-color:transparent;
    }
    .zigzag-bottom {
      width:100%;
      height:14px;
      background:
        linear-gradient(315deg, #fff 33.33%, transparent 33.33%) 0 0,
        linear-gradient( 45deg, #fff 33.33%, transparent 33.33%) 0 0;
      background-size:12px 14px;
      background-color:transparent;
    }

    @media print {
      .no-print { display:none !important; }
    }
  `],
  template: `
<div class="min-h-screen flex items-start justify-center py-8 px-4"
  style="background:linear-gradient(135deg,#fff7ed 0%,#fef3c7 50%,#fff7ed 100%);">

  <div class="w-full flex flex-col items-center" style="max-width:380px;">

    <!-- ═══════════════════════════════
         PRINTER MACHINE
    ═══════════════════════════════ -->
    <div class="printer-machine no-print w-full rounded-2xl relative z-10"
      style="background:linear-gradient(170deg,#27272a,#18181b);
             border:3px solid #3f3f46;
             padding:18px 24px 12px;">

      <!-- top bar: brand + LEDs -->
      <div class="flex items-center justify-between mb-3">
        <div style="font-weight:800;font-size:14px;letter-spacing:2px;color:#f9fafb;">{{orgService.org().name}}</div>
        <div class="flex gap-1.5">
          <span class="dot1 w-2.5 h-2.5 rounded-full bg-green-400 block"></span>
          <span class="dot2 w-2.5 h-2.5 rounded-full bg-orange-400 block"></span>
          <span class="dot3 w-2.5 h-2.5 rounded-full bg-red-400 block"></span>
        </div>
      </div>

      <!-- LCD display bar -->
      <div style="background:#0a0a0a;border-radius:6px;padding:5px 10px;margin-bottom:10px;
                  border:1px solid #3f3f46;">
        <div style="font-size:9px;font-family:monospace;color:#22c55e;letter-spacing:1px;text-align:center;">
          {{ printing() ? 'PRINTING...' : 'READY' }}
        </div>
      </div>

      <!-- roller slot -->
      <div style="background:#0a0a0a;border-radius:6px;height:10px;overflow:hidden;margin-bottom:8px;
                  border:1px solid #3f3f46;">
        <div class="h-full" [class.roller-active]="printing()"
          [style.background]="!printing() ? '#111827' : ''"></div>
      </div>

      <!-- orange LED strip -->
      <div class="flex justify-center mb-1">
        <div style="height:3px;width:120px;border-radius:3px;background:linear-gradient(90deg,#f97316,#fb923c,#f97316);
                    box-shadow:0 0 10px rgba(249,115,22,.7);"></div>
      </div>

      <!-- paper exit slit -->
      <div style="background:#0a0a0a;height:6px;border-radius:0 0 4px 4px;
                  margin:6px -20px -10px;border-top:1px solid #3f3f46;"></div>
    </div>

    <!-- ═══════════════════════════════
         RECEIPT PAPER
    ═══════════════════════════════ -->
    <div class="receipt-paper relative z-0"
      style="filter:drop-shadow(0 16px 32px rgba(0,0,0,.22)); width: calc(100% - 32px); margin: 0 auto;">

      <!-- top perforation strip -->
      <div class="no-print" style="height:12px;
        background:repeating-linear-gradient(90deg,#fff 0,#fff 6px,transparent 6px,transparent 10px);
        border-top:1px solid #e5e7eb;"></div>

      <!-- receipt body -->
      <div class="rfont bg-white" style="padding:16px 18px;" id="receipt-content">

        <!-- header -->
        <div style="text-align:center;margin-bottom:10px;">
          <div style="font-size:18px;font-weight:700;letter-spacing:4px;color:#111;">🍽 {{orgService.org().name.toUpperCase()}}</div>
          <div style="font-size:9px;color:#9ca3af;letter-spacing:2px;margin-top:2px;">FOOD DELIVERY &amp; PICKUP</div>
          <div style="font-size:9px;color:#d1d5db;margin-top:1px;">{{orgService.org().city}}, India</div>
        </div>

        <hr class="rdash">

        <!-- order meta -->
        <div style="font-size:10px;display:flex;flex-direction:column;gap:3px;margin-bottom:6px;">
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#9ca3af;">ORDER #</span>
            <span style="font-weight:700;color:#111;font-size:9px;max-width:200px;text-align:right;word-break:break-all;">
              {{order()?.orderId || 'N/A'}}
            </span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#9ca3af;">DATE</span>
            <span style="font-weight:700;color:#111;">{{order()?.createdAt | date:'dd/MM/yy hh:mm a'}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#9ca3af;">TYPE</span>
            <span style="font-weight:700;color:#111;text-transform:uppercase;">{{order()?.orderType || 'Delivery'}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span style="color:#9ca3af;">PAYMENT</span>
            <span style="font-weight:700;color:#111;text-transform:uppercase;">{{order()?.paymentMode || 'COD'}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;" *ngIf="order()?.customerName">
            <span style="color:#9ca3af;">CUSTOMER</span>
            <span style="font-weight:700;color:#111;">
              {{order()?.customerName}} {{order()?.customerPhone ? '('+order()?.customerPhone+')' : ''}}
            </span>
          </div>
        </div>

        <!-- takeaway token -->
        <div *ngIf="order()?.tokenNumber"
          style="border:2px dashed #fb923c;border-radius:8px;padding:8px;text-align:center;margin:8px 0;">
          <div style="font-size:9px;color:#f97316;font-weight:800;letter-spacing:2px;">TAKEAWAY TOKEN</div>
          <div style="font-size:26px;font-weight:900;color:#111;">#{{order()?.tokenNumber}}</div>
          <div style="font-size:9px;color:#9ca3af;">Show at counter</div>
        </div>

        <hr class="rdash">

        <!-- items -->
        <div style="font-size:10px;margin-bottom:4px;">
          <div style="display:flex;justify-content:space-between;color:#9ca3af;font-weight:700;margin-bottom:4px;">
            <span>ITEM</span><span>QTY &nbsp; AMOUNT</span>
          </div>
          <div *ngFor="let item of order()?.items || []"
            style="display:flex;justify-content:space-between;padding:2px 0;color:#111;">
            <span style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.name}}</span>
            <span style="white-space:nowrap;font-weight:700;">x{{item.quantity}} &nbsp; ₹{{item.price | number:'1.2-2'}}</span>
          </div>
          <div *ngIf="!order()?.items?.length"
            style="color:#d1d5db;font-style:italic;text-align:center;font-size:9px;">No items</div>
        </div>

        <hr class="rdash">

        <!-- bill summary -->
        <div style="font-size:10px;display:flex;flex-direction:column;gap:3px;margin-bottom:6px;">
          <div style="display:flex;justify-content:space-between;">
            <span>Subtotal</span>
            <span style="font-weight:700;">₹{{order()?.subtotal | number:'1.2-2'}}</span>
          </div>
          <div *ngIf="(order()?.discount||0)>0"
            style="color:#16a34a;font-weight:700;">
            <div style="display:flex;justify-content:space-between;">
              <span>Discount {{order()?.couponCode ? '('+order()?.couponCode+')' : ''}}</span>
              <span>-₹{{order()?.discount | number:'1.2-2'}}</span>
            </div>
            <div style="font-size:8px;font-weight:bold;margin-top:1px;">*valid only 4 days</div>
          </div>
          <div *ngIf="(order()?.taxes||0)>0" style="display:flex;justify-content:space-between;">
            <span>GST &amp; Taxes</span>
            <span style="font-weight:700;">₹{{order()?.taxes | number:'1.2-2'}}</span>
          </div>
          <div *ngIf="(order()?.deliveryCharge||0)>0" style="display:flex;justify-content:space-between;">
            <span>Delivery</span>
            <span style="font-weight:700;">₹{{order()?.deliveryCharge | number:'1.2-2'}}</span>
          </div>
          <div *ngIf="(order()?.deliveryCharge||0)===0" style="display:flex;justify-content:space-between;">
            <span>Delivery</span>
            <span style="font-weight:700;color:#16a34a;">FREE</span>
          </div>
        </div>

        <!-- double rule before total -->
        <div style="border-top:2px solid #111;border-bottom:1px solid #111;padding:6px 0;
                    display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:12px;font-weight:900;color:#111;letter-spacing:1px;">TOTAL PAID</span>
          <span style="font-size:12px;font-weight:900;color:#111;">₹{{order()?.total | number:'1.2-2'}}</span>
        </div>

        <!-- delivery address -->
        <div *ngIf="order()?.address" style="font-size:9px;color:#111;margin-bottom:8px;line-height:1.5;">
          <span style="font-weight:700;color:#111;">DELIVERY TO</span><br>
          {{order()?.address}}
        </div>

        <!-- footer -->
        <div style="text-align:center;margin-top:6px;">
          <hr class="rdash">
          <div *ngIf="order()?.couponCode" style="font-size:9.5px;color:#16a34a;font-weight:800;margin-bottom:6px;">
            Applied Coupon Code: {{order()?.couponCode}}
          </div>
          <div style="font-size:9px;color:#111;font-weight:700;">Thank you for ordering with {{orgService.org().name}}!</div>
          <div style="font-size:9px;color:#111;">support&#64;{{orgService.org().name.toLowerCase()}}.in</div>
          <div *ngIf="order()?.orderType === 'Self Pickup'" style="font-size:10px;color:#b45309;font-weight:800;margin-top:6px;padding:4px;border:1px dashed #b45309;border-radius:4px;display:inline-block;">
            ⚠️ 30 MINS VALID PICKUP
          </div>
          <!-- barcode -->
          <div style="display:flex;justify-content:center;gap:1px;margin:8px 0 3px;">
            <div *ngFor="let b of barcodeLines"
              [style.width.px]="b.w" [style.height.px]="16" [style.background]="b.c"></div>
          </div>
          <div style="font-size:8px;color:#111;letter-spacing:2px;font-family:monospace;font-weight:700;">
            {{order()?.orderId || '000000'}}
          </div>
        </div>
      </div>

      <!-- ─── ZIG-ZAG BOTTOM TEAR ─── -->
      <div class="zigzag-bottom no-print"
        style="background-color:#f9f9f9; background-image:
          linear-gradient(315deg, #fff 33.33%, transparent 33.33%),
          linear-gradient( 45deg, #fff 33.33%, transparent 33.33%);
          background-size:12px 14px; height:14px; width:100%;">
      </div>
    </div>

    <!-- ═══════════════════════════════
         STEP 1 DONE: CTA BUTTONS
    ═══════════════════════════════ -->
    <div class="fade-up no-print flex flex-col items-center gap-3 mt-6 w-full">

      <!-- confirmed badge -->
      <div class="check-pop flex items-center gap-2 px-5 py-2 rounded-full shadow-lg font-bold text-sm text-white"
        style="background:linear-gradient(135deg,#16a34a,#15803d);">
        <mat-icon class="!text-base !w-4 !h-4">check_circle</mat-icon>
        Order Confirmed!
      </div>

      <!-- buttons -->
      <div class="flex flex-col gap-3 w-full mt-1">
        <button (click)="downloadReceipt()"
          class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg hover:-translate-y-0.5 transition-all"
          style="background:linear-gradient(135deg,#f97316,#ea580c);">
          <mat-icon class="!text-base !w-5 !h-5">download</mat-icon>
          Download Receipt
        </button>
        <div class="flex gap-3">
          <a routerLink="/orders"
            class="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm transition-all"
            style="border:2px solid #f97316;color:#f97316;background:#fff;">
            <mat-icon class="!text-sm !w-4 !h-4">track_changes</mat-icon>
            Track Order
          </a>
          <a routerLink="/"
            class="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-sm text-white transition-all"
            style="background:#1f2937;">
            <mat-icon class="!text-sm !w-4 !h-4">home</mat-icon>
            Home
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
  `
})
export class OrderSuccess implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  orgService     = inject(OrganizationService);

  order          = signal<any>(null);
  printing       = signal(true);
  barcodeLines: { w: number; c: string }[] = [];

  ngOnInit() {
    this.barcodeLines = Array.from({ length: 52 }, () => ({
      w: Math.random() > 0.6 ? 3 : 1,
      c: Math.random() > 0.35 ? '#1f2937' : '#9ca3af'
    }));

    try {
      const saved = localStorage.getItem('ownbites_last_order');
      if (saved) this.order.set(JSON.parse(saved));
    } catch { /* ignore */ }

    setTimeout(() => this.printing.set(false), 2200);
  }



  downloadReceipt() {
    const o = this.order();
    if (!o) return;

    const itemRows = (o.items || []).map((it: any) =>
      `<tr>
        <td style="padding:3px 0;border-bottom:1px dashed #ddd;">${it.name}</td>
        <td style="text-align:center;border-bottom:1px dashed #ddd;">×${it.quantity}</td>
        <td style="text-align:right;border-bottom:1px dashed #ddd;">₹${Number(it.price).toFixed(2)}</td>
      </tr>`
    ).join('');

    const discRow = (o.discount || 0) > 0
      ? `<tr><td>Discount${o.couponCode ? ' ('+o.couponCode+')' : ''}<br><span style="font-size:8px;color:#16a34a;">*valid only 4 days</span></td><td></td>
           <td style="text-align:right;color:#16a34a;">-₹${Number(o.discount).toFixed(2)}</td></tr>` : '';
    const delRow  = (o.deliveryCharge || 0) > 0
      ? `<tr><td>Delivery</td><td></td>
           <td style="text-align:right;">₹${Number(o.deliveryCharge).toFixed(2)}</td></tr>` : '';
    const taxRow  = (o.taxes || 0) > 0
      ? `<tr><td>GST &amp; Taxes</td><td></td>
           <td style="text-align:right;">₹${Number(o.taxes).toFixed(2)}</td></tr>` : '';

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${this.orgService.org().name} Receipt - ${o.orderId}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Courier New',monospace;background:#f5f5f5;display:flex;justify-content:center;padding:20px;}
  .receipt{background:#fff;width:320px;padding:24px 20px;box-shadow:0 4px 24px rgba(0,0,0,.15);}
  h1{font-size:20px;text-align:center;letter-spacing:4px;margin-bottom:2px;}
  .sub{text-align:center;font-size:10px;color:#9ca3af;letter-spacing:2px;margin-bottom:10px;}
  hr{border:none;border-top:1px dashed #ccc;margin:10px 0;}
  table{width:100%;border-collapse:collapse;font-size:11px;}
  td{padding:4px 0;vertical-align:top;}
  .lbl{color:#111;font-size:10px;}
  .val{font-weight:700;font-size:10px;text-align:right;}
  .total td{font-weight:900;font-size:13px;border-top:2px solid #111;padding-top:6px;}
  .footer{text-align:center;font-size:9px;color:#111;margin-top:12px;}
</style></head><body><div class="receipt">
  <h1>🍽 ${this.orgService.org().name.toUpperCase()}</h1>
  <div class="sub" style="color:#111;">FOOD DELIVERY &amp; PICKUP</div><hr>
  <table>
    <tr><td class="lbl">ORDER #</td><td class="val">${o.orderId||'N/A'}</td></tr>
    <tr><td class="lbl">DATE</td><td class="val">${new Date(o.createdAt).toLocaleString('en-IN')}</td></tr>
    <tr><td class="lbl">TYPE</td><td class="val">${(o.orderType||'Delivery').toUpperCase()}</td></tr>
    <tr><td class="lbl">PAYMENT</td><td class="val">${(o.paymentMode||'COD').toUpperCase()}</td></tr>
    ${o.customerName?`<tr><td class="lbl">CUSTOMER</td><td class="val">${o.customerName}${o.customerPhone ? ' ('+o.customerPhone+')' : ''}</td></tr>`:''}
  </table><hr>
  <table>
    <tr style="font-size:9px;color:#111;">
      <td><b>ITEM</b></td><td style="text-align:center;"><b>QTY</b></td>
      <td style="text-align:right;"><b>AMOUNT</b></td>
    </tr>${itemRows}
  </table><hr>
  <table>
    <tr><td>Subtotal</td><td></td><td style="text-align:right;">₹${Number(o.subtotal||0).toFixed(2)}</td></tr>
    ${discRow}${taxRow}${delRow}
    <tr class="total"><td>TOTAL PAID</td><td></td><td style="text-align:right;">₹${Number(o.total||0).toFixed(2)}</td></tr>
  </table>
  ${o.address?`<hr><div style="font-size:9px;color:#111;"><b>DELIVERY TO:</b><br>${o.address}</div>`:''}
  <div class="footer"><hr>
    ${o.couponCode ? `<p style="color:#16a34a;font-weight:bold;font-size:10px;margin-bottom:6px;">Applied Coupon Code: ${o.couponCode}</p>` : ''}
    <p><b>Thank you for ordering with ${this.orgService.org().name}!</b></p>
    <p>support@${this.orgService.org().name.toLowerCase()}.in</p>
    ${o.orderType === 'Self Pickup' ? `<p style="margin-top:6px;color:#b45309;font-weight:bold;font-size:9px;border:1px dashed #b45309;padding:4px;">⚠️ 30 MINS VALID PICKUP</p>` : ''}
    <p style="margin-top:6px;letter-spacing:2px;font-size:8px;">${o.orderId||''}</p>
  </div>
</div></body></html>`;

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `${this.orgService.org().name}_Receipt_${o.orderId || Date.now()}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
  }
}
