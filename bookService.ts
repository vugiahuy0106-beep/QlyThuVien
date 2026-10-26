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
import { Book, BookFormData, BookFilter } from './types';

const COLLECTION_NAME = 'books';

export const bookService = {
  /**
   * Listen to real-time updates of all books
   */
  subscribeBooks(onData: (books: Book[]) => void, onError?: (error: Error) => void): Unsubscribe {
    const booksQuery = query(collection(db, COLLECTION_NAME), orderBy('title', 'asc'));

    return onSnapshot(
      booksQuery,
      (snapshot) => {
        const seenCodes = new Set<string>();
        const seenTitles = new Set<string>();
        const books: Book[] = [];

        for (const docSnap of snapshot.docs) {
          const item: Book = {
            id: docSnap.id,
            ...(docSnap.data() as Omit<Book, 'id'>),
          };
          const normalizedCode = (item.code || docSnap.id).trim().toUpperCase();
          const normalizedTitle = (item.title || '').trim().toLowerCase();

          if (!seenCodes.has(normalizedCode) && !seenTitles.has(normalizedTitle)) {
            seenCodes.add(normalizedCode);
            if (normalizedTitle) seenTitles.add(normalizedTitle);
            books.push(item);
          }
        }
        onData(books);
      },
      (error) => {
        onError?.(error);
        handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      }
    );
  },

  /**
   * Add a new book to Firestore
   */
  async addBook(data: BookFormData): Promise<string> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        totalCopies: Number(data.totalCopies),
        availableCopies: Number(data.availableCopies),
        publishYear: Number(data.publishYear),
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    }
  },

  /**
   * Update an existing book in Firestore
   */
  async updateBook(id: string, data: Partial<BookFormData>): Promise<void> {
    const docPath = `${COLLECTION_NAME}/${id}`;
    try {
      const cleanData: Record<string, unknown> = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      if (data.totalCopies !== undefined) cleanData.totalCopies = Number(data.totalCopies);
      if (data.availableCopies !== undefined) cleanData.availableCopies = Number(data.availableCopies);
      if (data.publishYear !== undefined) cleanData.publishYear = Number(data.publishYear);

      await updateDoc(doc(db, COLLECTION_NAME, id), cleanData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  /**
   * Delete a book from Firestore
   */
  async deleteBook(id: string): Promise<void> {
    const docPath = `${COLLECTION_NAME}/${id}`;
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  /**
   * Filter books by keyword (code, title, author), category, and stock status
   */
  filterBooks(books: Book[], filters: BookFilter): Book[] {
    const searchLower = filters.search.trim().toLowerCase();
    return books.filter((book) => {
      // Search filter
      const matchesSearch =
        !searchLower ||
        book.title.toLowerCase().includes(searchLower) ||
        book.code.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        (book.isbn && book.isbn.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory = !filters.category || book.category === filters.category;

      // Stock filter
      let matchesStock = true;
      if (filters.stockStatus === 'in_stock') {
        matchesStock = book.availableCopies > 0;
      } else if (filters.stockStatus === 'out_of_stock') {
        matchesStock = book.availableCopies <= 0;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  },
};
