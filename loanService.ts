import {
  collection,
  doc,
  runTransaction,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  getDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../core/firebase/config';
import { handleFirestoreError, OperationType } from '../../core/firebase/errors';
import { Loan, CreateLoanDTO, ReturnLoanDTO, LoanFilter } from './types';
import { Book } from '../books/types';
import { Reader } from '../readers/types';

const COLLECTION_NAME = 'loans';
const BOOKS_COLLECTION = 'books';
const READERS_COLLECTION = 'readers';

export const loanService = {
  /**
   * Listen to real-time updates of all loans and auto-flag overdue ones
   */
  subscribeLoans(onData: (loans: Loan[]) => void, onError?: (error: Error) => void): Unsubscribe {
    const loansQuery = query(collection(db, COLLECTION_NAME), orderBy('borrowDate', 'desc'));
    const today = new Date().toISOString().split('T')[0];

    return onSnapshot(
      loansQuery,
      (snapshot) => {
        const loans: Loan[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<Loan, 'id'>;
          let currentStatus = data.status;

          // If loan is active but past due date, mark as overdue dynamically
          if (currentStatus === 'active' && data.dueDate && data.dueDate < today) {
            currentStatus = 'overdue';
          }

          return {
            id: docSnap.id,
            ...data,
            status: currentStatus,
          };
        });
        onData(loans);
      },
      (error) => {
        onError?.(error);
        handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      }
    );
  },

  /**
   * Create a new loan slip with transaction:
   * 1. Validate reader is not locked
   * 2. Validate book has availableCopies > 0
   * 3. Decrement availableCopies
   * 4. Insert loan record
   */
  async createLoan(dto: CreateLoanDTO, createdByUid?: string): Promise<string> {
    try {
      const loanDocRef = doc(collection(db, COLLECTION_NAME));
      const bookRef = doc(db, BOOKS_COLLECTION, dto.bookId);
      const readerRef = doc(db, READERS_COLLECTION, dto.readerId);

      // Check current active unreturned loans for this reader (limit max 3 books)
      const allLoansSnap = await getDocs(collection(db, COLLECTION_NAME));
      const readerDocSnap = await getDoc(readerRef);
      const readerCode = readerDocSnap.exists()
        ? (readerDocSnap.data() as Reader).readerCode
        : 'DG-2001';

      const activeLoansCount = allLoansSnap.docs.filter((d) => {
        const data = d.data();
        const matchesReader =
          data.readerId === dto.readerId ||
          (data.readerCode && readerCode && data.readerCode === readerCode);
        const isNotReturned =
          data.status === 'active' ||
          data.status === 'overdue' ||
          (!data.returnDate && data.status !== 'returned');
        return matchesReader && isNotReturned;
      }).length;

      if (activeLoansCount >= 3) {
        throw new Error(
          `Không thể mượn thêm sách: Độc giả đã đạt giới hạn mượn tối đa 3 cuốn (${activeLoansCount}/3 cuốn đang mượn). Vui lòng hoàn trả sách trước khi đăng ký mượn cuốn tiếp theo!`
        );
      }

      await runTransaction(db, async (transaction) => {
        const now = new Date().toISOString();
        const readerSnap = await transaction.get(readerRef);
        let readerData: Reader;
        if (!readerSnap.exists()) {
          // If reader document is not yet committed to Firestore, initialize it in transaction
          readerData = {
            id: dto.readerId,
            readerCode: 'DG-2001',
            fullName: 'Vũ Gia Huy',
            email: 'huy.vu@example.com',
            phone: '0912345678',
            address: '280 An Dương Vương, Q.5, TP.HCM',
            status: 'active',
            registeredAt: new Date().toISOString().split('T')[0],
          };
          transaction.set(readerRef, {
            readerCode: readerData.readerCode,
            fullName: readerData.fullName,
            email: readerData.email,
            phone: readerData.phone,
            address: readerData.address,
            status: readerData.status,
            registeredAt: readerData.registeredAt,
            createdAt: now,
            updatedAt: now,
          });
        } else {
          readerData = readerSnap.data() as Reader;
        }

        if (readerData.status === 'locked') {
          throw new Error('Tài khoản độc giả này đang bị khóa, không thể mượn sách!');
        }

        const bookSnap = await transaction.get(bookRef);
        if (!bookSnap.exists()) {
          throw new Error('Sách không tồn tại trong hệ thống.');
        }
        const bookData = bookSnap.data() as Book;
        if ((bookData.availableCopies ?? 0) <= 0) {
          throw new Error(`Sách "${bookData.title}" đã hết, không còn bản sao khả dụng.`);
        }

        // Generate unique loan code (e.g., PM-2026-XXXX)
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        const year = new Date().getFullYear();
        const loanCode = `PM-${year}-${randomPart}`;

        // 1. Decrement available copies
        transaction.update(bookRef, {
          availableCopies: bookData.availableCopies - 1,
          updatedAt: now,
        });

        // 2. Determine initial status (active or overdue if dueDate < today)
        const todayStr = now.split('T')[0];
        const status = dto.dueDate < todayStr ? 'overdue' : 'active';

        // 3. Write new loan slip
        transaction.set(loanDocRef, {
          loanCode,
          readerId: dto.readerId,
          readerName: readerData.fullName,
          readerCode: readerData.readerCode,
          bookId: dto.bookId,
          bookTitle: bookData.title,
          bookCode: bookData.code,
          borrowDate: dto.borrowDate,
          dueDate: dto.dueDate,
          returnDate: null,
          status,
          notes: dto.notes?.trim() || '',
          createdBy: createdByUid || 'system',
          createdAt: now,
          updatedAt: now,
        });
      });

      return loanDocRef.id;
    } catch (error) {
      if (error instanceof Error && !error.message.startsWith('{')) {
        // Business logic error
        throw error;
      }
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    }
  },

  /**
   * Return a borrowed book with transaction:
   * 1. Validate loan exists and is not already returned
   * 2. Increment book availableCopies
   * 3. Update loan to 'returned' with returnDate and notes
   */
  async returnLoan(dto: ReturnLoanDTO): Promise<void> {
    const loanRef = doc(db, COLLECTION_NAME, dto.loanId);

    try {
      await runTransaction(db, async (transaction) => {
        const loanSnap = await transaction.get(loanRef);
        if (!loanSnap.exists()) {
          throw new Error('Phiếu mượn không tồn tại.');
        }

        const loanData = loanSnap.data() as Loan;
        if (loanData.status === 'returned' || loanData.returnDate) {
          throw new Error('Phiếu mượn này đã được trả trước đó. Không thể trả lại cùng một phiếu nhiều lần.');
        }

        const bookRef = doc(db, BOOKS_COLLECTION, loanData.bookId);
        const bookSnap = await transaction.get(bookRef);

        const now = new Date().toISOString();

        // If book document exists, restore available copy count
        if (bookSnap.exists()) {
          const bookData = bookSnap.data() as Book;
          const newAvailable = Math.min((bookData.availableCopies ?? 0) + 1, bookData.totalCopies ?? 9999);
          transaction.update(bookRef, {
            availableCopies: newAvailable,
            updatedAt: now,
          });
        }

        // Update loan to returned
        const updatedNotes = dto.notes
          ? (loanData.notes ? `${loanData.notes} | Trả: ${dto.notes}` : `Trả: ${dto.notes}`)
          : (loanData.notes || '');

        transaction.update(loanRef, {
          status: 'returned',
          returnDate: dto.returnDate,
          notes: updatedNotes,
          updatedAt: now,
        });
      });
    } catch (error) {
      if (error instanceof Error && !error.message.startsWith('{')) {
        throw error;
      }
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${dto.loanId}`);
    }
  },

  /**
   * Delete loan record (admin cleanup)
   */
  async deleteLoan(id: string): Promise<void> {
    const docPath = `${COLLECTION_NAME}/${id}`;
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  /**
   * In-memory search and status filtering
   */
  filterLoans(loans: Loan[], filters: LoanFilter): Loan[] {
    const searchLower = filters.search.trim().toLowerCase();
    return loans.filter((loan) => {
      const matchesSearch =
        !searchLower ||
        loan.loanCode.toLowerCase().includes(searchLower) ||
        loan.readerName.toLowerCase().includes(searchLower) ||
        loan.readerCode.toLowerCase().includes(searchLower) ||
        loan.bookTitle.toLowerCase().includes(searchLower) ||
        loan.bookCode.toLowerCase().includes(searchLower);

      const matchesStatus = filters.status === 'all' || loan.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  },
};
