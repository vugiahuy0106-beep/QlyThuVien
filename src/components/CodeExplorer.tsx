import React, { useState } from 'react';
import { CODE_SAMPLES, CodeSnippetItem } from '../data/codebaseSamples';
import {
  Code2,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  FolderTree,
  Terminal,
  CheckCircle,
  XCircle,
  Copy,
  Check,
} from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(CODE_SAMPLES[0].id);
  const [activeCodeTab, setActiveCodeTab] = useState<'modular' | 'traditional'>('modular');
  const [copied, setCopied] = useState(false);
  const [simulatedViolation, setSimulatedViolation] = useState<'idle' | 'testing' | 'failed'>('idle');

  const snippet = CODE_SAMPLES.find((s) => s.id === selectedSnippetId) || CODE_SAMPLES[0];

  const handleCopy = () => {
    const code = activeCodeTab === 'modular' ? snippet.modularCode : snippet.traditionalCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunArchUnitTest = () => {
    setSimulatedViolation('testing');
    setTimeout(() => {
      setSimulatedViolation('failed');
    }, 700);
  };

  const handleResetArchUnitTest = () => {
    setSimulatedViolation('idle');
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
          <span>Khảo Sát Mã Nguồn & Ranh Giới</span>
          <span aria-hidden="true">·</span>
          <span>Architectural Fitness Functions</span>
          <span aria-hidden="true">·</span>
          <span>Clean Architecture</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          So Sánh Tổ Chức Mã Nguồn & Cơ Chế Kiểm Soát Ranh Giới
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          So sánh sự khác biệt trong mã nguồn thực tế: từ cấu trúc cây thư mục, thiết kế Interface Contract đến công cụ tự động hóa kiểm tra ranh giới (ArchUnit / ESLint).
        </p>
      </div>

      {/* Snippet Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {CODE_SAMPLES.map((item) => {
          const isSelected = item.id === selectedSnippetId;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedSnippetId(item.id);
                setSimulatedViolation('idle');
              }}
              className={`text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-sky-50 border-sky-300 text-sky-950 shadow-xs ring-1 ring-sky-300'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 font-semibold mb-0.5 uppercase">
                {item.category}
              </div>
              <div className="text-xs font-bold truncate">{item.title.split(':')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Main Code Comparison Box */}
      <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Code Header Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('modular')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeCodeTab === 'modular'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>Modular Monolith (Chuẩn Khuyến Nghị)</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('traditional')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                activeCodeTab === 'traditional'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
              <span>Monolith Truyền Thống (Dễ Suy Thoái)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              {snippet.fileName}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Sao chép mã nguồn"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed">
          <pre
            className={`${
              activeCodeTab === 'modular' ? 'text-emerald-300' : 'text-rose-200'
            }`}
          >
            {activeCodeTab === 'modular' ? snippet.modularCode : snippet.traditionalCode}
          </pre>
        </div>

        {/* Architectural Insight Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Nguyên lý cốt lõi:</span>
            <span className="text-sky-400 font-mono">{snippet.keyPrinciple}</span>
          </div>
          <p className="text-slate-400 leading-relaxed">{snippet.explanation}</p>
        </div>
      </div>

      {/* Interactive Boundary Test Sandbox */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-600" />
              <span>Công Cụ Thử Nghiệm Kiểm Tra Ranh Giới (ArchUnit Sandbox)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Giả lập tình huống khi lập trình viên cố tình import thư mục <code>modules/catalog/internal/</code> vào <code>modules/circulation/</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {simulatedViolation === 'idle' ? (
              <button
                onClick={handleRunArchUnitTest}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Chạy kiểm tra CI/CD (npm run test:arch)
              </button>
            ) : (
              <button
                onClick={handleResetArchUnitTest}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>

        {/* Terminal Output */}
        <div className="p-4 bg-slate-950 text-slate-200 rounded-lg font-mono text-xs space-y-1">
          <div className="text-slate-500">$ npx archunit-ts --project ./src</div>

          {simulatedViolation === 'idle' && (
            <div className="text-emerald-400 pt-1">
              ✓ All 5 modules adhere to bounded context isolation rules. (0 boundary violations)
            </div>
          )}

          {simulatedViolation === 'testing' && (
            <div className="text-sky-400 pt-1 animate-pulse">
              Running Architectural Fitness Functions scanning 142 source files...
            </div>
          )}

          {simulatedViolation === 'failed' && (
            <div className="pt-2 space-y-1.5 text-rose-400">
              <div className="font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>BUILD FAILED: Architectural Rule Violation Detected!</span>
              </div>
              <div className="text-slate-400 pl-6 text-[11px] space-y-1">
                <div>[Rule: no-cross-module-internal-imports]</div>
                <div className="text-rose-300">
                  File: /src/modules/circulation/BorrowBookUseCase.ts:4:1
                </div>
                <div>
                  Error: Module 'circulation' must NOT import internal package 'catalog/internal/BookEntity'.
                </div>
                <div className="text-emerald-400">
                  Fix: Use the public contract 'ICatalogModule' in 'modules/catalog/public/ICatalogModule.ts' instead.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
