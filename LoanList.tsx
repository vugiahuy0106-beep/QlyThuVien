import React, { useState } from 'react';
import { Loan, LoanFilter, LoanStatus } from '../types';
import { loanService } from '../loanService';
import { BookCover } from '../../books/components/BookCover';
import { useToast } from '../../../core/context/ToastContext';
import { ConfirmDialog } from '../../../core/components/ConfirmDialog';
import { ReturnLoanModal } from './ReturnLoanModal';
import {
  Search,
  Plus,
  Trash2,
  Undo2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  BookOpen,
  Calendar,
} from 'lucide-react';

interface LoanListProps {
  loans: Loan[];
  onOpenCreateModal: () => void;
  onRefresh?: () => void;
}

export const LoanList: React.FC<LoanListProps> = ({ loans, onOpenCreateModal }) => {
  const { success, error } = useToast();

  const [filters, setFilters] = useState<LoanFilter>({
    search: '',
    status: 'all',
  });

  const [loanToReturn, setLoanToReturn] = useState<Loan | null>(null);
  const [loanToDelete, setLoanToDelete] = useState<Loan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredLoans = loanService.filterLoans(loans, filters);

  const handleReturnSubmit = async (dto: any) => {
    try {
      await loanService.returnLoan(dto);
      success(
        'Thu hồi sách thành công!',
        `Phiếu "${loanToReturn?.loanCode}" đã được ghi nhận hoàn trả. Bản sách khả dụng đã được tự động cộng lại vào kho.`
      );
      setLoanToReturn(null);
    } catch (err: any) {
      error('Lỗi khi trả sách', err.message);
    }
  };

  const handleDeleteLoan = async () => {
    if (!loanToDelete) return;
    setIsDeleting(true);
    try {
      await loanService.deleteLoan(loanToDelete.id);
      success('Xóa phiếu mượn thành công', `Đã xóa phiếu "${loanToDelete.loanCode}".`);
      setLoanToDelete(null);
    } catch (err: any) {
      error('Không thể xóa phiếu', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Status Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Tìm theo mã phiếu, tên/mã độc giả hoặc tên sách..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden transition-all"
            />
          </div>

          {/* Status filter tabs */}
          <div className="md:col-span-6 flex items-center bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
            {(
              [
                { id: 'all', label: 'Tất cả' },
                { id: 'active', label: 'Đang mượn' },
                { id: 'overdue', label: 'Quá hạn' },
                { id: 'returned', label: 'Đã trả' },
              ] as const
            ).map((tab) => {
              const count =
                tab.id === 'all'
                  ? loans.length
                  : loans.filter((l) => l.status === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilters({ ...filters, status: tab.id })}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    filters.status === tab.id
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      tab.id === 'overdue' && count > 0
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Hiển thị <strong>{filteredLoans.length}</strong> / {loans.length} phiếu mượn
          </span>
          {(filters.search || filters.status !== 'all') && (
            <button
              onClick={() => setFilters({ search: '', status: 'all' })}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {filteredLoans.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Không có phiếu mượn nào</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Chưa có giao dịch mượn sách nào theo tiêu chí tìm kiếm này.
            </p>
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo phiếu mượn mới</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Mã phiếu</th>
                  <th className="py-3.5 px-4">Độc giả</th>
                  <th className="py-3.5 px-4">Sách mượn</th>
                  <th className="py-3.5 px-4">Ngày mượn & Hạn trả</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLoans.map((loan) => {
                  const isOverdue = loan.status === 'overdue';
                  const isReturned = loan.status === 'returned';

                  return (
                    <tr
                      key={loan.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        isOverdue ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                      }`}
                    >
                      {/* Loan code */}
                      <td className="py-4 px-4 sm:px-6">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                          {loan.loanCode}
                        </span>
                        {loan.notes && (
                          <span className="text-[11px] text-slate-400 truncate max-w-44 block">
                            {loan.notes}
                          </span>
                        )}
                      </td>

                      {/* Reader */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{loan.readerName}</div>
                        <div className="text-xs text-slate-400 font-mono">Mã: {loan.readerCode}</div>
                      </td>

                      {/* Book with Cover Image */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <BookCover
                            book={{ title: loan.bookTitle, code: loan.bookCode }}
                            className="w-8 h-11 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                              {loan.bookTitle}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">Mã sách: {loan.bookCode}</div>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-4 text-xs">
                        <div className="space-y-0.5">
                          <div className="text-slate-600 dark:text-slate-400">
                            Mượn: <span className="font-medium">{loan.borrowDate}</span>
                          </div>
                          <div
                            className={`font-medium ${
                              isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            Hạn: <span>{loan.dueDate}</span>
                          </div>
                          {loan.returnDate && (
                            <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Đã trả: {loan.returnDate}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isReturned
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : isOverdue
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {isReturned ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isOverdue ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          <span>{isReturned ? 'Đã trả' : isOverdue ? 'Quá hạn' : 'Đang mượn'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isReturned && (
                            <button
                              type="button"
                              onClick={() => setLoanToReturn(loan)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                            >
                              <Undo2 className="w-3.5 h-3.5" />
                              <span>Trả sách</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setLoanToDelete(loan)}
                            title="Xóa phiếu mượn"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!loanToDelete}
        onClose={() => setLoanToDelete(null)}
        onConfirm={handleDeleteLoan}
        title="Xác nhận xóa phiếu mượn"
        message={`Bạn có chắc chắn muốn xóa phiếu mượn "${loanToDelete?.loanCode}" của độc giả "${loanToDelete?.readerName}"? Thao tác này sẽ xóa bản ghi khỏi Cloud Firestore.`}
        confirmText="Xóa phiếu"
        isLoading={isDeleting}
      />
    </div>
  );
};
