import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { orderGuard } from './guards/order-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'products', canActivate: [orderGuard], loadComponent: () => import('./pages/products/products').then(m => m.Products) },
  { path: 'offers', loadComponent: () => import('./pages/offers/offers').then(m => m.Offers) },
  { path: 'product/:id', canActivate: [orderGuard], loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'cart', canActivate: [orderGuard], loadComponent: () => import('./pages/cart/cart').then(m => m.Cart) },
  { path: 'checkout', canActivate: [authGuard, orderGuard], loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout) },
  { path: 'order-success', canActivate: [authGuard], loadComponent: () => import('./pages/order-success/order-success').then(m => m.OrderSuccess) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./pages/orders/orders').then(m => m.Orders) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) },
  { path: '**', redirectTo: '' }
];
