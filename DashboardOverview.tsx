import React from 'react';
import { Book } from '../../books/types';
import { Reader } from '../../readers/types';
import { Loan } from '../../loans/types';
import { reportService } from '../../reports/reportService';
import { StatCard } from '../../../core/components/StatCard';
import { MonthlyLoansChart } from './MonthlyLoansChart';
import {
  BookOpen,
  Library,
  Users,
  ClipboardList,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { NavTab } from '../../../core/components/Sidebar';

interface DashboardOverviewProps {
  books: Book[];
  readers: Reader[];
  loans: Loan[];
  onNavigateTab: (tab: NavTab) => void;
  onOpenCreateLoan: () => void;
  onOpenAddBook: () => void;
  onOpenAddReader: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  books,
  readers,
  loans,
  onNavigateTab,
  onOpenCreateLoan,
  onOpenAddBook,
  onOpenAddReader,
}) => {
  // 1. Calculate Real Metrics
  const totalBookTitles = books.length;
  const totalBookCopies = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
  const totalAvailableCopies = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
  const totalReaders = readers.length;
  const activeLoans = loans.filter((l) => l.status === 'active');
  const overdueLoans = loans.filter((l) => l.status === 'overdue');
  const activeLoansCount = activeLoans.length;
  const overdueLoansCount = overdueLoans.length;

  // 2. Real Monthly stats
  const monthlyStats = reportService.getMonthlyLoanStats(loans);

  // 3. Top 5 recent loans
  const recentLoans = [...loans].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 5 KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Titles */}
        <StatCard
          title="Tổng đầu sách"
          value={totalBookTitles}
          subtext="Danh mục ấn phẩm trong thư viện"
          icon={<BookOpen className="w-5 h-5" />}
          colorScheme="indigo"
          badge="Đầu sách"
        />

        {/* Total Physical Copies */}
        <StatCard
          title="Tổng bản sách"
          value={totalBookCopies}
          subtext={`Còn ${totalAvailableCopies} bản khả dụng trong kho`}
          icon={<Library className="w-5 h-5" />}
          colorScheme="sky"
          badge="Bản in"
        />

        {/* Total Readers */}
        <StatCard
          title="Tổng số độc giả"
          value={totalReaders}
          subtext={`${readers.filter((r) => r.status === 'active').length} thẻ đang hoạt động`}
          icon={<Users className="w-5 h-5" />}
          colorScheme="emerald"
          badge="Độc giả"
        />

        {/* Active Loans */}
        <StatCard
          title="Sách đang mượn"
          value={activeLoansCount}
          subtext="Phiếu mượn chưa hoàn trả"
          icon={<ClipboardList className="w-5 h-5" />}
          colorScheme="amber"
          badge="Lưu hành"
        />

        {/* Overdue Loans */}
        <StatCard
          title="Phiếu quá hạn"
          value={overdueLoansCount}
          subtext={overdueLoansCount > 0 ? 'Cần gửi thông báo nhắc nhở' : 'Không có phiếu quá hạn'}
          icon={<AlertTriangle className="w-5 h-5" />}
          colorScheme="rose"
          badge={overdueLoansCount > 0 ? 'Cảnh báo' : 'Tốt'}
        />
      </div>

      {/* Main Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Chart (8 cols) */}
        <div className="lg:col-span-8">
          <MonthlyLoansChart data={monthlyStats} />
        </div>

        {/* Quick Action Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Thao tác Nhanh</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Lối tắt cho các quy trình thủ thư thường xuyên
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onOpenCreateLoan}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ClipboardList className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Lập phiếu mượn sách</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenAddBook}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Thêm sách mới vào kho</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={onOpenAddReader}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Cấp thẻ độc giả mới</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('reports')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Xem báo cáo & xuất CSV</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-[11px] text-slate-500 dark:text-slate-400">
            Kiến trúc <strong>Modular Monolith</strong> phân tách rõ ràng trách nhiệm giữa Books, Readers, Loans và Reports.
          </div>
        </div>
      </div>

      {/* Recent Loans Activity */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Giao Dịch Mượn Trả Gần Đây</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Các lượt mượn sách mới nhất được đồng bộ từ Firestore
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('loans')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả phiếu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentLoans.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">Chưa có giao dịch mượn trả nào được ghi nhận.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentLoans.map((loan) => (
              <div key={loan.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      loan.status === 'returned'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : loan.status === 'overdue'
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {loan.readerName} mượn "{loan.bookTitle}"
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Mã phiếu: {loan.loanCode} &bull; Mượn: {loan.borrowDate} &bull; Hạn: {loan.dueDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                    loan.status === 'returned'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : loan.status === 'overdue'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {loan.status === 'returned' ? 'Đã trả' : loan.status === 'overdue' ? 'Quá hạn' : 'Đang mượn'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
