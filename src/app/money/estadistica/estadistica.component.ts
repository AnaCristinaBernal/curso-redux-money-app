import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Money } from '../../models/money.model';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  standalone: false,
  templateUrl: './estadistica.component.html',
  styles: ``
})
export class EstadisticaComponent implements OnInit {

  ingresos: number = 0;
  gastos: number = 0;

  totalGastos: number = 0;
  totalIngresos: number = 0;

  public chartLabels: string[] = [
    'Ingresos','Gastos'
  ];
  public chartData: ChartData<'doughnut'> = {
    labels: this.chartLabels,
    datasets: [
      { data: [] }
    ],
  };

  constructor(
    private store: Store<AppState>,

  ){
  }

  ngOnInit(): void {
    this.store.select('ingresosGastos').subscribe( (({items})=>{
      this.generarEstadistica(items);
    }))
  }

  generarEstadistica(items: Money[]): void {
    this.ingresos = 0;
    this.gastos = 0;
    this.totalIngresos = 0;
    this.totalGastos = 0;
    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.importe;
        this.ingresos++;
      }
      if (item.tipo === 'gasto') {
        this.totalGastos += item.importe;
        this.gastos++;
      }
    }
    this.chartData.datasets[0].data = [this.totalIngresos, this.totalGastos]
  }
}
