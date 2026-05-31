import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. If the request is a login attempt, pass it through completely untouched
  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  // Retrieve the token from browser localStorage
  const token = localStorage.getItem('wms_auth_token');

  // 2. Only inject the Authorization header for secure business endpoints
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Pass the request out to the network chain
  return next(req);
};