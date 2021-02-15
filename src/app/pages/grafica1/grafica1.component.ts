import { Component, OnInit } from '@angular/core';
import { MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  labels1: string[] = ['Alimentos', 'Artículos de Limpieza', 'Medicinas'];

  data1: MultiDataSet = [
    [40, 250, 100],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
