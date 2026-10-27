import React, { useState } from 'react';
import { Book } from '../types';
import { getBookCoverUrl } from '../bookCoverHelper';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  book: Partial<Book> | null | undefined;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  alt?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  className = '',
  size = 'responsive',
  alt,
}) => {
  const [hasError, setHasError] = useState(false);
  const coverUrl = getBookCoverUrl(book);

  // Gradient themes for fallback based on category
  const getCategoryGradient = (cat?: string) => {
    switch (cat) {
      case 'Kỹ thuật phần mềm':
      case 'Công nghệ thông tin':
        return 'from-blue-600 via-indigo-700 to-slate-900';
      case 'Khoa học máy tính':
        return 'from-cyan-600 via-blue-700 to-slate-950';
      case 'Kinh tế & Quản trị':
        return 'from-amber-600 via-orange-700 to-stone-900';
      case 'Lịch sử & Triết học':
        return 'from-stone-600 via-amber-800 to-slate-900';
      case 'Văn học & Nghệ thuật':
        return 'from-rose-600 via-purple-700 to-slate-900';
      case 'Kỹ năng sống & Phát triển':
        return 'from-emerald-600 via-teal-700 to-slate-900';
      default:
        return 'from-indigo-600 via-purple-700 to-slate-900';
    }
  };

  const gradient = getCategoryGradient(book?.category);

  if (hasError || !coverUrl) {
    return (
      <div
        className={`relative flex flex-col justify-between p-2.5 rounded-lg text-white shadow-xs overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
      >
        <div className="flex items-center justify-between opacity-80">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="text-[9px] font-mono font-bold tracking-wider">{book?.code || 'LIB'}</span>
        </div>
        <div className="my-auto py-1 text-center">
          <p className="text-[11px] font-bold leading-tight line-clamp-2 drop-shadow-xs">
            {book?.title || 'Tài liệu Thư viện'}
          </p>
          <p className="text-[9px] text-white/80 line-clamp-1 mt-0.5">{book?.author || ''}</p>
        </div>
        <div className="text-[8px] uppercase tracking-wider text-white/70 font-semibold truncate">
          {book?.category || 'Sách'}
        </div>
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={alt || book?.title || 'Bìa sách'}
      onError={() => setHasError(true)}
      loading="lazy"
      className={`object-cover rounded-lg shadow-xs ${className}`}
    />
  );
};
