import { environment } from "../../environments/environment";

const baseUrl = environment.base_url;

export class Usuario {

  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: 'ADMIN_ROLE' | 'USER_ROLE',
    public uid?: string,
  ) {}

  get imagenUrl() {
    //http://localhost:3000/api/upload/usuarios/
    if(this.img && this.img.includes('https://')) {
      return this.img;
    } else if (this.img && !this.img.includes('https://')) {
      return `${baseUrl}/upload/usuarios/${this.img}`
    } else {
      return `${baseUrl}/upload/usuarios/no-img.jpg`
    }
  }
}
