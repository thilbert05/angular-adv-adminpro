import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuarios.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;

  constructor(public usuarioService: UsuarioService) {
    this.usuario = usuarioService.usuario;

   }

  ngOnInit(): void {

  }

  logout() {
    this.usuarioService.logout();
  }

}
