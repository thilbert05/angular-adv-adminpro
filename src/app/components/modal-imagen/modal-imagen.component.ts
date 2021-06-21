import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuarios.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  usuario: Usuario;
  imagenSubir: File;
  imgTemp: any = '';

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.imgTemp = '';
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;
    this.modalImagenService.ocultarModal = false;

    if (!file) {
      return (this.imgTemp = null);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {

    const tipo = this.modalImagenService.tipo;
    const id = this.modalImagenService.id;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo , id)
      .then((img) => {
        this.modalImagenService.nuevaImagen.emit(img);
        Swal.fire({
          title: 'Imagen Guardada',
          icon: 'success',
          text: 'Imagen ha sido guardada con éxito',
        });
        this.cerrarModal();
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
