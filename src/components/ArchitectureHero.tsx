import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Cpu, Sparkles, BookOpen } from 'lucide-react';

interface ArchitectureHeroProps {
  onExploreSimulator: () => void;
  onExploreApp: () => void;
}

export const ArchitectureHero: React.FC<ArchitectureHeroProps> = ({
  onExploreSimulator,
  onExploreApp,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Academic Brief & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed Metadata Header (Rule 1.A) */}
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
              <span>Đề tài Nghiên cứu</span>
              <span aria-hidden="true">·</span>
              <span>Môn: Các vấn đề hiện đại của CNTT</span>
              <span aria-hidden="true">·</span>
              <span>Khóa Luận / Đồ Án Chuyên Đề</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Hệ Thống Quản Lý Thư Viện Kiến Trúc <span className="text-sky-400">Modular Monolith</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Giải pháp kiến trúc phần mềm dung hòa hoàn hảo: Giữ trọn tính bao đóng và ranh giới nghiệp vụ sạch của{' '}
              <strong className="text-white font-semibold">Microservices</strong>, đồng thời loại bỏ 100% sự phức tạp phân tán, độ trễ mạng và chi phí vận hành đắt đỏ thông qua mô hình{' '}
              <strong className="text-white font-semibold">In-Process Event Bus & Bounded Contexts</strong>.
            </p>

            {/* Micro-metrics with clean unboxed text and dividers */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white">5 Bounded</div>
                <div className="text-xs text-slate-400">Contexts độc lập</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">&lt; 5ms</div>
                <div className="text-xs text-slate-400">Độ trễ In-Process Event</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-sky-400">1 Artifact</div>
                <div className="text-xs text-slate-400">Triển khai tối giản</div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreSimulator}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <span>Xem Mô phỏng So sánh</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreApp}
                className="px-5 py-2.5 text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Trải nghiệm Phần mềm Thư viện</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Fidelity Architecture Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src="/src/assets/images/hero_modular_monolith_1790582976381.jpg"
                alt="Sơ đồ kiến trúc Modular Monolith"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

              {/* Architectural Highlights Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-xs space-y-1.5 pointer-events-none">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold text-white">Kiến trúc Thư viện: 5 Phân hệ lõi</span>
                  <span className="font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ranh giới cô lập
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] leading-snug">
                  Catalog · Patron/Độc giả · Circulation/Mượn trả · Fine/Phạt · Notification
                </div>
              </div>
            </div>

            {/* Quick Note Badge */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Single Process Deployment</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero Microservice Tax</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
