import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BusquedasService } from 'src/app/services/busquedas.service';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medicos.model';
import { Usuario } from 'src/app/models/usuarios.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [],
})
export class BusquedaComponent implements OnInit {
  usuarios: Usuario[] = [];
  hospitales: Hospital[] = [];
  medicos: Medico[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: HttpParams) => {
      const termino = params['termino'];
      this.busquedaGlobal(termino);
    });
  }

  busquedaGlobal(termino: string) {
    this.busquedasService
      .busquedaGlobal(termino)
      .subscribe(({ medicos, usuarios, hospitales }) => {
        this.usuarios = usuarios;
        this.medicos = medicos;
        this.hospitales = hospitales;
      });
  }

  abrirMedico(id: string) {
    this.router.navigate(['/dashboard', 'medico', id]);
  }
}
