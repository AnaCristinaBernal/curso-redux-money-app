import { Routes } from "@angular/router";
import { EstadisticaComponent } from "../money/estadistica/estadistica.component";
import { MoneyComponent } from "../money/money.component";
import { DetalleComponent } from "../money/detalle/detalle.component";

export const dashboardRoutes: Routes = [
  { path: '', component: EstadisticaComponent },
  { path: 'money', component: MoneyComponent },
  { path: 'detalle', component: DetalleComponent },
]

