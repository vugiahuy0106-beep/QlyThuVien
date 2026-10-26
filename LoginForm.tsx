import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../../../core/context/ThemeContext';
import { UserRole } from '../types';
import {
  Layers,
  GraduationCap,
  Loader2,
  Lock,
  User,
  Eye,
  EyeOff,
  Palette,
  ArrowRight,
  KeyRound,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';
import { useToast } from '../../../core/context/ToastContext';
import { BrandLogo } from '../../../core/components/BrandLogo';

export const LoginForm: React.FC = () => {
  const { loginWithCredentials, registerAccount, signInWithGoogle } = useAuth();
  const {
    config,
    setIsCustomizerOpen,
    activeWallpaperUrl,
    activeGradientClass,
    activeSolidClass,
  } = useTheme();
  const { success, error: toastError } = useToast();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regReaderCode, setRegReaderCode] = useState('DG-' + Math.floor(1000 + Math.random() * 9000));

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasLoginError, setHasLoginError] = useState(false);

  // Execute Login with credentials
  const executeLogin = async (userClean: string, passClean: string) => {
    if (!userClean) {
      setErrorMessage('Không thể đăng nhập: Vui lòng nhập Tên đăng nhập hoặc Mã thẻ.');
      toastError('Thiếu thông tin', 'Vui lòng nhập tên đăng nhập để tiếp tục.');
      setHasLoginError(true);
      return;
    }
    if (!passClean) {
      setErrorMessage('Không thể đăng nhập: Vui lòng nhập Mật khẩu.');
      toastError('Thiếu thông tin', 'Vui lòng nhập mật khẩu để tiếp tục.');
      setHasLoginError(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setHasLoginError(false);

    try {
      const profile = await loginWithCredentials(userClean, passClean);
      success(
        'Đăng nhập thành công!',
        `Chào mừng ${profile.displayName} đã đăng nhập vào hệ thống LibModular!`
      );
    } catch (err: any) {
      const message = err.message || 'Không thể đăng nhập do sai tài khoản và mật khẩu!';
      setErrorMessage(message);
      setHasLoginError(true);
      toastError(
        'Đăng nhập thất bại',
        'Không thể đăng nhập do sai tài khoản và mật khẩu!'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign In submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeLogin(usernameInput.trim(), passwordInput.trim());
  };

  // Handle Registration submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên.');
      return;
    }
    if (!regUsername.trim()) {
      setErrorMessage('Vui lòng chọn Tên đăng nhập.');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 4) {
      setErrorMessage('Mật khẩu phải có tối thiểu 4 ký tự.');
      return;
    }
    if (regRole === 'librarian') {
      setErrorMessage('Không được phép tự tạo tài khoản Thủ thư/Admin!');
      return;
    }

    try {
      registerAccount({
        username: regUsername.trim(),
        password: regPassword.trim(),
        displayName: regFullName.trim(),
        role: regRole,
        email: regEmail.trim() || `${regUsername.trim()}@libmodular.local`,
        studentReaderCode: regRole === 'student' ? regReaderCode : undefined,
      });

      success('Đăng ký tài khoản thành công!', 'Bạn có thể đăng nhập ngay với tài khoản vừa tạo.');
      // Pre-fill to login form and switch mode
      setUsernameInput(regUsername.trim());
      setPasswordInput(regPassword.trim());
      setAuthMode('login');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tạo tài khoản.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle('librarian');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể đăng nhập bằng tài khoản Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 sm:p-6 overflow-x-hidden">
      {/* 1. DYNAMIC RICH BACKGROUND LAYER */}
      {(config.bgMode === 'image' || config.bgMode === 'custom') && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none"
          style={{
            backgroundImage: `url('${activeWallpaperUrl}')`,
            filter: `blur(${config.blurPx}px)`,
            transform: 'scale(1.04)',
          }}
        />
      )}

      {config.bgMode === 'gradient' && (
        <div
          className={`fixed inset-0 z-0 transition-all duration-700 pointer-events-none ${activeGradientClass}`}
        />
      )}

      {config.bgMode === 'solid' && (
        <div
          className={`fixed inset-0 z-0 transition-all duration-500 pointer-events-none ${activeSolidClass}`}
        />
      )}

      {/* 2. OVERLAY TINT FOR READABILITY */}
      <div
        className="fixed inset-0 z-0 transition-all duration-500 pointer-events-none"
        style={{
          backgroundColor: config.isDark ? '#020617' : '#0f172a',
          opacity: config.bgMode === 'solid' ? 0.05 : config.overlayOpacity,
        }}
      />

      {/* 3. TOP NAVIGATION: THEME CUSTOMIZER BUTTON */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsCustomizerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700/80 text-xs font-bold shadow-lg backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Palette className="w-4 h-4 text-indigo-500" />
          <span>Đổi Nền & Giao Diện ({config.bgMode === 'image' ? 'Ảnh Thư Viện' : config.bgMode === 'gradient' ? 'Dải Màu' : 'Màu Đơn'})</span>
        </button>
      </div>

      {/* 4. MAIN DEDICATED LOGIN CONTAINER */}
      <div className="max-w-2xl w-full relative z-10 my-6">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <BrandLogo size="lg" className="hover:scale-105 transition-transform" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            LibModular
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium drop-shadow-sm">
            Cổng Đăng Nhập Hệ Thống Quản Lý Thư Viện &bull; <span className="text-indigo-400 font-bold">Modular Monolith</span>
          </p>
        </div>

        {/* PRIMARY AUTH CARD */}
        <div
          className={`rounded-3xl p-5 sm:p-8 shadow-2xl transition-all border ${
            config.isGlassEnabled
              ? 'backdrop-blur-xl bg-slate-900/92 dark:bg-slate-900/92 border-slate-700/70'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          {/* Top Mode Tabs: Đăng nhập vs Đăng ký */}
          <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Đăng Nhập</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Tạo Tài Khoản</span>
            </button>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500/80 text-rose-200 text-xs shadow-xl shadow-rose-950/60 flex items-start gap-3.5 animate-in fade-in slide-in-from-top-1"
            >
              <div className="p-2 rounded-xl bg-rose-900/80 text-rose-300 shrink-0 mt-0.5 border border-rose-700/80 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="flex-1 leading-relaxed">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Không thể đăng nhập do sai tài khoản và mật khẩu!
                </h4>
                <p className="text-xs text-rose-200/90 mt-1 font-medium">
                  {errorMessage}
                </p>
                <p className="text-[11px] text-rose-400/90 mt-2 pt-2 border-t border-rose-800/60 flex items-center justify-between">
                  <span>Vui lòng kiểm tra lại chính xác tài khoản và mật khẩu của bạn.</span>
                </p>
              </div>
            </div>
          )}

          {/* MODE 1: LOGIN FORM WITH REAL CREDENTIALS */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Tên đăng nhập / Mã thẻ
                  </label>
                </div>
                <div className="relative">
                  <User
                    className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                      hasLoginError ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      if (hasLoginError || errorMessage) {
                        setErrorMessage(null);
                        setHasLoginError(false);
                      }
                    }}
                    placeholder="Nhập tên đăng nhập hoặc email..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border text-white text-xs sm:text-sm placeholder-slate-500 transition-all font-medium ${
                      hasLoginError
                        ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/20 text-rose-100 placeholder-rose-400/50'
                        : 'border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Mật khẩu</label>
                </div>
                <div className="relative">
                  <Lock
                    className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                      hasLoginError ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (hasLoginError || errorMessage) {
                        setErrorMessage(null);
                        setHasLoginError(false);
                      }
                    }}
                    placeholder="Nhập mật khẩu..."
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border text-white text-xs sm:text-sm placeholder-slate-500 transition-all font-mono ${
                      hasLoginError
                        ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/20 text-rose-100 placeholder-rose-400/50'
                        : 'border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {hasLoginError && (
                  <p className="mt-1.5 text-[11px] text-rose-400 flex items-center gap-1 font-medium animate-in fade-in">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Không thể đăng nhập do sai tài khoản và mật khẩu
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-3"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>Đăng Nhập</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Họ và tên người dùng
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Ví dụ: Lê Thị Mai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tên đăng nhập (Username)
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="ví dụ: maimai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mật khẩu tự chọn
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 4 ký tự"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 font-mono"
                  />
                </div>
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Vai trò tài khoản
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'student' as UserRole, label: 'Sinh viên', icon: GraduationCap, desc: 'Mượn sách & Thẻ thư viện' },
                    { id: 'guest' as UserRole, label: 'Khách', icon: User, desc: 'Tra cứu & Tham quan' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = regRole === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRegRole(item.id)}
                        className={`p-3 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{item.label}</span>
                        <span className="text-[11px] font-normal opacity-80">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {regRole === 'student' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mã thẻ sinh viên tự cấp
                  </label>
                  <input
                    type="text"
                    value={regReaderCode}
                    onChange={(e) => setRegReaderCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Hoàn tất đăng ký & Đăng nhập ngay</span>
              </button>
            </form>
          )}

          {/* Quick Google Sign In */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng nhập nhanh với Google OAuth</span>
            </button>
          </div>
        </div>



        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-4 font-medium drop-shadow-xs">
          LibModular &copy; 2026 &bull; Kiến trúc Modular Monolith &bull; Cloud Firestore Database
        </p>
      </div>
    </div>
  );
};
