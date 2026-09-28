import React, { useState, useEffect } from 'react';
import { ARCHITECTURE_SCENARIOS } from '../data/scenarios';
import { ScenarioDefinition, TraceStep } from '../types';
import {
  Play,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Zap,
  Activity,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const ScenarioSimulator: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(ARCHITECTURE_SCENARIOS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);

  const scenario = ARCHITECTURE_SCENARIOS.find((s) => s.id === selectedScenarioId) || ARCHITECTURE_SCENARIOS[0];

  const maxSteps = Math.max(scenario.traditionalSteps.length, scenario.modularSteps.length);

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < maxSteps) {
      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 1600);
    } else if (currentStepIndex >= maxSteps) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, maxSteps]);

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStepIndex < maxSteps) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Calculate cumulative durations
  const tradStepCurrent = scenario.traditionalSteps.slice(0, currentStepIndex);
  const modStepCurrent = scenario.modularSteps.slice(0, currentStepIndex);

  const tradDuration = tradStepCurrent.reduce((acc, s) => acc + s.durationMs, 0);
  const modDuration = modStepCurrent.reduce((acc, s) => acc + s.durationMs, 0);

  const isCompleted = currentStepIndex >= maxSteps;

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
          <span>Phòng Thí Nghiệm Đồ Án</span>
          <span aria-hidden="true">·</span>
          <span>Mô phỏng Luồng Xử lý Động (Dynamic Trace Simulation)</span>
          <span aria-hidden="true">·</span>
          <span>Theo thời gian thực</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Mô Phỏng & So Sánh Luồng Thực Thi Giữa Hai Kiến Trúc
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Chọn kịch bản thực tế để theo dõi từng bước đi của dữ liệu, thời gian giữ khóa CSDL và mức độ ảnh hưởng khi xảy ra sự cố.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {ARCHITECTURE_SCENARIOS.map((sc, idx) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              className={`text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-sky-50/70 border-sky-300 text-sky-950 shadow-xs ring-1 ring-sky-300'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-[11px] font-mono text-slate-400 font-semibold mb-0.5">
                KỊCH BẢN {idx + 1}
              </div>
              <div className="text-xs font-bold truncate">{sc.title.split(':')[1]?.trim() || sc.title}</div>
            </button>
          );
        })}
      </div>

      {/* Scenario Overview Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
        <div className="font-semibold text-slate-900">{scenario.title}</div>
        <p className="text-slate-600 leading-relaxed">{scenario.description}</p>
      </div>

      {/* Playback Controls & Simulation Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isCompleted && !isPlaying}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-sky-600 hover:bg-sky-500 text-white disabled:bg-slate-300 disabled:cursor-not-allowed'
            }`}
          >
            {isPlaying ? (
              <>
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{currentStepIndex === 0 ? 'Bắt đầu mô phỏng' : 'Tiếp tục chạy'}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Bước trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            disabled={isCompleted}
            className="p-2 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Bước tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
            title="Đặt lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-500 ml-2">
            Bước {Math.min(currentStepIndex, maxSteps)} / {maxSteps}
          </span>
        </div>

        {/* Failure Simulation Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
            className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
          />
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>Kích hoạt sự cố bên thứ ba (SMTP timeout / Network crash)</span>
        </label>
      </div>

      {/* Synchronized Side-by-Side Execution Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column Left: Traditional Monolith Trace */}
        <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Monolith Truyền Thống
              </div>
              <div className="text-sm font-bold text-slate-900">Luồng Xử Lý Đồng Bộ & Gắn Kết Chặt</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Thời gian tích lũy</div>
              <div className="text-sm font-mono font-bold text-rose-600 tabular-nums">
                {tradDuration} ms
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {scenario.traditionalSteps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex - 1;
              const isPending = idx >= currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    isCurrent
                      ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200 shadow-xs'
                      : isPast
                      ? 'bg-slate-50 border-slate-200 opacity-90'
                      : 'bg-white border-dashed border-slate-200 text-slate-400 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-[10px] font-mono">
                        {step.stepNumber}
                      </span>
                      <span className="text-slate-900">{step.component}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                      +{step.durationMs}ms
                    </span>
                  </div>

                  <div className="text-slate-800 font-medium">{step.action}</div>
                  <div className="text-slate-500 mt-1 leading-normal">{step.detail}</div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{step.layerOrModule}</span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        step.couplingType === 'DirectDbJoin'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {step.couplingType}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outcome Status Card on Completion */}
          {isCompleted && (
            <div
              className={`p-4 rounded-lg border text-xs space-y-2 ${
                simulateFailure
                  ? 'bg-rose-100 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {simulateFailure ? (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>HỆ THỐNG ĐỔ VỠ: GIAO DỊCH BỊ ROLLBACK HỦY BỎ!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>KẾT QUẢ: {scenario.traditionalOutcome.status}</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed">
                {simulateFailure
                  ? 'Do lỗi mạng khi gọi SMTP đồng bộ bên trong Transaction, toàn bộ thao tác bị hủy. Độc giả không thể hoàn thành việc mượn sách. Database bị giữ lock 5000ms!'
                  : scenario.traditionalOutcome.explanation}
              </p>
              <div className="pt-2 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="font-semibold text-slate-700">Vùng ảnh hưởng (Blast): </span>
                  <span>{scenario.traditionalOutcome.blastRadius}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Khóa dữ liệu: </span>
                  <span>{scenario.traditionalOutcome.lockContention}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Column Right: Modular Monolith Trace */}
        <div className="bg-white border border-sky-300 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Modular Monolith
              </div>
              <div className="text-sm font-bold text-slate-900">Ranh Giới Bounded Context & In-Process Event Bus</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Thời gian tích lũy</div>
              <div className="text-sm font-mono font-bold text-emerald-600 tabular-nums">
                {modDuration} ms
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {scenario.modularSteps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex - 1;
              const isPending = idx >= currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    isCurrent
                      ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-200 shadow-xs'
                      : isPast
                      ? 'bg-slate-50 border-slate-200 opacity-90'
                      : 'bg-white border-dashed border-slate-200 text-slate-400 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-sky-200 text-sky-900 flex items-center justify-center text-[10px] font-mono">
                        {step.stepNumber}
                      </span>
                      <span className="text-slate-900">{step.component}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                      +{step.durationMs}ms
                    </span>
                  </div>

                  <div className="text-slate-800 font-medium">{step.action}</div>
                  <div className="text-slate-500 mt-1 leading-normal">{step.detail}</div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{step.layerOrModule}</span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        step.couplingType === 'LooseEvent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {step.couplingType}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outcome Status Card on Completion */}
          {isCompleted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-2 text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>KẾT QUẢ: THÀNH CÔNG AN TOÀN (RESILIENT SUCCESS)</span>
              </div>
              <p className="leading-relaxed">
                {simulateFailure
                  ? 'Kể cả khi NotificationModule gặp lỗi mạng bên ngoài, nghiệp vụ mượn sách vẫn HOÀN TẤT THÀNH CÔNG trong CirculationModule. Sự kiện được đưa vào Retry Queue để gửi lại sau. Trải nghiệm người dùng không hề bị gián đoạn!'
                  : scenario.modularOutcome.explanation}
              </p>
              <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="font-semibold text-slate-700">Vùng ảnh hưởng (Blast): </span>
                  <span>{scenario.modularOutcome.blastRadius}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Khóa dữ liệu: </span>
                  <span>{scenario.modularOutcome.lockContention}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
