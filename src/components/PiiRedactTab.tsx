import React, { useState } from 'react';
import { EyeOff, Shield, CheckCircle2, ImageOff } from 'lucide-react';

// Che thông tin nhạy cảm ngay trên trình duyệt, không gửi đi đâu.
// Quy tắc giữ giống sanitizeAndRedactPII trong server/safety.ts (chỉ khác nhãn hiển thị).
const OTP_WORDS = 'otp|m[aã]\\s*x[aá]c\\s*(?:th[uự]c|nh[aậ]n)|m[aã]\\s*b[aả]o\\s*m[aậ]t';
const MASK_RULES: { label: string; regex: RegExp; keepGroup?: boolean; accept?: (match: string, group?: string) => boolean }[] = [
  { label: 'SỐ THẺ', regex: /\b(?:\d[ -]*?){13,19}\b/g, accept: (m) => m.replace(/\D/g, '').length >= 13 },
  { label: 'MÃ OTP', regex: /(\b(?:otp|code|pin|mã\s*otp)[:\s]+)[0-9]{4,8}\b/giu, keepGroup: true },
  { label: 'MÃ OTP', regex: new RegExp(`((?:${OTP_WORDS})[^\\d\\n]{0,40}?)\\d{4,8}(?!\\d)`, 'giu'), keepGroup: true },
  { label: 'MÃ OTP', regex: new RegExp(`(?<!\\d)\\d{6}(?!\\d)(?=[^\\d\\n]{0,25}(?:${OTP_WORDS}))`, 'giu') },
  {
    label: 'MẬT KHẨU',
    regex: /(\b(?:password|m[aậ]t\s*kh[aẩ]u|pwd|pass)(?:\s*[:=]\s*|\s+(?:l[aà]\s+)?))[^\s,;]+/giu,
    keepGroup: true,
    accept: (m, g) => /[:=]/.test(g || '') || /[\d@#$!%^&*_]/.test(m.slice((g || '').length)),
  },
  { label: 'SỐ TÀI KHOẢN', regex: /((?:stk|s[oố]\s*t[aà]i\s*kho[aả]n|t[aà]i\s*kho[aả]n\s*s[oố]|account(?:\s*number)?)[\s:.#]*)\d(?:[\s.-]?\d){5,18}(?!\d)/giu, keepGroup: true },
  { label: 'SỐ ĐIỆN THOẠI', regex: /(?<![\d.,])(?:\+84|0)(?:[\s.-]?\d){9,11}(?!\d)|(?<![\d\w])\+(?!84)\d{1,3}(?:[\s.-]?\d){6,12}(?!\d)/g },
  { label: 'SỐ ĐIỆN THOẠI', regex: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, accept: (m) => m.replace(/\D/g, '').length >= 10 },
  { label: 'EMAIL', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
];

function maskSensitiveText(input: string): { text: string; counts: Record<string, number> } {
  let text = input;
  const counts: Record<string, number> = {};
  for (const rule of MASK_RULES) {
    text = text.replace(rule.regex, (match: string, group?: unknown) => {
      const prefix = rule.keepGroup && typeof group === 'string' ? group : '';
      if (rule.accept && !rule.accept(match, prefix)) return match;
      counts[rule.label] = (counts[rule.label] || 0) + 1;
      return `${prefix}[${rule.label} ĐÃ CHE]`;
    });
  }
  return { text, counts };
}

export const PiiRedactTab: React.FC = () => {
  const [rawPiiText, setRawPiiText] = useState(
    'Họ tên tôi là Nguyễn Văn An, số điện thoại là 0912 345 678, số tài khoản Techcombank: 1903456789123, mã OTP nhận được là 482910.'
  );
  const [masked, setMasked] = useState<{ text: string; counts: Record<string, number> } | null>(null);

  const total = masked ? Object.values<number>(masked.counts).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="space-y-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <EyeOff className="w-4 h-4 text-cyan-400" />
          <span>Che thông tin cá nhân trên trình duyệt:</span>
        </label>
        <p className="text-xs text-slate-400">
          Che số điện thoại, email, số tài khoản, số thẻ, mã OTP, mật khẩu trong đoạn chữ ngay trên máy bạn (không gửi lên máy chủ), để bạn chép đi chia sẻ an toàn hơn. Dùng cùng quy tắc với bộ che của máy chủ ScamGuard.
        </p>
      </div>

      {/* Che chữ */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 font-mono">1. CHE THÔNG TIN TRONG ĐOẠN CHỮ / TIN NHẮN:</p>
        <textarea
          rows={3}
          value={rawPiiText}
          onChange={(e) => setRawPiiText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed"
        />
        <button
          onClick={() => setMasked(maskSensitiveText(rawPiiText))}
          disabled={!rawPiiText.trim()}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center space-x-2 font-mono disabled:opacity-40"
        >
          <Shield className="w-4 h-4" />
          <span>CHE THÔNG TIN NHẠY CẢM</span>
        </button>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Chưa che được: họ tên, địa chỉ, số dư; mã OTP đứng một mình không có chữ "OTP" hay "mã xác thực"; số tài khoản ngắn không có chữ "STK" đứng trước. Hãy đọc lại trước khi chia sẻ.
        </p>
      </div>

      {masked && (
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-emerald-500/30 space-y-2">
          <div className="font-mono text-xs">
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {total > 0
                  ? `Đã che ${total} mục: ${Object.entries(masked.counts).map(([k, v]) => `${v} ${k.toLowerCase()}`).join(', ')}`
                  : 'Không tìm thấy thông tin cần che theo các quy tắc trên.'}
              </span>
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 font-mono leading-relaxed border border-slate-800 whitespace-pre-wrap">
            {masked.text}
          </div>
        </div>
      )}

      {/* Ảnh: chưa che tự động được */}
      <div className="space-y-2 pt-3 border-t border-slate-800/60">
        <p className="text-xs font-bold text-slate-400 font-mono">2. CHE THÔNG TIN TRÊN ẢNH CHỤP MÀN HÌNH:</p>
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
          <p className="flex items-center space-x-1.5 font-bold text-amber-400">
            <ImageOff className="w-4 h-4" />
            <span>ScamGuard chưa che tự động được chữ trong ảnh (cần công nghệ đọc chữ trong ảnh – OCR).</span>
          </p>
          <p>Trước khi gửi ảnh biên lai, ảnh tin nhắn cho người khác, hãy tự che bằng công cụ chỉnh ảnh có sẵn trên điện thoại (bút vẽ, cắt ảnh):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Số tài khoản, số thẻ, số dư</li>
            <li>Họ tên, số điện thoại, mã giao dịch</li>
            <li>Mã OTP, mã QR cá nhân</li>
          </ul>
          <p className="text-slate-400">Nên tô kín bằng màu đặc; không dùng hiệu ứng làm mờ vì có thể khôi phục được.</p>
        </div>
      </div>
    </div>
  );
};
