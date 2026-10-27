import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BgMode = 'image' | 'gradient' | 'solid' | 'custom';

export interface WallpaperItem {
  id: string;
  name: string;
  category: 'classical' | 'modern' | 'nature' | 'cyber';
  url: string;
  thumbnail: string;
  description: string;
}

export interface GradientItem {
  id: string;
  name: string;
  cssClass: string;
  preview: string;
  description: string;
}

export interface SolidItem {
  id: string;
  name: string;
  bgClass: string;
  colorPreview: string;
  isDark: boolean;
  description: string;
}

export const WALLPAPERS: WallpaperItem[] = [
  {
    id: 'libmodular_studio_art',
    name: 'Không Gian Thư Viện LibModular (Logo Art)',
    category: 'classical',
    url: '/assets/aistudio/image_ddf58b4e.png',
    thumbnail: '/assets/aistudio/image_ddf58b4e.png',
    description: 'Bức họa không gian thư viện gỗ ấm cúng với kệ sách và ánh nắng ngập tràn',
  },
  {
    id: 'trinity_hall',
    name: 'Đại Sảnh Thư Viện Hoàng Gia',
    category: 'classical',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=300&q=70',
    description: 'Vẻ đẹp cổ kính, mái vòm gỗ tráng lệ phong cách đại học Oxford & Trinity',
  },
  {
    id: 'cozy_desk',
    name: 'Bàn Đọc Gỗ Trầm & Đèn Vàng',
    category: 'classical',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=70',
    description: 'Không gian đọc sách ấm cúng, cổ điển và tạo cảm hứng học tập sâu sắc',
  },
  {
    id: 'modern_atrium',
    name: 'Thư Viện Kiến Trúc Tương Lai',
    category: 'modern',
    url: 'https://images.unsplash.com/photo-1507842229458-5777ab266dd9?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507842229458-5777ab266dd9?auto=format&fit=crop&w=300&q=70',
    description: 'Kiến trúc giếng trời hiện đại, ánh sáng tự nhiên và các tầng sách mở',
  },
  {
    id: 'infinite_stacks',
    name: 'Kệ Sách Ngút Ngàn Tri Thức',
    category: 'classical',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=70',
    description: 'Hàng ngàn cuốn sách xếp lớp hình học đối xứng đầy tính nghệ thuật',
  },
  {
    id: 'book_cafe',
    name: 'Quán Cafe Sách Mưa Chiều',
    category: 'modern',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=70',
    description: 'Thư thái, yên tĩnh với tách cafe và không gian đọc sách chill',
  },
  {
    id: 'cosmic_stars',
    name: 'Vũ Trụ Tri Thức Tinh Tú',
    category: 'cyber',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=70',
    description: 'Dải ngân hà vô tận, biểu tượng cho kho tàng tri thức nhân loại',
  },
  {
    id: 'botanical_greenhouse',
    name: 'Vườn Đọc Sách Thảo Mộc',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=70',
    description: 'Cây cỏ xanh mát, không gian sinh thái thoáng đãng và trong lành',
  },
  {
    id: 'cyber_archive',
    name: 'Lưu Trữ Số Cyber Matrix',
    category: 'cyber',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=70',
    description: 'Ánh sáng neon vi mạch hiện đại cho sinh viên công nghệ thông tin',
  },
  {
    id: 'autumn_campus',
    name: 'Giảng Đường Mùa Thu Lãng Mạn',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=300&q=70',
    description: 'Lá phong vàng rực rỡ bên thềm giảng đường đại học thanh bình',
  },
  {
    id: 'minimal_sunlight',
    name: 'Phòng Nghiên Cứu Nắng Ban Mai',
    category: 'modern',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1920&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=70',
    description: 'Sáng tinh khôi, gọn gàng, tăng cường năng lượng và sự tập trung',
  },
];

