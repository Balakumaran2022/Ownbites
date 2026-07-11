import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../services/order';

export const orderGuard = () => {
  const orderService = inject(OrderService);
  const router = inject(Router);

  // If order type is not selected, redirect to Home to start the flow correctly.
  if (!orderService.orderType()) {
    router.navigate(['/']);
    return false;
  }
  
  return true;
};
