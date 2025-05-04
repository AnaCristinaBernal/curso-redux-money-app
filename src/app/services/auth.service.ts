import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CollectionReference, doc, DocumentData, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userDocuments$!: Observable<any[]>;
  userCollection!: CollectionReference;
  userDoc$!: Observable<any>;
  userDocSubscription?: Subscription;
  private _user!: Usuario;

  get user(): Usuario {
    return this._user;
  }

  constructor(
    public auth: AngularFireAuth,
    private firestore: Firestore,
    private store: Store<AppState>,
   ) {}

  initAuthListener(): void {
    this.auth.authState.subscribe((fUser)=> {
      if (fUser){
        this.userDoc$ = this.getUserDoc$(fUser.uid);
        this.userDocSubscription?.unsubscribe();

        this.userDocSubscription = this.userDoc$
          .subscribe(snapshot => {
            this._user = snapshot.data() as Usuario;
            this.store.dispatch(authActions.setUser({ user: this._user }));
          });
      } else {
        this.userDocSubscription?.unsubscribe();
        this.store.dispatch(authActions.unsetUser());
      }
    });
  }

  crearUsuario(nombre: string, correo: string, pass: string): Promise<any>  {
    return this.auth.createUserWithEmailAndPassword(correo, pass).then( ({ user })=> {
      const newUser = new Usuario(user!.uid, nombre, correo);
      const userDocRef = doc(this.firestore, `${newUser.uid}/usuario`);
      return setDoc(userDocRef, { ...newUser });
    });
  }

  login(correo: string, pass: string): Promise<any>  {
    return this.auth.signInWithEmailAndPassword(correo, pass);
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth.authState.pipe(map(user=>user !== null ));
  }

  getUserDoc$(uid: string): Observable<DocumentData | undefined> {
    const userDocRef = doc(this.firestore, `${uid}/usuario`);

    return new Observable(observer => {
      const unsubscribe = onSnapshot(userDocRef, snapshot => {
        observer.next(snapshot);
      }, error => {
        observer.error(error);
      });

      // Limpieza al desuscribirse
      return () => unsubscribe();
    });
  }
}
