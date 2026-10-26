import React, { useState } from 'react';
import { Modal } from './Modal';
import { Github, Globe, Check, Copy, Terminal, ExternalLink, ShieldCheck, KeyRound } from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Khởi tạo Git & Đẩy mã nguồn lên GitHub',
      desc: 'Tạo một repository mới trên GitHub (ví dụ: LibModular), sau đó chạy các lệnh sau trong thư mục dự án:',
      code: `# Khởi tạo git và commit mã nguồn
git init
git add .
git commit -m "feat: LibModular library management - Modular Monolith with Firebase"

# Tạo nhánh main và liên kết repository của bạn
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/LibModular.git

# Đẩy code lên GitHub
git push -u origin main`,
    },
    {
      title: '2. Nhập dự án vào Vercel',
      desc: 'Truy cập vercel.com, đăng nhập bằng GitHub và chọn "Add New Project" -> Import repo `LibModular` vừa đẩy lên.',
      code: `Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install`,
    },
    {
      title: '3. Cấu hình biến môi trường trên Vercel (Environment Variables)',
      desc: 'Vì dự án kết nối Firebase, file firebase-applet-config.json đã được cấu hình sẵn. Nếu triển khai riêng biệt, bạn có thể tạo các biến VITE_FIREBASE_* hoặc giữ file config được commit.',
      code: `# Kiểm tra file cấu hình kết nối tại:
firebase-applet-config.json
# (Đã chứa ProjectId, ApiKey, AuthDomain, FirestoreDatabaseId của Firebase)`,
    },
    {
      title: '4. Thêm Domain Vercel vào Firebase Authorized Domains',
      desc: 'Để đăng nhập Google OAuth hoạt động trên Vercel, mở Firebase Console -> Authentication -> Settings -> Authorized domains -> Thêm domain Vercel (ví dụ: libmodular.vercel.app).',
      code: `https://console.firebase.google.com/
> Authentication > Settings > Authorized domains > Add domain`,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hướng dẫn Đồng bộ GitHub & Triển khai Vercel"
      description="Các bước chuẩn để đưa LibModular lên môi trường sản xuất (Production) phục vụ báo cáo đồ án"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
            <span className="font-semibold">Kiến trúc Modular Monolith:</span> Tất cả mã nguồn phân rã thành các
            module (Books, Readers, Loans, Reports, Auth) gói gọn trong một codebase duy nhất, dễ dàng triển khai lên
            bất kỳ nền tảng tĩnh/serverless nào như <strong>Vercel</strong>, <strong>Netlify</strong> hay{' '}
            <strong>Firebase Hosting</strong>.
          </div>
        </div>

        <div className="space-y-5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {idx === 0 ? (
                    <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  ) : (
                    <Globe className="w-4 h-4 text-indigo-500" />
                  )}
                  {step.title}
                </h4>
                <button
                  type="button"
                  onClick={() => copyToClipboard(step.code, idx)}
                  className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép lệnh</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">{step.desc}</p>
              <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
                {step.code}
              </pre>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-xs"
          >
            Đã hiểu, đóng hướng dẫn
          </button>
        </div>
      </div>
    </Modal>
  );
};
