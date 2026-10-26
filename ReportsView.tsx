import React, { useState } from 'react';
import { Book } from '../../books/types';
import { Reader } from '../../readers/types';
import { Loan } from '../../loans/types';
import { reportService } from '../reportService';
import { useToast } from '../../../core/context/ToastContext';
import { ReturnLoanModal } from '../../loans/components/ReturnLoanModal';
import { loanService } from '../../loans/loanService';
import {
  Download,
  FileSpreadsheet,
  AlertTriangle,
  Flame,
  PackageX,
  Clock,
  Phone,
  Mail,
  Undo2,
  CheckCircle2,
  Award,
} from 'lucide-react';

interface ReportsViewProps {
  books: Book[];
  readers: Reader[];
  loans: Loan[];
  onReturnLoanSuccess?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ books, readers, loans }) => {
  const { success, error } = useToast();
  const [loanToReturn, setLoanToReturn] = useState<Loan | null>(null);

  // Compute reports from real live data
  const topBooks = reportService.getTopBorrowedBooks(books, loans, 6);
  const overdueLoans = reportService.getOverdueLoans(loans, readers);
  const lowStockBooks = reportService.getLowStockBooks(books, 2);

  const handleExportBooks = () => {
    try {
      reportService.exportBooksToCsv(books);
      success('Xuất file thành công', `Đã tải về danh sách ${books.length} ấn phẩm định dạng CSV.`);
    } catch (err: any) {
      error('Lỗi xuất CSV', err.message);
    }
  };

  const handleExportLoans = () => {
    try {
      reportService.exportLoansToCsv(loans);
      success('Xuất file thành công', `Đã tải về danh sách ${loans.length} phiếu mượn định dạng CSV.`);
    } catch (err: any) {
      error('Lỗi xuất CSV', err.message);
    }
  };

  const handleReturnSubmit = async (dto: any) => {
    try {
      await loanService.returnLoan(dto);
      success('Đã thu hồi sách quá hạn', 'Phiếu mượn đã được hoàn tất và số lượng sách đã được hoàn kho.');
      setLoanToReturn(null);
    } catch (err: any) {
      error('Lỗi khi trả sách', err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* CSV Export Bar */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-800/80 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold">Xuất Dữ liệu Báo cáo (CSV UTF-8)</h3>
            </div>
            <p className="text-xs text-indigo-200">
              Xuất dữ liệu chuẩn mã hóa tiếng Việt (UTF-8 with BOM), tương thích tuyệt đối với Microsoft Excel
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportBooks}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Danh mục Sách ({books.length})</span>
            </button>

            <button
              type="button"
              onClick={handleExportLoans}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Phiếu Mượn ({loans.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Top Borrowed & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Borrowed Books */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Sách Được Mượn Nhiều Nhất</h3>
              <p className="text-xs text-slate-500">Xếp hạng theo tổng số lượt phát hành phiếu mượn</p>
            </div>
          </div>

          {topBooks.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Chưa có dữ liệu lượt mượn.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {topBooks.map((item, index) => (
                <div key={item.bookId} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        index === 0
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : index === 1
                          ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : index === 2
                          ? 'bg-amber-800/10 text-amber-800 dark:text-amber-600'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 dark:text-white block truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.author} &bull; {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                      {item.borrowCount} lượt
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Còn {item.availableCopies}/{item.totalCopies} bản
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Books */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <PackageX className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Cảnh Báo Sách Sắp Hết / Đã Hết</h3>
              <p className="text-xs text-slate-500">Các ấn phẩm có số bản khả dụng trong kho &le; 2 bản</p>
            </div>
          </div>

          {lowStockBooks.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-600 dark:text-emerald-400 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8" />
              <span>Tất cả ấn phẩm đều còn số lượng khả dụng dồi dào trên kệ!</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {lowStockBooks.map((book) => {
                const isOutOfStock = book.availableCopies <= 0;
                return (
                  <div key={book.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-900 dark:text-white block truncate">
                        {book.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Mã: {book.code} &bull; Kệ: {book.shelfLocation}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {isOutOfStock ? 'Hết bản sao (0)' : `Còn ${book.availableCopies} bản`}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Tổng kho: {book.totalCopies}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Overdue Loans Full List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Danh Sách Phiếu Mượn Quá Hạn ({overdueLoans.length})
              </h3>
              <p className="text-xs text-slate-500">
                Các độc giả chưa hoàn trả tài liệu theo hạn quy định & thông tin liên hệ
              </p>
            </div>
          </div>
        </div>

        {overdueLoans.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Tuyệt vời! Không có phiếu mượn nào bị quá hạn.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50/60 dark:bg-rose-950/20 text-[11px] uppercase font-bold tracking-wider text-rose-800 dark:text-rose-300 border-b border-rose-200 dark:border-rose-900/40">
                <tr>
                  <th className="py-3 px-4">Mã phiếu</th>
                  <th className="py-3 px-4">Độc giả & Liên hệ</th>
                  <th className="py-3 px-4">Sách mượn</th>
                  <th className="py-3 px-4">Ngày mượn & Hạn trả</th>
                  <th className="py-3 px-4 text-center">Quá hạn</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {overdueLoans.map((item) => (
                  <tr key={item.loanId} className="hover:bg-rose-50/20 dark:hover:bg-rose-950/10">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.loanCode}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.readerName} ({item.readerCode})
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-0.5">
                        {item.readerPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{item.readerPhone}</span>
                          </span>
                        )}
                        {item.readerEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{item.readerEmail}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {item.bookTitle}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <div>Mượn: {item.borrowDate}</div>
                      <div className="text-rose-600 dark:text-rose-400 font-bold">Hạn: {item.dueDate}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                        Trễ {item.daysOverdue} ngày
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const originalLoan = loans.find((l) => l.id === item.loanId);
                          if (originalLoan) setLoanToReturn(originalLoan);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Thu hồi sách</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Return Loan Modal */}
      <ReturnLoanModal
        isOpen={!!loanToReturn}
        onClose={() => setLoanToReturn(null)}
        loan={loanToReturn}
        onSubmit={handleReturnSubmit}
      />
    </div>
  );
};
