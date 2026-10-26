import React, { useState, useEffect } from 'react';
import { Modal } from '../../../core/components/Modal';
import { Book } from '../../books/types';
import { Reader } from '../../readers/types';
import { CreateLoanDTO } from '../types';
import { Loader2, AlertCircle, BookOpen, Calendar, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';

import { BookCover } from '../../books/components/BookCover';

interface StudentBorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  studentReader: Reader | null;
  activeLoansCount?: number;
  onSubmit: (dto: CreateLoanDTO) => Promise<void>;
}

export const StudentBorrowModal: React.FC<StudentBorrowModalProps> = ({
  isOpen,
  onClose,
  book,
  studentReader,
  activeLoansCount = 0,
  onSubmit,
}) => {
  const getToday = () => new Date().toISOString().split('T')[0];
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  };

  const [borrowDate, setBorrowDate] = useState(getToday());
  const [dueDate, setDueDate] = useState(getDefaultDueDate());
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBorrowDate(getToday());
      setDueDate(getDefaultDueDate());
      setNotes('Sinh viên đăng ký mượn tự phục vụ trực tuyến');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!book || !studentReader) return null;

  const isReaderLocked = studentReader.status === 'locked';
  const isOutOfStock = (book.availableCopies ?? 0) <= 0;
  const isLimitReached = activeLoansCount >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      setErrorMsg('Không thể mượn thêm sách: Bạn đã đạt giới hạn mượn tối đa 3 cuốn sách. Vui lòng hoàn trả các cuốn sách đang mượn trước khi đăng ký mượn cuốn tiếp theo!');
      return;
    }
    if (isReaderLocked) {
      setErrorMsg('Thẻ độc giả của bạn hiện đang bị KHÓA. Vui lòng liên hệ quầy thủ thư để được mở khóa.');
      return;
    }
    if (isOutOfStock) {
      setErrorMsg(`Ấn phẩm "${book.title}" hiện đã hết bản sao trên kệ.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        readerId: studentReader.id,
        bookId: book.id,
        borrowDate,
        dueDate,
        notes,
      });
      onClose();
    } catch (err: any) {
      let rawMsg = err.message || 'Lỗi khi gửi yêu cầu mượn sách.';
      try {
        if (rawMsg.startsWith('{')) {
          const parsed = JSON.parse(rawMsg);
          rawMsg = parsed.error || rawMsg;
        }
      } catch {}
      setErrorMsg(rawMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng Ký Mượn Sách Trực Tuyến"
      description="Xác nhận thông tin mượn tài liệu để nhận sách tại quầy lưu thông"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* 3-Book Limit Warning Banner */}
        {isLimitReached && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-amber-950 dark:text-amber-200 text-xs sm:text-sm">
                Đã đạt giới hạn mượn tối đa ({activeLoansCount}/3 cuốn)
              </h5>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
                Hệ thống chỉ cho phép mỗi độc giả mượn tối đa <strong>3 cuốn sách</strong> cùng thời điểm. Bạn không thể mượn thêm cuốn thứ 4. Vui lòng mang sách đã mượn đến quầy thủ thư để trả trước khi mượn tiếp!
              </p>
            </div>
          </div>
        )}

        {/* Book summary card with Cover Illustration */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="flex items-start gap-3.5">
            <BookCover
              book={book}
              className="w-16 h-22 shrink-0 shadow-md border border-slate-200 dark:border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 mb-1">
                {book.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                {book.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tác giả: <strong className="text-slate-700 dark:text-slate-300">{book.author}</strong> &bull; Mã: {book.code}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-700/50 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>Vị trí: <strong>{book.shelfLocation || 'Chưa xếp'}</strong></span>
            </div>
            <div className="text-right text-emerald-600 dark:text-emerald-400 font-semibold">
              Còn {book.availableCopies} bản khả dụng
            </div>
          </div>
        </div>

        {/* Student card info */}
        <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Độc giả đăng ký:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {studentReader.fullName} ({studentReader.readerCode})
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              isReaderLocked
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {isReaderLocked ? 'Thẻ bị khóa' : 'Thẻ hợp lệ'}
          </span>
        </div>

        {/* Borrow & Due Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ngày mượn
            </label>
            <input
              type="date"
              value={borrowDate}
              disabled
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 outline-hidden cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Hạn trả (14 ngày)
            </label>
            <input
              type="date"
              value={dueDate}
              disabled
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 outline-hidden cursor-not-allowed"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ghi chú (Tùy chọn)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Lý do mượn (đề tài, đồ án...)"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isReaderLocked || isOutOfStock || isLimitReached}
            className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 ${
              isLimitReached
                ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {isLimitReached
                ? 'Đã đạt giới hạn 3 cuốn (Không thể mượn thêm)'
                : 'Xác nhận mượn sách'}
            </span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
