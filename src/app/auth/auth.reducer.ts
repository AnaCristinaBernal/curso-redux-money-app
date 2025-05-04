import { createReducer, on } from '@ngrx/store';
import * as actions from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
    user: Usuario | null;
}

export const initialState: State = {
   user: null,
}

export const authReducer = createReducer(initialState,
    on(actions.setUser, (state, { user }) => ({ ...state, user: {...user}})),
    on(actions.unsetUser, state => ({...state, user: null}))
);
