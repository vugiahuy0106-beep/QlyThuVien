export interface DefenseQuestion {
  id: string;
  question: string;
  category: 'LyThuyet' | 'ThietKe' | 'HieuNang' | 'TrienKhai';
  difficulty: 'CoBan' | 'NangCao' | 'ChuyenSau';
  lecturerPerspective: string;
  modelAnswer: string;
  keyTerminology: string[];
}

export interface ArchitectureComparisonMetric {
  criterion: string;
  traditionalMonolith: {
    score: number; // 1 - 5
    description: string;
    verdict: 'Kem' | 'TrungBinh' | 'Tot';
  };
  modularMonolith: {
    score: number;
    description: string;
    verdict: 'Kem' | 'TrungBinh' | 'Tot';
  };
  microservices: {
    score: number;
    description: string;
    verdict: 'Kem' | 'TrungBinh' | 'Tot';
  };
  note: string;
}

export const ARCHITECTURE_METRICS: ArchitectureComparisonMetric[] = [
  {
    criterion: 'Chi phí Hạ tầng & Vận hành (DevOps / Cloud Cost)',
    traditionalMonolith: {
      score: 5,
      description: 'Chỉ cần 1 máy chủ ảo (VPS/Container) và 1 instance CSDL duy nhất. Rất rẻ.',
      verdict: 'Tot',
    },
    modularMonolith: {
      score: 5,
      description: 'Cùng chung 1 artifact triển khai và 1 connection pool CSDL. Chi phí cực thấp.',
      verdict: 'Tot',
    },
    microservices: {
      score: 1,
      description: 'Cần cụm Kubernetes, Service Mesh, Kafka, API Gateway, Grafana/Jaeger. Chi phí đắt gấp 5-10 lần.',
      verdict: 'Kem',
    },
    note: 'Modular Monolith tiết kiệm hàng nghìn USD hạ tầng cloud mỗi tháng cho doanh nghiệp vừa và nhỏ.',
  },
  {
    criterion: 'Tính Bao đóng & Bảo vệ Ranh giới Nghiệp vụ (Encapsulation)',
    traditionalMonolith: {
      score: 1,
      description: 'Hầu như không có ranh giới. Sau 1 năm trở thành đống bùn (Big Ball of Mud), query chéo tự do.',
      verdict: 'Kem',
    },
    modularMonolith: {
      score: 5,
      description: 'Tuân thủ Bounded Context (DDD). Internal package bị ẩn; kiểm soát ranh giới bằng ArchUnit/CI.',
      verdict: 'Tot',
    },
    microservices: {
      score: 5,
      description: 'Ranh giới vật lý tuyệt đối qua mạng (Network Boundary, riêng biệt CSDL).',
      verdict: 'Tot',
    },
    note: 'Modular Monolith cung cấp sự cô lập nghiệp vụ tương đương Microservices nhưng chạy trong cùng một tiến trình (In-Process).',
  },
  {
    criterion: 'Độ trễ Giao tiếp (Latency & Performance)',
    traditionalMonolith: {
      score: 5,
      description: 'Gọi hàm trực tiếp trong bộ nhớ (In-memory method call, nanoseconds).',
      verdict: 'Tot',
    },
    modularMonolith: {
      score: 5,
      description: 'Gọi In-memory Interface và In-Process Event Bus (<1ms). Không có overhead mạng.',
      verdict: 'Tot',
    },
    microservices: {
      score: 2,
      description: 'Gọi qua HTTP/REST hoặc gRPC, serialization JSON/Protobuf, network hop (10ms - 80ms/request).',
      verdict: 'TrungBinh',
    },
    note: 'Microservices chịu thuế mạng (Network Tax); Modular Monolith đạt thông lượng tối đa của CPU.',
  },
  {
    criterion: 'Tính Toàn vẹn Dữ liệu (ACID Transaction vs Eventual Consistency)',
    traditionalMonolith: {
      score: 4,
      description: 'Dễ dàng dùng giao dịch CSDL cục bộ (ACID), nhưng dễ bị khóa bảng diện rộng.',
      verdict: 'Tot',
    },
    modularMonolith: {
      score: 4,
      description: 'Hỗ trợ cả ACID trong từng module và Eventual Consistency qua Domain Events / Outbox Pattern.',
      verdict: 'Tot',
    },
    microservices: {
      score: 1,
      description: 'Mất ACID. Phải cài đặt Saga Pattern, Two-Phase Commit (2PC) hoặc CDC cực kỳ phức tạp và dễ lỗi.',
      verdict: 'Kem',
    },
    note: 'Quản lý giao dịch phân tán trong Microservices là cơn ác mộng lớn nhất của kỹ sư phần mềm.',
  },
  {
    criterion: 'Tốc độ Debug & Khả năng Quan sát (Debugging & Observability)',
    traditionalMonolith: {
      score: 4,
      description: 'Dễ đặt breakpoint trong IDE, xem stacktrace đầy đủ từ Controller đến DAO.',
      verdict: 'Tot',
    },
    modularMonolith: {
      score: 5,
      description: 'Debug cục bộ 1-click trong IDE, kết hợp Event Bus Inspector nội bộ minh bạch.',
      verdict: 'Tot',
    },
    microservices: {
      score: 1,
      description: 'Bắt buộc dùng OpenTelemetry, Distributed Tracing (Jaeger, Zipkin) để lần dấu request qua 10 container.',
      verdict: 'Kem',
    },
    note: 'Modular Monolith cho phép lập trình viên chạy toàn bộ hệ thống trên laptop cá nhân trong 3 giây.',
  },
  {
    criterion: 'Khả năng Độc lập Phát triển của Nhiều Nhóm (Team Autonomy)',
    traditionalMonolith: {
      score: 2,
      description: 'Xung đột code (Merge conflicts) liên tục khi 50 lập trình viên cùng sửa 1 repo.',
      verdict: 'Kem',
    },
    modularMonolith: {
      score: 4,
      description: 'Mỗi nhóm sở hữu 1 module độc lập (Code Ownership), giao tiếp qua Public Contract.',
      verdict: 'Tot',
    },
    microservices: {
      score: 5,
      description: 'Mỗi nhóm sở hữu 1 repository và pipeline CI/CD riêng biệt hoàn toàn.',
      verdict: 'Tot',
    },
    note: 'Modular Monolith phù hợp xuất sắc cho đội ngũ từ 5 đến 40 kỹ sư mà không sinh ra ma sát tổ chức.',
  },
  {
    criterion: 'Đường lui & Khả năng Nâng cấp (Migration Pathway)',
    traditionalMonolith: {
      score: 1,
      description: 'Gần như không thể tách sang Microservices nếu không viết lại từ đầu (Rewrite from scratch).',
      verdict: 'Kem',
    },
    modularMonolith: {
      score: 5,
      description: 'Là bệ phóng lý tưởng. Khi cần tách 1 module, chỉ việc bọc adapter gRPC/HTTP và chuyển CSDL.',
      verdict: 'Tot',
    },
    microservices: {
      score: 2,
      description: 'Nếu chọn nhầm ranh giới dịch vụ (Wrong Service Boundary), gom lại thành monolith cực kỳ gian nan.',
      verdict: 'TrungBinh',
    },
    note: 'Martin Fowler: "Quy luật thiết kế số 1 của vi dịch vụ: Đừng bắt đầu bằng vi dịch vụ. Hãy bắt đầu bằng Monolith được tổ chức tốt."',
  },
];

