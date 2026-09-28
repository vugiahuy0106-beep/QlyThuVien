export interface CodeSnippetItem {
  id: string;
  title: string;
  category: 'Structure' | 'Contract' | 'EventBus' | 'ArchUnitEnforcement' | 'AntiPattern';
  fileName: string;
  language: 'typescript' | 'java' | 'csharp';
  traditionalCode: string;
  modularCode: string;
  explanation: string;
  keyPrinciple: string;
}

export const CODE_SAMPLES: CodeSnippetItem[] = [
  {
    id: 'sample-project-structure',
    title: 'Cấu trúc Thư mục: Horizontal Layering vs Vertical Slice (Module)',
    category: 'Structure',
    fileName: 'Project Structure Tree',
    language: 'typescript',
    traditionalCode: `// ❌ MONOLITH TRUYỀN THỐNG (Layered "Spaghetti" Architecture)
// Tất cả thực thể và nghiệp vụ bị gom theo tầng ngang (Horizontal Layering)
// Bất kỳ Controller nào cũng có thể gọi bừa bãi mọi Service & Repository!

src/
├── controllers/
│   ├── BookController.ts
│   ├── UserController.ts
│   ├── LoanController.ts
│   └── FineController.ts
├── services/
│   ├── BookService.ts
│   ├── UserService.ts
│   ├── LoanService.ts       // Chứa hơn 1200 dòng, gọi chéo 5 service khác!
│   └── EmailService.ts
├── repositories/
│   ├── BookRepository.ts
│   ├── UserRepository.ts
│   └── LoanRepository.ts
└── models/
    ├── Book.ts              // Chứa 30 quan hệ @OneToMany, @ManyToMany
    ├── User.ts
    └── Loan.ts`,
    modularCode: `// ✅ MODULAR MONOLITH (Vertical Slice Architecture + Domain-Driven Design)
// Mỗi Module là một "Bounded Context" độc lập, có ranh giới rõ ràng.
// Chỉ thư mục "public" được export ra ngoài. Thư mục "internal" bị bao đóng!

src/
├── core/
│   ├── event-bus/           // In-Process Domain Event Bus
│   │   ├── IEventBus.ts
│   │   └── InMemoryEventBus.ts
│   └── architecture-rules/  // Kiểm tra ranh giới qua ArchUnit / ESLint
├── modules/
│   ├── catalog/             // Bounded Context: Quản lý Sách
│   │   ├── public/          // 👉 Chỉ các file này được module khác import
│   │   │   ├── ICatalogModule.ts
│   │   │   └── events/BookAddedEvent.ts
│   │   └── internal/        // 🔒 CẤM module ngoài import!
│   │       ├── domain/BookEntity.ts
│   │       ├── infrastructure/CatalogRepository.ts
│   │       └── application/CatalogServiceImpl.ts
│   ├── patron/              // Bounded Context: Độc giả & Giới hạn thẻ
│   │   ├── public/IPatronModule.ts
│   │   └── internal/
│   ├── circulation/         // Bounded Context: Mượn - Trả sách
│   │   ├── public/ICirculationModule.ts
│   │   └── internal/
│   ├── fine-billing/        // Bounded Context: Tiền phạt & Hóa đơn
│   │   ├── public/IFineModule.ts
│   │   └── internal/
│   └── notification/        // Bounded Context: Thông báo đa kênh
│       ├── public/INotificationModule.ts
│       └── internal/`,
    explanation: 'Monolith truyền thống tổ chức theo tầng ngang (layer-by-layer) khiến mọi thành phần phụ thuộc lẫn nhau tạo thành "Big Ball of Mud". Modular Monolith tổ chức theo Bounded Context thẳng đứng (Vertical Slice), che giấu thông tin nội bộ.',
    keyPrinciple: 'Information Hiding (David Parnas, 1972) & Bounded Contexts (Eric Evans, 2003)',
  },
  {
    id: 'sample-contract-call',
    title: 'Giao tiếp giữa các Module: Direct SQL Join vs Public Interface Contract',
    category: 'Contract',
    fileName: 'BorrowBookUseCase.ts',
    language: 'typescript',
    traditionalCode: `// ❌ MONOLITH TRUYỀN THỐNG: Truy vấn chéo CSDL & Gọi trực tiếp Service khác
export class LoanService {
  constructor(
    private readonly db: DatabaseConnection,
    private readonly emailService: EmailService
  ) {}

  async borrowBook(userId: string, bookId: string): Promise<LoanResult> {
    // ⚠️ NGUY HIỂM: Query JOIN 4 bảng không thuộc quyền sở hữu của Loan
    const query = \`
      SELECT u.*, b.*, COUNT(l.id) as active_loans
      FROM users u
      CROSS JOIN books b
      LEFT JOIN loans l ON l.user_id = u.id AND l.status = 'ACTIVE'
      WHERE u.id = ? AND b.id = ?
    \`;
    const [result] = await this.db.query(query, [userId, bookId]);

    // Trực tiếp can thiệp bảng sách của phòng thư viện
    await this.db.query("UPDATE books SET available_copies = available_copies - 1 WHERE id = ?", [bookId]);

    // Tạo bản ghi mượn
    const loan = await this.db.query("INSERT INTO loans ...", [...]);

    // ⚠️ NGUY HIỂM: Gửi email đồng bộ bên trong Transaction. Nếu SMTP đơ 10s, DB bị nghẽn!
    await this.emailService.sendLoanConfirmation(result.email, result.title);

    return { success: true };
  }
}`,
    modularCode: `// ✅ MODULAR MONOLITH: Tuân thủ Clean Architecture & Public Contract
export class BorrowBookCommandHandler {
  constructor(
    private readonly patronModule: IPatronModule,     // Chỉ phụ thuộc Interface công khai
    private readonly catalogModule: ICatalogModule,   // Không phụ thuộc implementation hay DB
    private readonly loanRepository: ILoanRepository, // Repository riêng của Circulation
    private readonly eventBus: IInProcessEventBus     // Event Bus trong bộ nhớ
  ) {}

  async handle(command: BorrowBookCommand): Promise<Result<LoanId>> {
    // 1. Kiểm tra điều kiện độc giả qua Public Contract
    const patronStatus = await this.patronModule.canBorrow(command.patronId);
    if (!patronStatus.allowed) {
      return Result.fail(patronStatus.reason);
    }

    // 2. Yêu cầu Catalog giữ bản sao (Encapsulated trong Catalog Module)
    const reservation = await this.catalogModule.reserveCopy(command.bookId);
    if (!reservation.success) {
      return Result.fail("Sách đã hết bản sao có sẵn");
    }

    // 3. Lưu bản ghi mượn trong schema riêng của Circulation
    const loan = Loan.create(command.patronId, command.bookId, Duration.ofDays(14));
    await this.loanRepository.save(loan);

    // 4. Phát Domain Event bất đồng bộ trong bộ nhớ (In-Process)
    // Circulation không quan tâm ai gửi mail, ai tính audit log!
    await this.eventBus.publish(
      new LoanCreatedDomainEvent(loan.id, command.patronId, command.bookId, loan.dueDate)
    );

    return Result.ok(loan.id);
  }
}`,
    explanation: 'Module Circulation chỉ tương tác với Patron và Catalog thông qua Interface trừu tượng. Dữ liệu bảng Books và Users không bị can thiệp trái phép. Nghiệp vụ gửi email được đẩy sang Event Bus, giải phóng transaction database ngay lập tức.',
    keyPrinciple: 'Dependency Inversion Principle (DIP) & Loose Coupling',
  },
  {
    id: 'sample-event-bus',
    title: 'Giao tiếp Bất đồng bộ In-Process: In-Memory Domain Event Bus',
    category: 'EventBus',
    fileName: 'LoanCreatedDomainEvent.ts',
    language: 'typescript',
    traditionalCode: `// ❌ MONOLITH TRUYỀN THỐNG: Khối mã nguồn phụ thuộc hình chuỗi (Cascading Chain)
async function onBookReturned(loanId: string) {
  // Hàm này phải biết tất cả mọi việc cần làm trên đời:
  await updateLoanStatus(loanId, 'RETURNED');
  await increaseBookStock(loanId);
  const fine = calculateFine(loanId);
  if (fine > 0) {
    await insertFineRecord(fine);
    await lockUserAccountIfThresholdExceeded(loanId);
  }
  await sendSmsNotification(loanId);
  await writeSecurityAuditLog(loanId);
  // Nếu có thêm yêu cầu: "Cộng điểm thưởng đọc sách", lại phải vào sửa hàm này!
}`,
    modularCode: `// ✅ MODULAR MONOLITH: Event-Driven Architecture bên trong cùng một tiến trình (In-Process)
// Định nghĩa Domain Event bất biến (Immutable)
export class LoanCreatedDomainEvent implements IDomainEvent {
  readonly eventName = "Circulation.LoanCreated";
  readonly occurredOn = new Date();

  constructor(
    public readonly loanId: string,
    public readonly patronId: string,
    public readonly bookId: string,
    public readonly dueDate: Date
  ) {}
}

// Module Notification độc lập đăng ký lắng nghe (Subscriber)
export class SendLoanNotificationSubscriber {
  constructor(private readonly emailSender: IEmailSender) {}

  @EventHandler(LoanCreatedDomainEvent)
  async handle(event: LoanCreatedDomainEvent): Promise<void> {
    // Chạy bất đồng bộ, độc lập với transaction của Circulation!
    await this.emailSender.send(event.patronId, "Mượn sách thành công", event.dueDate);
  }
}

// Module Audit độc lập đăng ký lắng nghe (Subscriber)
export class AuditLogSubscriber {
  @EventHandler(LoanCreatedDomainEvent)
  async handle(event: LoanCreatedDomainEvent): Promise<void> {
    await this.auditLogger.log(\`Thẻ \${event.patronId} mượn sách \${event.bookId}\`);
  }
}`,
    explanation: 'In-Process Event Bus mang lại ưu điểm của Event-Driven Architecture (phân tách trách nhiệm, dễ mở rộng tính năng mới mà không sửa mã cũ) mà KHÔNG cần cài đặt hệ thống phức tạp như Apache Kafka hay RabbitMQ!',
    keyPrinciple: 'Open-Closed Principle (OCP) & In-Process Event Sourcing',
  },
  {
    id: 'sample-archunit-rule',
    title: 'Thực thi Ranh giới Kiến trúc bằng Mã kiểm thử tự động (ArchUnit / ESLint)',
    category: 'ArchUnitEnforcement',
    fileName: 'ArchitectureBoundaryTest.ts',
    language: 'typescript',
    traditionalCode: `// ❌ MONOLITH TRUYỀN THỐNG: "Ranh giới bằng lời nói" (Verbal Architecture)
// Trưởng nhóm dặn: "Đừng import DAO trong Controller nhé!"
// Nhưng sau 6 tháng áp lực deadline dự án, lập trình viên mới vào:
// import { BookInternalEntity } from '../modules/catalog/internal/BookInternalEntity';
// import { queryDatabaseRaw } from '../core/db';
// => Hệ thống suy thoái thành đống bùn (Architectural Erosion / Drift) mà không ai hay biết!`,
    modularCode: `// ✅ MODULAR MONOLITH: Tự động hóa kiểm tra ranh giới trong CI/CD (ArchUnit / ESLint)
// Nếu bất kỳ ai vi phạm ranh giới module, Lệnh Build / Pull Request sẽ bị CHẶN NGAY LẬP TỨC!

import { defineRule, scanCodebase } from 'eslint-plugin-modular-boundaries';

export const modularArchitectureRule = defineRule({
  name: 'enforce-module-encapsulation',
  validate(context) {
    // Quy tắc 1: Không module nào được import thư mục "internal" của module khác
    if (
      context.importingFile.includes('/modules/circulation/') &&
      context.importedFile.includes('/modules/catalog/internal/')
    ) {
      context.reportError({
        message: 'VI PHẠM KIẾN TRÚC: CirculationModule không được truy cập catalog/internal! Hãy dùng ICatalogModule trong catalog/public.'
      });
    }

    // Quy tắc 2: Cấm chu kỳ phụ thuộc vòng (No Cyclic Dependencies)
    if (context.hasCircularDependency(['catalog', 'circulation', 'patron'])) {
      context.reportError({
        message: 'VI PHẠM: Phát hiện phụ thuộc vòng giữa các Module.'
      });
    }
  }
});`,
    explanation: 'Một kiến trúc tốt phải có cơ chế tự bảo vệ (Fitness Functions). Công cụ như ArchUnit (Java), NetArchTest (.NET) hoặc Dependency Cruiser / ESLint Boundaries (TypeScript) đảm bảo ranh giới Modular Monolith không bị phá vỡ theo thời gian.',
    keyPrinciple: 'Architectural Fitness Functions (Building Evolutionary Architectures)',
  },
];
