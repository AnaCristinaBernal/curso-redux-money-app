import { Component, DestroyRef, OnInit } from '@angular/core';
import { Money } from '../../models/money.model';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { AppStateWithMoney } from '../money.reducer';

@Component({
  selector: 'app-detalle',
  standalone: false,
  templateUrl: './detalle.component.html',
  styles: ``
})
export class DetalleComponent implements OnInit {

  ingresosGastos!: Money[];
  ordenCriterios: { campo: keyof Money, direccion: 'asc' | 'desc' }[] = [{campo:'tipo', direccion:'desc'}]
  isOrdered = this.ordenCriterios.length > 0;

  constructor(
    private store: Store<AppStateWithMoney>,
    private destroyRef: DestroyRef,
    private fireStore: Firestore,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.store.select('ingresosGastos')
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({items: ingresosGastosFB})=>this.ingresosGastos=ingresosGastosFB)
  }

  borrar(item: Money): void {
    if (!item.uid) return;
    const path = `${this.authService.user.uid}/ingresos-gastos/items/${item.uid}`;
    const docItemRef = doc(this.fireStore, path);
    deleteDoc(docItemRef)
      .then(()=>Swal.fire({
        title: 'EXITO',
        text: `El ${item.tipo} de ${item.descripcion} se ha borrado correctamente.`,
        icon: 'success'
      }))
      .catch(err=>Swal.fire('ERROR', err.message, 'error'));
      // this.store.dispatch(actions.deleteItem({uid: item.uid}));
  }

  ordenar(campo: keyof Money): void {
    const i = this.ordenCriterios.findIndex(c => c.campo === campo);

    const nueva = [...this.ordenCriterios];

    if (i >= 0) {
      nueva[i].direccion === 'asc'
        ? nueva[i].direccion = 'desc'
        : nueva.splice(i, 1);
    } else {
      nueva.push({ campo, direccion: 'asc' });
    }

    this.ordenCriterios = nueva; // nueva referencia = pipe se ejecuta
  }

  getOrdenIcono(campo: keyof Money): string | null {
    const criterio = this.ordenCriterios.find(c => c.campo === campo);
    if (!criterio) return null;
    return criterio.direccion === 'asc' ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
  }
}
