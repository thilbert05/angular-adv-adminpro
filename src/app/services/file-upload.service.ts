import { Injectable } from '@angular/core';
import { error } from 'protractor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  baseUrl: string = environment.base_url;

  constructor() { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ) {
    try {
      const url = `${this.baseUrl}/upload/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });

      const data = await resp.json();

      if (data.ok) {
        return data.nombreArchivo
      } else {
        throw new Error('No se pudo subir el archivo')
      }

    } catch (error) {
      // console.log(error);
      return false;
    }
  }
}
