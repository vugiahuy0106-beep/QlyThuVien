import React, { useState } from 'react';
import { Reader, ReaderFilter } from '../types';
import { Loan } from '../../loans/types';
import { readerService } from '../readerService';
import { useToast } from '../../../core/context/ToastContext';
import { ConfirmDialog } from '../../../core/components/ConfirmDialog';
import { ReaderHistoryModal } from './ReaderHistoryModal';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  History,
  Lock,
  Unlock,
  Users,
  Mail,
  Phone,
  UserCheck,
  UserX,
} from 'lucide-react';

interface ReaderListProps {
  readers: Reader[];
  loans: Loan[];
  onOpenAddModal: () => void;
  onOpenEditModal: (reader: Reader) => void;
  onReturnLoan?: (loan: Loan) => void;
}

export const ReaderList: React.FC<ReaderListProps> = ({
  readers,
  loans,
  onOpenAddModal,
  onOpenEditModal,
  onReturnLoan,
}) => {
  const { success, error } = useToast();

  const [filters, setFilters] = useState<ReaderFilter>({
    search: '',
    status: 'all',
  });

  const [selectedReaderForHistory, setSelectedReaderForHistory] = useState<Reader | null>(null);
  const [readerToDelete, setReaderToDelete] = useState<Reader | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredReaders = readerService.filterReaders(readers, filters);

  const handleToggleLock = async (reader: Reader) => {
    try {
      const nextStatus = await readerService.toggleLockReader(reader.id, reader.status);
      if (nextStatus === 'locked') {
        success('Đã khóa thẻ độc giả', `Thẻ của "${reader.fullName}" đã bị khóa và không thể lập phiếu mượn mới.`);
      } else {
        success('Đã mở khóa thẻ độc giả', `Thẻ của "${reader.fullName}" đã được kích hoạt lại bình thường.`);
      }
    } catch (err: any) {
      error('Không thể cập nhật trạng thái thẻ', err.message);
    }
  };

  const handleDeleteReader = async () => {
    if (!readerToDelete) return;
    setIsDeleting(true);
    try {
      await readerService.deleteReader(readerToDelete.id);
      success('Xóa độc giả thành công', `Đã xóa độc giả "${readerToDelete.fullName}" khỏi hệ thống.`);
      setReaderToDelete(null);
    } catch (err: any) {
      error('Không thể xóa độc giả', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Tìm kiếm theo họ tên, mã độc giả, email hoặc số điện thoại..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden transition-all"
            />
          </div>

          {/* Status filter tabs */}
          <div className="md:col-span-4 flex items-center bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
            {(
              [
                { id: 'all', label: 'Tất cả' },
                { id: 'active', label: 'Hoạt động' },
                { id: 'locked', label: 'Bị khóa' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilters({ ...filters, status: tab.id })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filters.status === tab.id
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Hiển thị <strong>{filteredReaders.length}</strong> / {readers.length} độc giả
          </span>
          {(filters.search || filters.status !== 'all') && (
            <button
              onClick={() => setFilters({ search: '', status: 'all' })}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Readers Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {filteredReaders.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Không tìm thấy độc giả</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Thử tìm kiếm với từ khóa khác hoặc bấm nút thêm mới để cấp thẻ độc giả.
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Cấp thẻ độc giả</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Mã & Họ tên</th>
                  <th className="py-3.5 px-4">Thông tin liên hệ</th>
                  <th className="py-3.5 px-4">Ngày đăng ký</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredReaders.map((reader) => {
                  const isLocked = reader.status === 'locked';
                  // Calculate active loans for this reader
                  const activeLoansCount = loans.filter(
                    (l) => l.readerId === reader.id && l.status !== 'returned'
                  ).length;

                  return (
                    <tr
                      key={reader.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Name & Code */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                              isLocked
                                ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                                : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                            }`}
                          >
                            {reader.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {reader.fullName}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              Mã thẻ: {reader.readerCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact: Email & Phone */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{reader.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{reader.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="py-4 px-4 text-xs text-slate-600 dark:text-slate-400">
                        {reader.registeredAt || 'Chưa cập nhật'}
                        {activeLoansCount > 0 && (
                          <span className="block text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                            Đang mượn: {activeLoansCount} cuốn
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isLocked
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {isLocked ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          <span>{isLocked ? 'Bị khóa' : 'Hoạt động'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View loan history */}
                          <button
                            type="button"
                            onClick={() => setSelectedReaderForHistory(reader)}
                            title="Xem lịch sử mượn trả"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Lock / Unlock toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleLock(reader)}
                            title={isLocked ? 'Mở khóa thẻ' : 'Khóa thẻ độc giả'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isLocked
                                ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                                : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50'
                            }`}
                          >
                            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(reader)}
                            title="Sửa thông tin"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setReaderToDelete(reader)}
                            title="Xóa độc giả"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reader History Modal */}
      <ReaderHistoryModal
        isOpen={!!selectedReaderForHistory}
        onClose={() => setSelectedReaderForHistory(null)}
        reader={selectedReaderForHistory}
        loans={loans}
        onReturnLoan={onReturnLoan}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!readerToDelete}
        onClose={() => setReaderToDelete(null)}
        onConfirm={handleDeleteReader}
        title="Xác nhận xóa hồ sơ độc giả"
        message={`Bạn có chắc chắn muốn xóa hồ sơ độc giả "${readerToDelete?.fullName}" (Mã: ${readerToDelete?.readerCode})? Lưu ý nếu độc giả đang còn sách chưa trả, hãy thu hồi trước khi xóa.`}
        confirmText="Xóa độc giả"
        isLoading={isDeleting}
      />
    </div>
  );
};
