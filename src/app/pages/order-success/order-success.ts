import { Component, inject, OnInit, AfterViewInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UiButton } from '../../shared/components/ui-button/ui-button';

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
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');

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
        <div style="font-weight:800;font-size:14px;letter-spacing:2px;color:#f9fafb;">OwnBites</div>
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
          <div style="font-size:18px;font-weight:700;letter-spacing:4px;color:#111;">🍽 OWNBITES</div>
          <div style="font-size:9px;color:#9ca3af;letter-spacing:2px;margin-top:2px;">FOOD DELIVERY &amp; PICKUP</div>
          <div style="font-size:9px;color:#d1d5db;margin-top:1px;">Thiruvarur, Tamil Nadu, India</div>
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
            <span style="font-weight:700;color:#111;">{{order()?.customerName}}</span>
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
            style="display:flex;justify-content:space-between;color:#16a34a;font-weight:700;">
            <span>Discount {{order()?.couponCode ? '('+order()?.couponCode+')' : ''}}</span>
            <span>-₹{{order()?.discount | number:'1.2-2'}}</span>
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
          <div style="font-size:9px;color:#111;font-weight:700;">Thank you for ordering with OwnBites!</div>
          <div style="font-size:9px;color:#111;">support&#64;ownbites.in</div>
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

    <!-- ═══════════════════════════════
         STEP 2 — SCRATCH CARD REWARD
    ═══════════════════════════════ -->
    <div class="scratch-card-wrap no-print w-full">

      <!-- Margin Spacer -->
      <div class="mt-8"></div>

      <!-- Scratchable card -->
      <div *ngIf="!scratchRevealed()"
        style="background:linear-gradient(135deg,#1c1917,#292524);border-radius:20px;
          padding:20px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.3);">

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
            <div style="font-size:12px;font-weight:700;color:#92400e;margin-top:5px;">Code: {{ scratchCouponCode() }}</div>
            <div style="font-size:9px;color:#b45309;margin-top:2px;">Valid for 7 days · Next order</div>
          </div>

          <!-- Canvas scratch layer (full width) -->
          <canvas #scratchCanvas
            [width]="scratchWidth"
            height="120"
            style="position:absolute;inset:0;width:100%;height:100%;border-radius:14px;cursor:crosshair;touch-action:none;"></canvas>
        </div>

        <div style="font-size:11px;color:#78716c;">✋ Scratch with finger or mouse to reveal</div>
      </div>

      <!-- Revealed state -->
      <div class="reveal-pop" *ngIf="scratchRevealed()"
        style="background:linear-gradient(135deg,#fef9c3,#fef3c7);border-radius:20px;
          padding:24px 20px;text-align:center;border:2px dashed #d97706;
          box-shadow:0 8px 32px rgba(217,119,6,.25);">
        <div style="font-size:14px;font-weight:800;color:#92400e;margin-bottom:8px;">🎉 Congratulations!</div>
        <div style="font-size:36px;font-weight:900;color:#d97706;letter-spacing:-1px;margin-bottom:12px;">₹20 OFF</div>

        <!-- Coupon code + Copy button -->
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:14px;">
          <div style="background:#d97706;color:#fff;font-weight:900;
            font-size:15px;letter-spacing:3px;padding:8px 18px;border-radius:10px;">{{ scratchCouponCode() }}</div>
          <button (click)="copyCoupon()"
            style="width:38px;height:38px;border-radius:10px;border:2px solid #d97706;
              background:couponCopied() ? '#d97706' : '#fff';
              color:couponCopied() ? '#fff' : '#d97706';
              display:flex;align-items:center;justify-content:center;
              cursor:pointer;transition:all .2s;flex-shrink:0;"
            [style.background]="couponCopied() ? '#d97706' : '#fff'"
            [style.color]="couponCopied() ? '#fff' : '#d97706'">
            <mat-icon style="font-size:18px;width:18px;height:18px;">
              {{couponCopied() ? 'check' : 'content_copy'}}
            </mat-icon>
          </button>
        </div>
        <div *ngIf="couponCopied()" style="font-size:11px;color:#16a34a;font-weight:700;margin-bottom:8px;">✅ Copied!</div>

        <div style="font-size:12px;color:#92400e;font-weight:600;line-height:1.6;">
          Use this code at checkout for ₹20 off!<br>
          <span style="color:#b45309;font-size:11px;">Valid for 7 days from now</span>
        </div>
      </div>
    </div>

  </div>
