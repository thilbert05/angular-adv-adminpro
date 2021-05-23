import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  baseUrl = environment.base_url;

  public auth2: any;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {
    this.googleInit();
  }

  googleInit() {
    return new Promise<void>((resolve, reject) => {

      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id:
            '439684308867-nfsprcd5hmv8l1mt9p3ivv0amgq92evr.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });

  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.baseUrl}/auth/login/renew`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    }).pipe(
      tap((resp: { ok: boolean; token: string }) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => true),
      catchError((error) => of(false)),
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${this.baseUrl}/usuarios`, formData).pipe(
      tap((resp: { ok: boolean; token: string }) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  login(formData: LoginForm) {
    return this.http.post(`${this.baseUrl}/auth/login`, formData).pipe(
      tap((resp: { ok: boolean; token: string }) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  googleLogin(token: string) {
    return this.http.post(`${this.baseUrl}/auth/login/google`, { token }).pipe(
      tap((resp: { ok: boolean; token: string }) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigate(['/login']);
      });
    });
  }
}
