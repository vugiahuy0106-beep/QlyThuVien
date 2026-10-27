export type LoanStatus = 'active' | 'returned' | 'overdue';

export interface Loan {
  id: string;
  loanCode: string; // Mã phiếu mượn (e.g. PM-2026-001)
  readerId: string;
  readerName: string;
  readerCode: string;
  bookId: string;
  bookTitle: string;
  bookCode: string;
  borrowDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  returnDate: string | null; // YYYY-MM-DD or null
  status: LoanStatus;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLoanDTO {
  readerId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  notes?: string;
}

export interface ReturnLoanDTO {
  loanId: string;
  returnDate: string;
  notes?: string;
}

export interface LoanFilter {
  search: string;
  status: 'all' | LoanStatus;
}