</div>
  `
})
export class OrderSuccess implements OnInit, AfterViewInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('scratchCanvas') scratchCanvasRef!: ElementRef<HTMLCanvasElement>;

  order          = signal<any>(null);
  printing       = signal(true);
  scratchRevealed = signal(false);
  couponCopied   = signal(false);
  scratchCouponCode = signal<string>('SCRATCH20');
  barcodeLines: { w: number; c: string }[] = [];

  // Scratch card internal state
  private scratchCtx: CanvasRenderingContext2D | null = null;
  private isScratching = false;
  private scratchInitDone = false;
  scratchWidth = 340;   // updated dynamically after view init
  private readonly SCRATCH_KEY = 'ownbites_scratch_coupon';

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

    // Check if already revealed (don't show card again)
    const existing = localStorage.getItem(this.SCRATCH_KEY);
    if (existing) {
      try {
        const sc = JSON.parse(existing);
        if (sc.revealed) {
          this.scratchRevealed.set(true);
          this.scratchCouponCode.set(sc.code || 'SCRATCH20');
        } else {
          // If not revealed, keep the pre-generated code
          this.scratchCouponCode.set(sc.code || 'SCRATCH20');
        }
      } catch { /* ignore */ }
    } else {
      // Pre-create the unrevealed coupon associated with this order
      try {
        const orderVal = this.order();
        const orderId = orderVal?.orderId || orderVal?._id || orderVal?.id;
        if (orderId) {
          const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
          const uniqueCode = 'OB20-' + rand;
          this.scratchCouponCode.set(uniqueCode);

          const coupon = {
            code:     uniqueCode,
            amount:   20,
            revealed: false,
            expiry:   Date.now() + 7 * 24 * 60 * 60 * 1000,
            orderId:  orderId
          };
          localStorage.setItem(this.SCRATCH_KEY, JSON.stringify(coupon));
        }
      } catch { /* ignore */ }
    }
  }

  ngAfterViewInit() {
    // Init canvas after a delay matching the card animation
    setTimeout(() => this.initScratchCanvas(), 3800);
  }

  private initScratchCanvas() {
    if (this.scratchRevealed() || this.scratchInitDone) return;
    const canvas = this.scratchCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.scratchCtx = ctx;
    this.scratchInitDone = true;

    // Size canvas to match its CSS container (full width)
    const containerW = canvas.parentElement?.clientWidth || 340;
    this.scratchWidth = containerW;
    canvas.width  = containerW;
    canvas.height = 120;

    // Draw gold shimmer cover
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0,   '#b45309');
    grad.addColorStop(0.3, '#d97706');
    grad.addColorStop(0.5, '#fbbf24');
    grad.addColorStop(0.7, '#d97706');
    grad.addColorStop(1,   '#b45309');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scratch hint text
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SCRATCH HERE ✦', canvas.width / 2, canvas.height / 2);
  }

  // ─── Scratch event handlers ──────────────────────────────────────
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
    const canvas = this.scratchCanvasRef?.nativeElement;
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
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  private checkReveal() {
    const canvas = this.scratchCanvasRef?.nativeElement;
    const ctx = this.scratchCtx;
    if (!canvas || !ctx) return;

    // Sample pixel transparency to calculate scratched %
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

    // Clear entire canvas to show prize
    const ctx = this.scratchCtx;
    const canvas = this.scratchCanvasRef?.nativeElement;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Save coupon as revealed in localStorage
    try {
      const existing = localStorage.getItem(this.SCRATCH_KEY);
      if (existing) {
        const sc = JSON.parse(existing);
        sc.revealed = true;
        localStorage.setItem(this.SCRATCH_KEY, JSON.stringify(sc));
      }
    } catch { /* ignore */ }

    setTimeout(() => this.scratchRevealed.set(true), 400);
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
      ? `<tr><td>Discount${o.couponCode ? ' ('+o.couponCode+')' : ''}</td><td></td>
           <td style="text-align:right;color:#16a34a;">-₹${Number(o.discount).toFixed(2)}</td></tr>` : '';
    const delRow  = (o.deliveryCharge || 0) > 0
      ? `<tr><td>Delivery</td><td></td>
           <td style="text-align:right;">₹${Number(o.deliveryCharge).toFixed(2)}</td></tr>` : '';
    const taxRow  = (o.taxes || 0) > 0
      ? `<tr><td>GST &amp; Taxes</td><td></td>
           <td style="text-align:right;">₹${Number(o.taxes).toFixed(2)}</td></tr>` : '';

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>OwnBites Receipt - ${o.orderId}</title>
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
  <h1>🍽 OWNBITES</h1>
  <div class="sub" style="color:#111;">FOOD DELIVERY &amp; PICKUP</div><hr>
  <table>
    <tr><td class="lbl">ORDER #</td><td class="val">${o.orderId||'N/A'}</td></tr>
    <tr><td class="lbl">DATE</td><td class="val">${new Date(o.createdAt).toLocaleString('en-IN')}</td></tr>
    <tr><td class="lbl">TYPE</td><td class="val">${(o.orderType||'Delivery').toUpperCase()}</td></tr>
    <tr><td class="lbl">PAYMENT</td><td class="val">${(o.paymentMode||'COD').toUpperCase()}</td></tr>
    ${o.customerName?`<tr><td class="lbl">CUSTOMER</td><td class="val">${o.customerName}</td></tr>`:''}
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
    <p><b>Thank you for ordering with OwnBites!</b></p>
    <p>support@ownbites.in</p>
    <p style="margin-top:6px;letter-spacing:2px;font-size:8px;">${o.orderId||''}</p>
  </div>
</div></body></html>`;

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `OwnBites_Receipt_${o.orderId || Date.now()}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
  }

  copyCoupon() {
    navigator.clipboard.writeText(this.scratchCouponCode()).then(() => {
      this.couponCopied.set(true);
      try {
        localStorage.setItem('ownbites_copied_coupon', this.scratchCouponCode());
      } catch { /* ignore */ }
      setTimeout(() => this.couponCopied.set(false), 2000);
    });
  }
}
