import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuarios.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';
import {UsuarioService} from '../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  perfilForm: FormGroup;
  usuario: Usuario;
  imagenSubir: File;
  imgTemp: any = '';

  constructor(private fb: FormBuilder,
     private usuarioService: UsuarioService,
     private fileUploadService: FileUploadService
    ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarUsuario(this.perfilForm.value)
    .subscribe(
      (resp: any) => {
        const { nombre, email } = resp.usuario;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire({
          title: 'Guardado',
          icon: 'success',
          text: 'El usuario ha sido actualizado',
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: error.error.error,
        });
      }
    );
  }

  cambiarImagen(file: File) {

    this.imagenSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {

        this.imgTemp = reader.result;
    }

  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then((img) => {
        this.usuario.img = img;
        Swal.fire({
          title: 'Imagen Guardada',
          icon: 'success',
          text: 'Imagen ha sido guardada con éxito'
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'No se pudo subir el la imagen',
        });
      });
  }

}
