import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { map, retry, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  private intervalSubs: Subscription;

  constructor() {

    this.intervalSubs = this.retornaIntervalo().subscribe( console.log );


    // this.retornaObservable().pipe(retry(1)).subscribe(
    //   (valor) => {
    //     console.log('Subs:', valor);
    //   },
    //   (err) => {
    //     console.warn(err);
    //   },
    //   () => {
    //     console.info('Obs Terminado');
    //   }
    // );
  }

  ngOnInit(): void {

  }

  retornaIntervalo(): Observable<number> {
    return interval(100).pipe(
      map((valor) => valor + 1),
      filter((valor) => {
        if (valor % 2 === 0) {
          return true;
        }
      }),
    );

  }

  retornaObservable(){
    let i = -1;
    return new Observable<number>((observer) => {
      const interval = setInterval(() => {
        i++;
        observer.next(i);
        if (i === 4) {
          clearInterval(interval);
          observer.complete();
        }
        if (i === 2) {
          // i = 0;
          observer.error('i llego al valor de 2')
        }
      }, 1000);
    });


  }

  ngOnDestroy() {
    this.intervalSubs.unsubscribe();
  }

}
