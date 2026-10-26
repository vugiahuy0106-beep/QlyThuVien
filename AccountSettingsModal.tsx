import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../modules/auth/AuthContext';
import { useToast } from '../context/ToastContext';
import { readerService } from '../../modules/readers/readerService';
import { Reader } from '../../modules/readers/types';
import {
  X,
  User,
  Lock,
  Camera,
  Upload,
  Link as LinkIcon,
  Check,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  Trash2,
  Save,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  readers?: Reader[];
}

// Curated high quality avatars for scholars, researchers, students, and librarians
const PRESET_AVATARS = [
  {
    id: 'avatar-library-logo',
    name: 'Biểu Tượng Thư Viện LibModular',
    url: '/assets/aistudio/image_ddf58b4e.png',
    category: 'scholar',
  },
  {
    id: 'avatar-scholar-1',
    name: 'Học giả Trẻ (Huy)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    category: 'scholar',
  },
  {
    id: 'avatar-student-2',
    name: 'Sinh viên Nghiên cứu',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=256&auto=format&fit=crop&q=80',
    category: 'student',
  },
  {
    id: 'avatar-scientist-3',
    name: 'Nhà Khoa học Trẻ',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    category: 'student',
  },
  {
    id: 'avatar-dev-4',
    name: 'Kỹ sư Công nghệ',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
    category: 'student',
  },
  {
    id: 'avatar-literature-5',
    name: 'Độc giả Văn học',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop&q=80',
    category: 'reader',
  },
  {
    id: 'avatar-creative-6',
    name: 'Học giả Sáng tạo',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&auto=format&fit=crop&q=80',
    category: 'reader',
  },
  {
    id: 'avatar-academic-7',
    name: 'Giảng viên / Nghiên cứu',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80',
    category: 'librarian',
  },
  {
    id: 'avatar-librarian-8',
    name: 'Thủ thư Trưởng',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=256&auto=format&fit=crop&q=80',
    category: 'librarian',
  },
];

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  readers = [],
}) => {
  const { user, role, updateProfile, changePassword } = useAuth();
  const { success, error: toastError } = useToast();

  const isStudent = role === 'student';
  const isGuest = role === 'guest';

  // Active tab: 'profile' | 'security'
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile edit fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state when modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      // Clean display name of role suffixes if needed
      const rawName = user.displayName || (isStudent ? 'Vũ Gia Huy' : 'Người dùng');
      const cleanName = rawName.replace(/ \((Sinh viên|Khách Sinh Viên|Thủ thư Trưởng|Độc giả|Admin)\)/g, '').trim();
      setFullName(cleanName);
      setEmail(user.email || (isStudent ? 'huy.vu@example.com' : ''));
      setAvatarUrl(user.photoURL || null);
      setCustomUrlInput('');
      setPassError(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Look up additional reader details if student
      if (isStudent) {
        const studentCode = user.studentReaderCode || 'DG-2001';
        const reader = readers.find(
          (r) => r.readerCode === studentCode || r.email === user.email
        );
        if (reader) {
          setPhone(reader.phone || '0912345678');
          setAddress(reader.address || '280 An Dương Vương, Q.5, TP.HCM');
        } else {
          setPhone('0912345678');
          setAddress('280 An Dương Vương, Q.5, TP.HCM');
        }
      }
    }
  }, [isOpen, user, isStudent, readers]);

  if (!isOpen || !user) return null;

  // Handle local image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Định dạng không hợp lệ', 'Vui lòng chọn file hình ảnh (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toastError('Kích thước ảnh quá lớn', 'Vui lòng chọn ảnh nhỏ hơn 2MB để đảm bảo tốc độ.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        success('Đã tải ảnh lên', 'Xem trước ảnh đại diện thành công. Nhấn "Lưu thay đổi" để áp dụng.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle applying custom URL
  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatarUrl(customUrlInput.trim());
    setCustomUrlInput('');
    success('Đã chọn URL ảnh', 'Xem trước ảnh đại diện thành công.');
  };

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toastError('Thiếu họ tên', 'Vui lòng nhập họ và tên của bạn.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const formattedDisplayName = isStudent
        ? `${fullName.trim()} (Sinh viên)`
        : isGuest
        ? `${fullName.trim()} (Tham quan)`
        : `${fullName.trim()}`;

      await updateProfile({
        displayName: formattedDisplayName,
        photoURL: avatarUrl,
        email: email.trim(),
      });

      // Synchronize with Firestore readers collection if current user is linked to a reader card
      if (isStudent && user.studentReaderCode) {
        const matchingReader = readers.find(
          (r) => r.readerCode === user.studentReaderCode || r.readerCode === 'DG-2001'
        );
        if (matchingReader) {
          try {
            await readerService.updateReader(matchingReader.id, {
              fullName: fullName.trim(),
              email: email.trim(),
              phone: phone.trim(),
              address: address.trim(),
            });
          } catch (rErr) {
            console.warn('Reader profile sync note:', rErr);
          }
        }
      }

      success(
        'Cập nhật tài khoản thành công!',
        `Thông tin và ảnh đại diện của ${fullName.trim()} đã được lưu vào hệ thống.`
      );
      onClose();
    } catch (err: any) {
      toastError('Không thể cập nhật', err.message || 'Lỗi khi lưu thông tin tài khoản.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Password Change
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (!currentPassword) {
      setPassError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPassError('Mật khẩu mới phải có tối thiểu 4 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Mật khẩu xác nhận không khớp. Vui lòng nhập lại.');
      return;
    }

    setIsChangingPass(true);
    try {
      await changePassword(currentPassword, newPassword);
      success(
        'Đổi mật khẩu thành công!',
        'Mật khẩu tài khoản của bạn đã được cập nhật an toàn.'
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: any) {
      const msg = err.message || 'Không thể đổi mật khẩu.';
      setPassError(msg);
      toastError('Đổi mật khẩu thất bại', msg);
    } finally {
      setIsChangingPass(false);
    }
  };

  const userInitial = (fullName.trim() || user.displayName || 'U')[0].toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Cài Đặt Tài Khoản
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    isGuest
                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                      : isStudent
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                  }`}
                >
                  {isGuest ? (
                    <UserCheck className="w-3 h-3" />
                  ) : isStudent ? (
                    <GraduationCap className="w-3 h-3" />
                  ) : (
                    <ShieldCheck className="w-3 h-3" />
                  )}
                  <span>{isGuest ? 'Khách Vãng Lai' : isStudent ? 'Học Giả / Sinh Viên' : 'Quản Trị Viên'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cập nhật họ tên, ảnh đại diện tài khoản và đổi mật khẩu bảo mật
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Hồ Sơ & Ảnh Đại Diện</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Bảo Mật & Đổi Mật Khẩu</span>
          </button>
        </div>

        {/* TAB 1: PROFILE & AVATAR */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Top avatar preview & actions */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar circle */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-indigo-500/20 bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xl">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName || 'Avatar'}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarUrl(null)}
                    />
                  ) : (
                    <span className="text-2xl font-black">{userInitial}</span>
                  )}
                </div>
                {/* Online indicator */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>

              {/* Avatar info & quick upload/delete buttons */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {fullName || 'Chưa đặt tên'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.username ? `@${user.username}` : user.email || 'Học giả LibModular'} &bull;{' '}
                    <span className="font-semibold text-indigo-500">
                      {isStudent ? 'Mã thẻ: ' + (user.studentReaderCode || 'DG-2001') : 'Tài khoản hệ thống'}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  {/* Local file upload input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải ảnh từ máy</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa ảnh</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preset Avatars Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bộ sưu tập ảnh đại diện Học giả & Độc giả có sẵn:</span>
                </label>
                <span className="text-[11px] text-slate-400">Nhấn để chọn nhanh</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      title={preset.name}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer group hover:scale-105 active:scale-95 ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/50'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-600/40 rounded-xl flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Or custom URL input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Hoặc liên kết URL ảnh đại diện trên mạng:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Profile fields: Full Name, Email, Phone, Address */}
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Thông tin học giả & thẻ thư viện
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Họ và tên học giả / độc giả *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Vũ Gia Huy"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="huy.vu@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {isStudent && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912345678"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Địa chỉ / Khoa viện
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Khoa CNTT - ĐH Sư Phạm TP.HCM"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-indigo-50/60 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                &bull; Thông tin họ tên và ảnh sẽ được cập nhật đồng bộ cho hồ sơ cá nhân, Thẻ Thư Viện Điện Tử và các giao dịch mượn trả sách.
              </p>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SECURITY & CHANGE PASSWORD */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {passError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{passError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mật khẩu hiện tại *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang sử dụng..."
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 4 ký tự..."
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Xác nhận mật khẩu mới *
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Quy tắc bảo mật mật khẩu:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] leading-relaxed">
                <li>Độ dài tối thiểu 4 ký tự.</li>
                <li>Mật khẩu mới có hiệu lực ngay lập tức cho các lần đăng nhập tiếp theo.</li>
                <li>Không chia sẻ mật khẩu của bạn với bất kỳ ai để bảo vệ quyền lợi mượn sách.</li>
              </ul>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isChangingPass}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isChangingPass ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