export const GRADIENTS: GradientItem[] = [
  {
    id: 'sunset_academic',
    name: 'Hoàng Hôn Giảng Đường (Sunset)',
    cssClass: 'bg-gradient-to-br from-[#1a0b2e] via-[#2d124d] to-[#4a1c17]',
    preview: 'from-purple-950 via-indigo-950 to-amber-950',
    description: 'Sự pha trộn huyền ảo giữa tím hoàng hôn và ánh đỏ hổ phách ấm áp',
  },
  {
    id: 'aurora_borealis',
    name: 'Cực Quang Tri Thức (Aurora)',
    cssClass: 'bg-gradient-to-br from-[#021b1a] via-[#05322b] to-[#041c2c]',
    preview: 'from-emerald-950 via-teal-950 to-cyan-950',
    description: 'Dải màu xanh ngọc bích cực quang phương Bắc tươi mát và thanh tĩnh',
  },
  {
    id: 'ocean_midnight',
    name: 'Đại Dương Đêm Sâu (Deep Ocean)',
    cssClass: 'bg-gradient-to-br from-[#030712] via-[#0c1a30] to-[#071329]',
    preview: 'from-slate-950 via-blue-950 to-indigo-950',
    description: 'Xanh thẳm đại dương sang trọng, êm dịu cho mắt khi làm việc buổi tối',
  },
  {
    id: 'imperial_amber',
    name: 'Hổ Phách Quý Tộc (Amber Gold)',
    cssClass: 'bg-gradient-to-br from-[#1c130c] via-[#2c1d11] to-[#120c08]',
    preview: 'from-amber-950 via-yellow-950 to-stone-950',
    description: 'Tone màu gỗ sồi và hổ phách cổ kính như các thư viện châu Âu thế kỷ 18',
  },
  {
    id: 'cyber_neon',
    name: 'Cyberpunk Dạ Quang (Synth)',
    cssClass: 'bg-gradient-to-br from-[#120324] via-[#28084a] to-[#070214]',
    preview: 'from-fuchsia-950 via-purple-950 to-violet-950',
    description: 'Đậm chất công nghệ tương lai, năng động và nổi bật',
  },
];

export const SOLIDS: SolidItem[] = [
  {
    id: 'slate',
    name: 'Mặc định (Slate Dark)',
    bgClass: 'bg-slate-950 text-slate-100',
    colorPreview: 'bg-slate-900 border-indigo-500',
    isDark: true,
    description: 'Tone xám đen hiện đại, dịu mắt, điểm nhấn màu chàm Indigo',
  },
  {
    id: 'light',
    name: 'Sáng Thanh Lịch (Clean Light)',
    bgClass: 'bg-slate-50 text-slate-900',
    colorPreview: 'bg-white border-indigo-600',
    isDark: false,
    description: 'Tone sáng thanh thoát, phong cách giảng đường và thư viện truyền thống',
  },
  {
    id: 'navy',
    name: 'Đại Dương Tri Thức (Navy)',
    bgClass: 'bg-[#06101e] text-slate-100',
    colorPreview: 'bg-[#0c1a2e] border-sky-500',
    isDark: true,
    description: 'Tone xanh biển sâu sang trọng, phong cách thư viện số hiện đại',
  },
  {
    id: 'emerald',
    name: 'Rừng Xanh Học Thuật (Emerald)',
    bgClass: 'bg-[#041610] text-slate-100',
    colorPreview: 'bg-[#08241b] border-emerald-500',
    isDark: true,
    description: 'Tone xanh ngọc bích tri thức, tươi mới và kích thích tập trung',
  },
  {
    id: 'parchment',
    name: 'Trang Sách Cổ Điển (Parchment)',
    bgClass: 'bg-[#18130f] text-amber-50',
    colorPreview: 'bg-[#231b15] border-amber-600',
    isDark: true,
    description: 'Tone vàng ấm trang sách cổ, dịu mắt và ấm cúng',
  },
  {
    id: 'violet',
    name: 'Tím Công Nghệ (Cyber Violet)',
    bgClass: 'bg-[#0f081d] text-slate-100',
    colorPreview: 'bg-[#190e2e] border-purple-500',
    isDark: true,
    description: 'Tone tím dạ quang cao cấp, phong cách công nghệ thế hệ mới',
  },
];

export interface ThemeConfig {
  bgMode: BgMode;
  selectedWallpaperId: string;
  selectedGradientId: string;
  selectedSolidId: string;
  customImageUrl: string;
  overlayOpacity: number; // 0.3 to 0.9
  blurPx: number; // 0, 4, 8, 12
  isGlassEnabled: boolean;
  isDark: boolean;
}

