import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { UiButton } from '../../shared/components/ui-button/ui-button';
import { UiCard } from '../../shared/components/ui-card/ui-card';
import { Product, Addon, Variation } from '../../models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, UiButton],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" *ngIf="product(); let p">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a routerLink="/" class="hover:text-primary transition-colors">Home</a>
        <mat-icon class="text-sm">chevron_right</mat-icon>
        <a routerLink="/products" class="hover:text-primary transition-colors">Menu</a>
        <mat-icon class="text-sm">chevron_right</mat-icon>
        <span class="text-secondary font-medium">{{p.name}}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Image Gallery -->
        <div class="space-y-4">
          <div class="rounded-2xl overflow-hidden aspect-square shadow-md border border-gray-100">
            <img [src]="p.imageUrl" [alt]="p.name" class="w-full h-full object-cover">
          </div>
        </div>

        <!-- Details -->
        <div class="flex flex-col">
          <div class="mb-6 border-b border-gray-100 pb-6">
            <div class="flex items-start justify-between mb-2">
              <h1 class="text-3xl font-bold text-secondary">{{p.name}}</h1>
              <div [class]="p.isVeg ? 'w-5 h-5 border-2 border-green-600 flex items-center justify-center shrink-0 mt-2' : 'w-5 h-5 border-2 border-red-600 flex items-center justify-center shrink-0 mt-2'">
                <div [class]="p.isVeg ? 'w-2.5 h-2.5 rounded-full bg-green-600' : 'w-2.5 h-2.5 rounded-full bg-red-600'"></div>
              </div>
            </div>
            <p class="text-gray-500 text-lg mb-4">{{p.description}}</p>
            <div class="flex items-center gap-3">
              <span class="text-3xl font-bold text-secondary">₹{{p.price}}</span>
              <span *ngIf="p.originalPrice" class="text-lg text-gray-400 line-through">₹{{p.originalPrice}}</span>
              <span *ngIf="p.discount" class="bg-orange-100 text-primary px-2 py-1 rounded text-sm font-bold">{{p.discount}}% OFF</span>
            </div>
          </div>

          <!-- Quantity -->
          <div class="mb-8">
            <h3 class="text-lg font-bold text-secondary mb-4">Quantity</h3>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                <button (click)="quantity.set(Math.max(1, quantity() - 1))" class="w-10 h-10 flex items-center justify-center text-primary hover:bg-orange-100 rounded-lg transition-colors">
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="font-bold text-xl text-secondary w-8 text-center">{{quantity()}}</span>
                <button (click)="quantity.set(quantity() + 1)" class="w-10 h-10 flex items-center justify-center text-primary hover:bg-orange-100 rounded-lg transition-colors">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              <div class="text-gray-500 text-sm">
                <span class="flex items-center gap-1"><mat-icon class="text-green-600 text-sm">check_circle</mat-icon> In Stock</span>
              </div>
            </div>
          </div>

          <!-- Add to Cart -->
          <div class="mt-auto pt-6 border-t border-gray-100 flex gap-4">
            <app-ui-button variant="outline" class="flex-1 text-lg py-3"><span class="flex items-center gap-2 justify-center"><mat-icon>favorite_border</mat-icon> Favorite</span></app-ui-button>
            <app-ui-button variant="primary" class="flex-1 text-lg py-3" (click)="addToCart()"><span class="flex items-center gap-2 justify-center"><mat-icon>shopping_cart_checkout</mat-icon> Add to Cart</span></app-ui-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetail implements OnInit {
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  cartService = inject(CartService);

  product = signal<Product | null>(null);
  quantity = signal(1);
  Math = Math;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productService.getProductById(id, environment.outletId).subscribe(res => {
          if(res) this.product.set(res);
        });
      }
    });
  }

  addToCart() {
    const p = this.product();
    if(p) {
      // Mocked local addToCart for now. In real app, call updateCart backend API.
      this.cartService.addToCart(p); // quantity is ignored in mock
    }
  }
}
