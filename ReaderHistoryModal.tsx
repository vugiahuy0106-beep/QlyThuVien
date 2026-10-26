import React from 'react';
import { Modal } from '../../../core/components/Modal';
import { Reader } from '../types';
import { Loan } from '../../loans/types';
import { Mail, Phone, MapPin, Calendar, Clock, CheckCircle2, AlertTriangle, BookOpen, Undo2 } from 'lucide-react';

interface ReaderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reader: Reader | null;
  loans: Loan[];
  onReturnLoan?: (loan: Loan) => void;
}

export const ReaderHistoryModal: React.FC<ReaderHistoryModalProps> = ({
  isOpen,
  onClose,
  reader,
  loans,
  onReturnLoan,
}) => {
  if (!reader) return null;

  // Filter loans belonging to this reader
  const readerLoans = loans.filter((l) => l.readerId === reader.id);
  const activeCount = readerLoans.filter((l) => l.status === 'active').length;
  const overdueCount = readerLoans.filter((l) => l.status === 'overdue').length;
  const returnedCount = readerLoans.filter((l) => l.status === 'returned').length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lịch sử Mượn Trả: ${reader.fullName}`}
      description={`Mã thẻ: ${reader.readerCode} • Ngày đăng ký: ${reader.registeredAt || 'N/A'}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Contact info bar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              <span>{reader.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-500" />
              <span>{reader.phone}</span>
            </span>
            {reader.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>{reader.address}</span>
              </span>
            )}
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              reader.status === 'active'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
            }`}
          >
            {reader.status === 'active' ? 'Đang hoạt động' : 'Đang bị khóa'}
          </span>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">Đang mượn</span>
            <p className="text-xl font-bold text-amber-900 dark:text-amber-200 mt-0.5">{activeCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
            <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300">Quá hạn</span>
            <p className="text-xl font-bold text-rose-900 dark:text-rose-200 mt-0.5">{overdueCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">Đã hoàn trả</span>
            <p className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">{returnedCount}</p>
          </div>
        </div>

        {/* Loans Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Danh sách phiếu mượn ({readerLoans.length})
          </h4>

          {readerLoans.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Độc giả này chưa có lịch sử mượn sách nào.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              {readerLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-3.5 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{loan.bookTitle}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({loan.bookCode})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>Mã phiếu: {loan.loanCode}</span>
                      <span>Mượn: {loan.borrowDate}</span>
                      <span>Hạn trả: {loan.dueDate}</span>
                      {loan.returnDate && <span className="text-emerald-600 font-medium">Trả: {loan.returnDate}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        loan.status === 'returned'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : loan.status === 'overdue'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {loan.status === 'returned' ? 'Đã trả' : loan.status === 'overdue' ? 'Quá hạn' : 'Đang mượn'}
                    </span>

                    {loan.status !== 'returned' && onReturnLoan && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onReturnLoan(loan);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                      >
                        <Undo2 className="w-3 h-3" />
                        <span>Trả sách</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};
