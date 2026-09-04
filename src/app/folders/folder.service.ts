import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Observable, of, switchMap } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { firebaseFirestore } from '../firebase/firebase';
import { Folder } from './folder.model';

@Injectable({ providedIn: 'root' })
export class FolderService {
  private readonly firestore = firebaseFirestore;

  readonly folders$: Observable<Folder[]> = this.authService.user$.pipe(
    switchMap((user) => {
      if (!user || !this.firestore) {
        return of([]);
      }

      const foldersQuery = query(
        collection(this.firestore, 'folders'),
        where('userId', '==', user.uid)
      );

      return new Observable<Folder[]>((subscriber) => onSnapshot(
        foldersQuery,
        (snapshot) => subscriber.next(snapshot.docs
          .map((folder) => ({
            id: folder.id,
            ...folder.data()
          } as Folder))
          .sort((first, second) => first.name.localeCompare(second.name))),
        (error) => subscriber.error(error)
      ));
    })
  );

  constructor(private readonly authService: AuthService) {}

  create(name: string) {
    const user = this.authService.currentUser;
    const normalizedName = name.trim();

    if (!user || !this.firestore || !normalizedName) {
      return Promise.reject(new Error('No se puede crear la carpeta'));
    }

    return addDoc(collection(this.firestore, 'folders'), {
      userId: user.uid,
      name: normalizedName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  rename(folderId: string, name: string) {
    const normalizedName = name.trim();

    if (!this.firestore || !normalizedName) {
      return Promise.reject(new Error('El nombre de la carpeta es obligatorio'));
    }

    return updateDoc(doc(this.firestore, 'folders', folderId), {
      name: normalizedName,
      updatedAt: serverTimestamp()
    });
  }

  delete(folderId: string) {
    if (!this.firestore) {
      return Promise.reject(new Error('Firestore no esta configurado'));
    }

    return deleteDoc(doc(this.firestore, 'folders', folderId));
  }

}
