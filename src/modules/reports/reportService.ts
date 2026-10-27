import { Book } from '../books/types';
import { Reader } from '../readers/types';
import { Loan } from '../loans/types';
import { TopBorrowedBook, OverdueLoanReport, LowStockBook, MonthlyLoanStat } from './types';

export const reportService = {
  /**
   * Calculate top most borrowed books from real loans collection
   */
  getTopBorrowedBooks(books: Book[], loans: Loan[], limit = 5): TopBorrowedBook[] {
    const borrowCounts: Record<string, number> = {};

    // Count loans per bookId
    loans.forEach((loan) => {
      if (loan.bookId) {
        borrowCounts[loan.bookId] = (borrowCounts[loan.bookId] || 0) + 1;
      }
    });

    const bookMap = new Map<string, Book>();
    books.forEach((b) => bookMap.set(b.id, b));

    const result: TopBorrowedBook[] = [];

    // Map existing books that have loan counts
    Object.entries(borrowCounts).forEach(([bookId, count]) => {
      const book = bookMap.get(bookId);
      if (book) {
        result.push({
          bookId,
          code: book.code,
          title: book.title,
          author: book.author,
          category: book.category,
          borrowCount: count,
          availableCopies: book.availableCopies,
          totalCopies: book.totalCopies,
        });
      }
    });

    // Also include top books from total catalog even if borrowCount is low
    if (result.length < limit) {
      books.forEach((book) => {
        if (!borrowCounts[book.id]) {
          result.push({
            bookId: book.id,
            code: book.code,
            title: book.title,
            author: book.author,
            category: book.category,
            borrowCount: 0,
            availableCopies: book.availableCopies,
            totalCopies: book.totalCopies,
          });
        }
      });
    }

    result.sort((a, b) => b.borrowCount - a.borrowCount);
    return result.slice(0, limit);
  },

  /**
   * Extract overdue loans with enriched reader contact info and days overdue
   */
  getOverdueLoans(loans: Loan[], readers: Reader[]): OverdueLoanReport[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const readerMap = new Map<string, Reader>();
    readers.forEach((r) => readerMap.set(r.id, r));

    const overdueList: OverdueLoanReport[] = [];

    loans.forEach((loan) => {
      // Must not be returned and due date is in the past
      if (loan.status !== 'returned' && loan.dueDate && loan.dueDate < todayStr) {
        const dueDateObj = new Date(loan.dueDate);
        dueDateObj.setHours(0, 0, 0, 0);
        const diffTime = Math.max(0, today.getTime() - dueDateObj.getTime());
        const daysOverdue = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const reader = readerMap.get(loan.readerId);

        overdueList.push({
          loanId: loan.id,
          loanCode: loan.loanCode,
          readerName: loan.readerName,
          readerCode: loan.readerCode,
          readerPhone: reader?.phone,
          readerEmail: reader?.email,
          bookTitle: loan.bookTitle,
          bookCode: loan.bookCode,
          borrowDate: loan.borrowDate,
          dueDate: loan.dueDate,
          daysOverdue,
        });
      }
    });

    overdueList.sort((a, b) => b.daysOverdue - a.daysOverdue);
    return overdueList;
  },

  /**
   * Find books with low available copies (e.g. <= 2)
   */
  getLowStockBooks(books: Book[], threshold = 2): LowStockBook[] {
    return books
      .filter((b) => (b.availableCopies ?? 0) <= threshold)
      .sort((a, b) => a.availableCopies - b.availableCopies)
      .map((b) => ({
        id: b.id,
        code: b.code,
        title: b.title,
        author: b.author,
        category: b.category,
        totalCopies: b.totalCopies,
        availableCopies: b.availableCopies,
        shelfLocation: b.shelfLocation || 'Chưa xếp',
      }));
  },

  /**
   * Group loans into monthly statistics for the last 6 months
   */
  getMonthlyLoanStats(loans: Loan[]): MonthlyLoanStat[] {
    const monthsMap = new Map<string, number>();

    // Generate past 6 months keys
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthsMap.set(key, 0);
    }

    loans.forEach((loan) => {
      if (loan.borrowDate) {
        const key = loan.borrowDate.substring(0, 7); // "YYYY-MM"
        if (monthsMap.has(key)) {
          monthsMap.set(key, (monthsMap.get(key) || 0) + 1);
        }
      }
    });

    const result: MonthlyLoanStat[] = [];
    monthsMap.forEach((count, key) => {
      const [year, month] = key.split('-');
      result.push({
        monthKey: key,
        displayMonth: `Tháng ${month}/${year}`,
        count,
      });
    });

    return result;
  },

  /**
   * Export books to CSV file with UTF-8 BOM for proper Vietnamese diacritics in Excel
   */
  exportBooksToCsv(books: Book[], filename = 'danh-sach-sach.csv'): void {
    const headers = [
      'Mã sách',
      'ISBN',
      'Tên sách',
      'Tác giả',
      'Thể loại',
      'Nhà xuất bản',
      'Năm XB',
      'Tổng số lượng',
      'Còn lại',
      'Vị trí kệ',
    ];

    const rows = books.map((b) => [
      `"${(b.code || '').replace(/"/g, '""')}"`,
      `"${(b.isbn || '').replace(/"/g, '""')}"`,
      `"${(b.title || '').replace(/"/g, '""')}"`,
      `"${(b.author || '').replace(/"/g, '""')}"`,
      `"${(b.category || '').replace(/"/g, '""')}"`,
      `"${(b.publisher || '').replace(/"/g, '""')}"`,
      b.publishYear || '',
      b.totalCopies || 0,
      b.availableCopies || 0,
      `"${(b.shelfLocation || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
  },

  /**
   * Export loans to CSV file with UTF-8 BOM
   */
  exportLoansToCsv(loans: Loan[], filename = 'danh-sach-phieu-muon.csv'): void {
    const headers = [
      'Mã phiếu',
      'Mã độc giả',
      'Họ tên độc giả',
      'Mã sách',
      'Tên sách',
      'Ngày mượn',
      'Hạn trả',
      'Ngày trả thực tế',
      'Trạng thái',
      'Ghi chú',
    ];

    const statusMap: Record<string, string> = {
      active: 'Đang mượn',
      returned: 'Đã trả',
      overdue: 'Quá hạn',
    };

    const rows = loans.map((l) => [
      `"${(l.loanCode || '').replace(/"/g, '""')}"`,
      `"${(l.readerCode || '').replace(/"/g, '""')}"`,
      `"${(l.readerName || '').replace(/"/g, '""')}"`,
      `"${(l.bookCode || '').replace(/"/g, '""')}"`,
      `"${(l.bookTitle || '').replace(/"/g, '""')}"`,
      l.borrowDate || '',
      l.dueDate || '',
      l.returnDate || '',
      `"${statusMap[l.status] || l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    downloadBlob(csvContent, filename, 'text/csv;charset=utf-8;');
  },
};

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
