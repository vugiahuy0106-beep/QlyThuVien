export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: 'KienTrucPhanMem' | 'CoSoDuLieu' | 'HeThongPhanTan' | 'AI_MachineLearning' | 'LapTrinhHeThong' | 'AnToanThongTin';
  categoryLabel: string;
  totalCopies: number;
  availableCopies: number;
  publishedYear: number;
  publisher: string;
  locationShelf: string;
  coverImage?: string;
  description?: string;
}

export interface Patron {
  id: string;
  studentId: string;
  fullName: string;
  role: 'SinhVien' | 'HocVienCaoHoc' | 'GiangVien';
  email: string;
  phone: string;
  borrowLimit: number;
  currentBorrowCount: number;
  status: 'HoatDong' | 'KhoaThe' | 'CanGiaHan';
  debtFineAmount: number; // VND
  department?: string;
  joinedDate?: string;
  avatarColor?: string;
  avatarUrl?: string;
}

export interface LoanRecord {
  id: string;
  patronId: string;
  patronName: string;
  patronStudentId?: string;
  bookId: string;
  bookTitle: string;
  borrowDate: string; // ISO date
  dueDate: string; // ISO date
  returnDate: string | null;
  status: 'DangMuon' | 'DaTra' | 'QuaHan';
  overdueDays: number;
  fineAmount: number;
  notes?: string;
  renewalCount?: number;
}

export interface FineRecord {
  id: string;
  loanId: string;
  patronId: string;
  patronName: string;
  bookTitle: string;
  overdueDays: number;
  amount: number;
  status: 'ChuaThanhToan' | 'DaThanhToan';
  createdAt: string;
  paidAt: string | null;
}

export interface NotificationRecord {
  id: string;
  patronId: string;
  patronName: string;
  type: 'MUON_THANH_CONG' | 'TRA_DUNG_HAN' | 'CANH_BAO_QUA_HAN' | 'PHAT_TIEN' | 'HE_THONG';
  title: string;
  content: string;
  channel: 'InApp' | 'Email' | 'SMS';
  timestamp: string;
  read: boolean;
}

export interface DomainEvent<T = Record<string, unknown>> {
  id: string;
  eventName: string;
  occurredAt: string;
  sourceModule: 'Catalog' | 'Patron' | 'Circulation' | 'Fine' | 'Notification';
  targetSubscribers: string[];
  payload: T;
  latencyMs: number;
  status: 'Success' | 'Warning' | 'Error';
}

export type ArchitectureMode = 'MODULAR_MONOLITH' | 'TRADITIONAL_MONOLITH';

export interface TraceStep {
  stepNumber: number;
  component: string;
  action: string;
  layerOrModule: string;
  detail: string;
  couplingType: 'TightlyCoupled' | 'LooseEvent' | 'ContractCall' | 'DirectDbJoin';
  riskLevel: 'Low' | 'Medium' | 'High';
  durationMs: number;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  description: string;
  traditionalSteps: TraceStep[];
  modularSteps: TraceStep[];
  traditionalOutcome: {
    status: 'Success' | 'Vulnerable' | 'Failure';
    explanation: string;
    blastRadius: string;
    lockContention: string;
  };
  modularOutcome: {
    status: 'Success' | 'Vulnerable' | 'Failure';
    explanation: string;
    blastRadius: string;
    lockContention: string;
  };
}
