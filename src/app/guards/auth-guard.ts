import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('foodie_token');
  if (token) {
    return true;
  }
  router.navigate(['/']); // Redirect to home or login page
  return false;
};
