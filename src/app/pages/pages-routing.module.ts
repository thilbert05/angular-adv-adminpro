import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
      { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Account Settings'} },
      { path: 'buscar/:termino', component: BusquedaComponent, data: {titulo: 'Busqueda'} },
      { path: 'charts', component: Grafica1Component, data: {titulo: 'Grafica #1'} },
      { path: 'miperfil', component: PerfilComponent, data: {titulo: 'Mi Perfil'} },
      { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress bar'} },
      { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesa'} },
      { path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'} },

      //Mantenimientos
      { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de Hospitales'} },
      { path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de Médicos'} },
      { path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Mantenimiento de Médicos'} },

      //Rutas de Admin
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard], data: {titulo: 'Mantenimiento de Usuarios'} },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
