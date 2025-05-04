import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Money } from '../models/money.model';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoneyService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  crearIngresoGasto(money: Money): Promise<any> {
    return addDoc(
      collection(this.firestore, `${this.authService.user.uid}/ingresos-gastos/items`),
      { ...money }
    );
  }

  initIngresosGastosListener(uid: string): Observable<Money[]>{
    const itemsRef = collection(this.firestore, `${uid}/ingresos-gastos/items`);
    return new Observable(observer => {
      const unsubscribe = onSnapshot(itemsRef, snapshot => {
      const items = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...(doc.data() as any)
      }));
      observer.next(items);
      }, error => {
        observer.error(error);
      });
      // Limpieza al desuscribirse
      return () => unsubscribe();
    });
  }

  async renameDocWithSubcollection(uid: string) {
    const oldDocPath = `${uid}/ingresos-egresos`;
    const newDocPath = `${uid}/ingresos-gastos`;

    const oldDocRef = doc(this.firestore, oldDocPath);
    const newDocRef = doc(this.firestore, newDocPath);

    // 1. Copiar los datos del documento principal
    const snapshot = await getDoc(oldDocRef);

    if (!snapshot.exists()) {
      console.error('Documento original no encontrado.');
      return;
    }

    const data = snapshot.data();
    await setDoc(newDocRef, data);

    // 2. Copiar subcolección 'items'
    const oldItemsRef = collection(this.firestore, `${oldDocPath}/items`);
    const newItemsPath = `${newDocPath}/items`;

    const itemsSnapshot = await getDocs(oldItemsRef);

    for (const itemDoc of itemsSnapshot.docs) {
      const newItemRef = doc(this.firestore, `${newItemsPath}/${itemDoc.id}`);
      await setDoc(newItemRef, itemDoc.data());
    }

    // 3. (Opcional) Eliminar los documentos originales
    for (const itemDoc of itemsSnapshot.docs) {
      await deleteDoc(itemDoc.ref);
    }

    await deleteDoc(oldDocRef);

    console.log('Documento y subcolección renombrados correctamente.');
  }
  }
