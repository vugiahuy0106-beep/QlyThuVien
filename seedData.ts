import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errors';

export const INITIAL_DEMO_BOOKS = [
  {
    code: 'BK-1001',
    isbn: '978-604-2-08532-1',
    title: 'Clean Architecture: Cấu trúc và Thiết kế Phần mềm',
    author: 'Robert C. Martin (Uncle Bob)',
    category: 'Kỹ thuật phần mềm',
    publisher: 'NXB Thông tin và Truyền thông',
    publishYear: 2021,
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'Kệ A1-T2',
    description: 'Nguyên tắc vàng về kiến trúc phần mềm, cấu trúc module, SOLID và ranh giới hệ thống.',
    coverUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1002',
    isbn: '978-604-58-9123-5',
    title: 'Thiết kế Vi dịch vụ (Building Microservices)',
    author: 'Sam Newman',
    category: 'Công nghệ thông tin',
    publisher: 'NXB Khoa học và Kỹ thuật',
    publishYear: 2022,
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'Kệ A1-T3',
    description: 'Cẩm nang toàn diện về phân tách hệ thống, Modular Monolith và Microservices thực chiến.',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1003',
    isbn: '978-604-77-5421-9',
    title: 'Nhà Giả Kim (The Alchemist)',
    author: 'Paulo Coelho',
    category: 'Văn học & Nghệ thuật',
    publisher: 'NXB Hội Nhà Văn',
    publishYear: 2020,
    totalCopies: 10,
    availableCopies: 8,
    shelfLocation: 'Kệ B2-T1',
    description: 'Cuốn tiểu thuyết kinh điển lay động hàng triệu trái tim về hành trình theo đuổi ước mơ.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1004',
    isbn: '978-604-1-17892-0',
    title: 'Kinh tế học Hài hước (Freakonomics)',
    author: 'Steven D. Levitt & Stephen J. Dubner',
    category: 'Kinh tế & Quản trị',
    publisher: 'NXB Trẻ',
    publishYear: 2019,
    totalCopies: 6,
    availableCopies: 5,
    shelfLocation: 'Kệ C1-T2',
    description: 'Khám phá thế giới qua lăng kính kinh tế học dữ liệu và hành vi xã hội đầy bất ngờ.',
    coverUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1005',
    isbn: '978-604-56-3214-7',
    title: 'Lược Sử Loài Người (Sapiens)',
    author: 'Yuval Noah Harari',
    category: 'Lịch sử & Triết học',
    publisher: 'NXB Tri Thức',
    publishYear: 2021,
    totalCopies: 8,
    availableCopies: 6,
    shelfLocation: 'Kệ D1-T1',
    description: 'Cuộc hành trình từ loài vượn không tên tuổi đến bá chủ Trái Đất của giống loài Sapiens.',
    coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1006',
    isbn: '978-604-89-6541-2',
    title: 'Refactoring: Cải tiến Thiết kế Mã nguồn Hiện có',
    author: 'Martin Fowler',
    category: 'Kỹ thuật phần mềm',
    publisher: 'NXB Bách Khoa Hà Nội',
    publishYear: 2023,
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'Kệ A2-T1',
    description: 'Kỹ thuật tái cấu trúc mã nguồn sạch, phát hiện code smells và kiểm thử hồi quy an toàn.',
    coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1007',
    isbn: '978-604-98-1122-3',
    title: 'Học máy Cơ bản (Machine Learning cơ bản)',
    author: 'Vũ Hữu Tiệp',
    category: 'Khoa học máy tính',
    publisher: 'NXB Đại học Quốc gia Hà Nội',
    publishYear: 2022,
    totalCopies: 5,
    availableCopies: 1,
    shelfLocation: 'Kệ A3-T2',
    description: 'Nền tảng toán học, giải thuật và ứng dụng học máy từ cơ bản đến nâng cao trong thực tế.',
    coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1008',
    isbn: '978-604-2-12498-8',
    title: 'Tư Duy Nhanh và Chậm (Thinking, Fast and Slow)',
    author: 'Daniel Kahneman',
    category: 'Kỹ năng sống & Phát triển',
    publisher: 'NXB Thế Giới',
    publishYear: 2020,
    totalCopies: 7,
    availableCopies: 5,
    shelfLocation: 'Kệ E1-T3',
    description: 'Hai hệ thống tư duy chi phối nhận thức và quyết định của con người trong kinh tế xã hội.',
    coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1009',
    isbn: '978-604-80-2211-9',
    title: 'Design Patterns: Mẫu Thiết Kế Hướng Đối Tượng',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides (GoF)',
    category: 'Kỹ thuật phần mềm',
    publisher: 'NXB Bách Khoa Hà Nội',
    publishYear: 2022,
    totalCopies: 6,
    availableCopies: 4,
    shelfLocation: 'Kệ A2-T2',
    description: '23 mẫu thiết kế kinh điển giúp xây dựng phần mềm linh hoạt, dễ bảo trì và có tính tái sử dụng cao.',
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b29?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1010',
    isbn: '978-604-56-7890-1',
    title: 'Đắc Nhân Tâm (How to Win Friends and Influence People)',
    author: 'Dale Carnegie',
    category: 'Kỹ năng sống & Phát triển',
    publisher: 'NXB Trẻ',
    publishYear: 2021,
    totalCopies: 12,
    availableCopies: 9,
    shelfLocation: 'Kệ E1-T1',
    description: 'Nghệ thuật đối nhân xử thế, giao tiếp và kết nối bền vững giữa người với người.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1011',
    isbn: '978-604-1-09876-2',
    title: 'Cấu Trúc Dữ Liệu và Giải Thuật (Data Structures & Algorithms)',
    author: 'Robert Sedgewick & Kevin Wayne',
    category: 'Khoa học máy tính',
    publisher: 'NXB Giáo Dục Việt Nam',
    publishYear: 2023,
    totalCopies: 8,
    availableCopies: 6,
    shelfLocation: 'Kệ A1-T1',
    description: 'Toàn tập về cấu trúc cây, đồ thị, tìm kiếm, sắp xếp và phân tích độ phức tạp thuật toán.',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1012',
    isbn: '978-604-58-4567-8',
    title: 'Khởi Nghiệp Tinh Gọn (The Lean Startup)',
    author: 'Eric Ries',
    category: 'Kinh tế & Quản trị',
    publisher: 'NXB Lao Động',
    publishYear: 2020,
    totalCopies: 5,
    availableCopies: 4,
    shelfLocation: 'Kệ C1-T1',
    description: 'Phương pháp xây dựng mô hình kinh doanh đổi mới sáng tạo, phát triển sản phẩm lặp nhanh.',
    coverUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1013',
    isbn: '978-604-77-3344-5',
    title: 'Trí Tuệ Nhân Tạo: Tiếp Cận Hiện Đại (AI: A Modern Approach)',
    author: 'Stuart Russell & Peter Norvig',
    category: 'Khoa học máy tính',
    publisher: 'NXB Khoa học Tự nhiên và Công nghệ',
    publishYear: 2023,
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'Kệ A3-T1',
    description: 'Giáo trình chuẩn mực toàn cầu về tác tử thông minh, logic suy diễn, học tăng cường và mạng nơ-ron.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  },
  {
    code: 'BK-1014',
    isbn: '978-604-89-9988-1',
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ (The Universe in a Nutshell)',
    author: 'Stephen Hawking',
    category: 'Lịch sử & Triết học',
    publisher: 'NXB Trẻ',
    publishYear: 2021,
    totalCopies: 6,
    availableCopies: 5,
    shelfLocation: 'Kệ D2-T1',
    description: 'Bức tranh sống động về thuyết tương đối, lỗ đen, cơ học lượng tử và thời gian đa chiều.',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_DEMO_READERS = [
  {
    readerCode: 'DG-2001',
    fullName: 'Vũ Gia Huy',
    email: 'huy.vu@example.com',
    phone: '0912345678',
    address: '280 An Dương Vương, Q.5, TP.HCM',
    status: 'active' as const,
    registeredAt: '2026-01-15',
    notes: 'Học giả / Sinh viên Khoa CNTT - Nghiên cứu hệ thống phân tán',
  },
  {
    readerCode: 'DG-2002',
    fullName: 'Trần Thị Mai',
    email: 'mai.tran@example.com',
    phone: '0987654321',
    address: '12 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
    status: 'active' as const,
    registeredAt: '2026-02-10',
    notes: 'Học viên Cao học Kỹ thuật Phần mềm',
  },
  {
    readerCode: 'DG-2003',
    fullName: 'Lê Hoàng Minh',
    email: 'minh.le@example.com',
    phone: '0903112233',
    address: '45 Lê Duẩn, Q. Hải Châu, Đà Nẵng',
    status: 'active' as const,
    registeredAt: '2026-03-01',
    notes: 'Thành viên CLB Lập trình viên',
  },
  {
    readerCode: 'DG-2004',
    fullName: 'Phạm Thu Hương',
    email: 'huong.pham@example.com',
    phone: '0934556677',
    address: '18 Cầu Giấy, Q. Cầu Giấy, Hà Nội',
    status: 'locked' as const,
    registeredAt: '2025-11-20',
    notes: 'Thẻ tạm khóa do mượn sách quá hạn kỳ trước',
  },
  {
    readerCode: 'DG-2005',
    fullName: 'Võ Minh Quân',
    email: 'quan.vo@example.com',
    phone: '0978990011',
    address: '102 Hai Bà Trưng, Q.3, TP.HCM',
    status: 'active' as const,
    registeredAt: '2026-03-20',
    notes: 'Độc giả thân thiết, mượn sách chuyên khảo thường xuyên',
  },
];

export async function seedDemoData(): Promise<{ booksCount: number; readersCount: number; loansCount: number }> {
  try {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // 1. Seed Books (14 books with full cover URLs and shelf locations)
    const createdBookIds: { id: string; data: (typeof INITIAL_DEMO_BOOKS)[0] }[] = [];
    for (const b of INITIAL_DEMO_BOOKS) {
      const bRef = doc(collection(db, 'books'));
      batch.set(bRef, {
        ...b,
        createdAt: now,
        updatedAt: now,
      });
      createdBookIds.push({ id: bRef.id, data: b });
    }

    // 2. Seed Readers (5 readers)
    const createdReaderIds: { id: string; data: (typeof INITIAL_DEMO_READERS)[0] }[] = [];
    for (const r of INITIAL_DEMO_READERS) {
      const rRef = doc(collection(db, 'readers'));
      batch.set(rRef, {
        ...r,
        createdAt: now,
        updatedAt: now,
      });
      createdReaderIds.push({ id: rRef.id, data: r });
    }

    // 3. Seed Realistic Loans (Active, Returned, Overdue)
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Helpers to create relative dates
    const daysAgo = (days: number) => {
      const d = new Date(today);
      d.setDate(today.getDate() - days);
      return formatDate(d);
    };
    const daysFromNow = (days: number) => {
      const d = new Date(today);
      d.setDate(today.getDate() + days);
      return formatDate(d);
    };

    // Loan 1: OVERDUE (Borrowed 25 days ago, due 11 days ago)
    const loan1Ref = doc(collection(db, 'loans'));
    batch.set(loan1Ref, {
      loanCode: 'PM-2026-1011',
      readerId: createdReaderIds[0].id,
      readerName: createdReaderIds[0].data.fullName,
      readerCode: createdReaderIds[0].data.readerCode,
      bookId: createdBookIds[0].id,
      bookTitle: createdBookIds[0].data.title,
      bookCode: createdBookIds[0].data.code,
      borrowDate: daysAgo(25),
      dueDate: daysAgo(11),
      returnDate: null,
      status: 'overdue',
      notes: 'Đã gửi email nhắc nhở trả sách quá hạn lần 1',
      createdBy: 'system',
      createdAt: now,
      updatedAt: now,
    });

    // Loan 2: ACTIVE (Borrowed 5 days ago, due in 9 days)
    const loan2Ref = doc(collection(db, 'loans'));
    batch.set(loan2Ref, {
      loanCode: 'PM-2026-1012',
      readerId: createdReaderIds[1].id,
      readerName: createdReaderIds[1].data.fullName,
      readerCode: createdReaderIds[1].data.readerCode,
      bookId: createdBookIds[1].id,
      bookTitle: createdBookIds[1].data.title,
      bookCode: createdBookIds[1].data.code,
      borrowDate: daysAgo(5),
      dueDate: daysFromNow(9),
      returnDate: null,
      status: 'active',
      notes: 'Mượn phục vụ đề tài nghiên cứu kiến trúc Microservices',
      createdBy: 'system',
      createdAt: now,
      updatedAt: now,
    });

    // Loan 3: RETURNED (Borrowed 40 days ago, returned 20 days ago)
    const loan3Ref = doc(collection(db, 'loans'));
    batch.set(loan3Ref, {
      loanCode: 'PM-2026-1013',
      readerId: createdReaderIds[2].id,
      readerName: createdReaderIds[2].data.fullName,
      readerCode: createdReaderIds[2].data.readerCode,
      bookId: createdBookIds[2].id,
      bookTitle: createdBookIds[2].data.title,
      bookCode: createdBookIds[2].data.code,
      borrowDate: daysAgo(40),
      dueDate: daysAgo(20),
      returnDate: daysAgo(20),
      status: 'returned',
      notes: 'Đã hoàn trả sách nguyên vẹn, đúng thời hạn',
      createdBy: 'system',
      createdAt: now,
      updatedAt: now,
    });

    // Loan 4: ACTIVE (Borrowed 3 days ago, due in 11 days)
    const loan4Ref = doc(collection(db, 'loans'));
    batch.set(loan4Ref, {
      loanCode: 'PM-2026-1014',
      readerId: createdReaderIds[4].id,
      readerName: createdReaderIds[4].data.fullName,
      readerCode: createdReaderIds[4].data.readerCode,
      bookId: createdBookIds[5].id,
      bookTitle: createdBookIds[5].data.title,
      bookCode: createdBookIds[5].data.code,
      borrowDate: daysAgo(3),
      dueDate: daysFromNow(11),
      returnDate: null,
      status: 'active',
      notes: 'Mượn ôn tập kỹ thuật tái cấu trúc mã nguồn',
      createdBy: 'system',
      createdAt: now,
      updatedAt: now,
    });

    // Loan 5: RETURNED (Borrowed 30 days ago, returned 10 days ago)
    const loan5Ref = doc(collection(db, 'loans'));
    batch.set(loan5Ref, {
      loanCode: 'PM-2026-1015',
      readerId: createdReaderIds[0].id,
      readerName: createdReaderIds[0].data.fullName,
      readerCode: createdReaderIds[0].data.readerCode,
      bookId: createdBookIds[3].id,
      bookTitle: createdBookIds[3].data.title,
      bookCode: createdBookIds[3].data.code,
      borrowDate: daysAgo(30),
      dueDate: daysAgo(16),
      returnDate: daysAgo(10),
      status: 'returned',
      notes: 'Đã hoàn trả, trễ hạn 6 ngày (đã nộp phạt theo quy định)',
      createdBy: 'system',
      createdAt: now,
      updatedAt: now,
    });

    // Loan 6: OVERDUE (Borrowed 35 days ago, due 21 days ago)
    const loan6Ref = doc(collection(db, 'loans'));
    batch.set(loan6Ref, {
      loanCode: 'PM-2026-1016',
      readerId: createdReaderIds[3].id,
      readerName: createdReaderIds[3].data.fullName,
      readerCode: createdReaderIds[3].data.readerCode,
      bookId: createdBookIds[4].id,
      bookTitle: createdBookIds[4].data.title,
      bookCode: createdBookIds[4].data.code,
      borrowDate: daysAgo(35),
      dueDate: daysAgo(21),
      returnDate: null,
      status: 'overdue',
      notes: 'Quá hạn 21 ngày, thẻ thư viện tạm khóa',
      createdBy: 'system',
      createdAt: now,
      updatedAt: now,
    });

    // Loan 7: ACTIVE (Borrowed 1 day ago, due in 13 days)
    const loan7Ref = doc(collection(db, 'loans'));
    batch.set(loan7Ref, {
      loanCode: 'PM-2026-1017',
      readerId: createdReaderIds[2].id,
      readerName: createdReaderIds[2].data.fullName,
      readerCode: createdReaderIds[2].data.readerCode,
      bookId: createdBookIds[8].id,
      bookTitle: createdBookIds[8].data.title,
      bookCode: createdBookIds[8].data.code,
      borrowDate: daysAgo(1),
      dueDate: daysFromNow(13),
      returnDate: null,
      status: 'active',
      notes: 'Mượn nghiên cứu Design Patterns phục vụ đồ án kỳ này',
      createdBy: 'system',
      createdAt: now,
      updatedAt: now,
    });

    // Loan 8: RETURNED (Borrowed 18 days ago, returned 4 days ago)
    const loan8Ref = doc(collection(db, 'loans'));
    batch.set(loan8Ref, {
      loanCode: 'PM-2026-1018',
      readerId: createdReaderIds[1].id,
      readerName: createdReaderIds[1].data.fullName,
      readerCode: createdReaderIds[1].data.readerCode,
      bookId: createdBookIds[7].id,
      bookTitle: createdBookIds[7].data.title,
      bookCode: createdBookIds[7].data.code,
      borrowDate: daysAgo(18),
      dueDate: daysAgo(4),
      returnDate: daysAgo(4),
      status: 'returned',
      notes: 'Đã hoàn trả sách nguyên vẹn đúng hẹn',
      createdBy: 'system',
      createdAt: now,
      updatedAt: now,
    });

    await batch.commit();

    return {
      booksCount: createdBookIds.length,
      readersCount: createdReaderIds.length,
      loansCount: 8,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed_data');
    throw error;
  }
}
