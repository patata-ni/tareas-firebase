import { Injectable, NgZone } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { auth } from './firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();

  // Se resuelve cuando Firebase restaura (o descarta) la sesión inicial.
  readonly ready: Promise<void>;

  constructor(private zone: NgZone) {
    this.ready = new Promise<void>((resolve) => {
      onAuthStateChanged(auth, (user) => {
        this.zone.run(() => {
          this.userSubject.next(user);
          resolve();
        });
      });
    });
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  async register(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(auth);
  }
}
