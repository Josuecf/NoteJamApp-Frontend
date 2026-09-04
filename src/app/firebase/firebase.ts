import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';

import { environment } from '../../environments/environment';

const firebaseApp = environment.firebase.apiKey && environment.firebase.projectId
  ? initializeApp(environment.firebase)
  : null;

export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;

export const firebaseFirestore: Firestore | null = firebaseApp
  ? initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    })
  : null;
