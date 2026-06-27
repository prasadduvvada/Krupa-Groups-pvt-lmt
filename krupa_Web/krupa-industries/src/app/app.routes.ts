import { Routes } from '@angular/router';
import { RealEstateComponent } from './real-estate/real-estate';
import { FurnitureComponent } from './furniture/furniture';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { ExpenseComponent } from './expense/expense';
import { authGuard } from './auth.guard'; // 👈 Crucial import line fixed

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  // Public Storefront Paths (Open to everyone) 🌍
  { path: 'real-estate', component: RealEstateComponent },
  { path: 'furniture', component: FurnitureComponent },
  
  // Protected Administrative Paths (Locked by Guard) 🔐
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'expenses', component: ExpenseComponent, canActivate: [authGuard] },
  
  // Global Fallbacks
  { path: '', redirectTo: '/real-estate', pathMatch: 'full' },
  { path: '**', redirectTo: '/real-estate' }
];