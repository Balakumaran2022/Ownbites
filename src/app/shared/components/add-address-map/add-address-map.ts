import { Component, EventEmitter, OnDestroy, OnInit, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { AddressService } from '../../../services/address';
import { CustomerService } from '../../../services/customer';
import { Address } from '../../../models';

@Component({
  selector: 'app-add-address-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div class="bg-white rounded-[2rem] w-full max-w-[500px] h-[600px] max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in-up flex flex-col relative">
        
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 flex items-center gap-3 bg-white z-10 relative shadow-sm">
          <button (click)="close.emit()" class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors -ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h2 class="text-lg font-bold text-gray-900 flex-1">Add New Address</h2>
        </div>

        <!-- Map Container -->
        <div class="flex-1 relative bg-gray-100">
          <div id="leafletMap" class="w-full h-full"></div>
          
          <!-- Search Box Overlay -->
          <div class="absolute top-4 left-4 right-4 z-[400]">
            <div class="relative bg-white rounded-xl shadow-md flex items-center overflow-hidden border border-gray-100">
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="searchLocation()" placeholder="Search area or street..." class="w-full pl-4 pr-10 py-3 outline-none text-sm text-gray-700 placeholder-gray-400">
              <button (click)="searchLocation()" class="absolute right-0 top-0 bottom-0 px-3 text-gray-400 hover:text-orange-500 bg-white transition-colors flex items-center justify-center">
                <div *ngIf="searching()" class="w-5 h-5 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                <svg *ngIf="!searching()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Current Location Button -->
          <button (click)="goToCurrentLocation()" class="absolute bottom-6 right-4 z-[400] bg-white p-3 rounded-full shadow-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 border border-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2.25v2.25m0 15v2.25M2.25 12h2.25m15 0h2.25m-15 0a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0Z" />
            </svg>
          </button>

          <!-- Fixed Center Pin (Mocked) -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[400] pointer-events-none drop-shadow-md pb-1 text-orange-500">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
                <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
             </svg>
          </div>
        </div>

        <!-- Address Form -->
        <div class="p-6 bg-white z-10 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
          
          <div class="mb-4">
             <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Selected Location</label>
             <div class="flex items-start gap-2">
                <div *ngIf="loadingLocation()" class="w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mt-1"></div>
                <div *ngIf="!loadingLocation()" class="flex flex-col">
                  <p class="text-gray-900 font-medium text-sm leading-tight line-clamp-2 min-h-[40px]">{{ formattedAddress() }}</p>
                  
                  <!-- Service Area Error -->
                  <div *ngIf="outOfServiceArea()" class="mt-2 bg-orange-50 border border-orange-100 rounded-lg p-3 relative flex items-center shadow-sm">
                    <!-- Little triangle pointing up -->
                    <div class="absolute -top-2 left-4 w-4 h-4 bg-orange-50 border-t border-l border-orange-100 transform rotate-45"></div>
                    <span class="text-[#B54A18] font-bold text-sm relative z-10">Outside service area. We don't deliver here yet.</span>
                  </div>
                </div>
             </div>
          </div>

          <div class="mb-6">
             <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Save As</label>
             <div class="flex gap-3">
                <button *ngFor="let type of ['Home', 'Office', 'Other']"
                        (click)="addressType.set(type)"
                        class="flex-1 py-2 rounded-xl text-sm font-bold border transition-colors"
                        [ngClass]="addressType() === type ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'">
                  {{ type }}
                </button>
             </div>
          </div>

          <button 
            [disabled]="loadingLocation() || saving() || outOfServiceArea()"
            (click)="saveAddress()"
            class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:hover:shadow-none disabled:shadow-none">
            <span *ngIf="!saving()">Save Address</span>
            <span *ngIf="saving()">Saving...</span>
          </button>
        </div>

      </div>
    </div>
  `
})
export class AddAddressMapComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() addressSaved = new EventEmitter<Address>();

  addressService = inject(AddressService);
  customerService = inject(CustomerService);
  http = inject(HttpClient);

  map!: L.Map;
  center = signal<{lat: number, lng: number}>({lat: 20.5937, lng: 78.9629}); // Default India
  formattedAddress = signal<string>('Move the pin to select your exact location');
  loadingLocation = signal<boolean>(false);
  searching = signal<boolean>(false);
  searchQuery = '';
  addressType = signal<string>('Home');
  saving = signal<boolean>(false);
  outOfServiceArea = signal<boolean>(false);
  
  private moveTimeout: any;

  ngOnInit() {
    this.initMap();
    this.goToCurrentLocation();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    // Small delay to ensure container is rendered
    setTimeout(() => {
      this.map = L.map('leafletMap', {
        zoomControl: false,
        attributionControl: false
      }).setView([this.center().lat, this.center().lng], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(this.map);

      this.map.on('move', () => {
        const center = this.map.getCenter();
        this.center.set({lat: center.lat, lng: center.lng});
        this.loadingLocation.set(true);
      });

      this.map.on('moveend', () => {
        clearTimeout(this.moveTimeout);
        this.moveTimeout = setTimeout(() => {
          this.reverseGeocode(this.center().lat, this.center().lng);
        }, 500);
      });
    }, 100);
  }

  goToCurrentLocation() {
    if (navigator.geolocation) {
      this.loadingLocation.set(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.map.flyTo([lat, lng], 16, { duration: 1.5 });
          this.reverseGeocode(lat, lng);
        },
        (error) => {
          console.error("Location error:", error);
          this.formattedAddress.set('Location access denied. Please search or move map manually.');
          this.loadingLocation.set(false);
        }
      );
    }
  }

  reverseGeocode(lat: number, lng: number) {
    this.loadingLocation.set(true);
    // Free OSM Nominatim API
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.display_name) {
          this.formattedAddress.set(res.display_name);
          this.checkServiceArea(res.display_name);
        } else {
          this.formattedAddress.set('Unknown location');
          this.outOfServiceArea.set(true);
        }
        this.loadingLocation.set(false);
      },
      error: () => {
        this.formattedAddress.set('Could not fetch address details');
        this.outOfServiceArea.set(true);
        this.loadingLocation.set(false);
      }
    });
  }

  checkServiceArea(address: string) {
    const lower = address.toLowerCase();
    const isValid = lower.includes('tiruvarur') || lower.includes('chennai') || lower.includes('thiruvarur');
    this.outOfServiceArea.set(!isValid);
  }

  searchLocation() {
    if (!this.searchQuery.trim()) return;
    this.searching.set(true);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}&limit=1`;
    
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        this.searching.set(false);
        if (res && res.length > 0) {
          const lat = parseFloat(res[0].lat);
          const lng = parseFloat(res[0].lon);
          this.map.flyTo([lat, lng], 16, { duration: 1.5 });
          // reverseGeocode will trigger automatically from 'moveend' event
        }
      },
      error: () => {
        this.searching.set(false);
      }
    });
  }

  saveAddress() {
    this.saving.set(true);
    
    const parts = this.formattedAddress().split(',').map(p => p.trim());
    const street = parts.slice(0, Math.max(1, parts.length - 4)).join(', ');
    const city = parts[parts.length - 4] || '';
    const state = parts[parts.length - 3] || '';
    const zip = parts[parts.length - 2] || '';

    const phone = this.customerService.currentUser()?.phone;
    
    if (!phone) {
       this.saving.set(false);
       return;
    }

    const payload = {
      customerPhoneNo: phone,
      type: this.addressType(),
      street: street || this.formattedAddress(),
      city: city,
      state: state,
      zip: zip,
      latitude: this.center().lat,
      longitude: this.center().lng,
      isDefault: false
    };

    this.addressService.createAddress(payload as any).subscribe({
       next: (res) => {
          this.addressService.selectAddress(res);
          this.saving.set(false);
          this.addressSaved.emit(res);
          this.close.emit();
       },
       error: (err) => {
          console.error('Error saving address:', err);
          this.saving.set(false);
       }
    });
  }
}
