import { Injectable, NgZone } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { db } from './firebase';

export interface Tarea {
  id: string;
  titulo: string;
}

// Las tareas viven en usuarios/{uid}/tareas, por lo que cada usuario solo accede a su propia ruta.
@Injectable({ providedIn: 'root' })
export class TareasService {
  constructor(private zone: NgZone) {}

  private tareasRef(uid: string) {
    return collection(db, 'usuarios', uid, 'tareas');
  }

  listar(uid: string): Observable<Tarea[]> {
    return new Observable<Tarea[]>((subscriber) => {
      const q = query(this.tareasRef(uid), orderBy('creadaEn', 'desc'));
      return onSnapshot(
        q,
        (snap) =>
          this.zone.run(() =>
            subscriber.next(
              snap.docs.map((d) => ({ id: d.id, titulo: d.data()['titulo'] as string }))
            )
          ),
        (err) => this.zone.run(() => subscriber.error(err))
      );
    });
  }

  async agregar(uid: string, titulo: string): Promise<void> {
    await addDoc(this.tareasRef(uid), { titulo, creadaEn: serverTimestamp() });
  }

  eliminar(uid: string, id: string): Promise<void> {
    return deleteDoc(doc(db, 'usuarios', uid, 'tareas', id));
  }
}
