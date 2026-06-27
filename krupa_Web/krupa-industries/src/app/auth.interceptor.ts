import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAuthToken(); // 👈 Grab the token out of sessionStorage

  // If a token exists and we are hitting your Spring Boot backend, attach it
  if (token && req.url.includes('localhost:8080')) {
    const authRequest = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
    return next(authRequest);
  }

  return next(req);
};