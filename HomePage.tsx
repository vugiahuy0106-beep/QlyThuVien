import React, { useState } from 'react';
import { Book } from '../../books/types';
import { Reader } from '../../readers/types';
import { Loan } from '../../loans/types';
import { NavTab } from '../../../core/components/Sidebar';
import { useAuth } from '../../auth/AuthContext';
import { BookCover } from '../../books/components/BookCover';
import {
  Search,
  BookOpen,
  Users,
  ClipboardList,
  BarChart3,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Library,
  ShieldCheck,
  GraduationCap,
  Layers,
  Clock,
  Download,
  Flame,
  CreditCard,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { BrandLogo } from '../../../core/components/BrandLogo';

interface HomePageProps {
  books: Book[];
  readers: Reader[];
  loans: Loan[];
  onNavigateTab: (tab: NavTab) => void;
  onSearchBook: (keyword: string) => void;
  onOpenBorrowModal?: (book: Book) => void;
  onOpenAddBook?: () => void;
  onOpenCreateLoan?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  books,
  readers,
  loans,
  onNavigateTab,
  onSearchBook,
  onOpenBorrowModal,
  onOpenAddBook,
  onOpenCreateLoan,
}) => {
  const { role } = useAuth();
  const isStudent = role === 'student';
  const [searchKeyword, setSearchKeyword] = useState('');

  // Calculate live stats
  const totalBooks = books.length;
  const totalCopies = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
  const totalAvailable = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
  const totalReaders = readers.length;
  const activeLoans = loans.filter((l) => l.status === 'active').length;

  // Featured books (up to 4 books)
  const featuredBooks = books.slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      onSearchBook(searchKeyword.trim());
      onNavigateTab('books');
    } else {
      onNavigateTab('books');
    }
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-300">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 p-6 sm:p-10 text-white shadow-2xl">
        {/* Decorative background glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Kiến trúc Modular Monolith &bull; Cloud Firestore</span>
          </div>

          {/* Heading */}
          <div className="flex items-center gap-4 mb-4">
            <BrandLogo size="lg" className="hidden sm:inline-block shadow-xl shadow-indigo-950/40" />
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Hệ Thống Thư Viện Số <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">LibModular</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
            Nền tảng quản lý thư viện hiện đại phân tách rõ ràng các phân hệ <strong>Sách (Books)</strong>,{' '}
            <strong>Độc giả (Readers)</strong>, <strong>Mượn trả (Loans)</strong> và <strong>Báo cáo (Reports)</strong>. Hỗ trợ tra cứu vị trí kệ, đăng ký mượn online và đồng bộ dữ liệu thời gian thực.
          </p>

          {/* Live Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mb-6">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm sách theo tên, tác giả, chuyên ngành hoặc ISBN..."
                className="w-full pl-12 pr-28 sm:pr-36 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 shadow-lg backdrop-blur-md transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Tìm kiếm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-400">
              <span className="text-slate-400">Gợi ý tìm kiếm:</span>
              {['Clean Architecture', 'Microservices', 'Kinh tế', 'Học máy'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchKeyword(tag);
                    onSearchBook(tag);
                    onNavigateTab('books');
                  }}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab('books')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Khám phá toàn bộ kho sách</span>
            </button>

            {!isStudent && (
              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 font-semibold text-xs transition-all"
              >
                <BarChart3 className="w-4 h-4 text-indigo-300" />
                <span>Xem Tổng quan Quản trị</span>
              </button>
            )}

            {isStudent && (
              <button
                type="button"
                onClick={() => onNavigateTab('loans')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 font-semibold text-xs transition-all"
              >
                <ClipboardList className="w-4 h-4 text-emerald-300" />
                <span>Phiếu mượn cá nhân</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Real-Time Stats Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Đầu sách trong kho</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {totalBooks} <span className="text-xs font-normal text-slate-400">tựa đề</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng bản in vật lý</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {totalCopies} <span className="text-xs font-normal text-emerald-500 font-semibold">({totalAvailable} sẵn sàng)</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Độc giả đăng ký</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {totalReaders} <span className="text-xs font-normal text-slate-400">thẻ hoạt động</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sách đang lưu hành</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {activeLoans} <span className="text-xs font-normal text-slate-400">phiếu mượn</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. System Functional Modules Map (Bản đồ phân hệ chức năng) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Các Phân Hệ Chức Năng Chính</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Kiến trúc Modular Monolith gom tụ các domain độc lập vào một khối thống nhất, dễ bảo trì và vận hành
            </p>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            5 Phân Hệ Hoàn Chỉnh
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Books */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400/60 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Module 01
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Quản Lý Danh Mục Sách
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Lưu trữ toàn diện thông tin ấn phẩm: mã sách, ISBN, tác giả, nhà xuất bản, năm xuất bản, tổng số bản in, số bản khả dụng và vị trí kệ.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tra cứu vị trí kệ lưu kho chính xác</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tìm kiếm nhanh & lọc theo thể loại / tồn kho</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('books')}
              className="mt-6 w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 hover:text-indigo-600 font-semibold text-xs transition-colors"
            >
              <span>Vào phân hệ Sách</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Readers */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400/60 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Module 02
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Quản Lý Hồ Sơ Độc Giả
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Quản lý mã thẻ bạn đọc, thông tin cá nhân, liên hệ, ngày cấp thẻ và trạng thái hoạt động. Tích hợp thẻ thư viện điện tử có mã vạch.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Xem lịch sử mượn trả của từng độc giả</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Khóa / mở khóa thẻ để kiểm soát mượn sách</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('readers')}
              className="mt-6 w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-600 font-semibold text-xs transition-colors"
            >
              <span>{isStudent ? 'Xem Thẻ Thư Viện' : 'Quản lý Độc giả'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Loans */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400/60 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Module 03
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Quản Lý Mượn & Trả Sách
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Xử lý giao dịch mượn và hoàn trả qua Firestore Transaction. Tự động đồng bộ số lượng khả dụng và cảnh báo khi quá hạn 14 ngày.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tự động trừ/cộng lại tồn kho trong Firestore</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Chặn mượn khi sách hết hoặc thẻ bị khóa</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('loans')}
              className="mt-6 w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 hover:text-amber-600 font-semibold text-xs transition-colors"
            >
              <span>{isStudent ? 'Xem Phiếu Mượn Của Tôi' : 'Quản lý Mượn Trả'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4: Reports (Admin) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-400/60 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Module 04
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                Báo Cáo & Xuất Dữ Liệu CSV
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Tổng hợp sách mượn nhiều nhất, danh sách phiếu mượn quá hạn (có liên hệ SĐT/Email), cảnh báo sách sắp hết và xuất CSV chuẩn UTF-8 BOM.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Xuất danh sách Sách & Phiếu mượn ra CSV</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Xếp hạng Top ấn phẩm phổ biến</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab(isStudent ? 'books' : 'reports')}
              className="mt-6 w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-200 hover:text-sky-600 font-semibold text-xs transition-colors"
            >
              <span>{isStudent ? 'Xem Sách Phổ Biến' : 'Xem Báo Cáo Chuyên Sâu'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 5: Student Portal */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-violet-400/60 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Module 05
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                Cổng Dịch Vụ Sinh Viên
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Không gian dành riêng cho bạn đọc: tra cứu vị trí kệ sách để tự tìm, đăng ký mượn trực tuyến tự phục vụ, theo dõi thời hạn trả sách.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tự đăng ký mượn sách 1-click</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cảnh báo hạn trả cá nhân bảo mật</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('books')}
              className="mt-6 w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-slate-700 dark:text-slate-200 hover:text-violet-600 font-semibold text-xs transition-colors"
            >
              <span>Trải nghiệm Cổng Sinh Viên</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 6: Architecture & Deployment */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-violet-50/40 dark:from-slate-900 dark:to-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full uppercase">
                  Software Architecture
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Bảo Mật & Kiến Trúc Monolith
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                Thiết kế phù hợp hoàn hảo với đề tài học phần Kiến trúc phần mềm: tách biệt ranh giới logic (Bounded Contexts), quy tắc Firestore Rules bảo vệ dữ liệu.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
              <span className="font-semibold text-indigo-950 dark:text-indigo-200 block">Dữ liệu thời gian thực:</span>
              <p className="text-[11px] text-slate-500">
                Đồng bộ tự động tức thì giữa kho sách, hồ sơ độc giả và phiếu mượn qua Cloud Firestore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Books Catalog Spotlight */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Tài Liệu & Ấn Phẩm Tiêu Biểu Trong Kho
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Các đầu sách chất lượng cao được lưu trữ thực tế trên Cloud Firestore
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('books')}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <span>Xem tất cả {books.length} ấn phẩm</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured books grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredBooks.map((book) => {
            const isOutOfStock = (book.availableCopies ?? 0) <= 0;
            return (
              <div
                key={book.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between hover:shadow-lg hover:border-indigo-500/40 transition-all group"
              >
                <div>
                  {/* Book Cover Illustration */}
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-3 bg-slate-200 dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700/60">
                    <BookCover
                      book={book}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                      <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-md bg-slate-900/85 text-white backdrop-blur-xs shadow-xs">
                        {book.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950/85 text-indigo-200 backdrop-blur-xs shadow-xs">
                        {book.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                    {book.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">Tác giả: {book.author}</p>

                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Vị trí:</span>
                      </span>
                      <strong className="text-slate-800 dark:text-slate-200">{book.shelfLocation || 'Chưa xếp'}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tồn kho:</span>
                      <span
                        className={`font-bold ${
                          isOutOfStock ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isOutOfStock ? 'Hết sách' : `Còn ${book.availableCopies}/${book.totalCopies} bản`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3">
                  {isStudent ? (
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => onOpenBorrowModal?.(book)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                        isOutOfStock
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Tạm hết sách' : 'Mượn sách này'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigateTab('books')}
                      className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-200/80 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Xem & Điều chỉnh</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Quy trình 3 bước mượn trả rõ ràng */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
            Quy trình phục vụ bạn đọc
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Quy Trình Mượn Trả Sách 3 Bước Chuẩn Hóa
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            Đơn giản, minh bạch và số hóa toàn diện từ tra cứu đến thu hồi tài liệu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 relative">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-3">
              1
            </div>
            <h3 className="font-bold text-sm text-white">Tra Cứu & Xác Định Vị Trí</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Bạn đọc tìm kiếm ấn phẩm trên hệ thống, kiểm tra tình trạng số lượng khả dụng và vị trí kệ sách (Ví dụ: Kệ A1-T2).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 relative">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-3">
              2
            </div>
            <h3 className="font-bold text-sm text-white">Đăng Ký & Phát Hành Phiếu</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Sinh viên tự bấm "Mượn sách" hoặc thủ thư lập phiếu mượn. Firestore Transaction tự động trừ tồn kho ngay lập tức.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 relative">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-3">
              3
            </div>
            <h3 className="font-bold text-sm text-white">Bảo Quản & Hoàn Trả Kho</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Thời hạn mượn 14 ngày. Khi trả sách tại quầy, thủ thư bấm "Xác nhận hoàn trả", hệ thống tự động cộng lại bản sách vào kho.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
