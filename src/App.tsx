import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './core/context/ToastContext';
import { AuthProvider, useAuth } from './modules/auth/AuthContext';
import { ThemeProvider, useTheme } from './core/context/ThemeContext';
import { LoginForm } from './modules/auth/components/LoginForm';
import { Sidebar, NavTab } from './core/components/Sidebar';
import { Header } from './core/components/Header';
import { ThemeCustomizerModal } from './core/components/ThemeCustomizerModal';
import { AccountSettingsModal } from './core/components/AccountSettingsModal';
import { ChatbotWidget } from './core/components/ChatbotWidget';

// Books Module
import { Book, BookFormData } from './modules/books/types';
import { bookService } from './modules/books/bookService';
import { BookList } from './modules/books/components/BookList';
import { BookFormModal } from './modules/books/components/BookFormModal';

// Readers Module
import { Reader, ReaderFormData } from './modules/readers/types';
import { readerService } from './modules/readers/readerService';
import { ReaderList } from './modules/readers/components/ReaderList';
import { ReaderFormModal } from './modules/readers/components/ReaderFormModal';
import { StudentCardView } from './modules/readers/components/StudentCardView';

// Loans Module
import { Loan, CreateLoanDTO } from './modules/loans/types';
import { loanService } from './modules/loans/loanService';
import { LoanList } from './modules/loans/components/LoanList';
import { CreateLoanModal } from './modules/loans/components/CreateLoanModal';
import { StudentBorrowModal } from './modules/loans/components/StudentBorrowModal';
import { StudentMyLoans } from './modules/loans/components/StudentMyLoans';

// Dashboard & Reports Modules
import { DashboardOverview } from './modules/dashboard/components/DashboardOverview';
import { ReportsView } from './modules/reports/components/ReportsView';
import { HomePage } from './modules/home/components/HomePage';
import { seedDemoData } from './core/firebase/seedData';
import { Loader2 } from 'lucide-react';

