import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const publicEndpoints = [
    'http://localhost:8000/api/login/',
    'http://localhost:8000/api/register/',
  ];

  if (publicEndpoints.includes(req.url)) {
    return next(req);
  }

  const token =
    sessionStorage.getItem('access_token') ||
    localStorage.getItem('access_token');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedReq);
  }

  return next(req);
};