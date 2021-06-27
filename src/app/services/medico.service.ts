import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medicos.model';

interface MedicoResponse {
  ok: boolean;
  msg?: string;
  medico?: Medico;
}

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  baseUrl: string = environment.base_url;

  constructor(
    private http: HttpClient,

  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  getMedicos(desde: number = 0, limit: number = 0) {
    const url = `${this.baseUrl}/medicos`;
    const params = new HttpParams({
      fromObject: {
        desde: desde.toString(),
        limit: limit.toString()
      }
    });
    return this.http
      .get<{ ok: boolean; medicos: Medico[], totalMedicos: number }>(url, {
        headers: this.headers,
        params
      })
      .pipe(
        map(({ medicos, totalMedicos }) => {
          medicos.map((medico) => {
            const { nombre, _id, img = '', hospital, usuario } = medico;
            return new Medico(nombre, usuario, _id, hospital, img);
          });
          return {
            medicos,
            total: totalMedicos
          }
        }),
        catchError((err) => {
          throw new Error(err.error.error);
        })
      );
  }

  getMedico(id: string): Observable<Medico> {
    const url = `${this.baseUrl}/medicos/${id}`;
    return this.http
      .get<{ ok: boolean; medico: Medico }>(url, { headers: this.headers })
      .pipe(
        map(({ medico }) => {
          return new Medico(
            medico.nombre,
            medico.usuario,
            medico._id,
            medico.hospital,
            medico.img
          );
        }),
        catchError((err) => {
          throw new Error(err.error.error);
        })
      );
  }

  crearMedico(medico: {nombre: string; hospital: string} ) {
    const url = `${this.baseUrl}/medicos`;

    return this.http.post<{ok: boolean; medico: Medico}>(
      url,
      medico,
      {
        headers: this.headers,
      }
    );
  }

  actualizarMedico(id: string, formData: {nombre: string; hospital: string}) {
    const url = `${this.baseUrl}/medicos/${id}`;

    return this.http
      .put<MedicoResponse>(url, formData, {
        headers: this.headers,
      })
      .pipe(
        tap((resp) => resp),
        catchError((err) => {
          throw new Error(err.error.error);
        })
      );
  }

  borrarMedico(medico: Medico) {
    const _id = medico._id;
    const url = `${this.baseUrl}/medicos/${_id}`;

    return this.http.delete<{ ok: boolean; msg: string }>(url, {
      headers: this.headers
    }).pipe(
      map(resp => resp.msg),
      catchError((err) => {
        // console.log(err.error)
        throw new Error(err.error.error);
      })
    );
  }
}
