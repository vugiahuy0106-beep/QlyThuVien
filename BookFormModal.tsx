import React, { useState, useEffect } from 'react';
import { Modal } from '../../../core/components/Modal';
import { Book, BookFormData, BOOK_CATEGORIES } from '../types';
import { Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PRESET_BOOK_COVERS, getBookCoverUrl } from '../bookCoverHelper';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => Promise<void>;
  initialData?: Book | null;
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState<BookFormData>({
    code: '',
    isbn: '',
    title: '',
    author: '',
    category: BOOK_CATEGORIES[0],
    publisher: '',
    publishYear: new Date().getFullYear(),
    totalCopies: 5,
    availableCopies: 5,
    shelfLocation: 'Kệ A1-T1',
    description: '',
    coverUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        isbn: initialData.isbn || '',
        title: initialData.title || '',
        author: initialData.author || '',
        category: initialData.category || BOOK_CATEGORIES[0],
        publisher: initialData.publisher || '',
        publishYear: initialData.publishYear || new Date().getFullYear(),
        totalCopies: initialData.totalCopies ?? 1,
        availableCopies: initialData.availableCopies ?? 1,
        shelfLocation: initialData.shelfLocation || '',
        description: initialData.description || '',
        coverUrl: initialData.coverUrl || '',
      });
    } else {
      // Reset form
      const randomCode = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        code: randomCode,
        isbn: '978-604-',
        title: '',
        author: '',
        category: BOOK_CATEGORIES[0],
        publisher: '',
        publishYear: new Date().getFullYear(),
        totalCopies: 5,
        availableCopies: 5,
        shelfLocation: 'Kệ A1-T1',
        description: '',
        coverUrl: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = 'Mã sách không được để trống';
    if (!formData.title.trim()) newErrors.title = 'Tên sách không được để trống';
    if (!formData.author.trim()) newErrors.author = 'Tên tác giả không được để trống';
    if (!formData.category.trim()) newErrors.category = 'Thể loại không được để trống';
    if (formData.totalCopies < 1) newErrors.totalCopies = 'Tổng số bản phải tối thiểu là 1';
    if (formData.availableCopies < 0) newErrors.availableCopies = 'Số bản còn lại không thể âm';
    if (formData.availableCopies > formData.totalCopies) {
      newErrors.availableCopies = 'Số bản còn lại không thể lớn hơn tổng số bản';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Cập nhật Thông tin Sách' : 'Thêm Sách Mới vào Thư viện'}
      description="Điền đầy đủ thông tin ấn phẩm để quản lý vị trí kệ và tồn kho chính xác"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code & ISBN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mã sách <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="VD: BK-1001"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
            {errors.code && <p className="text-xs text-rose-500 mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mã ISBN</label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              placeholder="VD: 978-604-2-08532-1"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tên sách <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="VD: Clean Architecture: Cấu trúc và Thiết kế Phần mềm"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Author & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tác giả <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="VD: Robert C. Martin"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
            {errors.author && <p className="text-xs text-rose-500 mt-1">{errors.author}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Thể loại <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            >
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Publisher, Publish Year, Shelf Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nhà xuất bản</label>
            <input
              type="text"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              placeholder="VD: NXB Thông tin & TT"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Năm xuất bản</label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={formData.publishYear}
              onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) || 2026 })}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vị trí kệ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.shelfLocation}
              onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
              placeholder="VD: Kệ A1-T2"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
          </div>
        </div>

        {/* Copies: Total & Available */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tổng số lượng bản sách <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.totalCopies}
              onChange={(e) => {
                const total = parseInt(e.target.value) || 0;
                setFormData((prev) => ({
                  ...prev,
                  totalCopies: total,
                  // If creating new book, sync available copies
                  availableCopies: isEditing ? prev.availableCopies : total,
                }));
              }}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
            {errors.totalCopies && <p className="text-xs text-rose-500 mt-1">{errors.totalCopies}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Số bản còn lại (Khả dụng) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.availableCopies}
              onChange={(e) => setFormData({ ...formData, availableCopies: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
            />
            {errors.availableCopies && <p className="text-xs text-rose-500 mt-1">{errors.availableCopies}</p>}
          </div>
        </div>

        {/* Cover Illustration Image URL with Live Preview & Presets */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Hình ảnh minh họa / Ảnh bìa sách (URL)
            </label>
            <span className="text-[11px] text-slate-400">Tùy chọn</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-14 h-20 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shrink-0 shadow-xs">
              <img
                src={getBookCoverUrl({ title: formData.title, category: formData.category, coverUrl: formData.coverUrl })}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="url"
                value={formData.coverUrl || ''}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                placeholder="Dán link ảnh bìa (https://images.unsplash.com/...)"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden font-mono"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Mẫu có sẵn:
                </span>
                {PRESET_BOOK_COVERS.slice(0, 4).map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, coverUrl: preset.url })}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/80 hover:bg-indigo-100 dark:bg-slate-700 dark:hover:bg-indigo-950/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tóm tắt mô tả</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nội dung chính hoặc ghi chú chuyên ngành..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Lưu thay đổi' : 'Thêm sách'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
