export interface TopBorrowedBook {
  bookId: string;
  code: string;
  title: string;
  author: string;
  category: string;
  borrowCount: number;
  availableCopies: number;
  totalCopies: number;
}

export interface OverdueLoanReport {
  loanId: string;
  loanCode: string;
  readerName: string;
  readerCode: string;
  readerPhone?: string;
  readerEmail?: string;
  bookTitle: string;
  bookCode: string;
  borrowDate: string;
  dueDate: string;
  daysOverdue: number;
}

export interface LowStockBook {
  id: string;
  code: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

export interface MonthlyLoanStat {
  monthKey: string; // "YYYY-MM"
  displayMonth: string; // "Tháng MM/YYYY"
  count: number;
}
