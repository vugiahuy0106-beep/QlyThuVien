import React from 'react';
import { Reader } from '../types';
import { Loan } from '../../loans/types';
import { useAuth } from '../../auth/AuthContext';
import {
  CreditCard,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Info,
  Settings,
  Camera,
} from 'lucide-react';
import { BrandLogo } from '../../../core/components/BrandLogo';

interface StudentCardViewProps {
  studentReader: Reader | null;
  loans: Loan[];
  onBrowseBooks: () => void;
}

export const StudentCardView: React.FC<StudentCardViewProps> = ({
  studentReader,
  loans,
  onBrowseBooks,
}) => {
  const { user, setIsAccountSettingsOpen } = useAuth();

  if (!studentReader) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-2" />
        <h3 className="font-bold text-slate-800 dark:text-white">Không tìm thấy hồ sơ thẻ độc giả</h3>
        <p className="text-xs text-slate-500 mt-1">Vui lòng liên hệ quầy thủ thư để kích hoạt thẻ độc giả.</p>
      </div>
    );
  }

  const isLocked = studentReader.status === 'locked';
  const activeLoans = loans.filter((l) => l.status === 'active');
  const overdueLoans = loans.filter((l) => l.status === 'overdue');
  const studentInitial = (studentReader.fullName || 'V')[0].toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Digital Library Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between pb-6 border-b border-indigo-900/60 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                THẺ THƯ VIỆN ĐIỆN TỬ
              </span>
              <h2 className="text-lg font-black tracking-tight text-white">LibModular Digital Card</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAccountSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-xs"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-300" />
              <span>Cài đặt & Đổi ảnh</span>
            </button>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isLocked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isLocked ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              <span>{isLocked ? 'Thẻ Tạm Khóa' : 'Thẻ Hợp Lệ'}</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-8 space-y-3">
            {/* Student Avatar + Full Name */}
            <div className="flex items-center gap-4">
              <div
                onClick={() => setIsAccountSettingsOpen(true)}
                title="Nhấn để đổi ảnh đại diện"
                className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-indigo-400/40 bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 cursor-pointer group shadow-lg"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={studentReader.fullName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <span className="text-2xl font-black">{studentInitial}</span>
                )}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-5 h-5 text-white drop-shadow-sm" />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block">Học giả / Chủ thẻ:</span>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {studentReader.fullName}
                </p>
                <span className="text-xs text-indigo-300 font-medium">Độc giả chính quy LibModular</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Mã số thẻ:</span>
                <span className="font-mono font-bold text-indigo-300 text-sm">
                  {studentReader.readerCode}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Ngày phát hành:</span>
                <span className="font-medium text-slate-200">
                  {studentReader.registeredAt || '2026-01-15'}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{studentReader.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>{studentReader.phone}</span>
              </div>
              {studentReader.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{studentReader.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Barcode representation */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-indigo-900/40 text-center">
            {/* Barcode lines */}
            <div className="h-12 flex items-center gap-1 px-3 py-1 bg-white rounded-lg">
              {[4, 2, 6, 3, 2, 5, 2, 4, 3, 2, 5, 3, 4, 2, 6].map((w, i) => (
                <div
                  key={i}
                  style={{ width: `${w}px` }}
                  className="h-full bg-slate-900 rounded-xs"
                />
              ))}
            </div>
            <span className="font-mono text-xs text-slate-400 mt-2 tracking-wider">
              *{studentReader.readerCode}*
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Dùng để quét mã tại quầy mượn</span>
          </div>
        </div>

        {/* Card Footer Rules */}
        <div className="pt-4 border-t border-indigo-900/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>Quyền hạn: Mượn tối đa 3 cuốn &bull; Thời hạn 14 ngày/lần</span>
          <span className="text-emerald-400 font-medium">Hệ thống LibModular Verified</span>
        </div>
      </div>

      {/* Borrowing status overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Tài liệu đang mượn</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              <span className="text-amber-600 dark:text-amber-400">{activeLoans.length}</span>
              <span className="text-xs text-slate-400 font-normal"> / 3 cuốn cho phép</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onBrowseBooks}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            Mượn thêm
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Tình trạng trả sách</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              <span className={overdueLoans.length > 0 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'}>
                {overdueLoans.length > 0 ? `${overdueLoans.length} quá hạn` : 'Đúng hạn'}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 text-right">
            {overdueLoans.length > 0 ? 'Vui lòng hoàn trả sớm' : 'Lịch sử mượn tốt'}
          </span>
        </div>
      </div>

      {/* Information guidelines */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>Nội quy & Hướng dẫn Sử dụng Thẻ:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 leading-relaxed">
          <li>Thẻ độc giả chỉ được sử dụng bởi chính chủ, không cho người khác mượn thẻ.</li>
          <li>Độc giả có trách nhiệm bảo quản nguyên vẹn tài liệu đã mượn (không gạch xóa, làm rách trang).</li>
          <li>Khi trả sách, độc giả mang sách đến quầy thủ thư để quét mã và xác nhận hoàn kho.</li>
        </ul>
      </div>
    </div>
  );
};
