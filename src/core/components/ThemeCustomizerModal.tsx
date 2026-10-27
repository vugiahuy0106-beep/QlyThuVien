import React, { useState } from 'react';
import { Modal } from './Modal';
import {
  useTheme,
  WALLPAPERS,
  GRADIENTS,
  SOLIDS,
  BgMode,
} from '../context/ThemeContext';
import {
  Palette,
  Check,
  Sparkles,
  Sun,
  Moon,
  Image as ImageIcon,
  Sliders,
  Sparkle,
  Link as LinkIcon,
  RotateCcw,
  Layers,
  Eye,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ThemeCustomizerModal: React.FC = () => {
  const {
    config,
    setBgMode,
    selectWallpaper,
    selectGradient,
    selectSolid,
    setCustomImageUrl,
    setOverlayOpacity,
    setBlurPx,
    setIsGlassEnabled,
    setIsDark,
    resetToDefault,
    isCustomizerOpen,
    setIsCustomizerOpen,
  } = useTheme();

  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'wallpapers' | 'gradients' | 'solids' | 'settings'>('wallpapers');
  const [customUrlInput, setCustomUrlInput] = useState(config.customImageUrl || '');

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    setCustomImageUrl(customUrlInput.trim());
    success('Đã áp dụng ảnh nền tùy chọn', 'Hệ thống đã cập nhật hình ảnh nền từ đường link của bạn.');
  };

  return (
    <Modal
      isOpen={isCustomizerOpen}
      onClose={() => setIsCustomizerOpen(false)}
      title="Tùy Biến Nền & Giao Diện Thư Viện"
      description="Lựa chọn hình nền thư viện kinh điển, dải màu gradient nghệ thuật hoặc màu đơn sắc sang trọng"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Quick Theme Mode Toggle (Sáng / Tối) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Chế độ hiển thị Giao diện</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                config.isDark ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {config.isDark ? 'Đang bật Tối (Dark)' : 'Đang bật Sáng (Light)'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Chuyển nhanh giữa chế độ Sáng (thanh lịch ban ngày) và chế độ Tối (dịu mắt ban đêm)
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsDark(false);
                success('Đã bật Giao diện Sáng', 'Toàn bộ giao diện đã chuyển sang chế độ Sáng.');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !config.isDark
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Sáng (Light)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsDark(true);
                success('Đã bật Giao diện Tối', 'Toàn bộ giao diện đã chuyển sang chế độ Tối.');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                config.isDark
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Tối (Dark)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('wallpapers')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'wallpapers'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Hình Nền Thư Viện ({WALLPAPERS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gradients')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'gradients'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dải Màu Gradient ({GRADIENTS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('solids')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'solids'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Màu Đơn Sắc ({SOLIDS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Hiệu Ứng Kính & Mờ</span>
          </button>
        </div>

        {/* TAB 1: WALLPAPER IMAGES */}
        {activeTab === 'wallpapers' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
              {WALLPAPERS.map((wp) => {
                const isSelected =
                  config.bgMode === 'image' && config.selectedWallpaperId === wp.id;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => {
                      selectWallpaper(wp.id);
                      success('Đã đổi hình nền', `Đã kích hoạt "${wp.name}".`);
                    }}
                    className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all cursor-pointer flex flex-col h-40 ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:scale-[1.01]'
                    }`}
                  >
                    {/* Background thumbnail */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${wp.thumbnail}')` }}
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                    {/* Active checkmark */}
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Content text */}
                    <div className="relative mt-auto p-3 text-white">
                      <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-indigo-200 transition-colors">
                        {wp.name}
                      </h4>
                      <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5 leading-tight opacity-90">
                        {wp.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom URL Option */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={handleApplyCustomUrl} className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="Hoặc dán URL ảnh nền bất kỳ từ internet (https://...)..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!customUrlInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                >
                  Áp dụng ảnh riêng
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: GRADIENTS */}
        {activeTab === 'gradients' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
            {GRADIENTS.map((grad) => {
              const isSelected =
                config.bgMode === 'gradient' && config.selectedGradientId === grad.id;
              return (
                <button
                  key={grad.id}
                  type="button"
                  onClick={() => {
                    selectGradient(grad.id);
                    success('Đã áp dụng dải màu', `Đã chọn "${grad.name}".`);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-100 dark:bg-slate-800/80 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl shadow-inner border border-white/20 bg-gradient-to-br ${grad.preview}`}
                        />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {grad.name}
                        </span>
                      </div>

                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {grad.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Phong cách chuyển tiếp đa sắc</span>
                    <span className={isSelected ? 'text-indigo-600 font-bold' : 'text-slate-400'}>
                      {isSelected ? 'Đang kích hoạt' : 'Chọn dải màu này'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 3: SOLID COLORS */}
        {activeTab === 'solids' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
            {SOLIDS.map((sol) => {
              const isSelected =
                config.bgMode === 'solid' && config.selectedSolidId === sol.id;
              return (
                <button
                  key={sol.id}
                  type="button"
                  onClick={() => {
                    selectSolid(sol.id);
                    success('Đã áp dụng màu nền', `Đã chọn "${sol.name}".`);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-slate-100 dark:bg-slate-800/80 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl border-2 shadow-xs ${sol.colorPreview}`} />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {sol.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {sol.isDark ? (
                          <Moon className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {sol.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {sol.isDark ? 'Chế độ tối (Dark)' : 'Chế độ sáng (Light)'}
                    </span>
                    <span className={isSelected ? 'text-indigo-600 font-bold' : 'text-slate-400'}>
                      {isSelected ? 'Đang kích hoạt' : 'Chọn màu này'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 4: ADVANCED TWEAKS & GLASS EFFECT */}
        {activeTab === 'settings' && (
          <div className="space-y-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            {/* Overlay Opacity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  <span>Độ mờ lớp phủ nền (Độ tối ưu cho khả năng đọc chữ)</span>
                </label>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round(config.overlayOpacity * 100)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 0.45, label: '45% (Thấy rõ ảnh nền)' },
                  { val: 0.6, label: '60% (Cân bằng)' },
                  { val: 0.75, label: '75% (Tiêu chuẩn)' },
                  { val: 0.88, label: '88% (Tối đa tương phản)' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setOverlayOpacity(item.val)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                      config.overlayOpacity === item.val
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Blur */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Sparkle className="w-4 h-4 text-indigo-500" />
                  <span>Độ làm mờ hậu cảnh (Backdrop Blur)</span>
                </label>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {config.blurPx}px
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { px: 0, label: '0px (Sắc nét)' },
                  { px: 4, label: '4px (Mờ nhẹ)' },
                  { px: 8, label: '8px (Mờ nghệ thuật)' },
                  { px: 14, label: '14px (Mờ sâu)' },
                ].map((item) => (
                  <button
                    key={item.px}
                    type="button"
                    onClick={() => setBlurPx(item.px)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                      config.blurPx === item.px
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Glassmorphism Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    Hiệu ứng Kính Mờ (Glassmorphism)
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Làm trong suốt nhẹ các thẻ dữ liệu và thanh điều hướng để lộ lớp nền sang trọng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGlassEnabled(!config.isGlassEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  config.isGlassEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                    config.isGlassEnabled ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              resetToDefault();
              success('Đã khôi phục', 'Đã đặt lại nền thư viện hoàng gia mặc định.');
            }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định ban đầu</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCustomizerOpen(false)}
            className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all cursor-pointer"
          >
            Hoàn tất & Áp dụng
          </button>
        </div>
      </div>
    </Modal>
  );
};
