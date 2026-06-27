import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Checks your updated loggedIn flag from the new AuthService
  if (authService.isLoggedIn()) {
    return true; // Let the admin pass through to the page
  }

  // If not logged in, block access and redirect them to the login screen
  console.warn('Access denied. Redirecting to administrative login terminal...');
  router.navigate(['/login']);
  return false;
};