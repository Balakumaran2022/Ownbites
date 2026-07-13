import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('foodie_token');
  const isDemoUser = localStorage.getItem('ownbites_is_demo_user') === 'true';

  // Only attach Authorization header if we have a real token (not demo user)
  const authReq = (token && !isDemoUser)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // When backend returns 401 Session expired → force full logout & redirect to home
      if (err.status === 401 && !isDemoUser) {
        const body = err.error;
        const isSessionExpired =
          (typeof body === 'object' && body?.message?.toLowerCase().includes('session expired')) ||
          (typeof body === 'string' && body.toLowerCase().includes('session expired'));

        if (isSessionExpired) {
          // Clear stale session data
          localStorage.removeItem('foodie_customer');
          localStorage.removeItem('foodie_token');
          localStorage.removeItem('ownbites_backend3_session_reset_v2');

          // Hard reload to trigger Angular re-init (forces login gate to show)
          window.location.href = '/';
        }
      }
      return throwError(() => err);
    })
  );
};
