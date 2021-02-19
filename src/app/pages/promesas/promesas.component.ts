import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // const promesa = new Promise((resolve, reject) => {
    //   if (false) {
    //     resolve('Hola Mundo!');

    //   } else {
    //     reject('Algo Salio Mal');
    //   }

    // });

    // promesa
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // console.log('fin del init');

    this.getUsers().then(usuarios => console.log(usuarios));
  }

  getUsers() {
    const promesa = new Promise((resolve, reject) => {
      fetch('https://reqres.in/api/users')
        .then((response) => {
          return response.json();
        })
        .then(body => resolve(body.data))
        .catch(err => reject(err));
    });

    return promesa;
  }

}
