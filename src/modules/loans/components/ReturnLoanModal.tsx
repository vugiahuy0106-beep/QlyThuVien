import React, { useState, useEffect } from 'react';
import { Modal } from '../../../core/components/Modal';
import { Loan, ReturnLoanDTO } from '../types';
import { Loader2, Undo2, AlertCircle, BookCheck } from 'lucide-react';

interface ReturnLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: Loan | null;
  onSubmit: (dto: ReturnLoanDTO) => Promise<void>;
}

export const ReturnLoanModal: React.FC<ReturnLoanModalProps> = ({
  isOpen,
  onClose,
  loan,
  onSubmit,
}) => {
  const getToday = () => new Date().toISOString().split('T')[0];
  const [returnDate, setReturnDate] = useState(getToday());
  const [notes, setNotes] = useState('Sách hoàn trả đầy đủ, nguyên vẹn');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReturnDate(getToday());
      setNotes('Sách hoàn trả đầy đủ, nguyên vẹn');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!loan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate) {
      setErrorMsg('Vui lòng chọn ngày trả thực tế.');
      return;
    }

    if (loan.status === 'returned' || loan.returnDate) {
      setErrorMsg('Phiếu mượn này đã được trả trước đó. Không thể thao tác lại.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        loanId: loan.id,
        returnDate,
        notes,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi ghi nhận trả sách.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận Thu hồi / Trả Sách"
      description={`Mã phiếu: ${loan.loanCode} • Sách: ${loan.bookTitle}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Loan summary card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Độc giả:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {loan.readerName} ({loan.readerCode})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Ấn phẩm:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {loan.bookTitle} ({loan.bookCode})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Ngày mượn:</span>
            <span className="text-slate-700 dark:text-slate-300">{loan.borrowDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Hạn trả quy định:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{loan.dueDate}</span>
          </div>
        </div>

        {/* Return date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ngày trả thực tế <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ghi chú khi trả sách
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tình trạng sách khi trả..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
          />
        </div>

        <p className="text-[11px] text-slate-400 italic">
          * Khi hoàn tất, hệ thống sẽ tự động cộng 1 bản vào số lượng sách khả dụng trong kho sách.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <BookCheck className="w-4 h-4" />
            <span>Xác nhận hoàn trả</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
