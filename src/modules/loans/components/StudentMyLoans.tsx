import React from 'react';
import { Loan } from '../types';
import { Reader } from '../../readers/types';
import { BookCover } from '../../books/components/BookCover';
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface StudentMyLoansProps {
  loans: Loan[];
  studentReader: Reader | null;
  onBrowseBooks: () => void;
}

export const StudentMyLoans: React.FC<StudentMyLoansProps> = ({
  loans,
  studentReader,
  onBrowseBooks,
}) => {
  const activeLoans = loans.filter((l) => l.status === 'active');
  const overdueLoans = loans.filter((l) => l.status === 'overdue');
  const returnedLoans = loans.filter((l) => l.status === 'returned');

  return (
    <div className="space-y-6">
      {/* Student Card Summary Banner */}
      {studentReader && (
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 border border-emerald-800/60 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">{studentReader.fullName}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      studentReader.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {studentReader.status === 'active' ? 'Thẻ Đang Hoạt Động' : 'Thẻ Bị Khóa'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  Mã số độc giả: <strong className="text-emerald-300">{studentReader.readerCode}</strong> &bull; Đăng ký:{' '}
                  {studentReader.registeredAt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{studentReader.email}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{studentReader.phone}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats on the card */}
            <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 w-full md:w-auto justify-around">
              <div className="text-center px-3">
                <span className="text-[11px] text-slate-400">Đang mượn</span>
                <p className="text-lg font-bold text-amber-400">{activeLoans.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center px-3">
                <span className="text-[11px] text-slate-400">Quá hạn</span>
                <p className="text-lg font-bold text-rose-400">{overdueLoans.length}</p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center px-3">
                <span className="text-[11px] text-slate-400">Đã trả</span>
                <p className="text-lg font-bold text-emerald-400">{returnedLoans.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Warning Alert if any */}
      {overdueLoans.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
            <span className="font-bold">Lưu ý: Bạn có {overdueLoans.length} phiếu mượn đã quá hạn trả!</span>
            <p className="mt-0.5 opacity-90">
              Vui lòng mang ấn phẩm đến quầy lưu thông thư viện để hoàn trả hoặc làm thủ tục gia hạn kịp thời nhằm tránh phát sinh phí trễ hạn.
            </p>
          </div>
        </div>
      )}

      {/* Loan Slips List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Sách Bạn Đang Mượn & Lịch Sử Hoàn Trả</span>
            </h3>
            <p className="text-xs text-slate-500">
              Theo dõi hạn trả và tình trạng tài liệu thư viện đã phát hành cho bạn
            </p>
          </div>
          <button
            type="button"
            onClick={onBrowseBooks}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mượn thêm sách</span>
          </button>
        </div>

        {loans.length === 0 ? (
          <div className="p-10 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Bạn chưa có phiếu mượn sách nào
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Khám phá danh mục hàng ngàn đầu sách trong thư viện và bấm "Đăng ký mượn sách" để nhận sách ngay.
            </p>
            <button
              type="button"
              onClick={onBrowseBooks}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              Xem danh mục sách ngay
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loans.map((loan) => {
              const isOverdue = loan.status === 'overdue';
              const isReturned = loan.status === 'returned';

              return (
                <div
                  key={loan.id}
                  className={`py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                    isOverdue ? 'bg-rose-50/30 dark:bg-rose-950/10 -mx-5 px-5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <BookCover
                      book={{ title: loan.bookTitle, code: loan.bookCode }}
                      className="w-10 h-14 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{loan.bookTitle}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Mã sách: {loan.bookCode} &bull; Mã phiếu: {loan.loanCode}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-slate-500 mt-1">
                        <span>Ngày mượn: <strong>{loan.borrowDate}</strong></span>
                        <span className={isOverdue ? 'text-rose-600 font-bold' : ''}>
                          Hạn trả: <strong>{loan.dueDate}</strong>
                        </span>
                        {loan.returnDate && (
                          <span className="text-emerald-600 font-medium">
                            Đã trả ngày: {loan.returnDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
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
                      <span>{isReturned ? 'Đã hoàn trả' : isOverdue ? 'Quá hạn trả' : 'Đang mượn'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
