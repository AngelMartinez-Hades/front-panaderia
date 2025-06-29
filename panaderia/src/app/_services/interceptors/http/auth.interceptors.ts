

import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth-service';



export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isLogged = authService.isLoggedIn();
  const authHeader = authService.getAuthHeader();

  console.log('%c[AuthInterceptor]', 'color: blue; font-weight: bold');
  console.log('➡️ Request URL:', req.url);
  console.log('🧾 isLoggedIn():', isLogged);
  console.log('🔐 Authorization Header:', authHeader);

  if (isLogged) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });

    console.log('✅ Header agregado, enviando solicitud...');
    return next(authReq);
  }

  console.log('🚫 Usuario no logueado, enviando solicitud sin header...');
  return next(req);
};