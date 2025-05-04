import { DestroyRef, Injectable } from '@angular/core';
import { from, map, Observable, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CollectionReference, doc, DocumentData, Firestore, getDoc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { unsetUser } from '../auth/auth.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userDocuments$!: Observable<any[]>;
  userCollection!: CollectionReference;
  userDoc$!: Observable<any>;
  userDocSubscription?: Subscription;

  constructor(
    public auth: AngularFireAuth,
    private firestore: Firestore,
    private store: Store<AppState>,
    private destroyRef: DestroyRef
   ) {}

  initAuthListener(): void {
    this.auth.authState.subscribe((fUser)=> {
      if (fUser){
        this.userDoc$ = this.getUserDoc$(fUser.uid);
        this.userDocSubscription?.unsubscribe();

        this.userDocSubscription = this.userDoc$
          .subscribe(snapshot => {
            const user = snapshot.data() as Usuario;
            console.log(user);
            this.store.dispatch(authActions.setUser({ user }));
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
