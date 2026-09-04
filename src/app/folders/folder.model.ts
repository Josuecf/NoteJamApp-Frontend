import { Timestamp } from 'firebase/firestore';

export interface Folder {
  id: string;
  userId: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
