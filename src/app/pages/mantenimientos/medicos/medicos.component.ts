import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medicos.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  cargando: boolean = true;
  medicos: Medico[] = [];
  medicosTemP: Medico[] = [];
  hospitales: Hospital[] = [];
  totalMedicos: number = 0;
  desde: number = 0;
  private imgSubs: Subscription;

  constructor(
    private medicoService: MedicoService,
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarMedicos());
  }

  buscarMedico(termino: string) {
    if (termino.length === 0) {
      return (this.medicos = this.medicosTemP);
    }

    this.busquedasService
      .buscar('medicos', termino)
      .subscribe((medicos: Medico[]) => {
        this.medicos = medicos;
      });
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.getMedicos(this.desde, 5).subscribe(
      ({ medicos, total }) => {
        this.totalMedicos = total;
        if (medicos.length !== 0) {
          this.medicos = medicos;
          this.medicosTemP = medicos;
        }
        this.cargando = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cargarHospitales() {
    this.hospitalService.getHospitales().subscribe(({ hospitales }) => {
      this.hospitales = hospitales;
    });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalMedicos) {
      this.desde -= valor;
    }

    if (this.desde === this.totalMedicos) {
      this.desde -= valor;
      return;
    } else if (this.desde < this.totalMedicos) {
      this.cargarMedicos();
    }
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar Usuario?',
      text: `Está a punto de borar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo'
    }).then((res) => {
      if (res.value) {
        this.medicoService.borrarMedico(medico).subscribe(
          (msg: string) => {
            this.cargarMedicos();
            Swal.fire('Medico Borrado', msg, 'success')
          },
          (err) => {
            // console.log(err.message)
            Swal.fire('Ha ocurrido un error', err.message, 'error');
          }
        );
      }
    })
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
}
