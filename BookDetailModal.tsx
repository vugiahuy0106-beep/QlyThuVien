import React from 'react';
import { Modal } from '../../../core/components/Modal';
import { Book } from '../types';
import { Loan } from '../../loans/types';
import { BookOpen, MapPin, Hash, Building2, Calendar, Layers, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { BookCover } from './BookCover';

interface BookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  loans?: Loan[];
  onBorrowBook?: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  isOpen,
  onClose,
  book,
  loans = [],
  onBorrowBook,
}) => {
  if (!book) return null;

  // Filter loans that belong to this book
  const activeBookLoans = loans.filter((l) => l.bookId === book.id && l.status !== 'returned');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book.title}
      description={`Mã sách: ${book.code} • Thể loại: ${book.category}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Cover illustration & basic info header */}
        <div className="flex flex-col sm:flex-row gap-5 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
          <BookCover
            book={book}
            className="w-28 sm:w-36 h-40 sm:h-50 shrink-0 mx-auto sm:mx-0 shadow-md border border-slate-200 dark:border-slate-700"
          />
          <div className="flex-1 space-y-2.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                {book.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">Mã: {book.code}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {book.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tác giả: <strong className="text-slate-800 dark:text-slate-200">{book.author}</strong>
            </p>
            <p className="text-xs text-slate-500">
              Nhà xuất bản: {book.publisher || 'Chưa cập nhật'} {book.publishYear ? `(${book.publishYear})` : ''}
            </p>
            {book.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 pt-1">
                {book.description}
              </p>
            )}
          </div>
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Khả dụng</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              <span className={book.availableCopies > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}>
                {book.availableCopies}
              </span>
              <span className="text-xs text-slate-400 font-normal"> / {book.totalCopies} bản</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Vị trí lưu kho</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{book.shelfLocation || 'Chưa xếp'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Năm xuất bản</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{book.publishYear || 'N/A'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">ISBN</span>
            <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-1 truncate">
              {book.isbn || 'Chưa có'}
            </div>
          </div>
        </div>

        {/* Currently Borrowed By */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Độc giả đang mượn ấn phẩm này ({activeBookLoans.length})
          </h4>
          {activeBookLoans.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">Hiện chưa có độc giả nào đang mượn cuốn sách này.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden">
              {activeBookLoans.map((loan) => (
                <div key={loan.id} className="p-3 text-xs flex items-center justify-between bg-white dark:bg-slate-800/40">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">{loan.readerName}</span>
                    <span className="text-slate-400 ml-2">({loan.readerCode})</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Ngày mượn: {loan.borrowDate} • Hạn trả: {loan.dueDate}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      loan.status === 'overdue'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {loan.status === 'overdue' ? 'Quá hạn' : 'Đang mượn'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Đóng
          </button>
          {onBorrowBook && book.availableCopies > 0 && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onBorrowBook(book);
              }}
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
            >
              Lập phiếu mượn sách này
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
