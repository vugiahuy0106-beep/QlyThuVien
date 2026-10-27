export interface Reader {
  id: string;
  readerCode: string; // Mã độc giả (e.g. DG-1001)
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'locked';
  registeredAt: string; // YYYY-MM-DD
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ReaderFormData = Omit<Reader, 'id' | 'createdAt' | 'updatedAt'>;

export interface ReaderFilter {
  search: string;
  status: 'all' | 'active' | 'locked';
}
