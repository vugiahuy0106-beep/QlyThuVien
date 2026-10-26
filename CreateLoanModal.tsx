import React, { useState, useEffect } from 'react';
import { Modal } from '../../../core/components/Modal';
import { Book } from '../../books/types';
import { Reader } from '../../readers/types';
import { CreateLoanDTO, Loan } from '../types';
import { useAuth } from '../../auth/AuthContext';
import { Loader2, AlertCircle, Calendar, BookOpen, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { getBookCoverUrl } from '../../books/bookCoverHelper';

interface CreateLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  readers: Reader[];
  loans?: Loan[];
  onSubmit: (dto: CreateLoanDTO) => Promise<void>;
  preselectedBook?: Book | null;
  preselectedReader?: Reader | null;
}

export const CreateLoanModal: React.FC<CreateLoanModalProps> = ({
  isOpen,
  onClose,
  books,
  readers,
  loans = [],
  onSubmit,
  preselectedBook,
  preselectedReader,
}) => {
  const { user } = useAuth();

  const getToday = () => new Date().toISOString().split('T')[0];
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 14 days borrowing period
    return d.toISOString().split('T')[0];
  };

  const [selectedReaderId, setSelectedReaderId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [borrowDate, setBorrowDate] = useState(getToday());
  const [dueDate, setDueDate] = useState(getDefaultDueDate());
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedReaderId(preselectedReader?.id || (readers.find((r) => r.status === 'active')?.id || ''));
      setSelectedBookId(preselectedBook?.id || (books.find((b) => (b.availableCopies ?? 0) > 0)?.id || ''));
      setBorrowDate(getToday());
      setDueDate(getDefaultDueDate());
      setNotes('');
      setErrorMsg(null);
    }
  }, [isOpen, preselectedBook, preselectedReader, books, readers]);

  const selectedReader = readers.find((r) => r.id === selectedReaderId);
  const selectedBook = books.find((b) => b.id === selectedBookId);

  const selectedReaderActiveLoans = loans.filter((l) => {
    if (!selectedReader) return l.readerId === selectedReaderId;
    const isMatching = l.readerId === selectedReader.id || l.readerCode === selectedReader.readerCode;
    const isActive = l.status === 'active' || l.status === 'overdue' || (!l.returnDate && l.status !== 'returned');
    return isMatching && isActive;
  });
  const readerActiveLoansCount = selectedReaderActiveLoans.length;
  const isReaderLimitReached = readerActiveLoansCount >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedReaderId) {
      setErrorMsg('Vui lòng chọn độc giả.');
      return;
    }
    if (selectedReader?.status === 'locked') {
      setErrorMsg('Thẻ độc giả này đang bị KHÓA. Vui lòng mở khóa thẻ trước khi cho mượn.');
      return;
    }
    if (isReaderLimitReached) {
      setErrorMsg(
        `Không thể mượn thêm vì đã đến giới hạn: Độc giả "${selectedReader?.fullName || 'này'}" đang mượn ${readerActiveLoansCount}/3 cuốn sách tối đa. Vui lòng hoàn trả sách trước khi lập thêm phiếu mượn!`
      );
      return;
    }
    if (!selectedBookId) {
      setErrorMsg('Vui lòng chọn sách cần mượn.');
      return;
    }
    if ((selectedBook?.availableCopies ?? 0) <= 0) {
      setErrorMsg(`Sách "${selectedBook?.title}" đã hết bản sao khả dụng (Còn lại: 0). Không thể lập phiếu.`);
      return;
    }
    if (!borrowDate) {
      setErrorMsg('Vui lòng chọn ngày mượn.');
      return;
    }
    if (!dueDate) {
      setErrorMsg('Vui lòng chọn hạn trả sách.');
      return;
    }
    if (dueDate < borrowDate) {
      setErrorMsg('Hạn trả sách không thể trước ngày mượn!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        readerId: selectedReaderId,
        bookId: selectedBookId,
        borrowDate,
        dueDate,
        notes,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tạo phiếu mượn.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lập Phiếu Mượn Sách Mới"
      description="Ghi nhận mượn tài liệu và tự động trừ số lượng bản sách khả dụng trong kho (tối đa 3 cuốn/độc giả)"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Reader selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Chọn Độc giả <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedReaderId}
            onChange={(e) => setSelectedReaderId(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
          >
            <option value="">-- Chọn độc giả --</option>
            {readers.map((r) => {
              const rLoansCount = loans.filter((l) => (l.readerId === r.id || l.readerCode === r.readerCode) && (l.status === 'active' || l.status === 'overdue' || (!l.returnDate && l.status !== 'returned'))).length;
              return (
                <option key={r.id} value={r.id} disabled={r.status === 'locked'}>
                  {r.fullName} ({r.readerCode}) — Đang giữ: {rLoansCount}/3 cuốn {r.status === 'locked' ? '[KHÓA]' : ''} {rLoansCount >= 3 ? '[ĐÃ ĐẦY]' : ''}
                </option>
              );
            })}
          </select>

          {selectedReader && (
            <div className="mt-2 space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedReader.fullName}</span>
                  <span className="text-slate-400 ml-2">Email: {selectedReader.email} • Mã: {selectedReader.readerCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      isReaderLimitReached
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    }`}
                  >
                    Đang mượn: {readerActiveLoansCount}/3 cuốn
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      selectedReader.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {selectedReader.status === 'active' ? 'Thẻ hợp lệ' : 'Thẻ bị khóa'}
                  </span>
                </div>
              </div>

              {isReaderLimitReached && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>
                    <strong>Đã đạt giới hạn mượn:</strong> Độc giả đang giữ {readerActiveLoansCount}/3 cuốn sách. Không thể mượn thêm vì đã đến giới hạn!
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Book selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Chọn Ấn phẩm cần mượn <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
          >
            <option value="">-- Chọn sách --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id} disabled={(b.availableCopies ?? 0) <= 0}>
                {b.title} ({b.code}) — Còn: {b.availableCopies}/{b.totalCopies} bản
                {(b.availableCopies ?? 0) <= 0 ? ' [HẾT SÁCH]' : ''}
              </option>
            ))}
          </select>

          {selectedBook && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={getBookCoverUrl(selectedBook)}
                  alt={selectedBook.title}
                  className="w-10 h-14 object-cover rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 dark:text-white block truncate">{selectedBook.title}</span>
                  <span className="text-slate-500 dark:text-slate-400">Tác giả: {selectedBook.author} &bull; Vị trí: <strong className="text-indigo-600 dark:text-indigo-400">{selectedBook.shelfLocation || 'Chưa xếp'}</strong></span>
                </div>
              </div>
              <span
                className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  selectedBook.availableCopies > 0
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                }`}
              >
                {selectedBook.availableCopies > 0 ? `Còn ${selectedBook.availableCopies} bản` : 'Hết sách'}
              </span>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ngày mượn <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Hạn trả sách <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              min={borrowDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ghi chú phiếu</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tình trạng sách khi giao, mục đích mượn..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedBookId || (selectedBook?.availableCopies ?? 0) <= 0 || isReaderLimitReached}
            className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Tạo phiếu mượn</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
