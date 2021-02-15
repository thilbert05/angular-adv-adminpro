import { Component, Input, OnInit } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styles: [
  ]
})
export class DoughnutChartComponent implements OnInit {

  @Input('title') titulo: string = 'Sin Titulo';
  @Input('labels') doughnutChartLabels: Label[] = ['Label1', 'Label2', 'Label3'];
  @Input('data') doughnutChartData: MultiDataSet = [
    [350, 450, 100],
  ];

  @Input() colors: Color[] = [
    {backgroundColor: ['#6857E6', '#009FEE', '#F02059']}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
