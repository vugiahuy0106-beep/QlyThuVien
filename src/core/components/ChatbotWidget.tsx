import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'Tài khoản đăng nhập có sẵn là gì?',
  'Hệ thống gồm những phân hệ chức năng nào?',
  'Vị trí kệ sách Clean Architecture ở đâu?',
  'Quy định mượn sách trong bao lâu?',
  'Kiến trúc Modular Monolith là gì?',
];

// Instant client-side intelligent answers (< 80ms) for lightning-fast perception
function getInstantLocalAnswer(text: string): string | null {
  const query = text.toLowerCase().trim();

  if (
    query.includes('khác') ||
    query.includes('chức năng') ||
    query.includes('quyền') ||
    query.includes('phân hệ')
  ) {
    return `⚡ **Phân quyền chức năng theo từng tài khoản riêng biệt:**

👑 **1. Admin Thư Viện (admin@123):**
- **Dashboard:** Thống kê tổng quan số sách, độc giả, phiếu mượn, quá hạn theo thời gian thực.
- **Quản lý Sách & Vị trí Kệ:** Thêm, sửa, xóa sách, xếp vị trí kệ kho (Kệ A1-T1...).
- **Quản lý Độc Giả:** Cấp thẻ, chỉnh sửa hồ sơ, khóa/mở khóa thẻ độc giả.
- **Quản lý Mượn & Trả:** Lập phiếu mượn, xác nhận hoàn trả, kiểm soát hạn trả.
- **Báo cáo & Xuất CSV:** Phân tích tài liệu, danh sách quá hạn, xuất file CSV.
- **Nạp Dữ liệu Mẫu (Seed Demo):** Khởi tạo dữ liệu mẫu nhanh chóng vào Firestore.

🎓 **2. Khách Sinh Viên (sinhvien@123):**
- **Trang chủ:** Xem tin tức, quy trình mượn trả và sách nổi bật.
- **Tra cứu Sách & Kệ:** Tìm kiếm sách, kiểm tra tồn kho và bấm "Mượn sách này".
- **Phiếu mượn của tôi:** Theo dõi sách đang mượn, ngày hẹn trả và cảnh báo quá hạn cá nhân.
- **Thẻ thư viện cá nhân:** Xem thông tin thẻ, mã vạch barcode số hóa, trạng thái hoạt động.

👤 **3. Khách Vãng Lai (khach):**
- Tra cứu danh mục sách & vị trí kệ kho công khai.`;
  }

  if (
    query.includes('tài khoản') ||
    query.includes('mật khẩu') ||
    query.includes('pass') ||
    query.includes('login') ||
    query.includes('đăng nhập') ||
    query.includes('1234')
  ) {
    return `🔑 **Tài khoản Đăng nhập & Quyền hạn riêng biệt:**

1. 👑 **Tài khoản Admin: admin@123**
   - Mật khẩu: **1234**
   - Quyền hạn: Quản trị toàn bộ thư viện (Dashboard, Sách, Độc giả, Mượn trả, Báo cáo CSV, Seed Data).

2. 🎓 **Tài khoản Sinh Viên: sinhvien@123**
   - Mật khẩu: **1234**
   - Quyền hạn: Bạn đọc sinh viên (Tra cứu vị trí kệ, Tự mượn sách online, Xem phiếu mượn của tôi, Xem thẻ thư viện sinh viên).

3. 👤 **Tài khoản Khách Vãng Lai: khach**
   - Mật khẩu: **guest123**
   - Quyền hạn: Tra cứu sách và vị trí kệ kho công khai.

💡 Đăng nhập tài khoản tương ứng trên màn hình đăng nhập để vào đúng giao diện và quyền hạn của tài khoản đó!`;
  }

  if (query.includes('vị trí') || query.includes('kệ') || query.includes('ở đâu')) {
    return `📍 **Vị trí lưu kho sách trong LibModular:**
- 💻 **CNTT & Phần mềm** (Clean Architecture, Microservices, Refactoring): **Kệ A1-T1** đến **Kệ A3-T2**
- 📖 **Văn học & Nghệ thuật** (Nhà Giả Kim): **Kệ B2-T1**
- 📈 **Kinh tế & Quản trị** (Freakonomics): **Kệ C1-T2**
- 🌍 **Lịch sử & Triết học** (Sapiens): **Kệ D1-T1**
- 🌱 **Kỹ năng sống & Phát triển:** **Kệ E1-T3**

💡 Bạn có thể tìm bất kỳ tên cuốn sách nào trên thanh tìm kiếm để hệ thống chỉ dẫn vị trí kệ ngay lập tức!`;
  }

  if (query.includes('hạn') || query.includes('mượn') || query.includes('bao lâu') || query.includes('quy định') || query.includes('mấy cuốn')) {
    return `📋 **Quy định Mượn & Trả sách tại LibModular:**
1. **Số lượng:** Mỗi bạn đọc được mượn tối đa **3 cuốn sách** cùng lúc.
2. **Thời hạn:** Thời hạn mượn tiêu chuẩn là **14 ngày**.
3. **Quy trình:**
   - Chọn sách cần đọc rồi bấm **"Tạo phiếu mượn"** hoặc **"Mượn sách"**.
   - Firestore Transaction sẽ tự động kiểm tra số lượng và trừ tồn kho tức thì.`;
  }

  if (query.includes('modular') || query.includes('monolith') || query.includes('kiến trúc')) {
    return `🏛️ **Kiến trúc Modular Monolith của LibModular:**
- **Triết lý:** Gom tụ toàn bộ hệ thống trong một khối mã nguồn duy nhất (Single Deployable Unit) nhưng được chia thành các module nghiệp vụ hoàn toàn độc lập (Books, Readers, Loans, Reports, Auth).
- **Lợi ích:** Đạt được tính rõ ràng của Microservices nhưng không chịu gánh nặng phức tạp về mạng hay hạ tầng phân tán.
- **Cơ sở dữ liệu:** Tích hợp **Cloud Firestore** cho giao dịch ACID thời gian thực.`;
  }

  return null;
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Xin chào! Tôi là **Trợ lý Thư viện AI LibModular (Phản hồi siêu tốc ⚡)**.\n\nTôi có thể giải đáp ngay:\n- Hướng dẫn tra cứu và quản lý sách & vị trí kệ kho\n- Quy trình lập phiếu mượn và hoàn trả tài liệu\n- Tài khoản và mật khẩu đăng nhập có sẵn\n- Kiến trúc phần mềm **Modular Monolith**\n\nBạn cần hỗ trợ gì ngay bây giờ?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 1. Check instant local intelligence (< 50ms)
    const instantReply = getInstantLocalAnswer(text);
    if (instantReply) {
      // Simulate ultra-short natural latency (120ms) so user perceives fast AI thinking
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'ai',
          text: instantReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 120);
      return;
    }

    // 2. Fast fetch with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2800);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.reply || 'Xin lỗi, tôi chưa thể trả lời câu hỏi này vào lúc này.';

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      // Instant graceful fallback
      const fallbackMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: `⚡ **Trợ lý Thư viện AI (Phản hồi tức thì):**\n- Bạn có thể tra cứu sách tại Trang chủ để thấy ngay vị trí kệ lưu kho.\n- **Thủ thư:** Tài khoản \`thuthu\` / \`admin123\` để toàn quyền quản lý kho & bạn đọc.\n- **Khách:** Tài khoản \`khach\` / \`guest123\` để tra cứu & xem FAQ.\n- Thời hạn mượn tiêu chuẩn: 14 ngày (tối đa 3 cuốn).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold text-xs shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
          </div>
          <span>Trợ lý Thư viện AI</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[390px] sm:max-w-[420px] h-[550px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-900/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">LibModular AI Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-indigo-200">Trợ lý tra cứu & tư vấn thư viện</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      isAi
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                        : 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line break-words">{msg.text}</div>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isAi ? 'text-slate-400' : 'text-indigo-200'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Đặt câu hỏi cho Trợ lý Thư viện AI..."
                className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-1.5 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                {isTyping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
