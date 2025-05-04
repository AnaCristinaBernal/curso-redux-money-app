import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { CollectionReference, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userDocuments$!: Observable<any[]>;
  userCollection!: CollectionReference;

  constructor(
    public auth: AngularFireAuth,
    private firestore: Firestore
   ) {}

  initAuthListener(): void {
    this.auth.authState.subscribe((user)=> console.log(user));
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
}
