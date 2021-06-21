import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
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
      { path: 'charts', component: Grafica1Component, data: {titulo: 'Grafica #1'} },
      { path: 'miperfil', component: PerfilComponent, data: {titulo: 'Mi Perfil'} },
      { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress bar'} },
      { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesa'} },
      { path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'} },

      //Mantenimientos
      { path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Usuarios de Aplicación'} },
      // { path: 'hospitales', component: UsuariosComponent, data: {titulo: 'Usuarios de Aplicación'} },
      // { path: 'medicos', component: UsuariosComponent, data: {titulo: 'Usuarios de Aplicación'} },

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
