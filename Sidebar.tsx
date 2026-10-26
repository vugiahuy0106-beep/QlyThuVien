import React from 'react';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  BarChart3,
  LogOut,
  Database,
  Layers,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../modules/auth/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BrandLogo } from './BrandLogo';

export type NavTab = 'home' | 'dashboard' | 'books' | 'readers' | 'loans' | 'reports';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  overdueCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  overdueCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, role, signOut, setIsAccountSettingsOpen } = useAuth();
  const isStudent = role === 'student';
  const isGuest = role === 'guest';

  // Role-specific navigation based strictly on logged-in account
  const navItems = isGuest
    ? [
        {
          id: 'home' as NavTab,
          label: 'Trang chủ',
          icon: <Home className="w-5 h-5" />,
          badge: null,
        },
        {
          id: 'books' as NavTab,
          label: 'Tra cứu sách & Kệ',
          icon: <BookOpen className="w-5 h-5" />,
          badge: null,
        },
      ]
    : isStudent
    ? [
        {
          id: 'home' as NavTab,
          label: 'Trang chủ',
          icon: <Home className="w-5 h-5" />,
          badge: null,
        },
        {
          id: 'books' as NavTab,
          label: 'Tra cứu sách & Kệ',
          icon: <BookOpen className="w-5 h-5" />,
          badge: null,
        },
        {
          id: 'loans' as NavTab,
          label: 'Phiếu mượn của tôi',
          icon: <ClipboardList className="w-5 h-5" />,
          badge: overdueCount > 0 ? `${overdueCount} quá hạn` : null,
          badgeColor: 'bg-rose-500 text-white',
        },
        {
          id: 'readers' as NavTab,
          label: 'Thẻ thư viện cá nhân',
          icon: <CreditCard className="w-5 h-5" />,
          badge: null,
        },
      ]
    : [
        {
          id: 'home' as NavTab,
          label: 'Trang chủ',
          icon: <Home className="w-5 h-5" />,
          badge: null,
        },
        {
          id: 'dashboard' as NavTab,
          label: 'Tổng quan',
          icon: <LayoutDashboard className="w-5 h-5" />,
          badge: null,
        },
        {
          id: 'books' as NavTab,
          label: 'Quản lý sách',
          icon: <BookOpen className="w-5 h-5" />,
          badge: null,
        },
        {
          id: 'readers' as NavTab,
          label: 'Quản lý độc giả',
          icon: <Users className="w-5 h-5" />,
          badge: null,
        },
        {
          id: 'loans' as NavTab,
          label: 'Quản lý mượn trả',
          icon: <ClipboardList className="w-5 h-5" />,
          badge: overdueCount > 0 ? `${overdueCount} quá hạn` : null,
          badgeColor: 'bg-rose-500 text-white',
        },
        {
          id: 'reports' as NavTab,
          label: 'Báo cáo & Thống kê',
          icon: <BarChart3 className="w-5 h-5" />,
          badge: null,
        },
      ];

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile?.();
  };

  const { config } = useTheme();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 ${
          config.isGlassEnabled
            ? 'bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-700/60'
            : 'bg-slate-900 border-slate-800'
        } text-slate-200 border-r flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">LibModular</span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm border ${
                    isGuest
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                      : isStudent
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                  }`}
                >
                  {isGuest ? 'Khách' : isStudent ? 'Sinh Viên' : 'Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isStudent ? 'Cổng Sinh Viên & Mượn Sách' : isGuest ? 'Cổng Tra Cứu Thư Viện' : 'Hệ thống Quản lý Thư viện'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-4 py-6 space-y-1.5 flex-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>{isStudent ? 'Dịch vụ sinh viên' : isGuest ? 'Tra cứu bạn đọc' : 'Phân hệ quản trị'}</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isStudent
                  ? 'bg-emerald-950 text-emerald-400'
                  : isGuest
                  ? 'bg-sky-950 text-sky-400'
                  : 'bg-indigo-950 text-indigo-400'
              }`}
            >
              {isStudent ? 'Quyền Sinh Viên' : isGuest ? 'Quyền Khách' : 'Toàn Quyền Quản Trị'}
            </span>
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? isStudent
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Profile & Status */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">

          {/* Connection status */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Cloud Firestore</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Đã kết nối
            </span>
          </div>

          {/* User info card */}
          {user ? (
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setIsAccountSettingsOpen(true)}
                title="Cài đặt tài khoản & Đổi ảnh, mật khẩu"
                className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group flex-1"
              >
                <div
                  className={`w-9 h-9 rounded-xl overflow-hidden border flex items-center justify-center shrink-0 text-xs font-bold transition-transform group-hover:scale-105 ${
                    isGuest
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                      : isStudent
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                  }`}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : isGuest ? (
                    <UserCheck className="w-4 h-4" />
                  ) : isStudent ? (
                    <GraduationCap className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {user.displayName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email || 'Hệ thống'}</p>
                </div>
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAccountSettingsOpen(true)}
                  title="Cài đặt tài khoản & Đổi mật khẩu, ảnh đại diện"
                  className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => signOut()}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
};
