import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { Hospital } from '../models/hospital.model';

interface HospitalResponse {
  ok: boolean;
  hospital: Hospital
  msg?:string;
}

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  private baseUrl: string = environment.base_url;

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getHospitales(desde: number = 0, limit: number = 0) {
    const url = `${this.baseUrl}/hospitales`;
    const params = new HttpParams({
      fromObject: {
        desde: desde.toString(),
        limit: limit.toString()
      },
    });

    return this.http
      .get<{ ok: boolean; hospitales: Hospital[], total: number }>(url, {
        headers: this.headers,
        params,
      })
      .pipe(
        map(({ hospitales, total }) => {
          hospitales = hospitales.map((hospital) => {
            return new Hospital(
              hospital.nombre,
              hospital._id,
              hospital.usuario,
              hospital.img
            );
          });
          return {
            hospitales,
            total
          };
        })
      );
  }

  crearHospital(nombre: string ) {
    const url = `${this.baseUrl}/hospitales`;

    return this.http.post<HospitalResponse>(
      url,
      { nombre },
      {
        headers: this.headers,
      }
    );
  }

  actualizarHospital(_id: string, nombre: string ) {
    const url = `${this.baseUrl}/hospitales/${_id}`;

    return this.http.put<HospitalResponse>(
      url,
      { nombre },
      {
        headers: this.headers,
      }
    );
  }

  borrarHospital(hospital: Hospital ) {
    const _id = hospital._id;
    const url = `${this.baseUrl}/hospitales/${_id}`;

    return this.http.delete<{ ok: boolean; msg: string }>(url, {
      headers: this.headers
    }).pipe(
      tap(resp => resp),
      catchError((err) => {
        console.log(err.error.error)
        throw new Error(err.error.error);
      })
    );
  }


}
