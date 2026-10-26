import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client if GEMINI_API_KEY is available
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// Fallback intelligent response generator for library queries
function generateKnowledgeBaseResponse(prompt: string): string {
  const query = prompt.toLowerCase();

  if (query.includes('khách') && (query.includes('thủ thư') || query.includes('khác nhau') || query.includes('chức năng') || query.includes('phân quyền'))) {
    return `⚖️ **Sự khác nhau giữa tài khoản Khách và Thủ thư:**

1. 👑 **Tài khoản Thủ thư (Username: thuthu / Pass: admin123):**
   - Quản lý toàn diện kho sách: Thêm sách mới, sửa thông tin, xóa sách, phân bổ vị trí kệ (A1, B2, C1...).
   - Quản lý hồ sơ độc giả: Cấp thẻ mới, chỉnh sửa thông tin, khóa hoặc mở khóa thẻ độc giả.
   - Quản lý mượn/trả sách: Xem toàn bộ phiếu mượn, xác nhận trả sách, xử lý quá hạn.
   - Báo cáo & Thống kê: Xem biểu đồ sách mượn nhiều nhất, danh sách nợ sách, xuất file báo cáo CSV (UTF-8).

2. 👤 **Tài khoản Khách (Username: khach / Pass: guest123):**
   - Tra cứu danh mục sách toàn trường theo tiêu đề, tác giả, chuyên mục.
   - Xem chính xác **vị trí kệ lưu kho** và số lượng sách còn trong kho.
   - Tra cứu câu hỏi thường gặp (FAQ) và quy định sử dụng thư viện.
   - An toàn tuyệt đối: Không can thiệp vào kho dữ liệu hoặc thay đổi phiếu mượn của hệ thống.`;
  }

  if (query.includes('tài khoản') || query.includes('mật khẩu') || query.includes('đăng nhập') || query.includes('login')) {
    return `🔑 **Thông tin tài khoản đăng nhập có sẵn trên hệ thống:**

1. 👑 **Tài khoản Thủ thư:**
   - Tên đăng nhập: **thuthu** (hoặc **admin**)
   - Mật khẩu: **admin123**
   - Quyền: Quản lý toàn bộ sách, độc giả, phiếu mượn, thống kê.

2. 👤 **Tài khoản Khách:**
   - Tên đăng nhập: **khach**
   - Mật khẩu: **guest123**
   - Quyền: Tra cứu sách, xem vị trí kệ, xem FAQ thư viện.

3. 🎓 **Tài khoản Sinh viên:**
   - Mã thẻ: **DG-2001**
   - Mật khẩu: **123456**
   - Quyền: Tự mượn sách, quản lý phiếu mượn cá nhân.`;
  }

  if (query.includes('vị trí') || query.includes('kệ') || query.includes('ở đâu')) {
    return `📍 **Vị trí lưu kho sách trong LibModular:**
- Sách CNTT & Phần mềm (Clean Architecture, Microservices, Refactoring): **Kệ A1-T1** đến **Kệ A3-T2**.
- Sách Văn học & Nghệ thuật (Nhà Giả Kim): **Kệ B2-T1**.
- Sách Kinh tế & Quản trị (Freakonomics): **Kệ C1-T2**.
- Sách Lịch sử & Triết học (Sapiens): **Kệ D1-T1**.
- Sách Kỹ năng sống: **Kệ E1-T3**.

💡 Bạn có thể tìm kiếm tên cuốn sách ở thanh tìm kiếm Trang chủ để thấy ngay vị trí kệ!`;
  }

  if (query.includes('hạn') || query.includes('mượn') || query.includes('bao lâu') || query.includes('quy định') || query.includes('mấy cuốn')) {
    return `📋 **Quy định Mượn & Trả sách tại LibModular:**
1. **Số lượng:** Tối đa **3 cuốn sách** cùng lúc cho mỗi bạn đọc.
2. **Thời hạn:** Thời hạn mượn tiêu chuẩn là **14 ngày**.
3. **Quy trình:**
   - Đăng nhập bằng tài khoản Sinh viên (DG-2001 / 123456).
   - Chọn sách và bấm **"Mượn sách"**.
   - Hệ thống tự động trừ tồn kho sách và tạo phiếu mượn chuẩn.`;
  }

  if (query.includes('nền') || query.includes('hình nền') || query.includes('giao diện') || query.includes('màu')) {
    return `🎨 **Hướng dẫn đổi hình nền & giao diện:**
- Bạn bấm vào nút **"Đổi Nền & Giao Diện"** ở góc trên cùng bên phải.
- Có 3 chế độ:
  1. **Hình ảnh:** Chọn từ 10 hình nền thư viện độ nét cao (HD) hoặc dán link ảnh tùy chỉnh.
  2. **Dải màu (Gradient):** Rất nhiều bộ phối màu hiện đại.
  3. **Màu đơn (Solid):** Tối giản, thanh lịch.
- Có thể chỉnh độ mờ (Blur) và độ trong suốt (Overlay Opacity) theo ý thích!`;
  }

  if (query.includes('modular') || query.includes('monolith') || query.includes('kiến trúc') || query.includes('software architecture')) {
    return `🏛️ **Về Kiến trúc Modular Monolith của LibModular:**
- **Bản chất:** Đơn vị triển khai duy nhất (single deployment) nhưng phân rã thành các module độc lập cao (Books, Readers, Loans, Reports, Auth).
- **Ưu điểm:** Dễ triển khai và debug hơn Microservices, nhưng giữ được tính module hóa và ranh giới nghiệp vụ sạch sẽ (Clean Architecture).
- **Cơ sở dữ liệu:** Tích hợp **Cloud Firestore** cho giao dịch mượn trả an toàn và Firebase Auth phân quyền theo vai trò.`;
  }

  if (query.includes('sách') || query.includes('clean architecture') || query.includes('sapiens') || query.includes('tiêu biểu')) {
    return `📚 **Các ấn phẩm tiêu biểu hiện có trong thư viện:**
- **Clean Architecture: Cấu trúc và Thiết kế Phần mềm** (Robert C. Martin) - Kệ A1-T2
- **Thiết kế Vi dịch vụ (Building Microservices)** (Sam Newman) - Kệ A1-T3
- **Refactoring: Cải tiến Thiết kế Mã nguồn** (Martin Fowler) - Kệ A2-T1
- **Lược Sử Loài Người (Sapiens)** (Yuval Noah Harari) - Kệ D1-T1
- **Nhà Giả Kim** (Paulo Coelho) - Kệ B2-T1
- **Kinh tế học Hài hước (Freakonomics)** - Kệ C1-T2`;
  }

  return `Xin chào! Tôi là **Trợ lý Thư viện AI LibModular**. Tôi có thể hỗ trợ bạn:
- Tra cứu nhanh vị trí kệ sách và số lượng tồn kho.
- Xem quy định mượn sách (14 ngày, tối đa 3 cuốn).
- Thông tin tài khoản: **Thủ thư** (thuthu/admin123) và **Khách** (khach/guest123).
- Giải thích cấu trúc đồ án kiến trúc phần mềm **Modular Monolith**.

Bạn cần hỗ trợ tra cứu cuốn sách nào hoặc tìm hiểu thông tin gì?`;
}