interface ThemeContextValue {
  config: ThemeConfig;
  setBgMode: (mode: BgMode) => void;
  selectWallpaper: (id: string) => void;
  selectGradient: (id: string) => void;
  selectSolid: (id: string) => void;
  setCustomImageUrl: (url: string) => void;
  setOverlayOpacity: (opacity: number) => void;
  setBlurPx: (px: number) => void;
  setIsGlassEnabled: (enabled: boolean) => void;
  setIsDark: (dark: boolean) => void;
  toggleDarkMode: () => void;
  resetToDefault: () => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;

  // Active theme properties for easy consumption
  activeWallpaperUrl: string;
  activeGradientClass: string;
  activeSolidClass: string;
}

const THEME_CONFIG_STORAGE_KEY = 'libmodular_rich_theme_config';

const DEFAULT_CONFIG: ThemeConfig = {
  bgMode: 'image',
  selectedWallpaperId: 'trinity_hall',
  selectedGradientId: 'sunset_academic',
  selectedSolidId: 'slate',
  customImageUrl: '',
  overlayOpacity: 0.72,
  blurPx: 0,
  isGlassEnabled: true,
  isDark: true,
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const stored = localStorage.getItem(THEME_CONFIG_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Error reading theme config:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Sync with HTML root class (dark mode)
  useEffect(() => {
    const root = document.documentElement;
    if (config.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem(THEME_CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving theme config:', e);
    }
  }, [config]);

  // Derived properties
  const activeWallpaper =
    WALLPAPERS.find((w) => w.id === config.selectedWallpaperId) || WALLPAPERS[0];
  const activeWallpaperUrl =
    config.bgMode === 'custom' && config.customImageUrl
      ? config.customImageUrl
      : activeWallpaper.url;

  const activeGradient =
    GRADIENTS.find((g) => g.id === config.selectedGradientId) || GRADIENTS[0];
  const activeGradientClass = activeGradient.cssClass;

  const activeSolid = SOLIDS.find((s) => s.id === config.selectedSolidId) || SOLIDS[0];
  const activeSolidClass = activeSolid.bgClass;

  const setBgMode = (bgMode: BgMode) => {
    setConfig((prev) => ({
      ...prev,
      bgMode,
      isDark: bgMode === 'solid' && prev.selectedSolidId === 'light' ? false : true,
    }));
  };

  const selectWallpaper = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      bgMode: 'image',
      selectedWallpaperId: id,
      isDark: true,
    }));
  };

  const selectGradient = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      bgMode: 'gradient',
      selectedGradientId: id,
      isDark: true,
    }));
  };

  const selectSolid = (id: string) => {
    const solidItem = SOLIDS.find((s) => s.id === id);
    setConfig((prev) => ({
      ...prev,
      bgMode: 'solid',
      selectedSolidId: id,
      isDark: solidItem ? solidItem.isDark : true,
    }));
  };

  const setCustomImageUrl = (customImageUrl: string) => {
    setConfig((prev) => ({
      ...prev,
      bgMode: 'custom',
      customImageUrl,
      isDark: true,
    }));
  };

  const setOverlayOpacity = (overlayOpacity: number) => {
    setConfig((prev) => ({ ...prev, overlayOpacity }));
  };

  const setBlurPx = (blurPx: number) => {
    setConfig((prev) => ({ ...prev, blurPx }));
  };

  const setIsGlassEnabled = (isGlassEnabled: boolean) => {
    setConfig((prev) => ({ ...prev, isGlassEnabled }));
  };

  const setIsDark = (isDark: boolean) => {
    setConfig((prev) => ({ ...prev, isDark }));
  };

  const toggleDarkMode = () => {
    setConfig((prev) => ({ ...prev, isDark: !prev.isDark }));
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <ThemeContext.Provider
      value={{
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
        toggleDarkMode,
        resetToDefault,
        isCustomizerOpen,
        setIsCustomizerOpen,
        activeWallpaperUrl,
        activeGradientClass,
        activeSolidClass,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
