import { Pipe, PipeTransform } from '@angular/core';
import { Money } from '../models/money.model';

@Pipe({
  name: 'ordenItems',
  standalone: false
})
export class OrdenItemsPipe implements PipeTransform {

  transform(items: Money[], criterios: { campo: keyof Money, direccion: 'asc' | 'desc' }[]): Money[] {
    if (!criterios?.length) return items;

    return items.slice().sort((a, b) => {
      for (const { campo, direccion } of criterios) {
        const valA = a[campo];
        const valB = b[campo];

        if( valA && valB){
          if (valA < valB) return direccion === 'asc' ? -1 : 1;
          if (valA > valB) return direccion === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }
  }
