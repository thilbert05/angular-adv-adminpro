import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo: 'hospitales' | 'medicos' | 'usuarios';
  public id: string;
  public img?: string;
  private baseUrl: string = environment.base_url;
  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  get ocultarModal() {
    return this._ocultarModal;
  }

  set ocultarModal(value) {
    this._ocultarModal = value;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,
    img: string = 'no-img'
  ) {
    this.ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    if (img && img.includes('https')) {
      this.img = img;
    } else if (img && !img.includes('https')) {
      this.img = `${this.baseUrl}/upload/${tipo}/${img}`;
    }
  }

  cerrarModal() {
    this.ocultarModal = true;
  }
}
