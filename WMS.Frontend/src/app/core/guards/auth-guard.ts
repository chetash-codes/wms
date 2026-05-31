import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth'; // Verify exact path extension
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // 1. Fallback Strategy: If the reactive state is empty, check memory directly to survive a page refresh (F5)
  const tokenExists = !!localStorage.getItem('wms_auth_token');

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      // If either the reactive stream or local storage confirms authentication, let them through the first gate
      if (isLoggedIn || tokenExists) {
        
        // 2. Role-Based Authorization Check
        const expectedRoles: string[] = route.data?.['roles'];
        
        // If the route doesn't require specific roles, it's a general authenticated route (e.g., Dashboard)
        if (!expectedRoles || expectedRoles.length === 0) {
          return true;
        }

        // Decode the JWT token to inspect the role claims
        const token = localStorage.getItem('wms_auth_token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userRole = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

            // If the user's role is included in the route's allowed roles array, grant access!
            if (expectedRoles.includes(userRole)) {
              return true;
            }
          } catch (e) {
            console.error('Error parsing token claims inside AuthGuard:', e);
          }
        }

        // User is authenticated but lacks the required clearance role -> Redirect to safe ground
        router.navigate(['/dashboard']);
        return false;
      }

      // Completely unauthenticated user -> Send away to login screen
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};