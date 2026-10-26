import React from 'react';

export const LOGO_IMAGE_PATH = '/assets/aistudio/image_ddf58b4e.png';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  subtitle?: string;
  badge?: string;
  rounded?: 'lg' | 'xl' | '2xl' | 'full';
  onClick?: () => void;
}

const SIZE_CONFIGS = {
  xs: {
    container: 'w-7 h-7',
    radius: 'rounded-lg',
    title: 'text-sm font-bold',
    subtitle: 'text-[10px]',
  },
  sm: {
    container: 'w-9 h-9',
    radius: 'rounded-xl',
    title: 'text-base font-bold',
    subtitle: 'text-[11px]',
  },
  md: {
    container: 'w-11 h-11',
    radius: 'rounded-2xl',
    title: 'text-lg font-bold',
    subtitle: 'text-xs',
  },
  lg: {
    container: 'w-14 h-14',
    radius: 'rounded-2xl',
    title: 'text-2xl font-black',
    subtitle: 'text-xs',
  },
  xl: {
    container: 'w-20 h-20',
    radius: 'rounded-3xl',
    title: 'text-3xl font-black',
    subtitle: 'text-sm',
  },
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  subtitle,
  badge,
  rounded,
  onClick,
}) => {
  const conf = SIZE_CONFIGS[size];
  const radiusClass = rounded ? `rounded-${rounded}` : conf.radius;

  const imageElement = (
    <div
      className={`relative shrink-0 overflow-hidden ${conf.container} ${radiusClass} ring-1.5 ring-indigo-500/30 dark:ring-indigo-400/30 shadow-md shadow-indigo-950/20 bg-slate-900 group transition-all duration-300 hover:ring-indigo-400/60 hover:shadow-indigo-500/25 ${className} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      }`}
      onClick={onClick}
    >
      {/* High-fidelity cropped library art logo */}
      <img
        src={LOGO_IMAGE_PATH}
        alt="LibModular Logo"
        className="w-full h-full object-cover object-[center_45%] scale-110 transition-transform duration-500 group-hover:scale-120"
        loading="eager"
      />

      {/* Subtle warm light vignette overlay for visual polish */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-amber-500/10 pointer-events-none" />

      {/* Inner fine highlight border */}
      <div className={`absolute inset-0 ${radiusClass} border border-white/20 dark:border-white/10 pointer-events-none`} />
    </div>
  );

  if (!showText) {
    return imageElement;
  }

  return (
    <div className="flex items-center gap-3">
      {imageElement}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-white tracking-tight ${conf.title}`}>LibModular</span>
          {badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm border bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className={`text-slate-400 truncate ${conf.subtitle}`}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};