// API endpoint for chatbot - ultra fast with timeout and instant fallback
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Try Gemini API with tight timeout (2.5 seconds) for instant response speed
    if (aiClient) {
      try {
        const systemInstruction = `Bạn là Trợ lý Thư viện AI LibModular (Kiến trúc Modular Monolith).
Phân quyền:
- Thủ thư: thuthu / admin123 (toàn quyền quản lý sách, độc giả, mượn trả, báo cáo).
- Khách: khach / guest123 (tra cứu sách, vị trí kệ lưu kho, FAQ).
- Sinh viên: DG-2001 / 123456 (tự mượn sách, tối đa 3 cuốn, hạn 14 ngày).
Hãy trả lời ngắn gọn, thân thiện, chính xác và trả lời nhanh bằng tiếng Việt định dạng Markdown.`;

        // Wrap call in a fast 2500ms timeout
        const geminiCall = aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.6,
            maxOutputTokens: 300,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout')), 2500)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        const replyText = response.text || generateKnowledgeBaseResponse(message);
        res.json({ reply: replyText });
        return;
      } catch (geminiError: any) {
        // Fast fallback to local library knowledge base
      }
    }

    // Instant fallback response
    const fallbackReply = generateKnowledgeBaseResponse(message);
    res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.json({ reply: generateKnowledgeBaseResponse(req.body?.message || '') });
  }
});

// Mount Vite middleware for SPA in development
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LibModular Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
