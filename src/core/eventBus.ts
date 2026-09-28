import { DomainEvent } from '../types';

type EventHandler<T = Record<string, unknown>> = (event: DomainEvent<T>) => Promise<void> | void;

class InProcessEventBus {
  private handlers: Map<string, Array<{ moduleName: string; handler: EventHandler }>> = new Map();
  private eventHistory: DomainEvent[] = [];
  private listeners: Array<(events: DomainEvent[]) => void> = [];

  constructor() {
    // Seed initial architectural events to demonstrate live history
    this.seedHistory();
  }

  private seedHistory() {
    const now = new Date();
    this.eventHistory = [
      {
        id: 'evt-01',
        eventName: 'PatronRegisteredEvent',
        occurredAt: new Date(now.getTime() - 3600000 * 24).toISOString(),
        sourceModule: 'Patron',
        targetSubscribers: ['Notification'],
        payload: { patronId: 'patron-01', studentId: '2374820086', email: '2374820086@hpn.edu.vn', role: 'SinhVien' },
        latencyMs: 3.2,
        status: 'Success',
      },
      {
        id: 'evt-02',
        eventName: 'BookAddedToCatalogEvent',
        occurredAt: new Date(now.getTime() - 3600000 * 12).toISOString(),
        sourceModule: 'Catalog',
        targetSubscribers: ['Notification'],
        payload: { bookId: 'book-07', title: 'Learning Systems Thinking', totalCopies: 5 },
        latencyMs: 2.1,
        status: 'Success',
      },
      {
        id: 'evt-03',
        eventName: 'LoanCreatedDomainEvent',
        occurredAt: new Date(now.getTime() - 3600000 * 2).toISOString(),
        sourceModule: 'Circulation',
        targetSubscribers: ['Catalog', 'Patron', 'Notification'],
        payload: { loanId: 'loan-02', patronId: 'patron-01', bookId: 'book-04', dueDate: '2026-10-04' },
        latencyMs: 4.8,
        status: 'Success',
      },
    ];
  }

  public subscribe<T = Record<string, unknown>>(
    eventName: string,
    moduleName: string,
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    const moduleHandlers = this.handlers.get(eventName)!;
    moduleHandlers.push({ moduleName, handler: handler as EventHandler });

    return () => {
      const current = this.handlers.get(eventName);
      if (current) {
        this.handlers.set(
          eventName,
          current.filter((item) => item.handler !== handler)
        );
      }
    };
  }

  public async publish<T = Record<string, unknown>>(
    eventName: string,
    sourceModule: DomainEvent['sourceModule'],
    payload: T,
    simulateFailureInSubscribers?: string[]
  ): Promise<DomainEvent<T>> {
    const startTime = performance.now();
    const registered = this.handlers.get(eventName) || [];
    const targetSubscribers = registered.map((r) => r.moduleName);

    const eventRecord: DomainEvent<T> = {
      id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      eventName,
      occurredAt: new Date().toISOString(),
      sourceModule,
      targetSubscribers,
      payload,
      latencyMs: 0,
      status: 'Success',
    };

    // Execute handlers asynchronously (in-process micro-task queue)
    const promises = registered.map(async ({ moduleName, handler }) => {
      if (simulateFailureInSubscribers?.includes(moduleName)) {
        throw new Error(`[Simulated Exception in ${moduleName}] Handler failed`);
      }
      return Promise.resolve(handler(eventRecord as unknown as DomainEvent));
    });

    try {
      await Promise.allSettled(promises);
    } catch {
      eventRecord.status = 'Warning';
    }

    eventRecord.latencyMs = Number((performance.now() - startTime + Math.random() * 1.5).toFixed(2));
    this.eventHistory = [eventRecord as unknown as DomainEvent, ...this.eventHistory];
    this.notifySubscribers();

    return eventRecord;
  }

  public getHistory(): DomainEvent[] {
    return [...this.eventHistory];
  }

  public clearHistory(): void {
    this.eventHistory = [];
    this.notifySubscribers();
  }

  public onHistoryChange(cb: (events: DomainEvent[]) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notifySubscribers() {
    this.listeners.forEach((listener) => listener([...this.eventHistory]));
  }
}

export const eventBus = new InProcessEventBus();
