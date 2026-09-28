import React, { useState, useEffect, useRef } from 'react';
import {
  INITIAL_BOOKS,
  INITIAL_PATRONS,
  INITIAL_LOANS,
  INITIAL_FINES,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { Book, Patron, LoanRecord, FineRecord, NotificationRecord } from '../types';
import { eventBus } from '../core/eventBus';
import {
  BookOpen,
  Users,
  Repeat,
  DollarSign,
  Bell,
  Search,
  Plus,
  CheckCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Edit3,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  Image as ImageIcon,
  Upload,
  Bookmark,
  Check,
  Filter,
  FileText,
  RotateCcw,
  Clock,
  Sparkles,
  Shield,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  CreditCard,
  Zap,
} from 'lucide-react';

const COVER_PRESETS = [
  {
    id: 'clean-arch',
    label: 'Clean Architecture (Blueprint)',
    url: '/src/assets/images/book_clean_architecture_1790583556639.jpg',
  },
  {
    id: 'ddd',
    label: 'Domain-Driven Design (Modular)',
    url: '/src/assets/images/book_domain_driven_design_1790583569219.jpg',
  },
  {
    id: 'dist-sys',
    label: 'Distributed Systems (Network Graph)',
    url: '/src/assets/images/book_distributed_systems_1790583582430.jpg',
  },
  {
    id: 'data-intensive',
    label: 'Data-Intensive (Database Rings)',
    url: '/src/assets/images/book_data_intensive_1790583593420.jpg',
  },
];

export const LibraryAppDemo: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'catalog' | 'patron' | 'circulation' | 'fine' | 'notification'>('catalog');

  // Module State (representing local module database state)
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [patrons, setPatrons] = useState<Patron[]>(INITIAL_PATRONS);
  const [loans, setLoans] = useState<LoanRecord[]>(INITIAL_LOANS);
  const [fines, setFines] = useState<FineRecord[]>(INITIAL_FINES);
  const [notifications, setNotifications] = useState<NotificationRecord[]>(INITIAL_NOTIFICATIONS);

  // Catalog View & Filter State
  const [catalogViewMode, setCatalogViewMode] = useState<'grid' | 'table'>('grid');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('ALL');
  const [catalogAvailabilityFilter, setCatalogAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'OUT_OF_STOCK'>('ALL');

  // Patron View & Filter State
  const [patronViewMode, setPatronViewMode] = useState<'grid' | 'table'>('table');
  const [patronSearch, setPatronSearch] = useState('');
  const [patronRoleFilter, setPatronRoleFilter] = useState<string>('ALL');
  const [patronStatusFilter, setPatronStatusFilter] = useState<'ALL' | 'HoatDong' | 'KhoaThe'>('ALL');

  // Patron Modals State
  const [showAddPatronModal, setShowAddPatronModal] = useState(false);
  const [editingPatron, setEditingPatron] = useState<Patron | null>(null);
  const [viewingPatronDetails, setViewingPatronDetails] = useState<Patron | null>(null);
  const [patronToDelete, setPatronToDelete] = useState<Patron | null>(null);
  const [patronDeleteWarning, setPatronDeleteWarning] = useState<string | null>(null);

  // Patron Form State
  const [formPatronStudentId, setFormPatronStudentId] = useState('');
  const [formPatronFullName, setFormPatronFullName] = useState('');
  const [formPatronRole, setFormPatronRole] = useState<Patron['role']>('SinhVien');
  const [formPatronEmail, setFormPatronEmail] = useState('');
  const [formPatronPhone, setFormPatronPhone] = useState('');
  const [formPatronBorrowLimit, setFormPatronBorrowLimit] = useState<number>(5);
  const [formPatronDepartment, setFormPatronDepartment] = useState('Khoa Công nghệ Phần mềm');
  const [formPatronStatus, setFormPatronStatus] = useState<Patron['status']>('HoatDong');

  // Modals State (Catalog & Loans)
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewingBookDetails, setViewingBookDetails] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  // Circulation / Loans Filter & Modal State
  const [loanSearch, setLoanSearch] = useState('');
  const [loanStatusFilter, setLoanStatusFilter] = useState<'ALL' | 'ACTIVE' | 'OVERDUE' | 'RETURNED'>('ALL');
  const [loanSubView, setLoanSubView] = useState<'all_loans' | 'active_borrowed'>('all_loans');
  const [loanViewMode, setLoanViewMode] = useState<'table' | 'grid'>('table');
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [newLoanPatronId, setNewLoanPatronId] = useState(patrons[0]?.id || '');
  const [newLoanBookId, setNewLoanBookId] = useState(books[0]?.id || '');
  const [loanErrorMessage, setLoanErrorMessage] = useState<string | null>(null);
  const [formLoanBorrowDays, setFormLoanBorrowDays] = useState<number>(14);
  const [formLoanNotes, setFormLoanNotes] = useState<string>('');

  const [editingLoan, setEditingLoan] = useState<LoanRecord | null>(null);
  const [viewingLoanDetails, setViewingLoanDetails] = useState<LoanRecord | null>(null);
  const [loanToDelete, setLoanToDelete] = useState<LoanRecord | null>(null);
  const [formEditLoanDueDate, setFormEditLoanDueDate] = useState<string>('');
  const [formEditLoanStatus, setFormEditLoanStatus] = useState<LoanRecord['status']>('DangMuon');
  const [formEditLoanNotes, setFormEditLoanNotes] = useState<string>('');

  // Add / Edit Book Form State
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formIsbn, setFormIsbn] = useState('');
  const [formCategory, setFormCategory] = useState<Book['category']>('KienTrucPhanMem');
  const [formCopies, setFormCopies] = useState<number>(5);
  const [formPublisher, setFormPublisher] = useState('NXB Khoa Học Kỹ Thuật');
  const [formPublishedYear, setFormPublishedYear] = useState<number>(2024);
  const [formShelf, setFormShelf] = useState('Khu A - Kệ 04 - Tầng 2');
  const [formCoverImage, setFormCoverImage] = useState<string>(COVER_PRESETS[0].url);
  const [formDescription, setFormDescription] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Register Event Subscribers for Modular Monolith In-Process Bus
  useEffect(() => {
    // 1. FineModule subscribes to BookReturnedOverdueEvent
    const unsubFine = eventBus.subscribe<{
      loanId: string;
      patronId: string;
      patronName: string;
      bookTitle: string;
      overdueDays: number;
      fineAmount: number;
    }>('BookReturnedOverdueEvent', 'FineModule', (event) => {
      const { loanId, patronId, patronName, bookTitle, overdueDays, fineAmount } = event.payload;
      const newFine: FineRecord = {
        id: `fine-${Date.now().toString(36)}`,
        loanId,
        patronId,
        patronName,
        bookTitle,
        overdueDays,
        amount: fineAmount,
        status: 'ChuaThanhToan',
        createdAt: new Date().toISOString(),
        paidAt: null,
      };
      setFines((prev) => [newFine, ...prev]);

      // Update patron debt
      setPatrons((prev) =>
        prev.map((p) =>
          p.id === patronId ? { ...p, debtFineAmount: p.debtFineAmount + fineAmount } : p
        )
      );
    });

    // 2. NotificationModule subscribes to LoanCreatedDomainEvent
    const unsubNotifLoan = eventBus.subscribe<{
      loanId: string;
      patronId: string;
      patronName: string;
      bookTitle: string;
      dueDate: string;
    }>('LoanCreatedDomainEvent', 'NotificationModule', (event) => {
      const { patronId, patronName, bookTitle, dueDate } = event.payload;
      const newNotif: NotificationRecord = {
        id: `notif-${Date.now().toString(36)}`,
        patronId,
        patronName,
        type: 'MUON_THANH_CONG',
        title: 'Mượn tài liệu thành công',
        content: `Đã xuất mượn cuốn "${bookTitle}". Hạn hoàn trả: ${dueDate}.`,
        channel: 'InApp',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      unsubFine();
      unsubNotifLoan();
    };
  }, []);

  // Open Add Book Modal
  const handleOpenAddModal = () => {
    setFormTitle('');
    setFormAuthor('');
    setFormIsbn(`978-604-${Math.floor(100000 + Math.random() * 900000)}`);
    setFormCategory('KienTrucPhanMem');
    setFormCopies(5);
    setFormPublisher('NXB Đại Học Quốc Gia');
    setFormPublishedYear(2026);
    setFormShelf('Khu A - Kệ 04 - Tầng 2');
    setFormCoverImage(COVER_PRESETS[0].url);
    setFormDescription('');
    setShowAddBookModal(true);
  };

  // Open Edit Book Modal
  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormIsbn(book.isbn);
    setFormCategory(book.category);
    setFormCopies(book.totalCopies);
    setFormPublisher(book.publisher);
    setFormPublishedYear(book.publishedYear);
    setFormShelf(book.locationShelf);
    setFormCoverImage(book.coverImage || COVER_PRESETS[0].url);
    setFormDescription(book.description || '');
  };

  // Handle Image File Upload (FileReader)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Book Action (Catalog Module)
  const handleSaveNewBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formAuthor.trim()) return;

    const categoryLabelMap: Record<Book['category'], string> = {
      KienTrucPhanMem: 'Kiến Trúc Phần Mềm',
      HeThongPhanTan: 'Hệ Thống Phân Tán',
      CoSoDuLieu: 'Cơ Sở Dữ Liệu & Lưu Trữ',
      AI_MachineLearning: 'Trí Tuệ Nhân Tạo & AI',
      LapTrinhHeThong: 'Lập Trình & Thuật Toán',
      AnToanThongTin: 'An Toàn Thông Tin',
    };

    const newBook: Book = {
      id: `book-${Date.now().toString(36)}`,
      isbn: formIsbn.trim() || `978-604-${Math.floor(100000 + Math.random() * 900000)}`,
      title: formTitle.trim(),
      author: formAuthor.trim(),
      category: formCategory,
      categoryLabel: categoryLabelMap[formCategory],
      totalCopies: Number(formCopies),
      availableCopies: Number(formCopies),
      publishedYear: Number(formPublishedYear),
      publisher: formPublisher.trim(),
      locationShelf: formShelf.trim(),
      coverImage: formCoverImage,
      description: formDescription.trim(),
    };

    setBooks([newBook, ...books]);
    setShowAddBookModal(false);

    // Dispatch In-Process Domain Event via Event Bus
    eventBus.publish('BookAddedToCatalogEvent', 'Catalog', {
      bookId: newBook.id,
      title: newBook.title,
      author: newBook.author,
      totalCopies: newBook.totalCopies,
    });
  };

  // Update Book Action (Catalog Module)
  const handleSaveEditBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !formTitle.trim() || !formAuthor.trim()) return;

    const categoryLabelMap: Record<Book['category'], string> = {
      KienTrucPhanMem: 'Kiến Trúc Phần Mềm',
      HeThongPhanTan: 'Hệ Thống Phân Tán',
      CoSoDuLieu: 'Cơ Sở Dữ Liệu & Lưu Trữ',
      AI_MachineLearning: 'Trí Tuệ Nhân Tạo & AI',
      LapTrinhHeThong: 'Lập Trình & Thuật Toán',
      AnToanThongTin: 'An Toàn Thông Tin',
    };

    // Calculate copy adjustment
    const copyDelta = Number(formCopies) - editingBook.totalCopies;
    const newAvailable = Math.max(0, editingBook.availableCopies + copyDelta);

    const updatedBook: Book = {
      ...editingBook,
      title: formTitle.trim(),
      author: formAuthor.trim(),
      isbn: formIsbn.trim(),
      category: formCategory,
      categoryLabel: categoryLabelMap[formCategory],
      totalCopies: Number(formCopies),
      availableCopies: newAvailable,
      publishedYear: Number(formPublishedYear),
      publisher: formPublisher.trim(),
      locationShelf: formShelf.trim(),
      coverImage: formCoverImage,
      description: formDescription.trim(),
    };

    setBooks((prev) => prev.map((b) => (b.id === editingBook.id ? updatedBook : b)));

    // Also update title in active loans if present
    setLoans((prev) =>
      prev.map((l) => (l.bookId === editingBook.id ? { ...l, bookTitle: updatedBook.title } : l))
    );

    setEditingBook(null);

    // Dispatch In-Process Domain Event
    eventBus.publish('BookUpdatedDomainEvent', 'Catalog', {
      bookId: updatedBook.id,
      updatedFields: ['title', 'author', 'coverImage', 'totalCopies'],
      title: updatedBook.title,
    });
  };

  // Delete Book Check & Action
  const handleRequestDeleteBook = (book: Book) => {
    const activeLoan = loans.find((l) => l.bookId === book.id && l.status !== 'DaTra');
    if (activeLoan) {
      setDeleteWarning(
        `[Ràng buộc Bounded Context]: Không thể xóa đầu sách "${book.title}" vì độc giả ${activeLoan.patronName} đang mượn cuốn sách này (Phiếu ${activeLoan.id}). Vui lòng thu hồi sách trước khi xóa khỏi danh mục!`
      );
    } else {
      setDeleteWarning(null);
    }
    setBookToDelete(book);
  };

  const handleConfirmDeleteBook = () => {
    if (!bookToDelete) return;

    // Check again to enforce modular invariant
    const activeLoan = loans.find((l) => l.bookId === bookToDelete.id && l.status !== 'DaTra');
    if (activeLoan) return;

    setBooks((prev) => prev.filter((b) => b.id !== bookToDelete.id));

    // Dispatch Domain Event
    eventBus.publish('BookRemovedFromCatalogEvent', 'Catalog', {
      bookId: bookToDelete.id,
      title: bookToDelete.title,
      isbn: bookToDelete.isbn,
    });

    setBookToDelete(null);
    setDeleteWarning(null);
  };

  // Open Add Patron Modal
  const handleOpenAddPatronModal = () => {
    const suffix = String(Math.floor(86 + Math.random() * 900)).padStart(3, '0').slice(-3);
    const newStudentId = `2374820${suffix}`;
    setFormPatronStudentId(newStudentId);
    setFormPatronFullName('');
    setFormPatronRole('SinhVien');
    setFormPatronEmail(`${newStudentId}@hpn.edu.vn`);
    setFormPatronPhone(`09${Math.floor(10000000 + Math.random() * 90000000)}`);
    setFormPatronBorrowLimit(5);
    setFormPatronDepartment('Khoa Công nghệ Phần mềm');
    setFormPatronStatus('HoatDong');
    setShowAddPatronModal(true);
  };

  // Add Patron Action (Patron Module)
  const handleSaveNewPatron = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatronFullName.trim() || !formPatronStudentId.trim()) return;

    const colors = ['bg-sky-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600', 'bg-indigo-600', 'bg-rose-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newPatron: Patron = {
      id: `patron-${Date.now().toString(36)}`,
      studentId: formPatronStudentId.trim(),
      fullName: formPatronFullName.trim(),
      role: formPatronRole,
      email: formPatronEmail.trim(),
      phone: formPatronPhone.trim(),
      borrowLimit: Number(formPatronBorrowLimit),
      currentBorrowCount: 0,
      status: formPatronStatus,
      debtFineAmount: 0,
      department: formPatronDepartment.trim(),
      joinedDate: new Date().toISOString().split('T')[0],
      avatarColor: randomColor,
    };

    setPatrons([newPatron, ...patrons]);
    setShowAddPatronModal(false);

    // Dispatch In-Process Domain Event via Event Bus
    eventBus.publish('PatronRegisteredEvent', 'Patron', {
      patronId: newPatron.id,
      studentId: newPatron.studentId,
      fullName: newPatron.fullName,
      role: newPatron.role,
      borrowLimit: newPatron.borrowLimit,
    });
  };

  // Open Edit Patron Modal
  const handleOpenEditPatronModal = (patron: Patron) => {
    setEditingPatron(patron);
    setFormPatronStudentId(patron.studentId);
    setFormPatronFullName(patron.fullName);
    setFormPatronRole(patron.role);
    setFormPatronEmail(patron.email);
    setFormPatronPhone(patron.phone);
    setFormPatronBorrowLimit(patron.borrowLimit);
    setFormPatronDepartment(patron.department || 'Khoa Công nghệ Phần mềm');
    setFormPatronStatus(patron.status);
  };

  // Save Edit Patron
  const handleSaveEditPatron = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatron || !formPatronFullName.trim()) return;

    const updatedPatron: Patron = {
      ...editingPatron,
      studentId: formPatronStudentId.trim(),
      fullName: formPatronFullName.trim(),
      role: formPatronRole,
      email: formPatronEmail.trim(),
      phone: formPatronPhone.trim(),
      borrowLimit: Number(formPatronBorrowLimit),
      department: formPatronDepartment.trim(),
      status: formPatronStatus,
    };

    setPatrons((prev) => prev.map((p) => (p.id === editingPatron.id ? updatedPatron : p)));

    // Update name on active loans and fines
    setLoans((prev) =>
      prev.map((l) => (l.patronId === editingPatron.id ? { ...l, patronName: updatedPatron.fullName } : l))
    );
    setFines((prev) =>
      prev.map((f) => (f.patronId === editingPatron.id ? { ...f, patronName: updatedPatron.fullName } : f))
    );

    setEditingPatron(null);

    // Dispatch Domain Event
    eventBus.publish('PatronProfileUpdatedEvent', 'Patron', {
      patronId: updatedPatron.id,
      fullName: updatedPatron.fullName,
      status: updatedPatron.status,
    });
  };

  // Request Delete Patron with Invariant Check
  const handleRequestDeletePatron = (patron: Patron) => {
    const unreturnedLoans = loans.filter((l) => l.patronId === patron.id && l.status !== 'DaTra');
    if (unreturnedLoans.length > 0) {
      setPatronDeleteWarning(
        `[Ràng buộc Bounded Context]: Không thể xóa độc giả "${patron.fullName}" (${patron.studentId}) vì đang giữ ${unreturnedLoans.length} cuốn sách chưa hoàn trả: ${unreturnedLoans.map((l) => `"${l.bookTitle}"`).join(', ')}. Vui lòng thu hồi toàn bộ tài liệu trước khi xóa hồ sơ!`
      );
    } else if (patron.debtFineAmount > 0) {
      setPatronDeleteWarning(
        `[Cảnh báo Công nợ]: Độc giả "${patron.fullName}" hiện còn nợ tiền phạt ${patron.debtFineAmount.toLocaleString('vi-VN')} đ chưa thanh toán. Bạn có chắc chắn muốn xóa không?`
      );
    } else {
      setPatronDeleteWarning(null);
    }
    setPatronToDelete(patron);
  };

  // Confirm Delete Patron
  const handleConfirmDeletePatron = () => {
    if (!patronToDelete) return;
    const hasUnreturned = loans.some((l) => l.patronId === patronToDelete.id && l.status !== 'DaTra');
    if (hasUnreturned) return;

    setPatrons((prev) => prev.filter((p) => p.id !== patronToDelete.id));

    // Dispatch Domain Event
    eventBus.publish('PatronDeletedDomainEvent', 'Patron', {
      patronId: patronToDelete.id,
      studentId: patronToDelete.studentId,
      fullName: patronToDelete.fullName,
    });

    setPatronToDelete(null);
    setPatronDeleteWarning(null);
  };

  // Toggle Patron Card Status (Patron Bounded Context)
  const handleTogglePatronStatus = (patronId: string) => {
    setPatrons((prev) =>
      prev.map((p) => {
        if (p.id === patronId) {
          const nextStatus = p.status === 'HoatDong' ? 'KhoaThe' : 'HoatDong';
          // Dispatch In-Process Domain Event
          eventBus.publish('PatronStatusChangedEvent', 'Patron', {
            patronId: p.id,
            previousStatus: p.status,
            newStatus: nextStatus,
          });
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Open Create Loan Modal
  const handleOpenNewLoanModal = (patronId?: string, bookId?: string) => {
    if (patronId) setNewLoanPatronId(patronId);
    else if (patrons.length > 0) setNewLoanPatronId(patrons[0].id);

    if (bookId) setNewLoanBookId(bookId);
    else {
      const availBook = books.find((b) => b.availableCopies > 0) || books[0];
      if (availBook) setNewLoanBookId(availBook.id);
    }
    setFormLoanBorrowDays(14);
    setFormLoanNotes('');
    setLoanErrorMessage(null);
    setShowNewLoanModal(true);
  };

  // Perform Borrow Book (Circulation Bounded Context using Public Contracts)
  const handleExecuteBorrow = () => {
    setLoanErrorMessage(null);
    const patron = patrons.find((p) => p.id === newLoanPatronId);
    const book = books.find((b) => b.id === newLoanBookId);

    if (!patron || !book) {
      setLoanErrorMessage('Vui lòng chọn hợp lệ Độc giả và Sách.');
      return;
    }

    // Step 1: Query IPatronModule.canBorrow(patronId)
    if (patron.status === 'KhoaThe') {
      setLoanErrorMessage(`[Từ chối bởi PatronModule]: Thẻ độc giả ${patron.fullName} đang bị tạm khóa.`);
      return;
    }
    if (patron.debtFineAmount > 50000) {
      setLoanErrorMessage(
        `[Từ chối bởi PatronModule]: Độc giả có nợ phạt quá hạn (${patron.debtFineAmount.toLocaleString('vi-VN')} đ) vượt mức cho phép.`
      );
      return;
    }
    if (patron.currentBorrowCount >= patron.borrowLimit) {
      setLoanErrorMessage(
        `[Từ chối bởi PatronModule]: Độc giả đã đạt tối đa hạn mức mượn (${patron.borrowLimit} cuốn).`
      );
      return;
    }

    // Step 2: Query ICatalogModule.reserveCopy(bookId)
    if (book.availableCopies <= 0) {
      setLoanErrorMessage(`[Từ chối bởi CatalogModule]: Đầu sách "${book.title}" đã hết bản sao có sẵn.`);
      return;
    }

    // Step 3: Create LoanRecord inside Circulation Module Context
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + (Number(formLoanBorrowDays) || 14));

    const newLoan: LoanRecord = {
      id: `loan-${Date.now().toString(36)}`,
      patronId: patron.id,
      patronName: patron.fullName,
      patronStudentId: patron.studentId,
      bookId: book.id,
      bookTitle: book.title,
      borrowDate: now.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      status: 'DangMuon',
      overdueDays: 0,
      fineAmount: 0,
      notes: formLoanNotes.trim() || undefined,
      renewalCount: 0,
    };

    // Update Circulation local store
    setLoans([newLoan, ...loans]);

    // Update Catalog local store
    setBooks((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    );

    // Update Patron local store
    setPatrons((prev) =>
      prev.map((p) => (p.id === patron.id ? { ...p, currentBorrowCount: p.currentBorrowCount + 1 } : p))
    );

    setShowNewLoanModal(false);

    // Step 4: Dispatch In-Process Domain Event via Event Bus
    eventBus.publish('LoanCreatedDomainEvent', 'Circulation', {
      loanId: newLoan.id,
      patronId: patron.id,
      patronName: patron.fullName,
      patronStudentId: patron.studentId,
      bookId: book.id,
      bookTitle: book.title,
      dueDate: newLoan.dueDate,
    });
  };

  // Open Edit Loan Modal
  const handleOpenEditLoanModal = (loan: LoanRecord) => {
    setEditingLoan(loan);
    setFormEditLoanDueDate(loan.dueDate);
    setFormEditLoanStatus(loan.status);
    setFormEditLoanNotes(loan.notes || '');
  };

  // Save Edit Loan
  const handleSaveEditLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoan) return;

    const oldStatus = editingLoan.status;
    const newStatus = formEditLoanStatus;

    // Handle status transitions to maintain cross-module consistency
    if ((oldStatus === 'DangMuon' || oldStatus === 'QuaHan') && newStatus === 'DaTra') {
      // Mark as returned: restore copy to catalog, decrement patron borrow count
      setBooks((prev) =>
        prev.map((b) => (b.id === editingLoan.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
      );
      setPatrons((prev) =>
        prev.map((p) =>
          p.id === editingLoan.patronId
            ? { ...p, currentBorrowCount: Math.max(0, p.currentBorrowCount - 1) }
            : p
        )
      );
    } else if (oldStatus === 'DaTra' && (newStatus === 'DangMuon' || newStatus === 'QuaHan')) {
      // Re-activating returned loan: decrement copy, increment patron
      setBooks((prev) =>
        prev.map((b) => (b.id === editingLoan.bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b))
      );
      setPatrons((prev) =>
        prev.map((p) => (p.id === editingLoan.patronId ? { ...p, currentBorrowCount: p.currentBorrowCount + 1 } : p))
      );
    }

    const updatedLoan: LoanRecord = {
      ...editingLoan,
      dueDate: formEditLoanDueDate,
      status: newStatus,
      returnDate: newStatus === 'DaTra' ? editingLoan.returnDate || new Date().toISOString().split('T')[0] : null,
      notes: formEditLoanNotes.trim() || undefined,
    };

    setLoans((prev) => prev.map((l) => (l.id === editingLoan.id ? updatedLoan : l)));
    setEditingLoan(null);

    // Dispatch Domain Event
    eventBus.publish('LoanUpdatedDomainEvent', 'Circulation', {
      loanId: updatedLoan.id,
      patronId: updatedLoan.patronId,
      bookId: updatedLoan.bookId,
      dueDate: updatedLoan.dueDate,
      status: updatedLoan.status,
    });
  };

  // Quick Renew Loan
  const handleRenewLoan = (loanId: string, daysToAdd = 7) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || loan.status === 'DaTra') return;

    const currentDue = new Date(loan.dueDate);
    currentDue.setDate(currentDue.getDate() + daysToAdd);
    const newDueDate = currentDue.toISOString().split('T')[0];

    const todayStr = new Date().toISOString().split('T')[0];
    const isNowActive = newDueDate >= todayStr;

    const updatedLoan: LoanRecord = {
      ...loan,
      dueDate: newDueDate,
      status: isNowActive ? 'DangMuon' : loan.status,
      overdueDays: isNowActive ? 0 : loan.overdueDays,
      renewalCount: (loan.renewalCount || 0) + 1,
    };

    setLoans((prev) => prev.map((l) => (l.id === loanId ? updatedLoan : l)));

    eventBus.publish('LoanRenewedDomainEvent', 'Circulation', {
      loanId: loan.id,
      patronId: loan.patronId,
      patronName: loan.patronName,
      bookTitle: loan.bookTitle,
      newDueDate,
      renewedCount: updatedLoan.renewalCount,
    });
  };

  // Request Delete Loan
  const handleRequestDeleteLoan = (loan: LoanRecord) => {
    setLoanToDelete(loan);
  };

  // Confirm Delete Loan
  const handleConfirmDeleteLoan = () => {
    if (!loanToDelete) return;

    // If loan is unreturned, restore inventory copy and decrement patron count
    if (loanToDelete.status !== 'DaTra') {
      setBooks((prev) =>
        prev.map((b) => (b.id === loanToDelete.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
      );
      setPatrons((prev) =>
        prev.map((p) =>
          p.id === loanToDelete.patronId
            ? { ...p, currentBorrowCount: Math.max(0, p.currentBorrowCount - 1) }
            : p
        )
      );
    }

    setLoans((prev) => prev.filter((l) => l.id !== loanToDelete.id));

    // Dispatch Domain Event
    eventBus.publish('LoanCancelledDomainEvent', 'Circulation', {
      loanId: loanToDelete.id,
      patronId: loanToDelete.patronId,
      bookId: loanToDelete.bookId,
      bookTitle: loanToDelete.bookTitle,
    });

    setLoanToDelete(null);
  };

  // Calculate loan days remaining / overdue status helper
  const getLoanDaysStatus = (loan: LoanRecord) => {
    if (loan.status === 'DaTra') {
      return {
        label: `Đã trả (${loan.returnDate || 'Hoàn tất'})`,
        badgeClass: 'text-slate-500 bg-slate-100 border border-slate-200',
        isOverdue: false,
        days: 0,
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(loan.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 || loan.status === 'QuaHan') {
      const overdue = Math.max(Math.abs(diffDays), loan.overdueDays || 1);
      return {
        label: `Quá hạn ${overdue} ngày`,
        badgeClass: 'text-rose-700 bg-rose-50 border border-rose-200 font-semibold',
        isOverdue: true,
        days: overdue,
      };
    } else if (diffDays === 0) {
      return {
        label: 'Hạn trả hôm nay',
        badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200 font-semibold',
        isOverdue: false,
        days: 0,
      };
    } else {
      return {
        label: `Còn ${diffDays} ngày`,
        badgeClass: 'text-sky-700 bg-sky-50 border border-sky-200 font-medium',
        isOverdue: false,
        days: diffDays,
      };
    }
  };

  // Perform Return Book (Circulation Bounded Context)
  const handleReturnBook = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || loan.status === 'DaTra') return;

    const returnDate = new Date().toISOString().split('T')[0];
    const isOverdue = loan.status === 'QuaHan' || loan.overdueDays > 0;
    const overdueDays = loan.overdueDays > 0 ? loan.overdueDays : 0;
    const fineAmount = overdueDays * 5000; // 5000 VND / day late

    // Update loan record in Circulation
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              returnDate,
              status: 'DaTra',
              fineAmount,
            }
          : l
      )
    );

    // Release copy in Catalog
    setBooks((prev) =>
      prev.map((b) => (b.id === loan.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );

    // Decrement borrow count in Patron
    setPatrons((prev) =>
      prev.map((p) =>
        p.id === loan.patronId
          ? { ...p, currentBorrowCount: Math.max(0, p.currentBorrowCount - 1) }
          : p
      )
    );

    if (isOverdue && overdueDays > 0) {
      // Dispatch Domain Event for Overdue Return -> Handled by FineModule and NotificationModule
      eventBus.publish('BookReturnedOverdueEvent', 'Circulation', {
        loanId: loan.id,
        patronId: loan.patronId,
        patronName: loan.patronName,
        bookTitle: loan.bookTitle,
        overdueDays,
        fineAmount,
      });
    } else {
      // Regular return event
      eventBus.publish('BookReturnedEvent', 'Circulation', {
        loanId: loan.id,
        patronId: loan.patronId,
        bookId: loan.bookId,
      });
    }
  };

  // Pay Fine (Fine Bounded Context)
  const handlePayFine = (fineId: string) => {
    const fine = fines.find((f) => f.id === fineId);
    if (!fine || fine.status === 'DaThanhToan') return;

    setFines((prev) =>
      prev.map((f) =>
        f.id === fineId
          ? { ...f, status: 'DaThanhToan', paidAt: new Date().toISOString() }
          : f
      )
    );

    // Reduce debt in Patron
    setPatrons((prev) =>
      prev.map((p) =>
        p.id === fine.patronId
          ? { ...p, debtFineAmount: Math.max(0, p.debtFineAmount - fine.amount) }
          : p
      )
    );

    // Publish event
    eventBus.publish('FinePaidDomainEvent', 'Fine', {
      fineId,
      patronId: fine.patronId,
      amount: fine.amount,
    });
  };

  // Filter Catalog Books
  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      b.categoryLabel.toLowerCase().includes(catalogSearch.toLowerCase());

    const matchCategory =
      catalogCategoryFilter === 'ALL' || b.category === catalogCategoryFilter;

    const matchAvailability =
      catalogAvailabilityFilter === 'ALL'
        ? true
        : catalogAvailabilityFilter === 'AVAILABLE'
        ? b.availableCopies > 0
        : b.availableCopies === 0;

    return matchSearch && matchCategory && matchAvailability;
  });

  const filteredPatrons = patrons.filter((p) => {
    const matchSearch =
      p.fullName.toLowerCase().includes(patronSearch.toLowerCase()) ||
      p.studentId.toLowerCase().includes(patronSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(patronSearch.toLowerCase()) ||
      (p.department && p.department.toLowerCase().includes(patronSearch.toLowerCase()));

    const matchRole = patronRoleFilter === 'ALL' || p.role === patronRoleFilter;

    const matchStatus = patronStatusFilter === 'ALL' || p.status === patronStatusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  const filteredLoans = loans.filter((loan) => {
    const query = loanSearch.toLowerCase().trim();
    const matchSearch =
      !query ||
      loan.id.toLowerCase().includes(query) ||
      loan.patronName.toLowerCase().includes(query) ||
      (loan.patronStudentId && loan.patronStudentId.toLowerCase().includes(query)) ||
      loan.bookTitle.toLowerCase().includes(query) ||
      (loan.notes && loan.notes.toLowerCase().includes(query));

    const matchStatus =
      loanStatusFilter === 'ALL'
        ? true
        : loanStatusFilter === 'ACTIVE'
        ? loan.status === 'DangMuon'
        : loanStatusFilter === 'OVERDUE'
        ? loan.status === 'QuaHan'
        : loan.status === 'DaTra';

    return matchSearch && matchStatus;
  });

  const activeBorrowedLoans = loans.filter((l) => l.status !== 'DaTra');

  return (
    <div className="space-y-6">
      {/* Grand Campus Library Showcase Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 text-white">
        {/* Background Image with Rich Dark Gradient */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/modern_library_hall_1790585083919.jpg"
            alt="Đại học HPN - Trung tâm Thư viện Hiện đại"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
        </div>

        {/* Banner Content */}
        <div className="relative p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Trung Tâm Học Liệu & Thư Viện Đại Học Số Hóa</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">Cổng Dịch Vụ @hpn.edu.vn</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Hệ Thống Thư Viện Kiến Trúc <span className="text-sky-400">Modular Monolith</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Tổ chức 5 phân hệ độc lập chuẩn Bounded Context: Kho sách, Bạn đọc, Lưu thông mượn trả, Xử lý vi phạm và Thông báo tự động — giao tiếp qua cơ chế In-Process Event Bus thời gian thực.
              </p>
            </div>

            {/* Quick Actions Cluster */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleOpenNewLoanModal()}
                className="px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-all shadow-md shadow-sky-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Bookmark className="w-4 h-4" />
                <span>+ Mượn Sách Mới</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 hover:text-white border border-slate-700/80 rounded-xl transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Thêm Đầu Sách</span>
              </button>

              <button
                onClick={handleOpenAddPatronModal}
                className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 hover:text-white border border-slate-700/80 rounded-xl transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Cấp Thẻ Độc Giả</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards Inside Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
            <div className="p-3 bg-slate-900/75 border border-slate-800 rounded-xl backdrop-blur-xs">
              <div className="text-[11px] text-slate-400">Tổng đầu sách lưu kho</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
                {books.length}{' '}
                <span className="text-xs font-normal text-slate-400">
                  ({books.reduce((acc, b) => acc + b.totalCopies, 0)} bản)
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/75 border border-slate-800 rounded-xl backdrop-blur-xs">
              <div className="text-[11px] text-slate-400">Bạn đọc kích hoạt thẻ</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                {patrons.filter((p) => p.status === 'HoatDong').length}{' '}
                <span className="text-xs font-normal text-slate-400">/ {patrons.length} độc giả</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/75 border border-slate-800 rounded-xl backdrop-blur-xs">
              <div className="text-[11px] text-slate-400">Phiếu đang mượn</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400 mt-0.5">
                {activeBorrowedLoans.length}{' '}
                <span className="text-xs font-normal text-slate-400">tài liệu</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/75 border border-slate-800 rounded-xl backdrop-blur-xs">
              <div className="text-[11px] text-slate-400">Tỷ lệ trả đúng hạn</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 mt-0.5">
                {loans.length > 0
                  ? Math.round(
                      ((loans.length - loans.filter((l) => l.status === 'QuaHan').length) /
                        loans.length) *
                        100
                    )
                  : 100}
                % <span className="text-xs font-normal text-slate-400">chuẩn mực</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Selector Tabs (Segmented Control per Section 1.A) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-fit overflow-x-auto border border-slate-200">
        <button
          onClick={() => setActiveModule('catalog')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeModule === 'catalog'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
          <span>1. Kho Sách (Catalog)</span>
          <span className="font-mono text-[10px] text-slate-500">({books.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('patron')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeModule === 'patron'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>2. Độc Giả (Patron)</span>
          <span className="font-mono text-[10px] text-slate-500">({patrons.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('circulation')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeModule === 'circulation'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Repeat className="w-3.5 h-3.5 text-emerald-600" />
          <span>3. Lưu Thông (Circulation)</span>
          <span className="font-mono text-[10px] text-slate-500">
            ({loans.filter((l) => l.status !== 'DaTra').length})
          </span>
        </button>

        <button
          onClick={() => setActiveModule('fine')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeModule === 'fine'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-amber-600" />
          <span>4. Phí Phạt (Fine & Billing)</span>
          <span className="font-mono text-[10px] text-slate-500">
            ({fines.filter((f) => f.status === 'ChuaThanhToan').length})
          </span>
        </button>

        <button
          onClick={() => setActiveModule('notification')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeModule === 'notification'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-violet-600" />
          <span>5. Thông Báo (Notification)</span>
          <span className="font-mono text-[10px] text-slate-500">({notifications.length})</span>
        </button>
      </div>

      {/* 1. CATALOG MODULE */}
      {activeModule === 'catalog' && (
        <div className="space-y-4">
          {/* Catalog Visual Spotlight Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 text-white p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="absolute inset-0">
              <img
                src="/src/assets/images/library_modern_academic_1790582992376.jpg"
                alt="Kho sách thư viện đại học"
                className="w-full h-full object-cover object-right filter brightness-[0.25] contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
            </div>

            <div className="relative space-y-1.5 z-10 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Phân Hệ 1: Kho Sách & Danh Mục Học Liệu (Catalog Bounded Context)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Kho Sách & Tài Liệu Chuyên Ngành CNTT Số Hóa
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tài liệu được mã hóa chuẩn ISBN quốc tế, phân bổ kệ kho chính xác và tự động khóa/mở quyền mượn dựa trên lượng bản in khả dụng thực tế.
              </p>
            </div>

            <div className="relative shrink-0 z-10 flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  {books.reduce((acc, b) => acc + b.availableCopies, 0)} bản sách sẵn sàng
                </div>
                <div className="text-[11px] text-slate-400">Trên tổng {books.reduce((acc, b) => acc + b.totalCopies, 0)} bản lưu kho</div>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Đầu Sách</span>
              </button>
            </div>
          </div>

          {/* Catalog Filter & Search Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên sách, tác giả, mã ISBN..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* View Switcher & Action */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setCatalogViewMode('grid')}
                    className={`p-1.5 rounded transition-colors ${
                      catalogViewMode === 'grid'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Chế độ xem Thẻ bìa sách (Grid)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCatalogViewMode('table')}
                    className={`p-1.5 rounded transition-colors ${
                      catalogViewMode === 'table'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Chế độ xem Bảng chi tiết (Table)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm sách</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Thể loại:</span>
              </span>
              <button
                onClick={() => setCatalogCategoryFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  catalogCategoryFilter === 'ALL'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({books.length})
              </button>
              <button
                onClick={() => setCatalogCategoryFilter('KienTrucPhanMem')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  catalogCategoryFilter === 'KienTrucPhanMem'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Kiến Trúc Phần Mềm
              </button>
              <button
                onClick={() => setCatalogCategoryFilter('HeThongPhanTan')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  catalogCategoryFilter === 'HeThongPhanTan'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Hệ Thống Phân Tán
              </button>
              <button
                onClick={() => setCatalogCategoryFilter('CoSoDuLieu')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  catalogCategoryFilter === 'CoSoDuLieu'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cơ Sở Dữ Liệu
              </button>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-slate-400">|</span>
                <select
                  value={catalogAvailabilityFilter}
                  onChange={(e) => setCatalogAvailabilityFilter(e.target.value as any)}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700"
                >
                  <option value="ALL">Tất cả tình trạng</option>
                  <option value="AVAILABLE">Còn sách mượn</option>
                  <option value="OUT_OF_STOCK">Đã mượn hết</option>
                </select>
              </div>
            </div>
          </div>

          {/* GRID VIEW WITH VISUAL BOOK COVERS */}
          {catalogViewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredBooks.length === 0 ? (
                <div className="col-span-full p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-xl">
                  Không tìm thấy đầu sách nào phù hợp với bộ lọc tìm kiếm.
                </div>
              ) : (
                filteredBooks.map((book) => {
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <div
                      key={book.id}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                    >
                      {/* Book Cover Image Slot */}
                      <div className="relative aspect-3/4 bg-slate-100 overflow-hidden border-b border-slate-100">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900 text-slate-200">
                            <BookOpen className="w-8 h-8 text-sky-400 mb-2" />
                            <div className="text-xs font-bold leading-snug">{book.title}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{book.author}</div>
                          </div>
                        )}

                        {/* Availability Pill on top of cover */}
                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md shadow-xs ${
                              isAvailable
                                ? 'bg-emerald-500 text-white'
                                : 'bg-rose-500 text-white'
                            }`}
                          >
                            {isAvailable ? `Còn ${book.availableCopies} cuốn` : 'Hết bản sao'}
                          </span>
                        </div>

                        {/* Shelf Location overlay tag */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-[10px] text-white/90 bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 rounded truncate block">
                            {book.locationShelf}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <div className="text-[11px] font-medium text-sky-600 truncate">
                            {book.categoryLabel}
                          </div>
                          <h4
                            onClick={() => setViewingBookDetails(book)}
                            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                            title={book.title}
                          >
                            {book.title}
                          </h4>
                          <div className="text-xs text-slate-600 truncate">{book.author}</div>
                        </div>

                        {/* Meta information */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>ISBN: ...{book.isbn.slice(-4)}</span>
                          <span>Tổng: {book.totalCopies}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-1 flex items-center justify-between gap-1.5">
                          <button
                            onClick={() => setViewingBookDetails(book)}
                            className="flex-1 py-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center justify-center gap-1"
                            title="Xem chi tiết sách"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chi tiết</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(book)}
                            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors border border-slate-200"
                            title="Chỉnh sửa thông tin sách"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleRequestDeleteBook(book)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-slate-200"
                            title="Xóa đầu sách"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TABLE VIEW */}
          {catalogViewMode === 'table' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold w-16">Bìa</th>
                      <th className="py-2.5 px-4 font-semibold">Tên Tài Liệu & Tác Giả</th>
                      <th className="py-2.5 px-4 font-semibold">Thể Loại</th>
                      <th className="py-2.5 px-4 font-semibold">ISBN</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Tổng / Có Sẵn</th>
                      <th className="py-2.5 px-4 font-semibold">Vị Trí Kệ</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="w-10 h-14 bg-slate-100 rounded overflow-hidden border border-slate-200 shrink-0">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                                <BookOpen className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div
                            onClick={() => setViewingBookDetails(book)}
                            className="font-semibold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer"
                          >
                            {book.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {book.author} · {book.publisher} ({book.publishedYear})
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-600">{book.categoryLabel}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {book.isbn}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          <span
                            className={`font-semibold ${
                              book.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {book.availableCopies}
                          </span>
                          <span className="text-slate-400"> / {book.totalCopies}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {book.locationShelf}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingBookDetails(book)}
                              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(book)}
                              className="p-1 text-slate-500 hover:text-sky-600 rounded hover:bg-sky-50"
                              title="Chỉnh sửa"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRequestDeleteBook(book)}
                              className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-rose-50"
                              title="Xóa sách"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. PATRON MODULE */}
      {activeModule === 'patron' && (
        <div className="space-y-4">
          {/* Patron Visual Spotlight Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 text-white p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="absolute inset-0">
              <img
                src="/src/assets/images/student_study_zone_1790585118364.jpg"
                alt="Sinh viên tự học tại thư viện"
                className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
            </div>

            <div className="relative space-y-1.5 z-10 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Phân Hệ 2: Hồ Sơ Độc Giả & Bạn Đọc (Patron Bounded Context)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Cổng Quản Lý Thẻ Sinh Viên & Giảng Viên @hpn.edu.vn
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Quản lý hồ sơ định danh sinh viên (MSSV 2374820086...), hạn mức mượn tài liệu, kiểm soát nợ phạt quá hạn và tự động khóa thẻ khi vi phạm nội quy thư viện.
              </p>
            </div>

            <div className="relative shrink-0 z-10 flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  {patrons.filter((p) => p.status === 'HoatDong').length} thẻ hoạt động
                </div>
                <div className="text-[11px] text-slate-400">100% định danh tài khoản số</div>
              </div>
              <button
                onClick={handleOpenAddPatronModal}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Cấp Thẻ Độc Giả</span>
              </button>
            </div>
          </div>

          {/* Patron Filter & Search Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tra cứu độc giả theo mã sinh viên, họ tên, email, khoa..."
                  value={patronSearch}
                  onChange={(e) => setPatronSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* View Switcher & Actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setPatronViewMode('table')}
                    className={`p-1.5 rounded transition-colors ${
                      patronViewMode === 'table'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Chế độ xem Bảng chi tiết (Table)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPatronViewMode('grid')}
                    className={`p-1.5 rounded transition-colors ${
                      patronViewMode === 'grid'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Chế độ xem Thẻ hồ sơ (Cards)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleOpenAddPatronModal}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm độc giả</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Đối tượng:</span>
              </span>
              <button
                onClick={() => setPatronRoleFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  patronRoleFilter === 'ALL'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({patrons.length})
              </button>
              <button
                onClick={() => setPatronRoleFilter('SinhVien')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  patronRoleFilter === 'SinhVien'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sinh viên
              </button>
              <button
                onClick={() => setPatronRoleFilter('HocVienCaoHoc')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  patronRoleFilter === 'HocVienCaoHoc'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Học viên cao học
              </button>
              <button
                onClick={() => setPatronRoleFilter('GiangVien')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  patronRoleFilter === 'GiangVien'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Giảng viên
              </button>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-slate-400">|</span>
                <select
                  value={patronStatusFilter}
                  onChange={(e) => setPatronStatusFilter(e.target.value as any)}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="HoatDong">Đang hoạt động</option>
                  <option value="KhoaThe">Đang bị khóa</option>
                </select>
              </div>
            </div>
          </div>

          {/* PATRON TABLE VIEW */}
          {patronViewMode === 'table' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Độc Giả & Liên Hệ</th>
                      <th className="py-2.5 px-4 font-semibold">Mã SV / CB</th>
                      <th className="py-2.5 px-4 font-semibold">Đối Tượng</th>
                      <th className="py-2.5 px-4 font-semibold">Khoa / Viện</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Đang Mượn / Hạn Mức</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Nợ Phạt (VND)</th>
                      <th className="py-2.5 px-4 font-semibold">Trạng Thái Thẻ</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredPatrons.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          Không tìm thấy độc giả nào phù hợp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredPatrons.map((patron) => (
                        <tr key={patron.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-slate-200 shrink-0">
                                {patron.avatarUrl ? (
                                  <img
                                    src={patron.avatarUrl}
                                    alt={patron.fullName}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className={`w-full h-full ${
                                      patron.avatarColor || 'bg-sky-600'
                                    } text-white font-bold flex items-center justify-center text-xs`}
                                  >
                                    {patron.fullName
                                      .split(' ')
                                      .map((n) => n[0])
                                      .slice(-2)
                                      .join('')}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div
                                  onClick={() => setViewingPatronDetails(patron)}
                                  className="font-semibold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer"
                                >
                                  {patron.fullName}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {patron.email} · {patron.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-900">
                            {patron.studentId}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {patron.role === 'GiangVien'
                              ? 'Giảng Viên'
                              : patron.role === 'HocVienCaoHoc'
                              ? 'Học Viên Cao Học'
                              : 'Sinh Viên'}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {patron.department || 'Khoa CNTT'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums">
                            <span className="font-semibold text-slate-900">
                              {patron.currentBorrowCount}
                            </span>
                            <span className="text-slate-400"> / {patron.borrowLimit}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums">
                            <span
                              className={
                                patron.debtFineAmount > 0
                                  ? 'text-rose-600 font-semibold'
                                  : 'text-slate-500'
                              }
                            >
                              {patron.debtFineAmount.toLocaleString('vi-VN')} đ
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {patron.status === 'HoatDong' ? (
                              <span className="text-emerald-700 font-medium flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Đang hoạt động</span>
                              </span>
                            ) : (
                              <span className="text-rose-700 font-medium flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5 text-rose-600" />
                                <span>Tạm khóa thẻ</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setViewingPatronDetails(patron)}
                                className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                                title="Xem hồ sơ chi tiết"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditPatronModal(patron)}
                                className="p-1 text-slate-500 hover:text-sky-600 rounded hover:bg-sky-50"
                                title="Chỉnh sửa thông tin"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleTogglePatronStatus(patron.id)}
                                className="p-1 text-slate-500 hover:text-amber-600 rounded hover:bg-amber-50"
                                title={patron.status === 'HoatDong' ? 'Khóa thẻ' : 'Mở khóa'}
                              >
                                {patron.status === 'HoatDong' ? (
                                  <Lock className="w-3.5 h-3.5" />
                                ) : (
                                  <Unlock className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleRequestDeletePatron(patron)}
                                className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-rose-50"
                                title="Xóa độc giả"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PATRON GRID / CARDS VIEW */}
          {patronViewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatrons.length === 0 ? (
                <div className="col-span-full p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-xl">
                  Không tìm thấy độc giả nào phù hợp với bộ lọc tìm kiếm.
                </div>
              ) : (
                filteredPatrons.map((patron) => (
                  <div
                    key={patron.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
                  >
                    {/* Top Smart Card Strip */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                        <span>HPN Digital Library Card</span>
                      </div>
                      <span className="font-mono text-slate-400">ID: {patron.studentId.slice(-4)}</span>
                    </div>

                    <div>
                      {/* Top Header in Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                            {patron.avatarUrl ? (
                              <img
                                src={patron.avatarUrl}
                                alt={patron.fullName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full ${
                                  patron.avatarColor || 'bg-sky-600'
                                } text-white font-bold flex items-center justify-center text-sm`}
                              >
                                {patron.fullName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(-2)
                                  .join('')}
                              </div>
                            )}
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                patron.status === 'HoatDong' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                          </div>

                          <div>
                            <h4
                              onClick={() => setViewingPatronDetails(patron)}
                              className="font-bold text-slate-900 hover:text-sky-600 transition-colors cursor-pointer text-sm leading-snug"
                            >
                              {patron.fullName}
                            </h4>
                            <div className="text-xs font-mono font-bold text-sky-700 mt-0.5">
                              MSSV: {patron.studentId}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {patron.status === 'HoatDong' ? (
                          <span className="px-2 py-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-medium text-rose-700 bg-rose-50 rounded-md border border-rose-200">
                            Khóa thẻ
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Đối tượng:</span>
                          <span className="font-semibold text-slate-800">
                            {patron.role === 'GiangVien'
                              ? 'Giảng Viên'
                              : patron.role === 'HocVienCaoHoc'
                              ? 'Học Viên Cao Học'
                              : 'Sinh Viên'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Khoa / Viện:</span>
                          <span className="text-slate-700 truncate max-w-[170px]">
                            {patron.department || 'Khoa CNTT'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="text-slate-700 truncate max-w-[170px] font-mono text-[11px]">
                            {patron.email}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Số điện thoại:</span>
                          <span className="text-slate-700 font-mono text-[11px]">
                            {patron.phone}
                          </span>
                        </div>
                      </div>

                      {/* Borrow Progress Bar */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Đang giữ sách:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {patron.currentBorrowCount} / {patron.borrowLimit} cuốn
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              patron.currentBorrowCount >= patron.borrowLimit
                                ? 'bg-rose-500'
                                : 'bg-sky-500'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (patron.currentBorrowCount / patron.borrowLimit) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Fine debt indicator */}
                      {patron.debtFineAmount > 0 && (
                        <div className="mt-2 text-[11px] p-2 bg-rose-50 rounded-lg border border-rose-200 text-rose-800 flex items-center justify-between font-mono">
                          <span>Nợ tiền phạt:</span>
                          <span className="font-bold">{patron.debtFineAmount.toLocaleString('vi-VN')} đ</span>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleOpenNewLoanModal(patron.id)}
                        className="py-1.5 px-2.5 text-[11px] font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                        title="Tạo phiếu mượn mới cho độc giả này"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Mượn sách</span>
                      </button>

                      <button
                        onClick={() => setViewingPatronDetails(patron)}
                        className="flex-1 py-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Hồ sơ</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditPatronModal(patron)}
                        className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors border border-slate-200"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleTogglePatronStatus(patron.id)}
                        className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-slate-200"
                        title={patron.status === 'HoatDong' ? 'Khóa thẻ' : 'Mở khóa thẻ'}
                      >
                        {patron.status === 'HoatDong' ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleRequestDeletePatron(patron)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                        title="Xóa độc giả"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. CIRCULATION MODULE (QUẢN LÝ MƯỢN TRẢ SÁCH) */}
      {activeModule === 'circulation' && (
        <div className="space-y-4">
          {/* Circulation Visual Desk Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 text-white p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="absolute inset-0">
              <img
                src="/src/assets/images/circulation_counter_1790585099229.jpg"
                alt="Quầy lưu thông và mượn trả sách đại học"
                className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
            </div>

            <div className="relative space-y-1.5 z-10 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
                <Repeat className="w-3.5 h-3.5" />
                <span>Phân Hệ 3: Quầy Lưu Thông & Mượn Trả Sách (Circulation Context)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Trạm Lưu Thông & Mượn Trả Tài Liệu Tập Trung
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Quản lý quy trình xuất mượn, gia hạn kỳ hạn, kiểm tra điều kiện độc giả (nợ phạt, hạn mức) và tự động phát In-Process Domain Events khi quá hạn hoặc trả sách.
              </p>
            </div>

            <div className="relative shrink-0 z-10 flex items-center gap-3">
              <button
                onClick={() => handleOpenNewLoanModal()}
                className="px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-all shadow-md shadow-sky-600/30 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Phiếu Mượn Mới</span>
              </button>
            </div>
          </div>

          {/* Sub-navigation & Stats Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-sky-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Phân Hệ Lưu Thông & Mượn Trả Sách (Circulation Module)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý toàn diện vòng đời phiếu mượn, gia hạn, trả sách và thu hồi tài liệu theo hợp đồng phân hệ Bounded Context.
                </p>
              </div>

              {/* View Switcher: All Loans vs Borrowed Books */}
              <div className="flex items-center gap-2">
                <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setLoanSubView('all_loans')}
                    className={`px-3 py-1.5 font-medium rounded-md transition-all flex items-center gap-1.5 ${
                      loanSubView === 'all_loans'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Tất Cả Phiếu Mượn</span>
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-200/80 text-slate-700 font-mono">
                      {loans.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setLoanSubView('active_borrowed')}
                    className={`px-3 py-1.5 font-medium rounded-md transition-all flex items-center gap-1.5 ${
                      loanSubView === 'active_borrowed'
                        ? 'bg-white text-sky-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span>Xem Sách Đang Được Mượn</span>
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-sky-100 text-sky-800 font-mono font-bold">
                      {activeBorrowedLoans.length}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => handleOpenNewLoanModal()}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tạo Phiếu Mượn Mới</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                <div className="text-slate-500 text-[11px]">Tổng phiếu phát hành</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {loans.length} <span className="text-xs font-normal text-slate-400">phiếu</span>
                </div>
              </div>
              <div className="p-3 bg-sky-50/60 border border-sky-200/70 rounded-lg">
                <div className="text-sky-700 text-[11px] font-medium">Sách đang lưu thông</div>
                <div className="text-lg font-bold font-mono text-sky-900 mt-0.5">
                  {loans.filter((l) => l.status === 'DangMuon').length}{' '}
                  <span className="text-xs font-normal text-sky-600">cuốn</span>
                </div>
              </div>
              <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-lg">
                <div className="text-rose-700 text-[11px] font-medium">Phiếu quá hạn trả</div>
                <div className="text-lg font-bold font-mono text-rose-700 mt-0.5">
                  {loans.filter((l) => l.status === 'QuaHan').length}{' '}
                  <span className="text-xs font-normal text-rose-500">cần thu hồi</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-lg">
                <div className="text-emerald-700 text-[11px] font-medium">Đã trả về kho</div>
                <div className="text-lg font-bold font-mono text-emerald-800 mt-0.5">
                  {loans.filter((l) => l.status === 'DaTra').length}{' '}
                  <span className="text-xs font-normal text-emerald-600">hoàn tất</span>
                </div>
              </div>
            </div>

            {/* Search and Filters Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phiếu mượn (Mã phiếu, tên độc giả, mã SV 2374820..., tên sách, ghi chú)..."
                  value={loanSearch}
                  onChange={(e) => setLoanSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 bg-slate-50/50"
                />
                {loanSearch && (
                  <button
                    onClick={() => setLoanSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
                  <button
                    onClick={() => setLoanStatusFilter('ALL')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      loanStatusFilter === 'ALL'
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả ({loans.length})
                  </button>
                  <button
                    onClick={() => setLoanStatusFilter('ACTIVE')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      loanStatusFilter === 'ACTIVE'
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'text-slate-600 hover:text-sky-600'
                    }`}
                  >
                    Đang mượn ({loans.filter((l) => l.status === 'DangMuon').length})
                  </button>
                  <button
                    onClick={() => setLoanStatusFilter('OVERDUE')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      loanStatusFilter === 'OVERDUE'
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'text-slate-600 hover:text-rose-600'
                    }`}
                  >
                    Quá hạn ({loans.filter((l) => l.status === 'QuaHan').length})
                  </button>
                  <button
                    onClick={() => setLoanStatusFilter('RETURNED')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      loanStatusFilter === 'RETURNED'
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-600 hover:text-emerald-600'
                    }`}
                  >
                    Đã trả ({loans.filter((l) => l.status === 'DaTra').length})
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-100">
                  <button
                    onClick={() => setLoanViewMode('table')}
                    className={`p-1.5 rounded-md transition-colors ${
                      loanViewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                    }`}
                    title="Dạng bảng"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLoanViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      loanViewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                    }`}
                    title="Dạng thẻ lưới"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: ALL LOANS LIST */}
          {loanSubView === 'all_loans' && (
            <div>
              {/* TABLE VIEW */}
              {loanViewMode === 'table' && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Mã Phiếu</th>
                          <th className="py-2.5 px-4 font-semibold">Độc Giả (Patron)</th>
                          <th className="py-2.5 px-4 font-semibold">Sách Mượn (Catalog)</th>
                          <th className="py-2.5 px-4 font-semibold">Ngày Mượn</th>
                          <th className="py-2.5 px-4 font-semibold">Hạn Trả & Tiến Độ</th>
                          <th className="py-2.5 px-4 font-semibold">Trạng Thái</th>
                          <th className="py-2.5 px-4 font-semibold">Ghi Chú</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredLoans.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-10 text-center text-slate-400">
                              Không tìm thấy phiếu mượn nào phù hợp với bộ lọc tìm kiếm.
                            </td>
                          </tr>
                        ) : (
                          filteredLoans.map((loan) => {
                            const book = books.find((b) => b.id === loan.bookId);
                            const patron = patrons.find((p) => p.id === loan.patronId);
                            const daysStatus = getLoanDaysStatus(loan);

                            return (
                              <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3 px-4 font-mono font-medium text-slate-900">
                                  <span
                                    onClick={() => setViewingLoanDetails(loan)}
                                    className="hover:text-sky-600 cursor-pointer underline decoration-dotted"
                                    title="Xem chi tiết phiếu mượn"
                                  >
                                    {loan.id}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div>
                                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                      <span>{loan.patronName}</span>
                                    </div>
                                    <div className="text-[11px] font-mono text-slate-500">
                                      MSSV: {loan.patronStudentId || patron?.studentId || '2374820086'}
                                    </div>
                                    {patron?.email && (
                                      <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                                        {patron.email}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-10 rounded shrink-0 overflow-hidden bg-slate-100 border border-slate-200">
                                      {book?.coverImage ? (
                                        <img
                                          src={book.coverImage}
                                          alt={loan.bookTitle}
                                          referrerPolicy="no-referrer"
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                                          <BookOpen className="w-4 h-4" />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-[200px]" title={loan.bookTitle}>
                                        {loan.bookTitle}
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-mono">
                                        ISBN: {book?.isbn || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">
                                  {loan.borrowDate}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="space-y-1">
                                    <div className="font-mono text-slate-700 tabular-nums font-medium">
                                      {loan.dueDate}
                                    </div>
                                    <span
                                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${daysStatus.badgeClass}`}
                                    >
                                      {daysStatus.label}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {loan.status === 'DangMuon' && (
                                    <span className="text-sky-700 font-medium bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                                      Đang mượn
                                    </span>
                                  )}
                                  {loan.status === 'QuaHan' && (
                                    <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1 w-fit">
                                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                                      <span>Quá hạn ({loan.overdueDays} ngày)</span>
                                    </span>
                                  )}
                                  {loan.status === 'DaTra' && (
                                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      Đã trả ({loan.returnDate})
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-slate-500 max-w-[150px]">
                                  <div className="truncate text-[11px]" title={loan.notes || 'Không có ghi chú'}>
                                    {loan.notes || '—'}
                                  </div>
                                  {loan.renewalCount && loan.renewalCount > 0 ? (
                                    <div className="text-[10px] text-sky-600 font-medium">
                                      Đã gia hạn: {loan.renewalCount} lần
                                    </div>
                                  ) : null}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => setViewingLoanDetails(loan)}
                                      className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                                      title="Xem chi tiết phiếu mượn"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>

                                    {loan.status !== 'DaTra' && (
                                      <button
                                        onClick={() => handleRenewLoan(loan.id, 7)}
                                        className="p-1 text-slate-500 hover:text-sky-600 rounded hover:bg-sky-50"
                                        title="Gia hạn thêm 7 ngày"
                                      >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleOpenEditLoanModal(loan)}
                                      className="p-1 text-slate-500 hover:text-sky-600 rounded hover:bg-sky-50"
                                      title="Chỉnh sửa phiếu mượn"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    {loan.status !== 'DaTra' ? (
                                      <button
                                        onClick={() => handleReturnBook(loan.id)}
                                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                                        title="Thu hồi & Trả sách"
                                      >
                                        Trả Sách
                                      </button>
                                    ) : (
                                      <span className="text-[11px] text-slate-400 px-1">Hoàn tất</span>
                                    )}

                                    <button
                                      onClick={() => handleRequestDeleteLoan(loan)}
                                      className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-rose-50"
                                      title="Xóa phiếu mượn"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* GRID VIEW */}
              {loanViewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLoans.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-xl">
                      Không tìm thấy phiếu mượn nào phù hợp.
                    </div>
                  ) : (
                    filteredLoans.map((loan) => {
                      const book = books.find((b) => b.id === loan.bookId);
                      const patron = patrons.find((p) => p.id === loan.patronId);
                      const daysStatus = getLoanDaysStatus(loan);

                      return (
                        <div
                          key={loan.id}
                          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                              <div>
                                <span className="font-mono text-[11px] font-bold text-slate-900">
                                  {loan.id}
                                </span>
                                <div className="text-[11px] text-slate-500">
                                  Mượn ngày: <span className="font-mono">{loan.borrowDate}</span>
                                </div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] ${daysStatus.badgeClass}`}
                              >
                                {daysStatus.label}
                              </span>
                            </div>

                            {/* Book Info */}
                            <div className="flex items-center gap-3 mt-3">
                              <div className="w-12 h-16 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                {book?.coverImage ? (
                                  <img
                                    src={book.coverImage}
                                    alt={loan.bookTitle}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                                    <BookOpen className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <h4
                                  className="font-semibold text-slate-900 text-xs line-clamp-2 hover:text-sky-600 cursor-pointer"
                                  onClick={() => setViewingLoanDetails(loan)}
                                >
                                  {loan.bookTitle}
                                </h4>
                                <div className="text-[11px] text-slate-500 truncate">
                                  {book?.author || 'Tác giả thư viện'}
                                </div>
                                <div className="text-[10px] font-mono text-slate-400">
                                  Kệ: {book?.locationShelf || 'Khu A'}
                                </div>
                              </div>
                            </div>

                            {/* Patron Info */}
                            <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Độc giả:</span>
                                <span className="font-semibold text-slate-900">{loan.patronName}</span>
                              </div>
                              <div className="flex items-center justify-between font-mono text-[11px]">
                                <span className="text-slate-400">MSSV:</span>
                                <span className="text-slate-800 font-medium">
                                  {loan.patronStudentId || patron?.studentId || '2374820086'}
                                </span>
                              </div>
                              {patron?.email && (
                                <div className="flex items-center justify-between font-mono text-[10px]">
                                  <span className="text-slate-400">Email:</span>
                                  <span className="text-slate-600 truncate max-w-[180px]">
                                    {patron.email}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500">Hạn trả:</span>
                                <span className="font-mono font-bold text-slate-900">{loan.dueDate}</span>
                              </div>
                            </div>

                            {loan.notes && (
                              <div className="mt-2 text-[11px] text-slate-500 italic bg-amber-50/50 p-1.5 rounded border border-amber-100">
                                "{loan.notes}"
                              </div>
                            )}
                          </div>

                          {/* Card Actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                            <button
                              onClick={() => setViewingLoanDetails(loan)}
                              className="flex-1 py-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Chi tiết</span>
                            </button>

                            {loan.status !== 'DaTra' && (
                              <button
                                onClick={() => handleRenewLoan(loan.id, 7)}
                                className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors border border-slate-200"
                                title="Gia hạn 7 ngày"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenEditLoanModal(loan)}
                              className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors border border-slate-200"
                              title="Chỉnh sửa phiếu"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {loan.status !== 'DaTra' ? (
                              <button
                                onClick={() => handleReturnBook(loan.id)}
                                className="px-3 py-1.5 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                              >
                                Trả Sách
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 px-2 py-1">Đã trả</span>
                            )}

                            <button
                              onClick={() => handleRequestDeleteLoan(loan)}
                              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-slate-200"
                              title="Xóa phiếu mượn"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: SÁCH ĐANG ĐƯỢC MƯỢN (ACTIVE BORROWED BOOKS VIEW) */}
          {loanSubView === 'active_borrowed' && (
            <div className="space-y-4">
              <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sky-950 text-sm">
                      Danh Mục Sách Đang Được Mượn (Chưa Hoàn Trả)
                    </h4>
                    <p className="text-sky-800 text-[11px]">
                      Tổng cộng <strong className="font-mono">{activeBorrowedLoans.length}</strong> cuốn sách đang nằm trong tay độc giả. Theo dõi hạn trả và thu hồi tài liệu kịp thời.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-sky-900">
                    Phí quá hạn quy định: <strong className="font-mono">5.000 đ/ngày</strong>
                  </span>
                </div>
              </div>

              {activeBorrowedLoans.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-xs text-slate-500">
                  Hiện không có cuốn sách nào đang được mượn. Toàn bộ sách đã được hoàn trả về kho lưu trữ.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeBorrowedLoans
                    .filter((loan) => {
                      const query = loanSearch.toLowerCase().trim();
                      if (!query) return true;
                      return (
                        loan.bookTitle.toLowerCase().includes(query) ||
                        loan.patronName.toLowerCase().includes(query) ||
                        (loan.patronStudentId && loan.patronStudentId.toLowerCase().includes(query)) ||
                        loan.id.toLowerCase().includes(query)
                      );
                    })
                    .map((loan) => {
                      const book = books.find((b) => b.id === loan.bookId);
                      const patron = patrons.find((p) => p.id === loan.patronId);
                      const daysStatus = getLoanDaysStatus(loan);

                      return (
                        <div
                          key={loan.id}
                          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          {/* Book Banner with Cover */}
                          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-start gap-3">
                            <div className="w-14 h-20 rounded-md overflow-hidden bg-slate-800 border border-slate-700 shadow-md shrink-0">
                              {book?.coverImage ? (
                                <img
                                  src={book.coverImage}
                                  alt={loan.bookTitle}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-700">
                                  <BookOpen className="w-6 h-6 text-slate-300" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">
                                Phiếu {loan.id}
                              </span>
                              <h4 className="font-bold text-sm text-white line-clamp-2 leading-tight">
                                {loan.bookTitle}
                              </h4>
                              <div className="text-[11px] text-slate-300 truncate">
                                {book?.author || 'Tác giả CNTT'}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {book?.locationShelf || 'Khu A - Tầng 2'}
                              </div>
                            </div>
                          </div>

                          {/* Borrower Info & Due Date Details */}
                          <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              {/* Due Date Indicator */}
                              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <div>
                                  <div className="text-[10px] text-slate-400">Thời hạn hoàn trả:</div>
                                  <div className="font-mono font-bold text-slate-900 text-xs">
                                    {loan.dueDate}
                                  </div>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${daysStatus.badgeClass}`}
                                >
                                  {daysStatus.label}
                                </span>
                              </div>

                              {/* Overdue Warning */}
                              {loan.status === 'QuaHan' && loan.overdueDays > 0 && (
                                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] flex items-center justify-between">
                                  <span className="flex items-center gap-1 font-medium">
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                    Phạt dự kiến ({loan.overdueDays} ngày):
                                  </span>
                                  <span className="font-mono font-bold text-rose-700">
                                    {(loan.overdueDays * 5000).toLocaleString('vi-VN')} đ
                                  </span>
                                </div>
                              )}

                              {/* Patron Card in Borrowed View */}
                              <div className="pt-2 border-t border-slate-100 space-y-1">
                                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                                  Độc giả đang giữ sách:
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900">{loan.patronName}</span>
                                  <span className="font-mono font-medium text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 text-[11px]">
                                    {loan.patronStudentId || patron?.studentId || '2374820086'}
                                  </span>
                                </div>
                                {patron?.email && (
                                  <div className="text-[11px] font-mono text-slate-500 truncate">
                                    {patron.email}
                                  </div>
                                )}
                                <div className="text-[11px] text-slate-500">
                                  {patron?.phone} · {patron?.department || 'Khoa CNTT'}
                                </div>
                              </div>

                              {loan.notes && (
                                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                                  Ghi chú: {loan.notes}
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                              <button
                                onClick={() => handleReturnBook(loan.id)}
                                className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <Check className="w-4 h-4" />
                                <span>Thu Hồi / Trả Sách</span>
                              </button>

                              <button
                                onClick={() => handleRenewLoan(loan.id, 7)}
                                className="p-2 text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg border border-slate-200 transition-colors"
                                title="Gia hạn thêm 7 ngày"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleOpenEditLoanModal(loan)}
                                className="p-2 text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg border border-slate-200 transition-colors"
                                title="Chỉnh sửa phiếu mượn"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setViewingLoanDetails(loan)}
                                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                                title="Xem phiếu chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. FINE MODULE */}
      {activeModule === 'fine' && (
        <div className="space-y-4">
          {/* Fine Spotlight Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 text-white p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 z-10 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Phân Hệ 4: Quản Lý Phí Phạt & Bồi Thường (Fine & Billing Context)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Thu Ngân & Quản Lý Công Nợ Thư Viện Đại Học
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tự động hóa 100% việc tính toán tiền phạt trễ hạn thông qua cơ chế Domain Event khi trả sách. Biểu phí cố định 5.000 đ/ngày quá hạn theo quy chế quản lý tài liệu.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0 z-10 text-xs">
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-[11px]">Đã thu ngân</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                  {fines
                    .filter((f) => f.status === 'DaThanhToan')
                    .reduce((sum, f) => sum + f.amount, 0)
                    .toLocaleString('vi-VN')}{' '}
                  đ
                </div>
              </div>
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="text-slate-400 text-[11px]">Chưa thanh toán</div>
                <div className="text-base font-bold font-mono text-rose-400 mt-0.5">
                  {fines
                    .filter((f) => f.status === 'ChuaThanhToan')
                    .reduce((sum, f) => sum + f.amount, 0)
                    .toLocaleString('vi-VN')}{' '}
                  đ
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">Danh Sách Hóa Đơn Phạt Quá Hạn</div>
                <div className="text-xs text-slate-500">Độc lập lắng nghe sự kiện BookReturnedOverdueEvent để xuất biên lai thu tiền</div>
              </div>
              <div className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                Biểu phí: 5.000 đ / ngày trễ
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Mã Hóa Đơn</th>
                    <th className="py-2.5 px-4 font-semibold">Độc Giả</th>
                    <th className="py-2.5 px-4 font-semibold">Tài Liệu Quá Hạn</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Số Ngày Trễ</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Số Tiền Phạt</th>
                    <th className="py-2.5 px-4 font-semibold">Tình Trạng</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {fines.map((fine) => (
                    <tr key={fine.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {fine.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {fine.patronName}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {fine.bookTitle}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-rose-600 font-semibold">
                        +{fine.overdueDays} ngày
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                        {fine.amount.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-3 px-4">
                        {fine.status === 'ChuaThanhToan' ? (
                          <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Chưa thanh toán
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Đã thu tiền
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {fine.status === 'ChuaThanhToan' && (
                          <button
                            onClick={() => handlePayFine(fine.id)}
                            className="px-3 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-xs"
                          >
                            Thu Tiền
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. NOTIFICATION MODULE */}
      {activeModule === 'notification' && (
        <div className="space-y-4">
          {/* Notification Spotlight Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 text-white p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 z-10 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5" />
                <span>Phân Hệ 5: Trung Tâm Thông Báo & Cảnh Báo (Notification Context)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Nhật Ký Thông Báo Tự Động Đa Kênh Thời Gian Thực
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tự động tiếp nhận Domain Events in-process khi có giao dịch mượn sách, phát sinh phí phạt hoặc quá hạn hoàn trả để chuyển phát thông báo đến sinh viên qua Email @hpn.edu.vn và giao diện ứng dụng.
              </p>
            </div>

            <div className="shrink-0 z-10 flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                Tổng cộng: {notifications.length} bản tin
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">Bảng Tin Cảnh Báo & Tin Nhắn Gửi Bạn Đọc</div>
                <div className="text-xs text-slate-500">Phát tin theo thời gian thực tới tài khoản bạn đọc</div>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{notif.title}</span>
                      <span className="text-[11px] font-mono text-slate-400">· Kênh: {notif.channel}</span>
                      <span className="text-[11px] text-sky-700 font-medium bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
                        {notif.patronName}
                      </span>
                    </div>
                    <p className="text-slate-600">{notif.content}</p>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                    {new Date(notif.timestamp).toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD BOOK MODAL */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Thêm Đầu Sách Mới (Catalog Module)</h3>
                <p className="text-[11px] text-slate-500">Tạo tài liệu và phát sự kiện BookAddedToCatalogEvent</p>
              </div>
              <button
                onClick={() => setShowAddBookModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewBook} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tựa đề sách *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Building Microservices (2nd Edition)"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tác giả *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Sam Newman"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mã ISBN</label>
                      <input
                        type="text"
                        value={formIsbn}
                        onChange={(e) => setFormIsbn(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-md font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Số bản sao</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formCopies}
                        onChange={(e) => setFormCopies(Number(e.target.value))}
                        className="w-full p-2 border border-slate-200 rounded-md font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Thể loại chuyên ngành</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Book['category'])}
                      className="w-full p-2 border border-slate-200 rounded-md bg-white"
                    >
                      <option value="KienTrucPhanMem">Kiến Trúc Phần Mềm</option>
                      <option value="HeThongPhanTan">Hệ Thống Phân Tán</option>
                      <option value="CoSoDuLieu">Cơ Sở Dữ Liệu & Lưu Trữ</option>
                      <option value="AI_MachineLearning">Trí Tuệ Nhân Tạo & AI</option>
                      <option value="LapTrinhHeThong">Lập Trình & Thuật Toán</option>
                      <option value="AnToanThongTin">An Toàn Thông Tin</option>
                    </select>
                  </div>
                </div>

                {/* Right: Book Cover Picker & Preview */}
                <div className="space-y-3">
                  <label className="block font-semibold text-slate-700">
                    Ảnh Bìa Sách (Nhận diện trực quan)
                  </label>

                  {/* Preview Frame */}
                  <div className="w-full aspect-3/4 max-h-44 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group flex items-center justify-center">
                    {formCoverImage ? (
                      <img
                        src={formCoverImage}
                        alt="Bìa xem trước"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400 p-2">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                        <span>Chưa chọn ảnh bìa</span>
                      </div>
                    )}
                  </div>

                  {/* Presets Grid */}
                  <div>
                    <div className="text-[11px] text-slate-500 mb-1">Chọn mẫu bìa có sẵn:</div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {COVER_PRESETS.map((preset) => (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => setFormCoverImage(preset.url)}
                          className={`aspect-3/4 rounded overflow-hidden border transition-all ${
                            formCoverImage === preset.url
                              ? 'ring-2 ring-sky-500 border-sky-500 scale-95'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload custom image */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-1.5 px-3 border border-dashed border-slate-300 hover:border-sky-500 rounded text-[11px] text-slate-600 hover:text-sky-600 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh từ máy tính...</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Extra Details */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nhà xuất bản</label>
                  <input
                    type="text"
                    value={formPublisher}
                    onChange={(e) => setFormPublisher(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Năm XB</label>
                  <input
                    type="number"
                    value={formPublishedYear}
                    onChange={(e) => setFormPublishedYear(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vị trí kệ</label>
                  <input
                    type="text"
                    value={formShelf}
                    onChange={(e) => setFormShelf(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả tóm tắt nội dung</label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt nội dung chính của tài liệu học thuật này..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
                >
                  Lưu vào Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT BOOK MODAL */}
      {editingBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Chỉnh Sửa Thông Tin Sách & Ảnh Bìa
                </h3>
                <p className="text-[11px] text-slate-500">Mã sách: {editingBook.id}</p>
              </div>
              <button
                onClick={() => setEditingBook(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditBook} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tựa đề sách *</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tác giả *</label>
                    <input
                      type="text"
                      required
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mã ISBN</label>
                      <input
                        type="text"
                        value={formIsbn}
                        onChange={(e) => setFormIsbn(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-md font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tổng bản sao</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={formCopies}
                        onChange={(e) => setFormCopies(Number(e.target.value))}
                        className="w-full p-2 border border-slate-200 rounded-md font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Thể loại</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Book['category'])}
                      className="w-full p-2 border border-slate-200 rounded-md bg-white"
                    >
                      <option value="KienTrucPhanMem">Kiến Trúc Phần Mềm</option>
                      <option value="HeThongPhanTan">Hệ Thống Phân Tán</option>
                      <option value="CoSoDuLieu">Cơ Sở Dữ Liệu & Lưu Trữ</option>
                      <option value="AI_MachineLearning">Trí Tuệ Nhân Tạo & AI</option>
                      <option value="LapTrinhHeThong">Lập Trình & Thuật Toán</option>
                      <option value="AnToanThongTin">An Toàn Thông Tin</option>
                    </select>
                  </div>
                </div>

                {/* Right: Book Cover Picker & Preview */}
                <div className="space-y-3">
                  <label className="block font-semibold text-slate-700">Ảnh Bìa Sách</label>

                  <div className="w-full aspect-3/4 max-h-44 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group flex items-center justify-center">
                    {formCoverImage ? (
                      <img
                        src={formCoverImage}
                        alt="Bìa xem trước"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400 p-2">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                        <span>Chưa chọn ảnh bìa</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 mb-1">Đổi mẫu bìa khác:</div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {COVER_PRESETS.map((preset) => (
                        <button
                          type="button"
                          key={preset.id}
                          onClick={() => setFormCoverImage(preset.url)}
                          className={`aspect-3/4 rounded overflow-hidden border transition-all ${
                            formCoverImage === preset.url
                              ? 'ring-2 ring-sky-500 border-sky-500 scale-95'
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-1.5 px-3 border border-dashed border-slate-300 hover:border-sky-500 rounded text-[11px] text-slate-600 hover:text-sky-600 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Đổi ảnh từ tệp máy tính...</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Extra Details */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nhà xuất bản</label>
                  <input
                    type="text"
                    value={formPublisher}
                    onChange={(e) => setFormPublisher(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Năm XB</label>
                  <input
                    type="number"
                    value={formPublishedYear}
                    onChange={(e) => setFormPublishedYear(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vị trí kệ</label>
                  <input
                    type="text"
                    value={formShelf}
                    onChange={(e) => setFormShelf(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
                >
                  Cập nhật Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW BOOK DETAILS */}
      {viewingBookDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-sky-600">
                  {viewingBookDetails.categoryLabel}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {viewingBookDetails.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingBookDetails(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Cover preview */}
              <div className="aspect-3/4 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                {viewingBookDetails.coverImage ? (
                  <img
                    src={viewingBookDetails.coverImage}
                    alt={viewingBookDetails.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="sm:col-span-2 space-y-2">
                <div>
                  <span className="text-slate-400">Tác giả: </span>
                  <span className="font-semibold text-slate-800">{viewingBookDetails.author}</span>
                </div>
                <div>
                  <span className="text-slate-400">Mã ISBN: </span>
                  <span className="font-mono text-slate-800">{viewingBookDetails.isbn}</span>
                </div>
                <div>
                  <span className="text-slate-400">Nhà xuất bản: </span>
                  <span className="text-slate-800">
                    {viewingBookDetails.publisher} ({viewingBookDetails.publishedYear})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Vị trí lưu kho: </span>
                  <span className="text-slate-800">{viewingBookDetails.locationShelf}</span>
                </div>
                <div>
                  <span className="text-slate-400">Tình trạng tồn kho: </span>
                  <span
                    className={`font-mono font-bold ${
                      viewingBookDetails.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    Còn {viewingBookDetails.availableCopies} / {viewingBookDetails.totalCopies} cuốn
                  </span>
                </div>

                {viewingBookDetails.description && (
                  <div className="pt-2 border-t border-slate-100 text-slate-600 leading-relaxed text-[11px]">
                    {viewingBookDetails.description}
                  </div>
                )}
              </div>
            </div>

            {/* Active loans of this book */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-700 mb-1">
                Tình trạng mượn hiện tại:
              </div>
              {loans.filter((l) => l.bookId === viewingBookDetails.id && l.status !== 'DaTra').length === 0 ? (
                <div className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Không có độc giả nào đang giữ sách này. Tất cả bản sao sẵn sàng tại quầy.</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {loans
                    .filter((l) => l.bookId === viewingBookDetails.id && l.status !== 'DaTra')
                    .map((loan) => (
                      <div
                        key={loan.id}
                        className="text-[11px] p-2 bg-slate-50 rounded flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-800">{loan.patronName}</span>
                        <span className="text-slate-500 font-mono">Hạn trả: {loan.dueDate}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setViewingBookDetails(null);
                  handleOpenEditModal(viewingBookDetails);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                Chỉnh sửa
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewLoanBookId(viewingBookDetails.id);
                  setViewingBookDetails(null);
                  setShowNewLoanModal(true);
                }}
                disabled={viewingBookDetails.availableCopies <= 0}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md disabled:bg-slate-300"
              >
                Mượn cuốn này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE BOOK CONFIRMATION */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác Nhận Xóa Đầu Sách</h3>
                <p className="text-xs text-slate-500">Thao tác này sẽ xóa vĩnh viễn sách khỏi Catalog</p>
              </div>
            </div>

            {deleteWarning ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 leading-relaxed">
                {deleteWarning}
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa đầu sách{' '}
                <strong className="text-slate-900 font-semibold">"{bookToDelete.title}"</strong> (ISBN:{' '}
                {bookToDelete.isbn}) không?
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setBookToDelete(null);
                  setDeleteWarning(null);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBook}
                disabled={Boolean(deleteWarning)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: NEW LOAN (TẠO PHIẾU MƯỢN MỚI) */}
      {showNewLoanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tạo Phiếu Mượn Sách Mới (Circulation Module)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Thiết lập giao dịch mượn tài liệu và phát sự kiện LoanCreatedDomainEvent
                </p>
              </div>
              <button
                onClick={() => setShowNewLoanModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {loanErrorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>{loanErrorMessage}</div>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              {/* Select Patron */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  1. Chọn Độc Giả (Patron):
                </label>
                <select
                  value={newLoanPatronId}
                  onChange={(e) => setNewLoanPatronId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md bg-white focus:ring-1 focus:ring-sky-500 font-sans"
                >
                  {patrons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} (MSSV: {p.studentId}) — Đang mượn {p.currentBorrowCount}/{p.borrowLimit} cuốn {p.status === 'KhoaThe' ? '🔒 [Khóa thẻ]' : ''}
                    </option>
                  ))}
                </select>

                {/* Patron preview badge */}
                {(() => {
                  const selPatron = patrons.find((p) => p.id === newLoanPatronId);
                  if (!selPatron) return null;
                  return (
                    <div className="mt-1.5 p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-semibold text-slate-800">{selPatron.fullName}</span> ·{' '}
                        <span className="font-mono text-slate-500">{selPatron.email}</span>
                      </div>
                      <span
                        className={`font-semibold ${
                          selPatron.currentBorrowCount >= selPatron.borrowLimit
                            ? 'text-rose-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        Còn {Math.max(0, selPatron.borrowLimit - selPatron.currentBorrowCount)} lượt mượn
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Select Book */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  2. Chọn Đầu Sách Cần Mượn (Catalog):
                </label>
                <select
                  value={newLoanBookId}
                  onChange={(e) => setNewLoanBookId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md bg-white focus:ring-1 focus:ring-sky-500"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                      {b.title} — Còn sẵn {b.availableCopies}/{b.totalCopies} cuốn {b.availableCopies <= 0 ? '❌ [Hết sách]' : ''}
                    </option>
                  ))}
                </select>

                {/* Book preview thumbnail */}
                {(() => {
                  const selBook = books.find((b) => b.id === newLoanBookId);
                  if (!selBook) return null;
                  return (
                    <div className="mt-1.5 p-2 bg-slate-50 rounded border border-slate-100 flex items-center gap-2.5 text-[11px]">
                      <div className="w-7 h-9 rounded overflow-hidden bg-slate-200 shrink-0">
                        {selBook.coverImage ? (
                          <img
                            src={selBook.coverImage}
                            alt={selBook.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-[8px]">
                            Bìa
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 truncate">{selBook.title}</div>
                        <div className="text-slate-500 font-mono text-[10px]">
                          ISBN: {selBook.isbn} · Vị trí: {selBook.locationShelf}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Duration selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  3. Thời Hạn Mượn:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: 7, label: '7 ngày (1 tuần)' },
                    { days: 14, label: '14 ngày (2 tuần - Chuẩn)' },
                    { days: 30, label: '30 ngày (1 tháng)' },
                  ].map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setFormLoanBorrowDays(item.days)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        formLoanBorrowDays === item.days
                          ? 'border-sky-500 bg-sky-50 text-sky-900 font-semibold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  4. Ghi Chú Phiếu Mượn (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="VD: Phục vụ nghiên cứu luận văn tốt nghiệp, mượn qua đề cương..."
                  value={formLoanNotes}
                  onChange={(e) => setFormLoanNotes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Modular Monolith Architecture Note */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-sky-600" />
                  <span>Quy tắc kiến trúc Modular Monolith:</span>
                </div>
                <div>
                  <code>CirculationModule</code> gọi <code>IPatronModule.canBorrow()</code> và <code>ICatalogModule.reserveCopy()</code>. Khi hoàn tất, sự kiện <code>LoanCreatedDomainEvent</code> được phát qua In-Process Event Bus để NotificationModule gửi email xác nhận.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewLoanModal(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleExecuteBorrow}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
              >
                Xác nhận Tạo Phiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5B: EDIT LOAN (CHỈNH SỬA PHIẾU MƯỢN) */}
      {editingLoan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Chỉnh Sửa Phiếu Mượn {editingLoan.id}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cập nhật thời hạn trả, trạng thái lưu thông hoặc ghi chú phiếu mượn
                </p>
              </div>
              <button
                onClick={() => setEditingLoan(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditLoan} className="space-y-4 text-xs">
              {/* Summary overview */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Độc giả:</span>
                  <span className="font-semibold text-slate-900">{editingLoan.patronName}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Mã sinh viên / CB:</span>
                  <span className="text-slate-800">{editingLoan.patronStudentId || '2374820086'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Đầu sách:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[250px]">{editingLoan.bookTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ngày mượn:</span>
                  <span className="font-mono text-slate-700">{editingLoan.borrowDate}</span>
                </div>
              </div>

              {/* Edit Due Date */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Hạn Trả Mới (Due Date) *</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(formEditLoanDueDate || editingLoan.dueDate);
                        d.setDate(d.getDate() + 7);
                        setFormEditLoanDueDate(d.toISOString().split('T')[0]);
                      }}
                      className="text-[10px] px-2 py-0.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 font-medium"
                    >
                      +7 Ngày
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date(formEditLoanDueDate || editingLoan.dueDate);
                        d.setDate(d.getDate() + 14);
                        setFormEditLoanDueDate(d.toISOString().split('T')[0]);
                      }}
                      className="text-[10px] px-2 py-0.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 font-medium"
                    >
                      +14 Ngày
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  required
                  value={formEditLoanDueDate}
                  onChange={(e) => setFormEditLoanDueDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-sky-500 font-mono"
                />
              </div>

              {/* Edit Status */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Trạng Thái Phiếu Mượn *
                </label>
                <select
                  value={formEditLoanStatus}
                  onChange={(e) => setFormEditLoanStatus(e.target.value as LoanRecord['status'])}
                  className="w-full p-2 border border-slate-200 rounded-md bg-white focus:ring-1 focus:ring-sky-500"
                >
                  <option value="DangMuon">Đang mượn (Sách vẫn ở ngoài kho)</option>
                  <option value="QuaHan">Quá hạn trả (Áp dụng tính phí phạt 5.000 đ/ngày)</option>
                  <option value="DaTra">Đã trả (Tự động hoàn trả bản sao về Catalog)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  * Khi chuyển sang trạng thái "Đã trả", hệ thống tự động hoàn lại 1 bản sao về kho sách và trừ lượt mượn của độc giả.
                </p>
              </div>

              {/* Edit Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ghi Chú Phiếu Mượn
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về tình trạng tài liệu, lý do gia hạn..."
                  value={formEditLoanNotes}
                  onChange={(e) => setFormEditLoanNotes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-sky-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLoan(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5C: DELETE LOAN CONFIRMATION (XÓA PHIẾU MƯỢN) */}
      {loanToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center border border-rose-200 shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác Nhận Xóa Phiếu Mượn</h3>
                <p className="text-xs text-slate-500">Mã giao dịch: {loanToDelete.id}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div>
                <span className="text-slate-500">Độc giả:</span>{' '}
                <strong className="text-slate-900 font-semibold">{loanToDelete.patronName}</strong> (MSSV:{' '}
                {loanToDelete.patronStudentId || '2374820086'})
              </div>
              <div>
                <span className="text-slate-500">Sách mượn:</span>{' '}
                <strong className="text-slate-900 font-semibold">{loanToDelete.bookTitle}</strong>
              </div>
              <div>
                <span className="text-slate-500">Tình trạng:</span>{' '}
                <span className="font-mono">{loanToDelete.status}</span>
              </div>
            </div>

            {loanToDelete.status !== 'DaTra' ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 leading-relaxed space-y-1">
                <div className="font-semibold flex items-center gap-1 text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cơ chế bảo toàn tính toàn vẹn Bounded Context:</span>
                </div>
                <p>
                  Phiếu này hiện chưa trả sách. Khi xác nhận xóa, hệ thống sẽ tự động khôi phục <strong>+1 bản sao</strong> về kho Catalog và giảm <strong>-1 lượt mượn</strong> của độc giả để bảo vệ dữ liệu giữa các phân hệ.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Phiếu mượn này đã được hoàn tất trả sách. Thao tác xóa sẽ loại bỏ phiếu khỏi lịch sử lưu thông.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLoanToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteLoan}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors shadow-xs"
              >
                Xác nhận Xóa Phiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5D: VIEW LOAN DETAILS (PHIẾU MƯỢN CHÍNH THỨC - RECEIPT MODAL) */}
      {viewingLoanDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 my-8">
            {/* Header Receipt */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Chi Tiết Phiếu Mượn Tài Liệu
                  </h3>
                  <div className="text-xs font-mono text-slate-500">
                    Số phiếu: <strong className="text-slate-900">{viewingLoanDetails.id}</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingLoanDetails(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3.5 text-xs">
              {/* Book Info Card */}
              {(() => {
                const book = books.find((b) => b.id === viewingLoanDetails.bookId);
                return (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                    <div className="w-12 h-16 rounded overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                      {book?.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={viewingLoanDetails.bookTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-[10px] uppercase font-semibold text-slate-400">Tài liệu mượn:</div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{viewingLoanDetails.bookTitle}</h4>
                      <div className="text-slate-600 text-[11px]">{book?.author}</div>
                      <div className="text-slate-400 font-mono text-[10px]">
                        ISBN: {book?.isbn} · Kệ: {book?.locationShelf}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Patron Info Card */}
              {(() => {
                const patron = patrons.find((p) => p.id === viewingLoanDetails.patronId);
                return (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Thông tin độc giả:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Họ và tên:</span>{' '}
                        <strong className="text-slate-900">{viewingLoanDetails.patronName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Mã SV:</span>{' '}
                        <span className="font-mono font-medium text-slate-900">
                          {viewingLoanDetails.patronStudentId || patron?.studentId || '2374820086'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Email:</span>{' '}
                        <span className="font-mono text-slate-700 text-[11px] truncate block">
                          {patron?.email || `${viewingLoanDetails.patronStudentId || '2374820086'}@hpn.edu.vn`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Số điện thoại:</span>{' '}
                        <span className="font-mono text-slate-700 text-[11px]">
                          {patron?.phone || '0912 345 678'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Progress & Due Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400">Ngày xuất mượn:</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{viewingLoanDetails.borrowDate}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400">Hạn hoàn trả:</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{viewingLoanDetails.dueDate}</div>
                </div>
              </div>

              {/* Status and fines */}
              <div className="p-3 rounded-lg border flex items-center justify-between bg-slate-50 border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500">Tình trạng phiếu:</div>
                  <div className="mt-0.5">
                    {viewingLoanDetails.status === 'DangMuon' && (
                      <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        Đang trong thời hạn mượn
                      </span>
                    )}
                    {viewingLoanDetails.status === 'QuaHan' && (
                      <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Quá hạn {viewingLoanDetails.overdueDays} ngày (Phạt {(viewingLoanDetails.overdueDays * 5000).toLocaleString('vi-VN')} đ)
                      </span>
                    )}
                    {viewingLoanDetails.status === 'DaTra' && (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Đã trả sách vào {viewingLoanDetails.returnDate}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">Số lần gia hạn:</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {viewingLoanDetails.renewalCount || 0} lần
                  </div>
                </div>
              </div>

              {viewingLoanDetails.notes && (
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Ghi chú: </span>
                  {viewingLoanDetails.notes}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                {viewingLoanDetails.status !== 'DaTra' && (
                  <button
                    onClick={() => {
                      handleRenewLoan(viewingLoanDetails.id, 7);
                      setViewingLoanDetails(null);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors border border-sky-200"
                  >
                    Gia hạn +7 ngày
                  </button>
                )}

                <button
                  onClick={() => {
                    const l = viewingLoanDetails;
                    setViewingLoanDetails(null);
                    handleOpenEditLoanModal(l);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Chỉnh sửa
                </button>
              </div>

              <div className="flex items-center gap-2">
                {viewingLoanDetails.status !== 'DaTra' && (
                  <button
                    onClick={() => {
                      handleReturnBook(viewingLoanDetails.id);
                      setViewingLoanDetails(null);
                    }}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    Trả Sách
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setViewingLoanDetails(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD PATRON MODAL */}
      {showAddPatronModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Đăng Ký Độc Giả Mới (Patron Module)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tạo thẻ thư viện và phát sự kiện PatronRegisteredEvent
                </p>
              </div>
              <button
                onClick={() => setShowAddPatronModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewPatron} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã SV / CB *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 2374820086"
                    value={formPatronStudentId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormPatronStudentId(val);
                      if (val.trim()) {
                        setFormPatronEmail(`${val.trim()}@hpn.edu.vn`);
                      }
                    }}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono"
                  />
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Định dạng: 2374820xxx (Tự đồng bộ sang email @hpn.edu.vn)
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Lê Thị Hồng Ngọc"
                    value={formPatronFullName}
                    onChange={(e) => setFormPatronFullName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đối tượng độc giả</label>
                  <select
                    value={formPatronRole}
                    onChange={(e) => {
                      const newRole = e.target.value as Patron['role'];
                      setFormPatronRole(newRole);
                      if (newRole === 'GiangVien') setFormPatronBorrowLimit(10);
                      else if (newRole === 'HocVienCaoHoc') setFormPatronBorrowLimit(8);
                      else setFormPatronBorrowLimit(5);
                    }}
                    className="w-full p-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="SinhVien">Sinh Viên (Hạn mức 5 cuốn)</option>
                    <option value="HocVienCaoHoc">Học Viên Cao Học (Hạn mức 8 cuốn)</option>
                    <option value="GiangVien">Giảng Viên (Hạn mức 10 cuốn)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hạn mức mượn tối đa</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formPatronBorrowLimit}
                    onChange={(e) => setFormPatronBorrowLimit(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khoa / Viện / Bộ môn</label>
                <input
                  type="text"
                  placeholder="VD: Khoa Công nghệ Phần mềm"
                  value={formPatronDepartment}
                  onChange={(e) => setFormPatronDepartment(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Địa chỉ Email *</label>
                  <input
                    type="email"
                    required
                    value={formPatronEmail}
                    onChange={(e) => setFormPatronEmail(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={formPatronPhone}
                    onChange={(e) => setFormPatronPhone(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trạng thái thẻ ban đầu</label>
                <select
                  value={formPatronStatus}
                  onChange={(e) => setFormPatronStatus(e.target.value as Patron['status'])}
                  className="w-full p-2 border border-slate-200 rounded-md bg-white"
                >
                  <option value="HoatDong">Đang hoạt động (Bình thường)</option>
                  <option value="KhoaThe">Tạm khóa thẻ</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-600">
                <strong>Domain Event:</strong> Khi bấm lưu, <code>PatronRegisteredEvent</code> sẽ được phát ra In-Process Event Bus để NotificationModule chuẩn bị email kích hoạt tài khoản.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPatronModal(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
                >
                  Lưu Độc Giả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: EDIT PATRON MODAL */}
      {editingPatron && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cập Nhật Thông Tin Độc Giả
                </h3>
                <p className="text-[11px] text-slate-500">Mã độc giả: {editingPatron.id}</p>
              </div>
              <button
                onClick={() => setEditingPatron(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPatron} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã SV / CB *</label>
                  <input
                    type="text"
                    required
                    value={formPatronStudentId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormPatronStudentId(val);
                      if (val.trim()) {
                        setFormPatronEmail(`${val.trim()}@hpn.edu.vn`);
                      }
                    }}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono"
                  />
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Định dạng: 2374820xxx (Tự đồng bộ sang email @hpn.edu.vn)
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={formPatronFullName}
                    onChange={(e) => setFormPatronFullName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đối tượng</label>
                  <select
                    value={formPatronRole}
                    onChange={(e) => setFormPatronRole(e.target.value as Patron['role'])}
                    className="w-full p-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="SinhVien">Sinh Viên</option>
                    <option value="HocVienCaoHoc">Học Viên Cao Học</option>
                    <option value="GiangVien">Giảng Viên</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hạn mức mượn tối đa</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formPatronBorrowLimit}
                    onChange={(e) => setFormPatronBorrowLimit(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khoa / Viện / Bộ môn</label>
                <input
                  type="text"
                  value={formPatronDepartment}
                  onChange={(e) => setFormPatronDepartment(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email liên hệ</label>
                  <input
                    type="email"
                    required
                    value={formPatronEmail}
                    onChange={(e) => setFormPatronEmail(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    required
                    value={formPatronPhone}
                    onChange={(e) => setFormPatronPhone(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-md font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trạng thái thẻ thư viện</label>
                <select
                  value={formPatronStatus}
                  onChange={(e) => setFormPatronStatus(e.target.value as Patron['status'])}
                  className="w-full p-2 border border-slate-200 rounded-md bg-white"
                >
                  <option value="HoatDong">Đang hoạt động (Bình thường)</option>
                  <option value="KhoaThe">Tạm khóa thẻ</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPatron(null)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
                >
                  Cập nhật Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: VIEW PATRON DETAILS */}
      {viewingPatronDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${
                    viewingPatronDetails.avatarColor || 'bg-sky-600'
                  } text-white font-bold flex items-center justify-center text-sm shadow-xs`}
                >
                  {viewingPatronDetails.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(-2)
                    .join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {viewingPatronDetails.fullName}
                  </h3>
                  <div className="text-xs font-mono text-slate-500">
                    {viewingPatronDetails.studentId} ·{' '}
                    {viewingPatronDetails.role === 'GiangVien'
                      ? 'Giảng Viên'
                      : viewingPatronDetails.role === 'HocVienCaoHoc'
                      ? 'Học Viên Cao Học'
                      : 'Sinh Viên'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingPatronDetails(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {/* Patron Profile Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                <div className="text-slate-400">Khoa / Viện:</div>
                <div className="font-semibold text-slate-800">
                  {viewingPatronDetails.department || 'Khoa CNTT'}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                <div className="text-slate-400">Trạng thái thẻ:</div>
                <div className="font-semibold">
                  {viewingPatronDetails.status === 'HoatDong' ? (
                    <span className="text-emerald-600">Đang hoạt động</span>
                  ) : (
                    <span className="text-rose-600">Đang bị khóa thẻ</span>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                <div className="text-slate-400">Email:</div>
                <div className="font-mono text-slate-800 text-[11px] truncate">
                  {viewingPatronDetails.email}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                <div className="text-slate-400">Số điện thoại:</div>
                <div className="font-mono text-slate-800 text-[11px]">
                  {viewingPatronDetails.phone}
                </div>
              </div>
            </div>

            {/* Borrow Quota & Debt */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Hạn mức mượn tài liệu:</span>
                <span className="font-mono font-bold text-slate-900">
                  {viewingPatronDetails.currentBorrowCount} / {viewingPatronDetails.borrowLimit} cuốn
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Tiền phạt quá hạn nợ:</span>
                <span
                  className={`font-mono font-bold ${
                    viewingPatronDetails.debtFineAmount > 0 ? 'text-rose-600' : 'text-slate-700'
                  }`}
                >
                  {viewingPatronDetails.debtFineAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Currently Borrowed Books List */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-800">
                Tài liệu đang giữ (Circulation Module):
              </div>
              {loans.filter((l) => l.patronId === viewingPatronDetails.id && l.status !== 'DaTra')
                .length === 0 ? (
                <div className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded">
                  Độc giả hiện không mượn tài liệu nào.
                </div>
              ) : (
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {loans
                    .filter((l) => l.patronId === viewingPatronDetails.id && l.status !== 'DaTra')
                    .map((l) => (
                      <div
                        key={l.id}
                        className="p-2 bg-slate-50 border border-slate-200 rounded text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{l.bookTitle}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Mượn: {l.borrowDate} · Hạn trả: {l.dueDate}
                          </div>
                        </div>
                        {l.status === 'QuaHan' && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            Trễ {l.overdueDays} ngày
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setViewingPatronDetails(null);
                  handleOpenEditPatronModal(viewingPatronDetails);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                Chỉnh sửa
              </button>

              <button
                type="button"
                onClick={() => {
                  setNewLoanPatronId(viewingPatronDetails.id);
                  setViewingPatronDetails(null);
                  setShowNewLoanModal(true);
                }}
                disabled={
                  viewingPatronDetails.status === 'KhoaThe' ||
                  viewingPatronDetails.currentBorrowCount >= viewingPatronDetails.borrowLimit
                }
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md disabled:bg-slate-300"
              >
                Tạo lượt mượn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: DELETE PATRON CONFIRMATION */}
      {patronToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác Nhận Xóa Độc Giả</h3>
                <p className="text-xs text-slate-500">Mã độc giả: {patronToDelete.studentId}</p>
              </div>
            </div>

            {patronDeleteWarning ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 leading-relaxed">
                {patronDeleteWarning}
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn xóa hồ sơ độc giả{' '}
                <strong className="text-slate-900 font-semibold">"{patronToDelete.fullName}"</strong>{' '}
                (Mã: {patronToDelete.studentId}) không? Thao tác này sẽ xóa hồ sơ khỏi PatronModule.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setPatronToDelete(null);
                  setPatronDeleteWarning(null);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePatron}
                disabled={Boolean(
                  loans.some((l) => l.patronId === patronToDelete.id && l.status !== 'DaTra')
                )}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
