import { Usuario } from '../models/usuarios.model';

export interface Usuarios {
  total: number;
  usuarios: Usuario[];
}
