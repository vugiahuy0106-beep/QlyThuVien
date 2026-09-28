import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ArchitectureHero } from './components/ArchitectureHero';
import { ArchitectureComparisonView } from './components/ArchitectureComparisonView';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { LibraryAppDemo } from './components/LibraryAppDemo';
import { CodeExplorer } from './components/CodeExplorer';
import { AcademicDefenseKit } from './components/AcademicDefenseKit';
import { EventBusInspector } from './components/EventBusInspector';
import { eventBus } from './core/eventBus';
import { DomainEvent } from './types';
import { Layers, BookOpen, GitCompare, Code2, Award, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('comparison');
  const [isEventBusOpen, setIsEventBusOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<DomainEvent[]>(() => eventBus.getHistory());

  useEffect(() => {
    const unsub = eventBus.onHistoryChange((updatedEvents) => {
      setEvents(updatedEvents);
    });
    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Bar Contract Compliant Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        eventCount={events.length}
        onOpenEventBus={() => setIsEventBusOpen(true)}
      />

      {/* Hero Banner with Academic Visual Presence */}
      {activeTab === 'comparison' && (
        <ArchitectureHero
          onExploreSimulator={() => setActiveTab('simulator')}
          onExploreApp={() => setActiveTab('demo')}
        />
      )}

      {/* Main Viewport Container (1440px max width presence) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'comparison' && <ArchitectureComparisonView />}

        {activeTab === 'simulator' && <ScenarioSimulator />}

        {activeTab === 'demo' && <LibraryAppDemo />}

        {activeTab === 'code' && <CodeExplorer />}

        {activeTab === 'defense' && <AcademicDefenseKit />}
      </main>

      {/* In-Process Event Bus Drawer */}
      <EventBusInspector
        isOpen={isEventBusOpen}
        onClose={() => setIsEventBusOpen(false)}
        events={events}
        onClear={() => {
          eventBus.clearHistory();
          setEvents([]);
        }}
      />

      {/* Domain-Native Academic Footer (Section 1.B) */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-white">LibModular</span>
            <span>— Đồ Án Nghiên Cứu Môn Các Vấn Đề Hiện Đại Của CNTT</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Domain-Driven Design (DDD)</span>
            <span>·</span>
            <span>Bounded Contexts</span>
            <span>·</span>
            <span>In-Process Event Bus</span>
            <span>·</span>
            <span>Architectural Fitness Functions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
