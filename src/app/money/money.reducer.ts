import { createReducer, on } from '@ngrx/store';
import { Money } from '../models/money.model';
import * as actions from './money.actions';
import { filter } from 'rxjs';

export interface State {
    items: Money[];
}

export const initialState: State = {
   items: [],
}

export const moneyReducer = createReducer(initialState,
  //desestructurar siempre, mirar si no es necesario el map
    on(actions.setItems, (state, {items}) => ({ ...state, items: [...items]})),
    on(actions.unsetItems, state => ({...state, items: []})),
    on(actions.deleteItem, (state, { uid }) => ({...state, items: state.items.filter(item=>item.uid !== uid)}))
);
