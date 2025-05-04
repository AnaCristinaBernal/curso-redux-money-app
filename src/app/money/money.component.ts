import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoneyService } from '../services/money.service';
import { Money } from '../models/money.model';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { isLoading, stopLoading } from '../shared/ui.actions';
import { AppState } from '../app.reducer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-money',
  standalone: false,
  templateUrl: './money.component.html',
  styles: ``
})
export class MoneyComponent implements OnInit {

  moneyForm!: FormGroup;
  tipo: string = 'ingreso';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private moneyService: MoneyService,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
  ){}

  ngOnInit(): void {
    this.moneyForm = this.fb.group({
      descripcion: ['', Validators.required],
      importe: ['', [Validators.required, Validators.min(1)]]
    });
    this.store.select('ui')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({isLoading})=> {
        this.cargando = isLoading
      })
  }

  guardar(): void {
    this.store.dispatch(isLoading());
    if (this.moneyForm.invalid) return;
    const {descripcion, importe} = this.moneyForm.value;
    const ingresoGasto = new Money(descripcion,importe,this.tipo)
    delete ingresoGasto.uid;
    this.moneyService.crearIngresoGasto(ingresoGasto)
      .then(() => {
        this.moneyForm.reset();
        this.store.dispatch(stopLoading());
        Swal.fire('Operación realizada correctamente', descripcion ,'success')
      })
      .catch((err)=> {
        this.store.dispatch(stopLoading());
        Swal.fire('No se ha podido realizar la operación', err.message ,'error')
    });
  }
}
