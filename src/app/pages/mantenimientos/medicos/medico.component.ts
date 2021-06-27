import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medicos.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit, OnDestroy {
  tipoForm: string;
  params: string;
  private routeSubs: Subscription;
  hospitales: Hospital[] = [];
  medicoForm: FormGroup;
  hospitalSeleccionado: Hospital;
  medicoSeleccionado: Medico;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private medicoService: MedicoService,
    private hospitalService: HospitalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.routeSubs = this.activatedRoute.params.subscribe((params: Params) => {
      this.params = params['id'];
      console.log(this.params);
    });

    this.cargarHospitales();
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.medicoForm.get('hospital').valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (h) => h._id === hospitalId
      );
    });

    if (this.params !== 'nuevo') {
      this.getMedico(this.params);
    }
  }

  cargarHospitales() {
    this.hospitalService.getHospitales().subscribe(({ hospitales }) => {
      this.hospitales = hospitales;
    });
  }

  getMedico(id: string) {
    this.medicoService.getMedico(id).pipe(delay(100)).subscribe(
      (medico) => {
        const {
          nombre,
          hospital: { _id },
        } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
        // this.medicoForm.get('nombre').setValue(this.medicoSeleccionado.nombre);
        // this.medicoForm.get('hospital').setValue(this.medicoSeleccionado.hospital._id);
      },
      (err) => {
        Swal.fire('Ha ocurrido un error', err.message, 'error')
        .then((resp) => {
          if (resp.isConfirmed) {
            this.router.navigate(['/dashboard', 'medicos']);
          }
        });
      }
    );
  }

  onSubmit() {
    console.log(this.medicoForm.value);
    if (!this.medicoSeleccionado) {
      this.medicoService.crearMedico(this.medicoForm.value).subscribe(
        ({ medico }) => {
          Swal.fire(
            'Médico Creado',
            `${medico.nombre} creado correctamente`,
            'success'
          ).then((resp) => {
            if (resp.isConfirmed) {
              this.router.navigate(['/dashboard', 'medico', `${medico._id}`]);
            }
          });
        },
        (err) => {
          Swal.fire('Ha ocurrido un error', err.message, 'error');
        }
      );
    } else {
      this.medicoService
        .actualizarMedico(this.medicoSeleccionado._id, this.medicoForm.value)
        .subscribe(
          (resp) => {
            Swal.fire('Medico Actualizado', resp.msg, 'success').then(
              (result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/dashboard', 'medicos']);
                }
              }
            );
          },
          (err) => {
            Swal.fire('Ha ocurrido un error', err.message, 'error');
          }
        );
    }
  }

  ngOnDestroy(): void {
    this.routeSubs.unsubscribe();
  }
}
