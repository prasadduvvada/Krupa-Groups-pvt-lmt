import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAuthToken();

  // Change: Attach the token to ALL requests going to your backend domain
  if (token && req.url.includes('krupa-groups-pvt-lmt.onrender.com')) {
    const authRequest = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
    return next(authRequest);
  }

  return next(req);
};