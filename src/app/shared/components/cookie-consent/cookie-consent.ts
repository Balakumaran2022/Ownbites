import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../../../services/organization';

// ─── Consent record stored in localStorage ───────────────────────
export interface CookieConsent {
  version: number;           // bump this to re-ask after policy changes
  timestamp: string;
  necessary: true;           // always true — cannot be turned off
  analytics: boolean;        // usage analytics (e.g. session tracking)
  preferences: boolean;      // user prefs like address, order type memory
  marketing: boolean;        // promotional banners, discount targeting
}

const CONSENT_KEY    = 'ownbites_cookie_consent';
const CONSENT_VER    = 2;    // increment to force re-consent on policy update

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host { font-family:'Inter',sans-serif; }

    @keyframes slideUp {
      from { opacity:0; transform:translateY(48px) scale(.98); }
      to   { opacity:1; transform:translateY(0)    scale(1);   }
    }
    @keyframes fadeIn {
      from { opacity:0; } to { opacity:1; }
    }
    @keyframes panelSlide {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .banner      { animation: slideUp .55s cubic-bezier(.16,1,.3,1) both; }
    .backdrop    { animation: fadeIn .3s ease both; }
    .pref-panel  { animation: panelSlide .3s ease both; }

    /* toggle switch */
    .toggle-track {
      width:44px; height:24px; border-radius:12px; position:relative;
      cursor:pointer; transition:background .2s; flex-shrink:0;
    }
    .toggle-track.on  { background:#f97316; }
    .toggle-track.off { background:#374151; }
    .toggle-track.disabled { background:#1f2937; cursor:not-allowed; opacity:.7; }
    .toggle-thumb {
      position:absolute; top:3px; width:18px; height:18px;
      border-radius:50%; background:#fff; transition:left .2s;
      box-shadow:0 1px 4px rgba(0,0,0,.4);
    }
    .toggle-track.on  .toggle-thumb { left:23px; }
    .toggle-track.off .toggle-thumb { left:3px; }
  `],
  template: `
<!-- ═══ BANNER ═══════════════════════════════════════════════════ -->
<div *ngIf="show() && !showPreferences()"
  style="position:fixed;bottom:0;left:0;right:0;z-index:1000;padding:12px 12px 12px;">

  <div style="max-width:860px; margin:0 auto;
    background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);
    border:1px solid rgba(255,255,255,.08);
    border-radius:20px; padding:18px 20px;
    box-shadow:0 -4px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.05);">

    <div style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:16px;">

      <!-- Cookie icon -->
      <div style="width:46px;height:46px;border-radius:12px;flex-shrink:0;
        background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.25);
        display:flex;align-items:center;justify-content:center;font-size:22px;">
        🍪
      </div>

      <!-- Text -->
      <div style="flex:1;min-width:200px;">
        <h3 style="color:#f9fafb;font-weight:800;font-size:16px;margin-bottom:5px;letter-spacing:-.2px;">
          We use cookies
        </h3>
        <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">
          {{orgService.org().name}} uses cookies to remember your address, preferred outlets, and order history,
          and to analyse how the app is used. We <strong style="color:#e2e8f0;">never sell</strong>
          your data. You can customise or withdraw consent at any time.
        </p>
      </div>

      <!-- Buttons -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:2px;flex-shrink:0;">
        <button (click)="rejectAll()"
          style="padding:9px 16px;border-radius:10px;font-size:13px;font-weight:700;
            border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);
            color:#94a3b8;cursor:pointer;transition:all .15s;white-space:nowrap;"
          onmouseover="this.style.background='rgba(255,255,255,.08)'"
          onmouseout="this.style.background='rgba(255,255,255,.04)'">
          Reject All
        </button>
        <button (click)="openPreferences()"
          style="padding:9px 16px;border-radius:10px;font-size:13px;font-weight:700;
            border:1px solid rgba(249,115,22,.35);background:rgba(249,115,22,.08);
            color:#fb923c;cursor:pointer;transition:all .15s;white-space:nowrap;"
          onmouseover="this.style.background='rgba(249,115,22,.16)'"
          onmouseout="this.style.background='rgba(249,115,22,.08)'">
          Manage Preferences
        </button>
        <button (click)="acceptAll()"
          style="padding:9px 20px;border-radius:10px;font-size:13px;font-weight:800;
            border:none;background:linear-gradient(135deg,#f97316,#ea580c);
            color:#fff;cursor:pointer;transition:all .2s;white-space:nowrap;
            box-shadow:0 4px 16px rgba(249,115,22,.35);"
          onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 22px rgba(249,115,22,.45)'"
          onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(249,115,22,.35)'">
          Accept All
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ═══ PREFERENCES MODAL ════════════════════════════════════════ -->
<ng-container *ngIf="show() && showPreferences()">

  <!-- backdrop -->
  <div class="backdrop" style="position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1001;"
    (click)="closePreferences()"></div>

  <!-- panel -->
  <div class="pref-panel" style="position:fixed;left:50%;top:50%;z-index:1002;
    transform:translate(-50%,-50%);width:calc(100% - 24px);max-width:480px;max-height:90vh;
    overflow-y:auto;border-radius:20px;
    background:linear-gradient(160deg,#0f172a 0%,#1e293b 100%);
    border:1px solid rgba(255,255,255,.08);
    box-shadow:0 32px 100px rgba(0,0,0,.7);
    font-family:'Inter',sans-serif;">

    <!-- header -->
    <div style="display:flex;align-items:center;justify-content:space-between;
      padding:20px 22px 16px;border-bottom:1px solid rgba(255,255,255,.07);">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;">🍪</span>
        <span style="color:#f9fafb;font-weight:800;font-size:15px;letter-spacing:-.2px;">
          Cookie Preferences
        </span>
      </div>
      <button (click)="closePreferences()"
        style="width:30px;height:30px;border-radius:50%;border:none;
          background:rgba(255,255,255,.06);cursor:pointer;color:#94a3b8;
          display:flex;align-items:center;justify-content:center;font-size:16px;">
        ✕
      </button>
    </div>

    <div style="padding:20px 22px;display:flex;flex-direction:column;gap:6px;">

      <!-- intro text -->
      <p style="color:#64748b;font-size:12.5px;line-height:1.6;margin-bottom:10px;">
        Choose which cookie categories you want to allow. Strictly necessary cookies cannot be
        disabled as they are essential for the app to function.
      </p>

      <!-- ── Necessary (always on) ── -->
      <div style="border:1px solid rgba(255,255,255,.07);border-radius:14px;
        padding:14px 16px;background:rgba(255,255,255,.03);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:15px;">🔒</span>
            <span style="color:#f9fafb;font-weight:700;font-size:13.5px;">Strictly Necessary</span>
          </div>
          <!-- always-on locked toggle -->
          <div class="toggle-track on disabled">
            <div class="toggle-thumb"></div>
          </div>
        </div>
        <p style="color:#475569;font-size:12px;line-height:1.5;margin:0;">
          Required for the app to work — authentication tokens, cart session, selected outlet &amp; address,
          security headers. Cannot be disabled.
        </p>
      </div>

      <!-- ── Analytics ── -->
      <div style="border:1px solid rgba(255,255,255,.07);border-radius:14px;
        padding:14px 16px;background:rgba(255,255,255,.03);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:15px;">📊</span>
            <span style="color:#f9fafb;font-weight:700;font-size:13.5px;">Analytics &amp; Performance</span>
          </div>
          <div class="toggle-track" [class.on]="prefs().analytics" [class.off]="!prefs().analytics"
            (click)="toggle('analytics')">
            <div class="toggle-thumb"></div>
          </div>
        </div>
        <p style="color:#475569;font-size:12px;line-height:1.5;margin:0;">
          Helps us understand how users navigate the app — page views, errors, load times —
          so we can improve your experience. Data is anonymised.
        </p>
      </div>

      <!-- ── Preferences ── -->
      <div style="border:1px solid rgba(255,255,255,.07);border-radius:14px;
        padding:14px 16px;background:rgba(255,255,255,.03);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:15px;">⚙️</span>
            <span style="color:#f9fafb;font-weight:700;font-size:13.5px;">Preferences &amp; Personalisation</span>
          </div>
          <div class="toggle-track" [class.on]="prefs().preferences" [class.off]="!prefs().preferences"
            (click)="toggle('preferences')">
            <div class="toggle-thumb"></div>
          </div>
        </div>
        <p style="color:#475569;font-size:12px;line-height:1.5;margin:0;">
          Remembers your saved addresses, last-used outlet, order type (delivery / takeaway),
          diet filters, and app settings between sessions.
        </p>
      </div>

      <!-- ── Marketing ── -->
      <div style="border:1px solid rgba(255,255,255,.07);border-radius:14px;
        padding:14px 16px;background:rgba(255,255,255,.03);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:15px;">📢</span>
            <span style="color:#f9fafb;font-weight:700;font-size:13.5px;">Marketing &amp; Promotions</span>
          </div>
          <div class="toggle-track" [class.on]="prefs().marketing" [class.off]="!prefs().marketing"
            (click)="toggle('marketing')">
            <div class="toggle-thumb"></div>
          </div>
        </div>
        <p style="color:#475569;font-size:12px;line-height:1.5;margin:0;">
          Used to show relevant coupon banners and promotional offers based on your order history.
          No data is shared with third-party advertisers.
        </p>
      </div>

      <!-- last consent info -->
      <div *ngIf="lastConsent()" style="margin-top:4px;padding:10px 14px;
        border-radius:10px;background:rgba(255,255,255,.03);
        border:1px solid rgba(255,255,255,.05);">
        <p style="color:#334155;font-size:11px;margin:0;line-height:1.5;">
          Last updated: {{lastConsent()?.timestamp | date:'d MMM y, h:mm a'}}
          &nbsp;·&nbsp;
          Analytics: <strong style="color:#64748b;">{{lastConsent()?.analytics ? 'On' : 'Off'}}</strong>
          &nbsp;·&nbsp;
          Preferences: <strong style="color:#64748b;">{{lastConsent()?.preferences ? 'On' : 'Off'}}</strong>
          &nbsp;·&nbsp;
          Marketing: <strong style="color:#64748b;">{{lastConsent()?.marketing ? 'On' : 'Off'}}</strong>
        </p>
      </div>
    </div>

    <!-- footer buttons -->
    <div style="display:flex;gap:10px;padding:0 22px 22px;">
      <button (click)="rejectAll()"
        style="flex:1;padding:11px;border-radius:11px;font-size:13px;font-weight:700;
          border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);
          color:#64748b;cursor:pointer;transition:all .15s;"
        onmouseover="this.style.background='rgba(255,255,255,.08)'"
        onmouseout="this.style.background='rgba(255,255,255,.04)'">
        Reject All
      </button>
      <button (click)="saveCustom()"
        style="flex:2;padding:11px;border-radius:11px;font-size:13px;font-weight:800;
          border:none;background:linear-gradient(135deg,#f97316,#ea580c);
          color:#fff;cursor:pointer;transition:all .2s;
          box-shadow:0 4px 16px rgba(249,115,22,.3);"
        onmouseover="this.style.transform='translateY(-1px)'"
        onmouseout="this.style.transform='translateY(0)'">
        Save My Preferences
      </button>
      <button (click)="acceptAll()"
        style="flex:2;padding:11px;border-radius:11px;font-size:13px;font-weight:800;
          border:1px solid rgba(249,115,22,.4);background:rgba(249,115,22,.1);
          color:#fb923c;cursor:pointer;transition:all .15s;"
        onmouseover="this.style.background='rgba(249,115,22,.2)'"
        onmouseout="this.style.background='rgba(249,115,22,.1)'">
        Accept All
      </button>
    </div>
  </div>
</ng-container>
  `
})
export class CookieConsentComponent implements OnInit {
  orgService = inject(OrganizationService);

  show            = signal(false);
  showPreferences = signal(false);
  lastConsent     = signal<CookieConsent | null>(null);

  /** Working copy of toggles while the modal is open */
  prefs = signal({ analytics: true, preferences: true, marketing: false });

  // ─── lifecycle ──────────────────────────────────────────────────
  ngOnInit() {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) {
      try {
        const saved: CookieConsent = JSON.parse(raw);
        this.lastConsent.set(saved);
        // Re-ask if policy version bumped
        if (saved.version < CONSENT_VER) {
          this.showBanner();
        } else {
          // Apply stored consent to real features
          this.applyConsent(saved);
        }
      } catch {
        this.showBanner();
      }
    } else {
      this.showBanner();
    }
  }

  private showBanner() {
    // Small delay so page paint completes first
    setTimeout(() => this.show.set(true), 600);
  }

  // ─── actions ────────────────────────────────────────────────────

  acceptAll() {
    this.save({ analytics: true, preferences: true, marketing: true });
  }

  rejectAll() {
    this.save({ analytics: false, preferences: false, marketing: false });
  }

  saveCustom() {
    const p = this.prefs();
    this.save({ analytics: p.analytics, preferences: p.preferences, marketing: p.marketing });
  }

  openPreferences() {
    // Pre-fill toggles from last saved consent (or defaults)
    const saved = this.lastConsent();
    this.prefs.set({
      analytics:   saved?.analytics   ?? true,
      preferences: saved?.preferences ?? true,
      marketing:   saved?.marketing   ?? false
    });
    this.showPreferences.set(true);
  }

  closePreferences() {
    this.showPreferences.set(false);
  }

  toggle(cat: 'analytics' | 'preferences' | 'marketing') {
    this.prefs.update(p => ({ ...p, [cat]: !p[cat] }));
  }

  // ─── core ───────────────────────────────────────────────────────

  private save(choices: { analytics: boolean; preferences: boolean; marketing: boolean }) {
    const consent: CookieConsent = {
      version:     CONSENT_VER,
      timestamp:   new Date().toISOString(),
      necessary:   true,
      analytics:   choices.analytics,
      preferences: choices.preferences,
      marketing:   choices.marketing
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    this.lastConsent.set(consent);
    this.applyConsent(consent);
    this.show.set(false);
    this.showPreferences.set(false);
  }

  /**
   * Real enforcement — runs on every load AND after the user saves choices.
   * Clears data that belongs to a disabled category.
   */
  private applyConsent(c: CookieConsent) {

    // ── Analytics ──────────────────────────────────────────────────
    if (!c.analytics) {
      // Remove any analytics session data
      sessionStorage.removeItem('ownbites_session_id');
      sessionStorage.removeItem('ownbites_page_views');
    } else {
      // Initialise lightweight session tracking
      if (!sessionStorage.getItem('ownbites_session_id')) {
        sessionStorage.setItem('ownbites_session_id', `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`);
        sessionStorage.setItem('ownbites_page_views', '0');
      }
    }

    // ── Preferences ────────────────────────────────────────────────
    if (!c.preferences) {
      // If user revoked preferences consent, wipe saved prefs
      // We keep recent_orders as those are operational (not preference cookies)
      localStorage.removeItem('ownbites_last_address_type');
      localStorage.removeItem('ownbites_last_order_type');
      localStorage.removeItem('ownbites_last_diet');
    }

    // ── Marketing ──────────────────────────────────────────────────
    if (!c.marketing) {
      // Remove any marketing session flags
      sessionStorage.removeItem('ownbites_promo_shown');
    } else {
      // Mark promo banners eligible to show
      sessionStorage.setItem('ownbites_promo_eligible', 'true');
    }

    // Expose consent globally for other services to read reactively
    (window as any).__ownbitesConsent = c;
  }
}
