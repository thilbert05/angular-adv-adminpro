import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuarios.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;

  constructor(public usuarioService: UsuarioService,
     private router: Router) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {}

  logout() {
    this.usuarioService.logout();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return Swal.fire(
        'No se puede realizar búsqueda',
        'El termino de búsqueda no puede estar vacío',
        'warning'
      )
      // .then((resp) => {
      //   if (resp.isConfirmed) {
      //     this.router.navigate(['/dashboard']);
      //   }
      // });
    }
    this.router.navigate(['/dashboard', 'buscar', termino]);
  }
}
