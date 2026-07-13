import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, catchError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('foodie_token');
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // When backend returns 401 with Session expired → force full logout & redirect to home
      if (err.status === 401) {
        const body = err.error;
        const isSessionExpired =
          (typeof body === 'object' && body?.message?.toLowerCase().includes('session expired')) ||
          (typeof body === 'string' && body.toLowerCase().includes('session expired'));

        if (isSessionExpired) {
          // Clear stale session data
          localStorage.removeItem('foodie_customer');
          localStorage.removeItem('foodie_token');
          // Remove the reset flag so next load re-runs cleanup too
          localStorage.removeItem('ownbites_backend3_session_reset_v2');

          // Hard reload to trigger Angular re-init (forces login gate to show)
          window.location.href = '/';
        }
      }
      return throwError(() => err);
    })
  );
};
