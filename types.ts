export interface Book {
  id: string;
  code: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  publishYear: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  description?: string;
  coverUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;

export interface BookFilter {
  search: string;
  category: string;
  stockStatus: 'all' | 'in_stock' | 'out_of_stock';
}

export const BOOK_CATEGORIES = [
  'Công nghệ thông tin',
  'Khoa học máy tính',
  'Kỹ thuật phần mềm',
  'Kinh tế & Quản trị',
  'Khoa học & Tự nhiên',
  'Văn học & Nghệ thuật',
  'Lịch sử & Triết học',
  'Kỹ năng sống & Phát triển',
  'Ngoại ngữ & Từ điển',
  'Tạp chí & Nghiên cứu',
] as const;
