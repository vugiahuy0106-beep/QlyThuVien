import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../core/firebase/config';
import { handleFirestoreError, OperationType } from '../../core/firebase/errors';
import { Reader, ReaderFormData, ReaderFilter } from './types';

const COLLECTION_NAME = 'readers';

export const readerService = {
  /**
   * Listen to real-time updates of all readers
   */
  subscribeReaders(onData: (readers: Reader[]) => void, onError?: (error: Error) => void): Unsubscribe {
    const readersQuery = query(collection(db, COLLECTION_NAME), orderBy('fullName', 'asc'));

    return onSnapshot(
      readersQuery,
      (snapshot) => {
        const readers: Reader[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Reader, 'id'>),
        }));
        onData(readers);
      },
      (error) => {
        onError?.(error);
        handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      }
    );
  },

  /**
   * Add a new reader to Firestore
   */
  async addReader(data: ReaderFormData): Promise<string> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    }
  },

  /**
   * Update an existing reader
   */
  async updateReader(id: string, data: Partial<ReaderFormData>): Promise<void> {
    const docPath = `${COLLECTION_NAME}/${id}`;
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  /**
   * Lock or unlock reader account
   */
  async toggleLockReader(id: string, currentStatus: 'active' | 'locked'): Promise<'active' | 'locked'> {
    const nextStatus = currentStatus === 'active' ? 'locked' : 'active';
    await this.updateReader(id, { status: nextStatus });
    return nextStatus;
  },

  /**
   * Delete reader
   */
  async deleteReader(id: string): Promise<void> {
    const docPath = `${COLLECTION_NAME}/${id}`;
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  /**
   * In-memory search and status filter
   */
  filterReaders(readers: Reader[], filters: ReaderFilter): Reader[] {
    const searchLower = filters.search.trim().toLowerCase();
    return readers.filter((reader) => {
      const matchesSearch =
        !searchLower ||
        reader.fullName.toLowerCase().includes(searchLower) ||
        reader.readerCode.toLowerCase().includes(searchLower) ||
        reader.email.toLowerCase().includes(searchLower) ||
        reader.phone.toLowerCase().includes(searchLower);

      const matchesStatus = filters.status === 'all' || reader.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  },
};
