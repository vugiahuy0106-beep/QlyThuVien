import React from 'react';
import { Layers, BookOpen, GitCompare, Code2, Award, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  eventCount: number;
  onOpenEventBus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  eventCount,
  onOpenEventBus,
}) => {
  const navItems = [
    { id: 'comparison', label: 'So sánh Kiến trúc', icon: GitCompare },
    { id: 'simulator', label: 'Mô phỏng Kịch bản', icon: Zap },
    { id: 'demo', label: 'Phần mềm Thư viện', icon: BookOpen },
    { id: 'code', label: 'Mã nguồn & Ranh giới', icon: Code2 },
    { id: 'defense', label: 'Báo cáo & Bảo vệ', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('comparison');
            }}
            className="text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:text-sky-300 transition-colors"
          >
            <Layers className="w-5 h-5 text-sky-400" />
            <span>LibModular</span>
          </a>
          <span className="hidden lg:inline text-xs text-slate-400 font-mono">
            v1.0 · Kiến trúc Modular Monolith
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-sky-400 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEventBus}
            className="relative px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center gap-2"
            title="Mở nhật ký In-Process Event Bus"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Event Bus</span>
            <span className="text-[11px] font-mono tabular-nums text-slate-400">
              ({eventCount})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors shadow-sm whitespace-nowrap"
          >
            Thực nghiệm ngay
          </button>
        </div>
      </div>
    </header>
  );
};
