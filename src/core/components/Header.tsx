import {
  Menu,
  Plus,
  ShieldCheck,
  GraduationCap,
  Palette,
  UserCheck,
  LogOut,
  Sun,
  Moon,
  Settings,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useAuth } from '../../modules/auth/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeTab: NavTab;
  onOpenMobileSidebar: () => void;
  onQuickAction?: (action: 'add_book' | 'add_reader' | 'create_loan') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onQuickAction,
}) => {
  const { user, role, signOut, setIsAccountSettingsOpen } = useAuth();
  const { config, setIsCustomizerOpen, toggleDarkMode } = useTheme();
  const isStudent = role === 'student';
  const isGuest = role === 'guest';

  // Standard comprehensive titles for all modules
  const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
    home: {
      title: 'Trang chủ LibModular',
      subtitle: 'Cổng dịch vụ thư viện số & Bản đồ các phân hệ chức năng',
    },
    dashboard: {
      title: 'Tổng quan Thư viện',
      subtitle: 'Theo dõi thời gian thực các chỉ số tài liệu, độc giả và giao dịch mượn trả',
    },
    books: {
      title: 'Quản lý Danh mục Sách',
      subtitle: 'Thêm mới, cập nhật, điều chỉnh số lượng bản sách và tra cứu vị trí kệ',
    },
    readers: {
      title: 'Quản lý Hồ sơ Độc giả',
      subtitle: 'Danh sách thẻ thư viện, kiểm soát trạng thái hoạt động và lịch sử mượn',
    },
    loans: {
      title: 'Quản lý Mượn & Trả sách',
      subtitle: 'Lập phiếu mượn, ghi nhận trả sách, tự động đồng bộ tồn kho và cảnh báo quá hạn',
    },
    reports: {
      title: 'Báo cáo & Thống kê Chuyên sâu',
      subtitle: 'Phân tích xu hướng mượn sách, danh sách quá hạn, cảnh báo tồn kho và xuất CSV',
    },
  };

  const currentTitle = tabTitles[activeTab] || tabTitles.home;

  return (
    <header
      className={`sticky top-0 z-30 ${
        config.isGlassEnabled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
      } px-4 sm:px-8 py-3.5 transition-colors`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Titles */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl lg:hidden transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="lg:hidden">
            <BrandLogo size="xs" onClick={onOpenMobileSidebar} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {currentTitle.title}
              </h1>
              <span
                className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isGuest
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                    : isStudent
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                }`}
              >
                {isGuest ? (
                  <UserCheck className="w-3.5 h-3.5" />
                ) : isStudent ? (
                  <GraduationCap className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>{isGuest ? 'Khách Vãng Lai' : isStudent ? 'Khách Sinh Viên' : 'Admin Thư Viện'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
              {currentTitle.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Theme Customizer, Seed (Admin) & Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {/* Dark / Light Mode Direct Quick Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            title={config.isDark ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)'}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs"
          >
            {config.isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline">Giao diện Sáng</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden md:inline">Giao diện Tối</span>
              </>
            )}
          </button>

          {/* Theme Customizer Trigger */}
          <button
            type="button"
            onClick={() => setIsCustomizerOpen(true)}
            title="Tùy chỉnh màu nền, hình ảnh thư viện và hiệu ứng kính"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">Đổi nền & Màu sắc</span>
          </button>

          {/* Quick create buttons (Admin only) */}
          {!isStudent && !isGuest && activeTab === 'books' && onQuickAction && (
            <button
              type="button"
              onClick={() => onQuickAction('add_book')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm sách</span>
            </button>
          )}

          {!isStudent && !isGuest && activeTab === 'readers' && onQuickAction && (
            <button
              type="button"
              onClick={() => onQuickAction('add_reader')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm độc giả</span>
            </button>
          )}

          {!isStudent && !isGuest && activeTab === 'loans' && onQuickAction && (
            <button
              type="button"
              onClick={() => onQuickAction('create_loan')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo phiếu mượn</span>
            </button>
          )}

          {/* Account Settings Trigger with Avatar & Name */}
          {user && (
            <button
              type="button"
              onClick={() => setIsAccountSettingsOpen(true)}
              title="Cài đặt tài khoản & Đổi mật khẩu, ảnh đại diện"
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs group"
            >
              <div className="w-6 h-6 rounded-lg overflow-hidden bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{(user.displayName || 'U')[0].toUpperCase()}</span>
                )}
              </div>
              <span className="text-xs font-bold max-w-[100px] sm:max-w-[130px] truncate hidden md:inline">
                {user.displayName?.replace(/ \((Sinh viên|Khách Sinh Viên|Thủ thư Trưởng|Độc giả|Admin)\)/g, '') || 'Tài khoản'}
              </span>
              <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>
          )}

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => signOut()}
            title="Đăng xuất khỏi hệ thống"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 transition-colors border border-rose-200 dark:border-rose-800/60 cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};
