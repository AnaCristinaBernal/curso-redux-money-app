import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { MoneyComponent } from './money.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { DetalleComponent } from './detalle/detalle.component';
import { OrdenItemsPipe } from '../pipes/orden-items.pipe';

import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ShareModule } from '../shared/shared.module';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { StoreModule } from '@ngrx/store';
import { moneyReducer } from './money.reducer';


@NgModule({
  declarations: [
    MoneyComponent,
    DashboardComponent,
    EstadisticaComponent,
    DetalleComponent,
    OrdenItemsPipe,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgChartsModule,
    ShareModule,
    DashboardRoutingModule,
    StoreModule.forFeature('ingresosGastos', moneyReducer)
  ]
})
export class MoneyModule { }
