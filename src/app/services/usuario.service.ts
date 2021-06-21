import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Usuario } from '../models/usuarios.model';

import { Usuarios } from "../interfaces/usuarios.interface";

declare const gapi: any;



@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  baseUrl = environment.base_url;

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
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

    return this.http.get(`${this.baseUrl}/auth/login/renew`, {
      headers: this.headers,
    }).pipe(
      map((resp: { ok: boolean; token: string; usuario: Usuario }) => {
        const {nombre, email, img, uid, role, google} = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        return true;
      }),
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

  actualizarUsuario(formData: {nombre: string; email: string, role:string }) {
    formData = {...formData, role: this.usuario.role};

    return this.http.put(`${this.baseUrl}/usuarios/${this.uid}`, formData, {
      headers: this.headers,
    })
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
    localStorage.removeItem('usuario');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigate(['/login']);
      });
    });
  }

  cargarUsuarios(desde:number = 0) {
    const url = `${this.baseUrl}/usuarios`;
    const params = new HttpParams({
      fromObject: {
        desde: desde.toString(),
      },
    });
    return this.http.get<Usuarios>(url, {
      headers: this.headers,
      params,
    })
    .pipe(
      map((resp) => {
        // console.log(resp);
        const usuarios = resp.usuarios.map((usuario) => {
          return new Usuario(usuario.nombre, usuario.email, '', usuario.img, usuario.google, usuario.role, usuario.uid);
        })
        return {
          total: resp.total,
          usuarios
          };
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${this.baseUrl}/usuarios/${usuario.uid}`;
    return this.http.delete<{msg: string}>(url, {headers: this.headers})
    .pipe(map(({msg}) => msg))
  }

  guardarUsuario(usuario: Usuario) {
    // formData = {...formData, role: this.usuario.role};

    return this.http.put<{ok: boolean; usuario: Usuario}>(`${this.baseUrl}/usuarios/${usuario.uid}`, usuario, {
      headers: this.headers,
    }).pipe(map(resp => resp.usuario));
  }
}