function LibraryApp() {
  const {
    user,
    role,
    isLoading: isAuthLoading,
    isAccountSettingsOpen,
    setIsAccountSettingsOpen,
  } = useAuth();
  const {
    config,
    activeWallpaperUrl,
    activeGradientClass,
    activeSolidClass,
  } = useTheme();
  const { success, error } = useToast();

  const isStudent = role === 'student';
  const isGuest = role === 'guest';

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [bookSearchKeyword, setBookSearchKeyword] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Real-time Firestore State Collections
  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [editingReader, setEditingReader] = useState<Reader | null>(null);

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [preselectedBookForLoan, setPreselectedBookForLoan] = useState<Book | null>(null);
  const [preselectedReaderForLoan, setPreselectedReaderForLoan] = useState<Reader | null>(null);

  // Student borrow modal state
  const [studentBorrowBook, setStudentBorrowBook] = useState<Book | null>(null);

  // Strict role permission guard: redirect unauthorized tabs
  useEffect(() => {
    if (isStudent && (activeTab === 'dashboard' || activeTab === 'reports')) {
      setActiveTab('books');
    }
    if (isGuest && (activeTab === 'dashboard' || activeTab === 'reports' || activeTab === 'loans' || activeTab === 'readers')) {
      setActiveTab('books');
    }
  }, [isStudent, isGuest, activeTab]);



  // Subscribe to Firestore collections when user is authenticated
  useEffect(() => {
    if (!user) return;

    const unsubBooks = bookService.subscribeBooks(
      (data) => setBooks(data),
      (err) => console.error('Books listener error:', err)
    );

    const unsubReaders = readerService.subscribeReaders(
      (data) => setReaders(data),
      (err) => console.error('Readers listener error:', err)
    );

    const unsubLoans = loanService.subscribeLoans(
      (data) => setLoans(data),
      (err) => console.error('Loans listener error:', err)
    );

    return () => {
      unsubBooks();
      unsubReaders();
      unsubLoans();
    };
  }, [user]);

  // Silent auto-populate if Firestore collections are empty (no manual seed button needed)
  const hasAutoPopulatedRef = React.useRef(false);
  useEffect(() => {
    if (!user || hasAutoPopulatedRef.current) return;
    if (books.length === 0 && readers.length === 0) {
      const timer = setTimeout(async () => {
        if (books.length === 0 && !hasAutoPopulatedRef.current) {
          hasAutoPopulatedRef.current = true;
          try {
            await seedDemoData();
          } catch (e) {
            console.warn('Auto population skipped or already populated:', e);
          }
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, books.length, readers.length]);

  // Auto-migrate legacy student reader name in Firestore database if exists
  useEffect(() => {
    if (!user) return;
    const legacy = readers.find(
      (r) => (r.readerCode === 'DG-2001' || r.email === 'an.nguyen@example.com') && r.fullName.includes('Nguyễn Văn An')
    );
    if (legacy) {
      readerService.updateReader(legacy.id, {
        fullName: 'Vũ Gia Huy',
        email: 'huy.vu@example.com',
        notes: 'Học giả / Sinh viên Khoa CNTT - Nghiên cứu hệ thống phân tán',
      }).catch((e) => console.warn('Reader auto-update note:', e));
    }
  }, [user, readers]);

  // Find linked student reader from Firestore readers
  const currentStudentReader: Reader | null = React.useMemo(() => {
    if (!isStudent) return null;
    const targetCode = user?.studentReaderCode || 'DG-2001';
    const found = readers.find(
      (r) => r.readerCode === targetCode || r.email === user?.studentReaderEmail
    );
    if (found) {
      // If found still has legacy name, provide Vũ Gia Huy
      if (found.fullName === 'Nguyễn Văn An') {
        return {
          ...found,
          fullName: 'Vũ Gia Huy',
          email: 'huy.vu@example.com',
        };
      }
      return found;
    }

    // Fallback if demo data hasn't been seeded yet
    return {
      id: 'demo-student-id',
      readerCode: 'DG-2001',
      fullName: 'Vũ Gia Huy',
      email: 'huy.vu@example.com',
      phone: '0912345678',
      address: '280 An Dương Vương, Q.5, TP.HCM',
      status: 'active',
      registeredAt: '2026-01-15',
      notes: 'Học giả / Sinh viên Khoa CNTT - Nghiên cứu hệ thống phân tán',
    };
  }, [isStudent, readers, user]);

  // Filter loans for student
  const studentLoans = React.useMemo(() => {
    if (!isStudent) return [];
    const code = currentStudentReader?.readerCode || 'DG-2001';
    const readerId = currentStudentReader?.id;
    return loans.filter(
      (l) =>
        l.readerCode === code ||
        l.readerId === readerId ||
        l.readerName === 'Vũ Gia Huy' ||
        l.readerName === 'Nguyễn Văn An'
    );
  }, [isStudent, loans, currentStudentReader]);

  // Active unreturned loans count for current student
  const studentActiveLoans = React.useMemo(() => {
    return studentLoans.filter(
      (l) => l.status === 'active' || l.status === 'overdue' || (!l.returnDate && l.status !== 'returned')
    );
  }, [studentLoans]);
  const studentActiveLoansCount = studentActiveLoans.length;

  // Auth loading state
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-300">Đang khởi tạo LibModular...</p>
      </div>
    );
  }

  // If not logged in, show Login Form with background customizer and AI assistant
  if (!user) {
    return (
      <>
        <LoginForm />
        <ThemeCustomizerModal />
        <ChatbotWidget />
      </>
    );
  }

  // Book Handlers (Admin only)
  const handleOpenAddBook = () => {
    if (isStudent || isGuest) {
      error('Không có quyền', 'Chỉ tài khoản Quản trị viên mới có quyền thêm sách.');
      return;
    }
    setEditingBook(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book: Book) => {
    if (isStudent || isGuest) {
      error('Không có quyền', 'Chỉ tài khoản Quản trị viên mới có quyền sửa sách.');
      return;
    }
    setEditingBook(book);
    setIsBookModalOpen(true);
  };

  const handleBookSubmit = async (data: BookFormData) => {
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.id, data);
        success('Cập nhật thành công', `Đã lưu thông tin ấn phẩm "${data.title}" vào Firestore.`);
      } else {
        await bookService.addBook(data);
        success('Thêm sách thành công', `Đã lưu ấn phẩm "${data.title}" vào cơ sở dữ liệu.`);
      }
    } catch (err: any) {
      error('Lỗi lưu ấn phẩm', err.message);
      throw err;
    }
  };

  // Reader Handlers (Admin only)
  const handleOpenAddReader = () => {
    if (isStudent || isGuest) {
      error('Không có quyền', 'Chỉ tài khoản Quản trị viên mới có quyền cấp thẻ độc giả.');
      return;
    }
    setEditingReader(null);
    setIsReaderModalOpen(true);
  };

  const handleOpenEditReader = (reader: Reader) => {
    if (isStudent || isGuest) {
      error('Không có quyền', 'Chỉ tài khoản Quản trị viên mới có quyền sửa hồ sơ độc giả.');
      return;
    }
    setEditingReader(reader);
    setIsReaderModalOpen(true);
  };

  const handleReaderSubmit = async (data: ReaderFormData) => {
    try {
      if (editingReader) {
        await readerService.updateReader(editingReader.id, data);
        success('Cập nhật thành công', `Đã lưu hồ sơ độc giả "${data.fullName}" vào Firestore.`);
      } else {
        await readerService.addReader(data);
        success('Cấp thẻ thành công', `Đã thêm độc giả "${data.fullName}" vào danh sách.`);
      }
    } catch (err: any) {
      error('Lỗi lưu hồ sơ độc giả', err.message);
      throw err;
    }
  };

  // Loan Handlers (Admin only)
  const handleOpenCreateLoan = (preselectedBook?: Book, preselectedReader?: Reader) => {
    if (isStudent || isGuest) {
      error('Không có quyền', 'Bạn đọc vui lòng dùng nút "Mượn sách" để đăng ký mượn trực tuyến.');
      return;
    }
    setPreselectedBookForLoan(preselectedBook || null);
    setPreselectedReaderForLoan(preselectedReader || null);
    setIsLoanModalOpen(true);
  };

  const handleLoanSubmit = async (dto: CreateLoanDTO) => {
    try {
      await loanService.createLoan(dto, user.uid);
      success(
        'Lập phiếu mượn thành công!',
        'Đã phát hành phiếu mượn và tự động trừ số lượng sách khả dụng trong kho.'
      );
    } catch (err: any) {
      error('Không thể lập phiếu mượn', err.message);
      throw err;
    }
  };

  // Quick Borrow Book Handler
  const handleOpenStudentBorrow = (book: Book) => {
    if (isStudent && studentActiveLoansCount >= 3) {
      error(
        'Không thể mượn thêm sách',
        'Không thể mượn thêm vì đã đến giới hạn (tối đa 3 cuốn). Bạn hiện đang mượn 3 cuốn sách chưa hoàn trả. Vui lòng hoàn trả sách trước khi đăng ký mượn cuốn tiếp theo!'
      );
      return;
    }
    setStudentBorrowBook(book);
  };

  const handleStudentBorrowSubmit = async (dto: CreateLoanDTO) => {
    if (studentActiveLoansCount >= 3) {
      const msg = 'Không thể mượn thêm vì đã đến giới hạn: Bạn đã mượn tối đa 3 cuốn sách. Vui lòng hoàn trả sách trước khi mượn tiếp!';
      error('Đã đạt giới hạn mượn', msg);
      throw new Error(msg);
    }

    try {
      let activeReaderId = dto.readerId;
      if (activeReaderId === 'demo-student-id' && currentStudentReader) {
        const existing = readers.find((r) => r.readerCode === currentStudentReader.readerCode);
        if (existing) {
          activeReaderId = existing.id;
        } else {
          activeReaderId = await readerService.addReader({
            readerCode: currentStudentReader.readerCode,
            fullName: currentStudentReader.fullName,
            email: currentStudentReader.email,
            phone: currentStudentReader.phone,
            address: currentStudentReader.address,
            status: currentStudentReader.status,
            registeredAt: currentStudentReader.registeredAt,
            notes: currentStudentReader.notes,
          });
        }
      }

      await loanService.createLoan({ ...dto, readerId: activeReaderId }, user.uid);
      success(
        'Đăng ký mượn sách thành công!',
        `Bạn đã đăng ký mượn "${studentBorrowBook?.title}". Hãy đến quầy lưu thông để nhận sách.`
      );
    } catch (err: any) {
      let rawMsg = err.message || 'Lỗi khi mượn sách';
      try {
        if (rawMsg.startsWith('{')) {
          const parsed = JSON.parse(rawMsg);
          rawMsg = parsed.error || rawMsg;
        }
      } catch {}
      error('Không thể đăng ký mượn sách', rawMsg);
      throw new Error(rawMsg);
    }
  };

  // Header quick action dispatcher
  const handleHeaderQuickAction = (action: 'add_book' | 'add_reader' | 'create_loan') => {
    if (action === 'add_book') handleOpenAddBook();
    if (action === 'add_reader') handleOpenAddReader();
    if (action === 'create_loan') handleOpenCreateLoan();
  };

  const handleSeedData = async () => {
    try {
      const res = await seedDemoData();
      success(
        'Khôi phục dữ liệu thành công!',
        `Đã nạp lại ${res.booksCount} đầu sách, ${res.readersCount} hồ sơ độc giả và ${res.loansCount} phiếu mượn trả.`
      );
    } catch (e: any) {
      error('Lỗi nạp dữ liệu', e.message || 'Không thể nạp dữ liệu mẫu');
    }
  };

  // Overdue count for badge
  const overdueCount = isStudent
    ? studentLoans.filter((l) => l.status === 'overdue').length
    : loans.filter((l) => l.status === 'overdue').length;

  return (
    <div className={`min-h-screen relative flex flex-col font-sans antialiased transition-colors duration-300 text-slate-900 dark:text-slate-100 ${
      !config.isDark && config.bgMode === 'solid' ? 'bg-slate-50' : 'bg-slate-950'
    }`}>
      {/* 1. DYNAMIC RICH BACKGROUND LAYER */}
      {(config.bgMode === 'image' || config.bgMode === 'custom') && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none"
          style={{
            backgroundImage: `url('${activeWallpaperUrl}')`,
            filter: `blur(${config.blurPx}px)`,
            transform: 'scale(1.04)',
          }}
        />
      )}

      {config.bgMode === 'gradient' && (
        <div
          className={`fixed inset-0 z-0 transition-all duration-700 pointer-events-none ${activeGradientClass}`}
        />
      )}

      {config.bgMode === 'solid' && (
        <div
          className={`fixed inset-0 z-0 transition-all duration-500 pointer-events-none ${activeSolidClass}`}
        />
      )}

      {/* 2. OVERLAY TINT FOR CONTENT READABILITY */}
      <div
        className="fixed inset-0 z-0 transition-all duration-500 pointer-events-none"
        style={{
          backgroundColor: config.isDark ? '#020617' : '#f8fafc',
          opacity: config.bgMode === 'solid' ? 0.0 : (config.isDark ? config.overlayOpacity : Math.min(config.overlayOpacity, 0.45)),
        }}
      />

      {/* 3. APPLICATION CONTENT LAYER */}
      <div className="relative z-10 flex flex-1 min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          overdueCount={overdueCount}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sticky Header */}
          <Header
            activeTab={activeTab}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onQuickAction={handleHeaderQuickAction}
          />

          {/* Viewport Content */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {/* Home Tab (Available for all roles) */}
            {activeTab === 'home' && (
              <HomePage
                books={books}
                readers={readers}
                loans={loans}
                onNavigateTab={setActiveTab}
                onSearchBook={(kw) => setBookSearchKeyword(kw)}
                onOpenBorrowModal={handleOpenStudentBorrow}
                onOpenAddBook={handleOpenAddBook}
                onOpenCreateLoan={() => handleOpenCreateLoan()}
              />
            )}

            {/* Dashboard Tab (Admin only) */}
            {!isStudent && !isGuest && activeTab === 'dashboard' && (
              <DashboardOverview
                books={books}
                readers={readers}
                loans={loans}
                onNavigateTab={setActiveTab}
                onOpenCreateLoan={() => handleOpenCreateLoan()}
                onOpenAddBook={handleOpenAddBook}
                onOpenAddReader={handleOpenAddReader}
              />
            )}

            {/* Books Tab (userRole controls CRUD vs borrow buttons) */}
            {activeTab === 'books' && (
              <BookList
                books={books}
                loans={loans}
                userRole={role}
                initialSearch={bookSearchKeyword}
                onOpenAddModal={handleOpenAddBook}
                onOpenEditModal={handleOpenEditBook}
                onOpenBorrowModal={handleOpenStudentBorrow}
              />
            )}

            {/* Readers Tab */}
            {activeTab === 'readers' &&
              (isStudent ? (
                <StudentCardView
                  studentReader={currentStudentReader}
                  loans={studentLoans}
                  onBrowseBooks={() => setActiveTab('books')}
                />
              ) : !isGuest ? (
                <ReaderList
                  readers={readers}
                  loans={loans}
                  onOpenAddModal={handleOpenAddReader}
                  onOpenEditModal={handleOpenEditReader}
                />
              ) : null)}

            {/* Loans Tab */}
            {activeTab === 'loans' &&
              (isStudent ? (
                <StudentMyLoans
                  loans={studentLoans}
                  studentReader={currentStudentReader}
                  onBrowseBooks={() => setActiveTab('books')}
                />
              ) : !isGuest ? (
                <LoanList loans={loans} onOpenCreateModal={() => handleOpenCreateLoan()} />
              ) : null)}

            {/* Reports Tab (Admin only) */}
            {!isStudent && !isGuest && activeTab === 'reports' && (
              <ReportsView books={books} readers={readers} loans={loans} />
            )}
          </main>
        </div>
      </div>

      {/* Admin: Book Add/Edit Modal */}
      {!isStudent && !isGuest && (
        <BookFormModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          onSubmit={handleBookSubmit}
          initialData={editingBook}
        />
      )}

      {/* Admin: Reader Add/Edit Modal */}
      {!isStudent && !isGuest && (
        <ReaderFormModal
          isOpen={isReaderModalOpen}
          onClose={() => setIsReaderModalOpen(false)}
          onSubmit={handleReaderSubmit}
          initialData={editingReader}
        />
      )}

      {/* Admin: Create Loan Slip Modal */}
      {!isStudent && !isGuest && (
        <CreateLoanModal
          isOpen={isLoanModalOpen}
          onClose={() => setIsLoanModalOpen(false)}
          books={books}
          readers={readers}
          loans={loans}
          onSubmit={handleLoanSubmit}
          preselectedBook={preselectedBookForLoan}
          preselectedReader={preselectedReaderForLoan}
        />
      )}

      {/* Student: Online Book Checkout Modal */}
      {isStudent && (
        <StudentBorrowModal
          isOpen={!!studentBorrowBook}
          onClose={() => setStudentBorrowBook(null)}
          book={studentBorrowBook}
          studentReader={currentStudentReader}
          activeLoansCount={studentActiveLoansCount}
          onSubmit={handleStudentBorrowSubmit}
        />
      )}

      {/* Account Settings Modal (Profile, Avatar, Password) */}
      <AccountSettingsModal
        isOpen={isAccountSettingsOpen}
        onClose={() => setIsAccountSettingsOpen(false)}
        readers={readers}
      />

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal />

      {/* Interactive AI Chatbot Assistant */}
      <ChatbotWidget />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider>
          <LibraryApp />
        </ThemeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
