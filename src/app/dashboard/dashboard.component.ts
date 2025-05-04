import { Component, DestroyRef, OnInit } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { concatMap, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MoneyService } from '../services/money.service';
import * as actions from '../money/money.actions';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit{

  uid: string | undefined;

  constructor(
    private store: Store<AppState>,
    private destroyRef: DestroyRef,
    private moneyService: MoneyService
  ){}

  ngOnInit(): void {
    this.store.select('auth')
      .pipe(
        filter((auth)=>auth.user!==null),
        takeUntilDestroyed(this.destroyRef),
        concatMap(({user}) => this.moneyService.initIngresosGastosListener(user!.uid))
      )
      .subscribe((ingresosGastos)=>this.store.dispatch(actions.setItems({items: ingresosGastos})));
      // .subscribe(({user}) => this.moneyService.renameDocWithSubcollection(user!.uid));

  }
}
