import { createAction, props } from '@ngrx/store';
import { Money } from '../models/money.model';

export const setItems = createAction('[Money Component] setItems',
props<{items: Money[]}>()
);

export const unsetItems = createAction('[Money Component] unsetItems');
export const deleteItem = createAction('[Money Component] deleteItem',
  props<{uid:string}>()
);