export const DEFENSE_QUESTIONS: DefenseQuestion[] = [
  {
    id: 'q-01',
    question: 'Tại sao lại chọn kiến trúc Modular Monolith thay vì Microservices ngay từ đầu cho hệ thống quản lý thư viện này?',
    category: 'LyThuyet',
    difficulty: 'CoBan',
    lecturerPerspective: 'Giảng viên muốn kiểm tra xem sinh viên có chạy theo trào lưu "Microservices Hype" hay thực sự hiểu các đánh đổi (Trade-offs) trong kiến trúc phần mềm.',
    modelAnswer: 'Dạ thưa Thầy/Cô, theo định luật "Monolith First" của Martin Fowler và nghiên cứu về Distributed Systems Tax: \n1. Hệ thống thư viện trường đại học có quy mô dữ liệu và lưu lượng người dùng (vài chục nghìn sinh viên) hoàn toàn nằm trong khả năng xử lý của 1 máy chủ hiện đại (vertical scaling).\n2. Nếu áp dụng Microservices sớm khi ranh giới nghiệp vụ (domain boundaries) chưa ổn định, chúng ta sẽ phải trả chi phí rất lớn cho: network latency, distributed transaction (Saga pattern), hạ tầng Kubernetes, monitoring phức tạp và nguy cơ sinh ra "Distributed Monolith".\n3. Modular Monolith mang lại tất cả ưu điểm về ranh giới sạch (Clean Boundaries, Bounded Contexts, Event-Driven) mà chi phí vận hành chỉ bằng 1/10 và không có rủi ro trễ mạng.',
    keyTerminology: ['Monolith First', 'Distributed Systems Tax', 'Bounded Context', 'In-Process Event Bus'],
  },
  {
    id: 'q-02',
    question: 'Làm thế nào để đảm bảo lập trình viên trong nhóm không "ăn gian", vô tình import mã nguồn nội bộ hoặc viết SQL truy vấn bảng của module khác?',
    category: 'ThietKe',
    difficulty: 'NangCao',
    lecturerPerspective: 'Giảng viên kiểm tra cơ chế kiểm soát ranh giới (Boundary Enforcement) - yếu tố quyết định sự thành bại giữa Modular Monolith và Monolith truyền thống.',
    modelAnswer: 'Dạ thưa Thầy/Cô, đồ án giải quyết vấn đề này qua 3 tầng bảo vệ tự động:\n1. Phân chia cấu trúc gói (Package Structure): Mỗi module chia thành 2 thư mục rõ ràng: "public/" (chứa Interface công khai, DTO, Domain Events) và "internal/" (chứa Entity, DAO, logic nghiệp vụ nội bộ).\n2. Công cụ kiểm thử kiến trúc (Architectural Fitness Functions): Chúng em cấu hình ArchUnit (đối với Java/.NET) hoặc plugin ESLint Boundaries (đối với TypeScript). Trong pipeline CI/CD, nếu phát hiện Module A import từ `modules/B/internal/`, lệnh build sẽ bị FAILED ngay lập tức.\n3. Phân tách CSDL logic: Trong cùng 1 database, các bảng được phân chia theo schema riêng biệt (vd: catalog.books, circulation.loans) hoặc sử dụng Database Users có quyền hạn giới hạn, cấm hoàn toàn các lệnh SQL JOIN vượt ranh giới.',
    keyTerminology: ['Architectural Fitness Functions', 'ArchUnit', 'Package Encapsulation', 'Logical Schema Separation'],
  },
  {
    id: 'q-03',
    question: 'Giả sử trong nghiệp vụ Mượn sách, Module Circulation cần biết thông tin Độc giả có được phép mượn hay không, hai module này trao đổi dữ liệu như thế nào?',
    category: 'ThietKe',
    difficulty: 'CoBan',
    lecturerPerspective: 'Giảng viên kiểm tra hiểu biết về giao tiếp đồng bộ (Synchronous Query) qua Public Interface Contract.',
    modelAnswer: 'Dạ thưa Thầy/Cô, hai module trao đổi hoàn toàn thông qua Public Contract `IPatronModule`:\n1. Phân hệ Patron export một Interface công khai: `canBorrow(patronId): Promise<BorrowEligibilityResult>` nằm trong `patron/public/`.\n2. Circulation Module inject interface này qua Dependency Injection (IoC Container).\n3. Khi thực hiện lệnh mượn, Circulation gọi `await this.patronModule.canBorrow(patronId)`.\n4. Circulation tuyệt đối KHÔNG truy vấn trực tiếp bảng Patron/User trong CSDL và KHÔNG phụ thuộc vào PatronEntity nội bộ. Nhờ đó, nếu cấu trúc bảng Patron thay đổi, Circulation vẫn hoạt động ổn định miễn là Interface không đổi.',
    keyTerminology: ['Public Contract', 'Dependency Inversion', 'Interface Segregation', 'DTO Mapping'],
  },
  {
    id: 'q-04',
    question: 'Cơ chế In-Process Event Bus hoạt động ra sao và khác gì so với Message Broker như Kafka hay RabbitMQ?',
    category: 'HieuNang',
    difficulty: 'NangCao',
    lecturerPerspective: 'Giảng viên kiểm tra hiểu biết về kiến trúc hướng sự kiện (EDA) cục bộ trong tiến trình so với hệ thống hàng đợi phân tán.',
    modelAnswer: 'Dạ thưa Thầy/Cô:\n- Điểm giống nhau: Đều triển khai mẫu thiết kế Publish-Subscribe. Module phát sự kiện (Publisher) hoàn toàn không biết và không phụ thuộc vào các Module nhận sự kiện (Subscribers).\n- Điểm khác biệt:\n  + In-Process Event Bus: Chạy hoàn toàn trong bộ nhớ RAM của cùng 1 tiến trình Node.js/JVM (dùng Observer pattern hoặc EventEmitter). Tốc độ cực nhanh (micro-seconds), không tốn RAM cho hạ tầng riêng, không có network hop.\n  + Kafka/RabbitMQ: Là máy chủ trung gian độc lập qua mạng, có khả năng lưu trữ sự kiện bền vững (disk persistence) và chịu tải phân tán nhiều node.\n- Khi hệ thống cần mở rộng sang Microservices, chúng em chỉ cần viết 1 Adapter thay thế In-Process Event Bus bằng Kafka Producer/Consumer mà không phải sửa logic nghiệp vụ của các module.',
    keyTerminology: ['In-Process Event Bus', 'Publish-Subscribe', 'Event-Driven Architecture', 'Message Broker Adapter'],
  },
  {
    id: 'q-05',
    question: 'Nếu module Notification bị lỗi (ví dụ nghẽn mạng khi gửi email xác nhận mượn sách), liệu lượt mượn sách của độc giả có bị hủy bỏ không?',
    category: 'HieuNang',
    difficulty: 'ChuyenSau',
    lecturerPerspective: 'Giảng viên muốn đánh giá khả năng chịu lỗi (Fault Tolerance) và phân tách ranh giới giao dịch (Transaction Isolation).',
    modelAnswer: 'Dạ thưa Thầy/Cô, đây chính là sự khác biệt then chốt giữa Modular Monolith và Monolith truyền thống:\n- Ở Monolith truyền thống: Lệnh gửi email thường được gọi đồng bộ trong cùng 1 Database Transaction với thao tác mượn sách. Nếu SMTP server timeout hoặc ném Exception, transaction bị rollback dẫn đến việc mượn sách thất bại.\n- Ở Modular Monolith của chúng em: Thao tác mượn sách được cam kết (Commit) thành công trong Circulation Module trước. Sau đó, một Domain Event `LoanCreatedDomainEvent` được phát ra bất đồng bộ. Notification Module lắng nghe sự kiện này trong một luồng/microtask riêng biệt. Nếu việc gửi email thất bại, lỗi được bắt tại Notification Module, ghi vào bảng Dead Letter / Retry Queue và hoàn toàn KHÔNG ảnh hưởng đến giao dịch mượn sách đã hoàn tất.',
    keyTerminology: ['Fault Isolation', 'Decoupled Transactions', 'Asynchronous Handlers', 'Dead Letter Queue'],
  },
  {
    id: 'q-06',
    question: 'Trong tương lai, nếu phân hệ Tra cứu danh mục sách (Catalog Search) bị quá tải vì có 100.000 lượt tìm kiếm/giây, làm thế nào để chuyển đổi sang Microservices?',
    category: 'TrienKhai',
    difficulty: 'ChuyenSau',
    lecturerPerspective: 'Giảng viên muốn thấy lộ trình tiến hóa kiến trúc (Evolutionary Architecture) trong thực tế doanh nghiệp.',
    modelAnswer: 'Dạ thưa Thầy/Cô, việc trích xuất (Extraction) CatalogModule thành Microservice diễn ra vô cùng thuận lợi theo 3 bước:\n1. Tách mã nguồn: Toàn bộ thư mục `src/modules/catalog` được chuyển sang một repository độc lập.\n2. Cắm Remote Adapter: Trong Modular Monolith cũ, chúng em thay thế implementation cục bộ của `ICatalogModule` bằng một `HttpCatalogClient` hoặc `GrpcCatalogClient`. Các module còn lại (Circulation, Patron) không phải sửa đổi bất kỳ dòng code nào vì chúng chỉ phụ thuộc vào Interface.\n3. Cắm Event Broker: Chuyển các Domain Event của Catalog phát ra sang RabbitMQ hoặc Redis Streams để các module khác tiếp tục nhận sự kiện.\nNhờ thiết kế Modular Monolith từ đầu, chúng ta tránh được thảm họa "phụ thuộc xoắn ốc" thường gặp khi phân rã monolith truyền thống.',
    keyTerminology: ['Strangler Fig Pattern', 'Evolutionary Architecture', 'Remote Facade', 'Microservice Extraction'],
  },
];
