import React, { useState } from 'react';
import { Book, BookFilter, BOOK_CATEGORIES } from '../types';
import { Loan } from '../../loans/types';
import { bookService } from '../bookService';
import { getBookCoverUrl } from '../bookCoverHelper';
import { BookCover } from './BookCover';
import { useToast } from '../../../core/context/ToastContext';
import { ConfirmDialog } from '../../../core/components/ConfirmDialog';
import { BookDetailModal } from './BookDetailModal';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Layers,
  BookOpen,
  AlertCircle,
  CheckCircle,
  LayoutGrid,
  List,
} from 'lucide-react';

import { UserRole } from '../../auth/types';

interface BookListProps {
  books: Book[];
  loans: Loan[];
  userRole?: UserRole;
  initialSearch?: string;
  onOpenAddModal: () => void;
  onOpenEditModal: (book: Book) => void;
  onOpenBorrowModal?: (book: Book) => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  loans,
  userRole = 'librarian',
  initialSearch = '',
  onOpenAddModal,
  onOpenEditModal,
  onOpenBorrowModal,
}) => {
  const { success, error } = useToast();

  const [filters, setFilters] = useState<BookFilter>({
    search: initialSearch,
    category: '',
    stockStatus: 'all',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  React.useEffect(() => {
    if (initialSearch) {
      setFilters((prev) => ({ ...prev, search: initialSearch }));
    }
  }, [initialSearch]);

  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredBooks = bookService.filterBooks(books, filters);

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);
    try {
      await bookService.deleteBook(bookToDelete.id);
      success('Xóa sách thành công', `Đã xóa ấn phẩm "${bookToDelete.title}" khỏi Firestore.`);
      setBookToDelete(null);
    } catch (err: any) {
      error('Không thể xóa sách', err.message || 'Lỗi kiểm tra quyền Firestore');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Tìm kiếm theo tên sách, mã sách, tác giả hoặc ISBN..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden transition-all"
            />
          </div>

          {/* Category filter */}
          <div className="md:col-span-3">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden transition-all"
            >
              <option value="">Tất cả thể loại</option>
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock filter tabs */}
          <div className="md:col-span-3 flex items-center bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
            {(
              [
                { id: 'all', label: 'Tất cả' },
                { id: 'in_stock', label: 'Còn sách' },
                { id: 'out_of_stock', label: 'Hết sách' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilters({ ...filters, stockStatus: tab.id })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filters.stockStatus === tab.id
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status count summary & View Mode Toggle */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-3">
            <span>
              Hiển thị <strong>{filteredBooks.length}</strong> / {books.length} đầu sách
            </span>
            {(filters.search || filters.category || filters.stockStatus !== 'all') && (
              <button
                onClick={() => setFilters({ search: '', category: '', stockStatus: 'all' })}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Chế độ Thẻ có hình ảnh"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Dạng Thẻ (Ảnh)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Chế độ Bảng danh sách"
            >
              <List className="w-3.5 h-3.5" />
              <span>Dạng Bảng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Books Table / Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              {userRole === 'librarian'
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để tạo đầu sách mới.'
                : 'Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục thể loại khác.'}
            </p>
            {userRole === 'librarian' && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm sách ngay</span>
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW: Visual cards with high quality book cover illustrations */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
            {filteredBooks.map((book) => {
              const isOutOfStock = (book.availableCopies ?? 0) <= 0;
              const isLowStock = (book.availableCopies ?? 0) > 0 && (book.availableCopies ?? 0) <= 2;
              const coverImg = getBookCoverUrl(book);

              return (
                <div
                  key={book.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 flex flex-col justify-between hover:shadow-lg hover:border-indigo-500/40 transition-all group"
                >
                  <div>
                    {/* Book Cover Illustration */}
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-3 bg-slate-200 dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700/60 group-hover:shadow-md transition-shadow">
                      <BookCover
                        book={book}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/85 text-white backdrop-blur-xs font-mono shadow-xs">
                          {book.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs ${
                            isOutOfStock
                              ? 'bg-rose-900/90 text-rose-200'
                              : isLowStock
                              ? 'bg-amber-900/90 text-amber-200'
                              : 'bg-emerald-900/90 text-emerald-200'
                          }`}
                        >
                          {isOutOfStock ? 'Hết sách' : `Còn ${book.availableCopies} bản`}
                        </span>
                      </div>

                      {/* Shelf location bottom pill */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold bg-slate-950/80 text-slate-200 backdrop-blur-xs">
                          <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="truncate">{book.shelfLocation || 'Chưa xếp kệ'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Book Metadata */}
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 mb-1.5">
                      {book.category}
                    </span>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      Tác giả: <span className="font-medium text-slate-700 dark:text-slate-300">{book.author}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {book.publisher || 'NXB chưa rõ'} {book.publishYear ? `(${book.publishYear})` : ''}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBookForDetail(book)}
                      className="flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-700/60 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết</span>
                    </button>

                    {userRole === 'student' ? (
                      onOpenBorrowModal && (
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => onOpenBorrowModal(book)}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 ${
                            isOutOfStock
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                          }`}
                        >
                          <span>{isOutOfStock ? 'Hết sách' : 'Mượn sách'}</span>
                        </button>
                      )
                    ) : userRole === 'guest' ? (
                      onOpenBorrowModal && (
                        <button
                          type="button"
                          onClick={() => onOpenBorrowModal(book)}
                          className="flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Mượn</span>
                        </button>
                      )
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(book)}
                          title="Chỉnh sửa thông tin"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookToDelete(book)}
                          title="Xóa sách"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW: Compact table with book thumbnail illustrations */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Ảnh bìa & Tên Sách</th>
                  <th className="py-3.5 px-4">Tác giả & NXB</th>
                  <th className="py-3.5 px-4">Thể loại</th>
                  <th className="py-3.5 px-4">Vị trí kệ</th>
                  <th className="py-3.5 px-4 text-center">Tồn kho (Khả dụng)</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBooks.map((book) => {
                  const isOutOfStock = (book.availableCopies ?? 0) <= 0;
                  const isLowStock = (book.availableCopies ?? 0) > 0 && (book.availableCopies ?? 0) <= 2;
                  const coverImg = getBookCoverUrl(book);

                  return (
                    <tr
                      key={book.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Code, Title & Cover Image */}
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-3.5">
                          <BookCover
                            book={book}
                            className="w-10 h-14 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 dark:text-white block hover:text-indigo-600 transition-colors line-clamp-1">
                              {book.title}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              Mã: {book.code} {book.isbn ? `• ISBN: ${book.isbn}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Author & Publisher */}
                      <td className="py-4 px-4">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">{book.author}</div>
                        <div className="text-xs text-slate-400">
                          {book.publisher || 'NXB chưa rõ'} {book.publishYear ? `(${book.publishYear})` : ''}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {book.category}
                        </span>
                      </td>

                      {/* Shelf location */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{book.shelfLocation || 'Chưa xếp'}</span>
                        </div>
                      </td>

                      {/* Stock availability */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-sm font-bold ${
                                isOutOfStock
                                  ? 'text-rose-600'
                                  : isLowStock
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {book.availableCopies ?? 0}
                            </span>
                            <span className="text-xs text-slate-400">/ {book.totalCopies}</span>
                          </div>

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                              isOutOfStock
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                : isLowStock
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            {isOutOfStock ? 'Hết sách' : isLowStock ? 'Sắp hết' : 'Khả dụng'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedBookForDetail(book)}
                            title="Xem chi tiết"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {userRole === 'student' ? (
                            onOpenBorrowModal && (
                              <button
                                type="button"
                                disabled={isOutOfStock}
                                onClick={() => onOpenBorrowModal(book)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                                  isOutOfStock
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                                }`}
                              >
                                <span>{isOutOfStock ? 'Hết sách' : 'Mượn sách'}</span>
                              </button>
                            )
                          ) : userRole === 'guest' ? (
                            onOpenBorrowModal && (
                              <button
                                type="button"
                                onClick={() => onOpenBorrowModal(book)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-xs cursor-pointer"
                              >
                                <span>Đăng ký mượn</span>
                              </button>
                            )
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => onOpenEditModal(book)}
                                title="Chỉnh sửa thông tin"
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setBookToDelete(book)}
                                title="Xóa sách"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
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

      {/* Book Detail Modal */}
      <BookDetailModal
        isOpen={!!selectedBookForDetail}
        onClose={() => setSelectedBookForDetail(null)}
        book={selectedBookForDetail}
        loans={loans}
        onBorrowBook={onOpenBorrowModal}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleDeleteBook}
        title="Xác nhận xóa ấn phẩm"
        message={`Bạn có chắc chắn muốn xóa ấn phẩm "${bookToDelete?.title}" (Mã: ${bookToDelete?.code}) khỏi cơ sở dữ liệu thư viện? Thao tác này sẽ cập nhật trực tiếp trên Cloud Firestore.`}
        confirmText="Xóa ấn phẩm"
        isLoading={isDeleting}
      />
    </div>
  );
};
