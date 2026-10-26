import { Book } from './types';

// Curated high quality illustration book cover presets
export const PRESET_BOOK_COVERS: { label: string; url: string; category: string }[] = [
  {
    label: 'Kiến trúc & Công nghệ',
    category: 'Kỹ thuật phần mềm',
    url: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Hệ thống & Đám mây',
    category: 'Công nghệ thông tin',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Văn học cổ điển & Tiểu thuyết',
    category: 'Văn học & Nghệ thuật',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Kinh tế & Tài chính',
    category: 'Kinh tế & Quản trị',
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Lịch sử & Triết học',
    category: 'Lịch sử & Triết học',
    url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Lập trình & Mã nguồn',
    category: 'Kỹ thuật phần mềm',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Khoa học dữ liệu & AI',
    category: 'Khoa học máy tính',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Tâm lý & Tư duy phát triển',
    category: 'Kỹ năng sống & Phát triển',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Sách bìa da cổ điển',
    category: 'Tài liệu nghiên cứu',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Thư viện & Kho tri thức',
    category: 'Tổng hợp',
    url: 'https://images.unsplash.com/photo-1507842229457-3770e2815777?w=600&auto=format&fit=crop&q=80',
  },
];

/**
 * Returns a reliable high-definition illustration cover URL for any book.
 * If book has a custom coverUrl, use it; otherwise map intelligently by title or category.
 */
export function getBookCoverUrl(book: Partial<Book> | null | undefined): string {
  if (!book) {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
  }

  if (book.coverUrl && book.coverUrl.trim().length > 0) {
    return book.coverUrl.trim();
  }

  const titleLower = (book.title || '').toLowerCase();
  const code = (book.code || '').toUpperCase();

  // Known catalog books mapping
  if (titleLower.includes('clean architecture') || code === 'BK-1001') {
    return 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('microservices') || titleLower.includes('vi dịch vụ') || code === 'BK-1002') {
    return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('giả kim') || titleLower.includes('alchemist') || code === 'BK-1003') {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('kinh tế') || titleLower.includes('freakonomics') || code === 'BK-1004') {
    return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('loài người') || titleLower.includes('sapiens') || code === 'BK-1005') {
    return 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('refactoring') || titleLower.includes('mã nguồn') || code === 'BK-1006') {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('học máy') || titleLower.includes('machine learning') || code === 'BK-1007') {
    return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('tư duy') || titleLower.includes('thinking') || code === 'BK-1008') {
    return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('design patterns') || titleLower.includes('mẫu thiết kế') || code === 'BK-1009') {
    return 'https://images.unsplash.com/photo-1532012164546-f432f2e37b29?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('đắc nhân tâm') || titleLower.includes('dale carnegie') || code === 'BK-1010') {
    return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('cấu trúc dữ liệu') || titleLower.includes('algorithms') || code === 'BK-1011') {
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('khởi nghiệp') || titleLower.includes('lean startup') || code === 'BK-1012') {
    return 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('trí tuệ nhân tạo') || titleLower.includes('modern approach') || code === 'BK-1013') {
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
  }
  if (titleLower.includes('vũ trụ') || titleLower.includes('nutshell') || code === 'BK-1014') {
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80';
  }

  // Category fallback
  switch (book.category) {
    case 'Kỹ thuật phần mềm':
    case 'Công nghệ thông tin':
      return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80';
    case 'Khoa học máy tính':
      return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80';
    case 'Kinh tế & Quản trị':
      return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80';
    case 'Lịch sử & Triết học':
      return 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80';
    case 'Văn học & Nghệ thuật':
      return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
    case 'Kỹ năng sống & Phát triển':
      return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80';
    default:
      return 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80';
  }
}
