import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: ReactNode;
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  colorScheme,
  badge,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-100 dark:border-indigo-900/50',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/50',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/50',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/50',
    },
    sky: {
      bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',
      border: 'border-sky-100 dark:border-sky-900/50',
    },
  }[colorScheme];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colorMap.bg}`}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {badge}
          </span>
        )}
      </div>
      {subtext && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtext}</p>}
    </div>
  );
};
