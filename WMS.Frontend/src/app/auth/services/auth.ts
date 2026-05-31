import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`;

  // 1. Initialize the stream. Check if a token already exists on app startup.
  private loggedInStatus = new BehaviorSubject<boolean>(!!localStorage.getItem('wms_auth_token'));
  
  // 2. Expose this status as an Observable for guards and components to subscribe to
  isLoggedIn$ = this.loggedInStatus.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('wms_auth_token', response.token);
          
          // 3. CRITICAL: Broadcast to the rest of the app that login was successful!
          this.loggedInStatus.next(true); 
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('wms_auth_token');
    
    // 4. Broadcast that the user has logged out
    this.loggedInStatus.next(false); 
  }

  // 5. Kept as a helper fallback, but your Guard should use isLoggedIn$ instead
  isLoggedIn(): boolean {
    return this.loggedInStatus.value;
  }
}