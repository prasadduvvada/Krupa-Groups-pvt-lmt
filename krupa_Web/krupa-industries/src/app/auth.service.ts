import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8080/api/auth';
  private loggedIn = false;

  constructor(private http: HttpClient) {
    // Keeps the user logged in if they refresh the dashboard page
    this.loggedIn = sessionStorage.getItem('token') !== null;
  }

  login(username: string, password: string): Observable<any> {
    // 1. Generate the header string from the credentials typed in the form
    const computedToken = 'Basic ' + btoa(username + ':' + password);
    
    const headers = new HttpHeaders({
      Authorization: computedToken
    });

    // 2. Fire the validation request to your custom login endpoint
    return this.http.get(`${this.authUrl}/login`, { headers, withCredentials: true }).pipe(
      tap((response: any) => {
        // 3. Check your custom JSON status key response
        if (response && response.status === 'success') {
          this.loggedIn = true;
          
          // CRITICAL FIX: Store the token inside the browser session tab context 
          // so the interceptor can grab it a microsecond later on the dashboard page!
          sessionStorage.setItem('token', computedToken);
        }
      })
    );
  }

  // Exposes the saved token to your functional interceptor
  getAuthToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout() {
    this.loggedIn = false;
    sessionStorage.removeItem('token'); // Clear token data completely on logout
  }
}