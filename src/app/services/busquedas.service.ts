import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuarios.model';


@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  private baseUrl: string = environment.base_url;

  constructor( private http: HttpClient ) { }

  private get token(): string {
    return localStorage.getItem('token') || '';
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map((usuario) => {
      return new Usuario(usuario.nombre, usuario.email, '', usuario.img, usuario.google, usuario.role, usuario.uid);
    });
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    const url = `${this.baseUrl}/todo/coleccion/${tipo}/${termino}`;
    return this.http
      .get<{ ok: boolean; resultados: any[] }>(url, { headers: this.headers })
      .pipe(
        map(({ resultados }) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resultados);
            case 'hospitales':
              break;
            case 'medicos':
              break;
            default:
              break;
          }
        })
      );
  }



}
