import React, { useState } from 'react';
import {
  Layers,
  Database,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Network,
  Split,
  Box,
  FileCode,
  Check,
  X,
} from 'lucide-react';

export const ArchitectureComparisonView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'communication'>('architecture');

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
          <span>Phân tích Kiến trúc Phần mềm</span>
          <span aria-hidden="true">·</span>
          <span>Bản so sánh đối chuẩn</span>
          <span aria-hidden="true">·</span>
          <span>Hệ thống Quản lý Thư viện</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          So Sánh Đối Chiếu: Monolith Truyền Thống vs. Modular Monolith
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Quan sát cách thức hai kiến trúc giải quyết bài toán nghiệp vụ thư viện: từ quản lý phụ thuộc, thiết kế cơ sở dữ liệu đến giao tiếp giữa các phân hệ.
        </p>
      </div>

      {/* Segmented Control Filter Tabs (Rule 1.A) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'architecture'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Kiến trúc Tổng thể & Ranh giới
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'database'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Mô hình Dữ liệu & Khóa CSDL
        </button>
        <button
          onClick={() => setActiveTab('communication')}
          className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'communication'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Cơ chế Giao tiếp & Xử lý Sự cố
        </button>
      </div>

      {/* Side-by-side Architectural Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Monolith Truyền Thống (Layered Architecture) */}
        <div className="bg-white border border-rose-200/80 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Monolith Truyền Thống (Layered / Spaghetti)</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Tổ chức theo Tầng Ngang (Horizontal Layers)
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              High Coupling
            </span>
          </div>

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Tất cả mã nguồn được chia theo loại kỹ thuật (Controllers, Services, Repositories). Không có ranh giới bảo vệ, dẫn đến việc bất kỳ Service nào cũng có thể gọi bừa bãi Service khác.
              </p>

              {/* Visual Diagram Representation */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 font-mono text-xs">
                <div className="p-2.5 bg-rose-50/80 border border-rose-200 rounded text-center font-medium text-rose-900">
                  Presentation Layer (Controllers: Book, User, Loan, Fine)
                </div>
                <div className="flex justify-center text-rose-400">↓ Phụ thuộc tự do không kiểm soát ↓</div>
                <div className="p-3 bg-rose-100/60 border border-rose-300 rounded space-y-2">
                  <div className="font-semibold text-rose-950 text-center">
                    God Service Layer (LoanService, UserService, CatalogService)
                  </div>
                  <div className="text-[11px] text-rose-800 text-center">
                    LoanService trực tiếp sửa Book, kiểm tra User, gửi Email đồng bộ.
                  </div>
                </div>
                <div className="flex justify-center text-rose-400">↓ SQL Query chéo tự do ↓</div>
                <div className="p-2.5 bg-slate-200 border border-slate-300 rounded text-center text-slate-800 font-semibold flex items-center justify-center gap-2">
                  <Database className="w-4 h-4 text-slate-600" />
                  <span>Cơ sở dữ liệu dùng chung (Shared Global Schema)</span>
                </div>
              </div>

              {/* Specific Vulnerabilities */}
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Hiện tượng xói mòn kiến trúc (Architectural Erosion):</strong> Sau một thời gian, mã nguồn biến thành "Big Ball of Mud", không ai dám sửa code cũ vì sợ hỏng tính năng khác.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Phụ thuộc vòng (Cyclic Dependencies):</strong> Module A gọi Module B, Module B lại gọi ngược Module A thông qua Service.</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Không thể tách Microservices:</strong> Khi thư viện mở rộng, việc bóc tách phân hệ mượn trả ra dịch vụ riêng gần như bất khả thi nếu không viết lại từ đầu.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Toàn bộ các bảng CSDL (Books, Users, Loans, Fines, Notifications) nằm chung 1 schema mặc định. Các bảng liên kết chặt chẽ bởi hàng chục khóa ngoại FOREIGN KEY.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 font-mono text-xs">
                <div className="text-rose-700 font-semibold">Ví dụ câu lệnh SQL thường gặp:</div>
                <pre className="p-3 bg-slate-900 text-rose-300 rounded text-[11px] overflow-x-auto">
{`SELECT * FROM loans l
JOIN books b ON l.book_id = b.id
JOIN users u ON l.user_id = u.id
JOIN fines f ON f.loan_id = l.id
WHERE u.status = 'ACTIVE' AND b.copies > 0;`}
                </pre>
                <div className="text-[11px] text-slate-600">
                  Câu lệnh JOIN 4 bảng phá hủy hoàn toàn ranh giới nghiệp vụ. Nếu phòng thư viện đổi tên cột trong bảng Books, màn hình thu ngân tiền phạt bị lỗi ngay.
                </div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
                <div className="font-semibold">Nguy cơ Tranh chấp Khóa (Lock Contention):</div>
                <div>Giao dịch mượn sách giữ khóa đồng thời trên bảng Sách, Độc giả và Phiếu mượn. Nếu hệ thống có nhiều độc giả mượn cùng lúc vào đầu học kỳ, CSDL sẽ bị nghẽn cổ chai (Deadlock).</div>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Các chức năng liên kết với nhau bằng cách gọi hàm đồng bộ (Synchronous Method Call) hoặc qua một Database Transaction khổng lồ.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <div className="font-semibold text-slate-900">Luồng thực thi tuần tự dễ vỡ:</div>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-700">
                  <div className="p-1.5 bg-white border border-slate-200 rounded">1. Bắt đầu Database Transaction</div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">2. UPDATE books SET available = available - 1</div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">3. INSERT INTO loans ...</div>
                  <div className="p-1.5 bg-rose-100 border border-rose-300 text-rose-900 rounded font-semibold">
                    4. Gọi SMTP Server gửi Email (Đồng bộ) ⚠️ NẾU MẠNG CHẬM / TIMEOUT
                  </div>
                  <div className="p-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded">
                    5. ROLLBACK TOÀN BỘ! Người dùng không mượn được sách dù đã lấy sách trên tay!
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <strong>Vùng ảnh hưởng lỗi (Blast Radius):</strong> Lỗi ở một tính năng phụ (Gửi thông báo email/SMS) làm tê liệt nghiệp vụ cốt lõi (Mượn sách).
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Modular Monolith (Vertical Slices + DDD) */}
        <div className="bg-white border border-sky-300 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Modular Monolith (Kiến trúc Đề xuất)</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Tổ chức theo Bounded Context (Vertical Slices)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Low Coupling · High Cohesion
            </span>
          </div>

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Mỗi phân hệ (Catalog, Patron, Circulation, Fine, Notification) là một khối độc lập hoàn chỉnh. Chỉ có Public Contract được xuất ra ngoài, phần mã nguồn nội bộ (internal) được bảo vệ nghiêm ngặt.
              </p>

              {/* Visual Diagram Representation */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-lg space-y-3 font-mono text-xs">
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-slate-800 border border-slate-700 rounded text-sky-300">
                    Catalog Module
                    <div className="text-[9px] text-slate-400">public / internal</div>
                  </div>
                  <div className="p-2 bg-slate-800 border border-slate-700 rounded text-sky-300">
                    Patron Module
                    <div className="text-[9px] text-slate-400">public / internal</div>
                  </div>
                  <div className="p-2 bg-slate-800 border border-slate-700 rounded text-sky-300">
                    Circulation
                    <div className="text-[9px] text-slate-400">public / internal</div>
                  </div>
                </div>

                <div className="p-2.5 bg-sky-950/80 border border-sky-600 rounded text-center text-sky-300 font-semibold flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span>In-Process Domain Event Bus (In-Memory Pub/Sub)</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-slate-800 border border-slate-700 rounded text-sky-300">
                    Fine & Billing Module
                  </div>
                  <div className="p-2 bg-slate-800 border border-slate-700 rounded text-sky-300">
                    Notification Module
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center">
                  Triển khai trên 1 tiến trình Node.js/Java duy nhất · 1 Connection Pool tối ưu
                </div>
              </div>

              {/* Specific Advantages */}
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Kiểm soát ranh giới bằng kiểm thử kiến trúc (ArchUnit / ESLint):</strong> Không ai có thể gọi lậu mã nguồn nội bộ. Nếu vi phạm, pipeline CI tự động ngắt.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Độc lập kiểm thử (Unit Testing):</strong> Dễ dàng Mock các Interface công khai, viết test nhanh gấp 5 lần so với dựng toàn bộ CSDL.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Sẵn sàng hóa thành Microservices (Evolutionary):</strong> Khi cần mở rộng phân hệ Tra cứu, chỉ cần thay thế Interface bằng gRPC Client trong 2 ngày!</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Phân tách CSDL theo Schema logic độc lập (Logical Schemas: catalog, circulation, patron, fine). Tuyệt đối cấm câu lệnh SQL JOIN vượt ranh giới module.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 font-mono text-xs">
                <div className="text-emerald-700 font-semibold">Nguyên tắc Dữ liệu trong Modular Monolith:</div>
                <div className="p-3 bg-slate-900 text-slate-200 rounded text-[11px] space-y-1">
                  <div>1. catalog_schema.books (chỉ Catalog Module được đọc/ghi)</div>
                  <div>2. circulation_schema.loans (chỉ Circulation Module được đọc/ghi)</div>
                  <div>3. patron_schema.members (chỉ Patron Module được đọc/ghi)</div>
                  <div className="text-sky-400 font-semibold mt-2">
                    // Không dùng FOREIGN KEY chéo schema. Giao tiếp qua ID và Public API.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                <div className="font-semibold">Ưu việt về Hiệu năng & Tách bạch:</div>
                <div>Mỗi phân hệ tự do tối ưu hóa cấu trúc dữ liệu bên trong. Có thể dùng PostgreSQL cho Circulation, Redis Cache cho Catalog Search mà không làm ảnh hưởng phần còn lại. Khóa CSDL được cô lập cục bộ, không bao giờ gây nghẽn toàn hệ thống.</div>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Kết hợp giữa Gọi hàm đồng bộ qua Interface (đối với truy vấn đọc) và Phát sự kiện Domain Events bất đồng bộ (đối với hành động làm thay đổi trạng thái).
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <div className="font-semibold text-slate-900">Luồng thực thi tự do, chịu lỗi cao:</div>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-700">
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    1. CirculationModule gọi ICatalogModule.reserveCopy(bookId)
                  </div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    2. Tạo bản ghi mượn và COMMIT giao dịch mượn thành công (&lt;10ms)
                  </div>
                  <div className="p-1.5 bg-sky-50 border border-sky-300 text-sky-900 rounded font-semibold">
                    3. eventBus.publish(new LoanCreatedDomainEvent(loanId, patronId))
                  </div>
                  <div className="p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded">
                    4. NotificationModule nhận event bất đồng bộ in-memory và gửi mail. Dù mail lỗi, độc giả VẪN MƯỢN ĐƯỢC SÁCH bình thường!
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <strong>Vùng ảnh hưởng lỗi (Blast Radius):</strong> Thu hẹp tối đa vào từng module riêng rẽ. Không có hiệu ứng domino (Cascading Failure).
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Architectural Blueprint Deep Dive Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Sơ Đồ Kiến Trúc Hệ Thống (Architectural Blueprint)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              Bản Đồ Bounded Context & Cơ Chế In-Process Event Bus
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Minh họa trực quan cách thức 5 phân hệ lõi của thư viện giao tiếp: Sử dụng In-Process Event Bus không cần network serialize, loại bỏ 100% rủi ro nghẽn mạng và chi phí vận hành cụm phân tán phức tạp.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="font-semibold text-white">Zero Network Latency</div>
                <div className="text-slate-400 text-[11px] mt-0.5">&lt; 1ms thời gian dispatch in-memory</div>
              </div>
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                <div className="font-semibold text-white">Độc Lập Schema</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Không Foreign Key chéo module</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-4 sm:p-6 bg-slate-950/60 border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="relative rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl group">
              <img
                src="/src/assets/images/hero_modular_monolith_1790582976381.jpg"
                alt="Sơ đồ tương tác Bounded Contexts"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 pointer-events-none">
                <span className="font-semibold text-white">5 Phân hệ độc lập:</span> Catalog · Patron · Circulation · Fine · Notification
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
