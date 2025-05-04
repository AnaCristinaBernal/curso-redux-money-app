import { createReducer, on } from '@ngrx/store';
import { isLoading, stopLoading, newUser } from './ui.actions';

export interface State {
    isLoading: boolean;
    counter: number;
}

export const initialState: State = {
   isLoading: false,
   counter: 2
}

export const uiReducer = createReducer(initialState,
  on(isLoading, state => ({ ...state, isLoading: true})),
  on(stopLoading, state => ({...state, isLoading: false})),
  on(newUser, state => ({...state, counter: state.counter + 1}))
);
