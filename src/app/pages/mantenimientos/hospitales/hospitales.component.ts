import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  cargando: boolean = true;
  hospitales: Hospital[] = [];
  hospitalesTemp: Hospital[] = [];
  desde: number = 0;
  totalHospitales: number = 0;
  private imagenSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();
    this.imagenSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe((img) => this.cargarHospitales());
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return (this.hospitales = this.hospitalesTemp);
    }

    this.busquedaService
      .buscar('hospitales', termino)
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService
      .getHospitales(this.desde)
      .subscribe(({ hospitales, total }) => {
        this.totalHospitales = total;
        if (hospitales.length !== 0) {
          this.hospitales = hospitales;
          this.hospitalesTemp = hospitales;
        }
        this.cargando = false;
      });
    }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalHospitales) {
      this.desde -= valor;
    }

    if (this.desde === this.totalHospitales) {
      this.desde -= valor;
      return;
    } else if (this.desde < this.totalHospitales) {
      this.cargarHospitales();
    }
  }

  async crearHospital() {
    const { value: nombre } = await Swal.fire<string>({
      title: 'Creación de Hospital',
      input: 'text',
      inputLabel: 'Nombre del hospital',
      inputPlaceholder: 'Introduzca el nombre del hospital',
      confirmButtonText: 'Crear Hospital',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonAriaLabel: 'Cancelar',
    });

    if (nombre) {
      this.hospitalService.crearHospital(nombre).subscribe((resp) => {
        const hospital = new Hospital(
          resp.hospital.nombre,
          resp.hospital._id,
          resp.hospital.usuario,
          resp.hospital.img
        );
        Swal.fire('Hospital creado con éxito', resp.msg, 'success').then(
          (resp) => {
            if (resp.isConfirmed) {
              this.hospitales.push(hospital);
              this.cargarHospitales();
            }
          }
        );
      });
    }
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService
      .actualizarHospital(hospital._id, hospital.nombre)
      .subscribe((resp) => {
        Swal.fire('Actualizado', resp.hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital).subscribe(
      (resp) => {
        Swal.fire('Hospital borrado', resp.msg, 'info');
        if (this.hospitales.includes(hospital)) {
          this.hospitales = this.hospitales.filter(
            (hosp) => hosp._id !== hospital._id
          );
          this.hospitalesTemp = this.hospitalesTemp.filter(
            (hosp) => hosp._id !== hospital._id
          );
        }
      },
      (err) => {
        console.log(err);
        Swal.fire({
          title: 'Ha ocurrido un error',
          icon: 'error',
          text: err,
        });
      }
    );
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id,
      hospital.img
    );
  }


  ngOnDestroy(): void {
    this.imagenSubs.unsubscribe();
  }
}
