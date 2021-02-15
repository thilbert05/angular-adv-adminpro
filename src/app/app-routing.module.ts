import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AuthRoutingModule } from './auth/auth-routing.module';

//
import { NotpagefoundComponent } from './notpagefound/notpagefound.component';

import { PagesRoutingModule } from './pages/pages-routing.module';



const routes: Routes = [

  // path: '/dashboard' pagesrouting
  // path: '/auth' authrouting
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: '**', component: NotpagefoundComponent },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
