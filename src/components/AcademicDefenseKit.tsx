import React, { useState } from 'react';
import { DEFENSE_QUESTIONS, ARCHITECTURE_METRICS, DefenseQuestion } from '../data/defenseData';
import {
  Award,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Download,
  HelpCircle,
  CheckCircle2,
  Table,
  FileText,
  Star,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AcademicDefenseKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'slides' | 'qa' | 'matrix'>('slides');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<DefenseQuestion['category'] | 'All'>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(DEFENSE_QUESTIONS[0].id);

  // Defense Presentation Slides
  const SLIDES = [
    {
      title: '1. Đặt Vấn Đề: Khủng Hoảng Kiến Trúc & Cạm Bẫy Microservices Hype',
      subtitle: 'Tại sao Monolith truyền thống thoái hóa và Microservices lại quá phức tạp?',
      bullets: [
        'Monolith truyền thống tổ chức theo tầng ngang (Layered) thường biến thành "Big Ball of Mud" sau 1-2 năm phát triển do thiếu ranh giới bảo vệ.',
        'Tuy nhiên, phong trào "Microservices hóa" sớm đem lại thảm họa hạ tầng (Distributed Systems Tax): độ trễ mạng, distributed transactions (Saga), cụm Kubernetes đắt đỏ và phân rã thành "Distributed Monolith".',
        'Định luật Monolith First (Martin Fowler): Đừng bao giờ bắt đầu bằng vi dịch vụ nếu chưa làm chủ được một khối Monolith có cấu trúc sạch.',
        'Mục tiêu đồ án: Thiết kế hệ thống Thư viện Đại học theo kiến trúc Modular Monolith - dung hòa ưu điểm của cả hai thế giới.',
      ],
      keyTakeaway: 'Modular Monolith là kiến trúc mặc định lý tưởng nhất cho 95% dự án phần mềm doanh nghiệp vừa và lớn hiện nay.',
    },
    {
      title: '2. Bản Chất Của Modular Monolith & Thiết Kế Bounded Contexts',
      subtitle: 'Ranh giới Bounded Context độc lập bên trong cùng một thực thi tiến trình',
      bullets: [
        'Hệ thống thư viện được phân chia thành 5 Bounded Contexts theo Domain-Driven Design (DDD): Catalog, Patron, Circulation, Fine & Billing, Notification.',
        'Mỗi phân hệ tuân thủ quy tắc Che giấu thông tin (Information Hiding): Chỉ có thư mục public/ (chứa Interface & DTO) được công khai; thư mục internal/ (chứa Entity, DAO, logic nghiệp vụ) bị bao đóng hoàn toàn.',
        'Sử dụng các công cụ kiểm thử kiến trúc (Architectural Fitness Functions như ArchUnit / ESLint Boundaries) trong CI/CD để chặn đứng vi phạm ranh giới từ dòng lệnh build.',
        'Cơ sở dữ liệu được phân chia theo Logical Schemas riêng biệt, cấm hoàn toàn các câu lệnh SQL JOIN chéo giữa các phân hệ.',
      ],
      keyTakeaway: 'Ranh giới logic chặt chẽ tương đương Microservices, nhưng chạy trên cùng 1 tiến trình và 1 database connection pool.',
    },
    {
      title: '3. Cơ Chế Giao Tiếp: Public Contract & In-Process Domain Event Bus',
      subtitle: 'Kết hợp gọi hàm đồng bộ qua Interface và phát sự kiện bất đồng bộ trong bộ nhớ',
      bullets: [
        'Truy vấn đọc (Read Queries): Gọi trực tiếp qua Interface công khai (vd: IPatronModule.canBorrow), độ trễ dưới 1 microsecond trong bộ nhớ RAM.',
        'Thay đổi trạng thái (Commands): Giao dịch hoàn tất trong module chủ quản, sau đó phát Domain Event (vd: LoanCreatedDomainEvent, BookReturnedOverdueEvent).',
        'In-Process Event Bus vận hành theo mẫu Publish-Subscribe ngay trong RAM: Không cần Kafka hay RabbitMQ, không mất chi phí mạng, không có overhead tuần tự hóa dữ liệu.',
        'Cô lập lỗi (Fault Isolation): Lỗi gửi email ở Notification Module hoàn toàn không làm rollback giao dịch mượn sách cốt lõi của Circulation Module.',
      ],
      keyTakeaway: 'Event-Driven Architecture không nhất thiết phải dùng message broker phân tán; in-process event bus cho thông lượng hàng chục nghìn event/giây.',
    },
    {
      title: '4. Đánh Đổi Kiến Trúc & Chi Phí Thực Tế (Trade-off Analysis)',
      subtitle: 'So sánh định lượng giữa Monolith Truyền Thống, Modular Monolith và Microservices',
      bullets: [
        'Chi phí hạ tầng: Modular Monolith chỉ tốn ~20-50 USD/tháng (1 VPS/Cloud Run) so với 500-1500 USD/tháng cho cụm Kubernetes/Service Mesh của Microservices.',
        'Độ trễ (Latency): Gọi in-memory đạt < 0.1ms; Microservices tốn 15ms - 50ms cho các network hops và parse JSON qua lại.',
        'Quản lý giao dịch: Duy trì tính toàn vẹn ACID cục bộ, không phải đau đầu xử lý 2PC (Two-Phase Commit) hay Eventual Consistency phức tạp.',
        'Tốc độ phát triển: Lập trình viên khởi động toàn bộ hệ thống trên laptop trong 3 giây mà không cần dựng 10 container docker-compose.',
      ],
      keyTakeaway: 'Tối ưu hóa "Developer Experience" và "Total Cost of Ownership (TCO)" cho doanh nghiệp.',
    },
    {
      title: '5. Lộ Trình Tiến Hóa Sang Microservices (Evolutionary Architecture)',
      subtitle: 'Modular Monolith là bàn đạp hoàn hảo để trích xuất vi dịch vụ khi cần thiết',
      bullets: [
        'Khi thư viện đạt quy mô liên trường (vài trăm nghìn sinh viên) và phân hệ Tra cứu (Catalog Search) cần scale độc lập:',
        'Bước 1: Tách thư mục src/modules/catalog sang repository độc lập.',
        'Bước 2: Thay thế implementation nội bộ của ICatalogModule bằng gRPC hoặc HTTP Client Adapter (Strangler Fig Pattern). Các module còn lại không sửa 1 dòng code!',
        'Bước 3: Cắm Event Bus Adapter chuyển từ in-memory sang Apache Kafka / RabbitMQ.',
        'Thời gian chuyển đổi chỉ tính bằng ngày thay vì mất hàng năm tái cấu trúc monolith cũ.',
      ],
      keyTakeaway: 'Kiến trúc tiến hóa bền vững: Hãy bắt đầu với Modular Monolith, và chỉ tách Microservices khi dữ liệu và tải thực sự đòi hỏi!',
    },
  ];

  const handleNextSlide = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // Export Academic Report as Markdown file
  const handleExportMarkdown = () => {
    const reportContent = `# BÁO CÁO ĐỒ ÁN MÔN HỌC: CÁC VẤN ĐỀ HIỆN ĐẠI CỦA CÔNG NGHỆ THÔNG TIN
## Đề tài: Nghiên Cứu và Ứng Dụng Kiến Trúc Modular Monolith Trong Hệ Thống Quản Lý Thư Viện Đại Học
**Sinh viên thực hiện:** Nhóm nghiên cứu kiến trúc phần mềm
**Ngày lập báo cáo:** 28/09/2026

---

### 1. TÓM TẮT ĐỀ TÀI (ABSTRACT)
Trong bối cảnh các hệ thống thông tin doanh nghiệp đang đối mặt với sự đánh đổi khốc liệt giữa tính phức tạp phân tán của Microservices và sự thoái hóa thành "Big Ball of Mud" của Monolith truyền thống, kiến trúc **Modular Monolith** nổi lên như một giải pháp chuẩn mực. Đồ án xây dựng một hệ thống Quản lý Thư viện Đại học hoàn chỉnh áp dụng các nguyên lý Domain-Driven Design (DDD), phân chia 5 Bounded Contexts độc lập (Catalog, Patron, Circulation, Fine, Notification), giao tiếp qua Public Contract và In-Process Domain Event Bus.

### 2. CÁC NGUYÊN LÝ THIẾT KẾ CỐT LÕI
1. **Bounded Context & High Cohesion:** Mỗi module tự đóng gói trọn vẹn nghiệp vụ, cơ sở dữ liệu logic và logic miền.
2. **Information Hiding (David Parnas):** Tuyệt đối che giấu tầng DAO và Entity nội bộ sau thư mục \`internal/\`.
3. **In-Process Event Bus:** Phân tách luồng xử lý bất đồng bộ trong bộ nhớ RAM, loại bỏ hiệu ứng lỗi dây chuyền (Cascading Failure).
4. **Architectural Fitness Functions:** Kiểm soát ranh giới tự động bằng ArchUnit / ESLint trong CI/CD.

### 3. MA TRẬN SO SÁNH ĐÁNH ĐỔI
| Tiêu chí | Monolith Truyền Thống | Modular Monolith | Microservices |
| :--- | :--- | :--- | :--- |
| Chi phí Hạ tầng | Cực thấp (1 VPS) | Cực thấp (1 VPS) | Rất đắt (K8s, Gateway) |
| Ranh giới Nghiệp vụ | Yếu (Dễ vỡ) | Rất mạnh (ArchUnit) | Rất mạnh (Network) |
| Độ trễ giao tiếp | < 1ms | < 1ms (In-Memory) | 20-80ms (Network hop) |
| Giao dịch CSDL | ACID dễ dàng | ACID nội bộ + Event | Phức tạp (Saga/2PC) |
| Tốc độ Debug | Dễ dàng | 1-Click Debug | Cần Distributed Tracing |
| Khả năng tách dịch vụ | Bất khả thi | Dễ dàng (Vài ngày) | Vốn đã phân tán |

---
*Tài liệu tự động xuất từ LibModular - Hệ thống Nghiên cứu Kiến trúc Phần mềm.*
`;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'BaoCao_Modular_Monolith_ThuVien.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredQuestions =
    selectedCategory === 'All'
      ? DEFENSE_QUESTIONS
      : DEFENSE_QUESTIONS.filter((q) => q.category === selectedCategory);

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Học Liệu & Đánh Giá</span>
            <span aria-hidden="true">·</span>
            <span>Bảo Vệ Đồ Án Môn Học</span>
            <span aria-hidden="true">·</span>
            <span>Slide & Câu Hỏi Phản Biện</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Hồ Sơ Bảo Vệ Đồ Án: Các Vấn Đề Hiện Đại Của CNTT
          </h2>
        </div>

        <button
          onClick={handleExportMarkdown}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-xs flex items-center gap-2 w-fit"
        >
          <Download className="w-4 h-4 text-sky-600" />
          <span>Tải Báo Cáo Tóm Tắt (.MD)</span>
        </button>
      </div>

      {/* Mode Selector Tabs (Segmented Control per Rule 1.A) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'slides'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
          <span>1. Slide Trình Bày (Defense Deck)</span>
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'qa'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>2. Câu Hỏi Phản Biện & Lời Giải Mẫu</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'matrix'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="w-3.5 h-3.5 text-emerald-600" />
          <span>3. Ma Trận Đánh Đổi 8 Tiêu Chí</span>
        </button>
      </div>

      {/* 1. SLIDES TAB */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-sky-400">
                  SLIDE {currentSlideIndex + 1} / {SLIDES.length} · BẢO VỆ ĐỒ ÁN CNTT
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentSlide.title}
                </h3>
                <div className="text-sm text-slate-400">{currentSlide.subtitle}</div>
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              {currentSlide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-slate-200 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-sky-950 border border-sky-600 text-sky-400 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>{bullet}</div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-sky-950/60 border border-sky-800 rounded-lg text-xs text-sky-200 flex items-start gap-2.5">
              <Star className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-white">Thông điệp cốt lõi: </strong>
                <span>{currentSlide.keyTakeaway}</span>
              </div>
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Slide trước</span>
              </button>

              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentSlideIndex ? 'bg-sky-400 w-6' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Chuyển tới slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === SLIDES.length - 1}
                className="px-4 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Slide tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEFENSE QUESTIONS & ANSWERS TAB */}
      {activeTab === 'qa' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-md w-fit border border-slate-200 text-xs">
            {(['All', 'LyThuyet', 'ThietKe', 'HieuNang', 'TrienKhai'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'All'
                  ? 'Tất cả câu hỏi'
                  : cat === 'LyThuyet'
                  ? 'Lý thuyết'
                  : cat === 'ThietKe'
                  ? 'Thiết kế'
                  : cat === 'HieuNang'
                  ? 'Hiệu năng'
                  : 'Triển khai'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;
              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-sky-600 font-bold">{q.id.toUpperCase()}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-medium">
                          {q.category === 'LyThuyet'
                            ? 'Lý thuyết kiến trúc'
                            : q.category === 'ThietKe'
                            ? 'Thiết kế chi tiết'
                            : q.category === 'HieuNang'
                            ? 'Hiệu năng & Khóa'
                            : 'Triển khai'}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            q.difficulty === 'ChuyenSau'
                              ? 'bg-purple-100 text-purple-800'
                              : q.difficulty === 'NangCao'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    <div className="text-slate-400 mt-1 shrink-0">
                      <ChevronRight
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90 text-sky-600' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-0 border-t border-slate-100 space-y-4 text-xs">
                      {/* Lecturer Perspective */}
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-amber-900 space-y-1">
                        <div className="font-semibold flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Mục đích đánh giá của Giảng viên:</span>
                        </div>
                        <div className="text-slate-700 leading-relaxed">{q.lecturerPerspective}</div>
                      </div>

                      {/* Model Answer */}
                      <div className="space-y-2">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Câu trả lời chuẩn đạt điểm tối đa (Model Answer):</span>
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 whitespace-pre-line leading-relaxed">
                          {q.modelAnswer}
                        </div>
                      </div>

                      {/* Key Terminology */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="font-semibold text-slate-600 text-[11px]">Từ khóa ghi điểm:</span>
                        {q.keyTerminology.map((term, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TRADEOFF MATRIX TAB */}
      {activeTab === 'matrix' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Bảng Đánh Đổi Toàn Diện: 3 Mô Hình Kiến Trúc Phần Mềm
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              So sánh khách quan dựa trên tiêu chuẩn công nghiệp và kinh nghiệm triển khai thực tế
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold w-1/4">Tiêu Chí Đánh Giá</th>
                  <th className="py-3 px-4 font-semibold w-1/4 text-rose-700">Monolith Truyền Thống</th>
                  <th className="py-3 px-4 font-semibold w-1/4 text-sky-700 bg-sky-50/50">
                    Modular Monolith (Đồ Án)
                  </th>
                  <th className="py-3 px-4 font-semibold w-1/4 text-purple-700">Microservices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {ARCHITECTURE_METRICS.map((metric, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{metric.criterion}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{metric.note}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 align-top">
                      <div className="font-medium text-slate-800">{metric.traditionalMonolith.description}</div>
                    </td>
                    <td className="py-3 px-4 bg-sky-50/30 text-slate-800 align-top">
                      <div className="font-semibold text-slate-900">{metric.modularMonolith.description}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 align-top">
                      <div className="font-medium text-slate-800">{metric.microservices.description}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
