import { Injectable } from '@angular/core';
import { Auth, browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = this.createAuth();

  readonly user$ = new Observable<User | null>((subscriber) => {
    if (!this.auth) {
      subscriber.next(null);
      subscriber.complete();
      return;
    }

    return onAuthStateChanged(this.auth, subscriber);
  });

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

  private createAuth(): Auth | null {
    if (!environment.firebase.apiKey || !environment.firebase.projectId) {
      return null;
    }

    return getAuth(initializeApp(environment.firebase));
  }
}
