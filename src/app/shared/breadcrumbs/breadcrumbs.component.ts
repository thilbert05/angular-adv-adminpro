import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {
  titulo: string;
  tituloSubs: Subscription;

  constructor( private router: Router, private documentTitle: Title ) {
    this.tituloSubs = this.getRouteArgs().subscribe(({ titulo }) => {
      this.titulo = titulo;

      this.documentTitle.setTitle(`AdminPro - ${titulo}`);
    });
   }

   getRouteArgs() {
    return this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event) => event.snapshot.data)
      );
   }

   ngOnDestroy() {
     this.tituloSubs.unsubscribe();
   }

}
