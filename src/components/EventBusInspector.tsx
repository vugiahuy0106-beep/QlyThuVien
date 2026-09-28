import React, { useState } from 'react';
import { DomainEvent } from '../types';
import { eventBus } from '../core/eventBus';
import {
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  Play,
  ArrowRight,
  Send,
  Radio,
} from 'lucide-react';

interface EventBusInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  events: DomainEvent[];
  onClear: () => void;
}

export const EventBusInspector: React.FC<EventBusInspectorProps> = ({
  isOpen,
  onClose,
  events,
  onClear,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(events[0]?.id || null);

  if (!isOpen) return null;

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleDispatchTestEvent = () => {
    eventBus.publish('TestDiagnosticPingEvent', 'Circulation', {
      timestamp: Date.now(),
      message: 'Kiểm tra thông tuyến In-Process Event Bus',
      pingOrigin: 'Simulator Inspector',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full shadow-2xl flex flex-col text-slate-100">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>In-Process Event Bus Inspector</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-400">
                Quan sát sự kiện miền (Domain Events) truyền tải bất đồng bộ trong bộ nhớ RAM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDispatchTestEvent}
              className="px-2.5 py-1 text-xs font-medium text-sky-300 bg-sky-950 hover:bg-sky-900 border border-sky-800 rounded transition-colors flex items-center gap-1.5"
              title="Phát sự kiện kiểm thử"
            >
              <Send className="w-3 h-3" />
              <span>Gửi Test Event</span>
            </button>

            <button
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
              title="Xóa lịch sử sự kiện"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body: Two Column Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Event List (5 cols) */}
          <div className="md:col-span-6 border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/80">
            {events.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Chưa có sự kiện nào được ghi nhận. Hãy thực hiện mượn sách hoặc trả sách trên giao diện để quan sát.
              </div>
            ) : (
              events.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`w-full text-left p-3 transition-colors block ${
                      isSelected
                        ? 'bg-slate-800 border-l-2 border-sky-400'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-sky-400 font-semibold">{evt.sourceModule}</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {evt.latencyMs} ms
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white truncate">{evt.eventName}</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>Đến: {evt.targetSubscribers.join(', ') || 'Zero Listeners'}</span>
                      <span className="font-mono">
                        {new Date(evt.occurredAt).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Event Payload & Execution Details (7 cols) */}
          <div className="md:col-span-6 p-4 overflow-y-auto space-y-4 bg-slate-950/50 text-xs">
            {selectedEvent ? (
              <>
                <div className="space-y-1 pb-3 border-b border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Chi tiết Sự Kiện Miền</div>
                  <div className="text-sm font-bold text-sky-400 font-mono">
                    {selectedEvent.eventName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Mã sự kiện: <span className="font-mono text-slate-300">{selectedEvent.id}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                    <div className="text-slate-400">Phân hệ Phát (Publisher)</div>
                    <div className="font-semibold text-white mt-0.5">{selectedEvent.sourceModule}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                    <div className="text-slate-400">Độ trễ In-Memory</div>
                    <div className="font-semibold font-mono text-emerald-400 mt-0.5 tabular-nums">
                      {selectedEvent.latencyMs} ms (In-RAM)
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 text-[11px] mb-1.5">
                    Các Phân Hệ Nhận & Xử Lý (Subscribers):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.targetSubscribers.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono text-[10px]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 text-[11px] mb-1.5">Dữ Liệu Payload (JSON):</div>
                  <pre className="p-3 bg-slate-900 text-slate-200 border border-slate-800 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
                    {JSON.stringify(selectedEvent.payload, null, 2)}
                  </pre>
                </div>

                <div className="p-3 bg-sky-950/40 border border-sky-800/80 rounded-lg text-[11px] text-sky-200 leading-normal">
                  <strong>Ưu thế kiến trúc:</strong> Khác với Monolith truyền thống gọi hàm dây chuyền, Event Bus giải phóng phân hệ phát ngay lập tức. Các phân hệ nhận chạy độc lập trong cùng 1 process, zero network latency.
                </div>
              </>
            ) : (
              <div className="text-slate-500 text-center py-10">Chọn một sự kiện để xem chi tiết payload</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
