import { Injectable } from '@angular/core';
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { Observable, shareReplay } from 'rxjs';

import { firebaseAuth } from '../firebase/firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = firebaseAuth;

  readonly user$ = new Observable<User | null>((subscriber) => {
    if (!this.auth) {
      subscriber.next(null);
      subscriber.complete();
      return;
    }

    return onAuthStateChanged(this.auth, subscriber);
  }).pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  get currentUser() {
    return this.auth?.currentUser ?? null;
  }

  login(email: string, password: string) {
    const auth = this.auth;

    if (!auth) {
      return Promise.reject(new Error('Firebase no esta configurado'));
    }

    return setPersistence(auth, browserLocalPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password));
  }

  logout() {
    return this.auth ? signOut(this.auth) : Promise.resolve();
  }

}
