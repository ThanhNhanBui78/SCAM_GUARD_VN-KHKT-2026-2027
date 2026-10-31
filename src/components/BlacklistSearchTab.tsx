import React, { useState } from 'react';
import { Search, ShieldAlert, PlusCircle, AlertTriangle } from 'lucide-react';
import { OFFICIAL_LOOKUP_LINKS } from '../data/officialLookup';

export const BlacklistSearchTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [blacklistSearching, setBlacklistSearching] = useState(false);
  const [blacklistResult, setBlacklistResult] = useState<any | null>(null);

  // Community report form states
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState<'phone' | 'stk'>('phone');
  const [reportIdentifier, setReportIdentifier] = useState('');
  const [reportBank, setReportBank] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSuccessMsg, setReportSuccessMsg] = useState('');
  const [reportErrorMsg, setReportErrorMsg] = useState('');

  // Handle blacklist query search
  const handleBlacklistSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setBlacklistSearching(true);
    setBlacklistResult(null);

    try {
      const res = await fetch(`/api/blacklist/search?query=${encodeURIComponent(searchQuery.trim())}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setBlacklistResult(data);
        return;
      }
      throw new Error('API non-JSON or offline');
    } catch (err) {
      console.warn('Blacklist API unavailable:', err);
      setBlacklistResult({
        found: false,
        message: 'Không kết nối được máy chủ ScamGuard nên chưa tra được. Hãy tự tra cứu ở các nguồn bên dưới.'
      });
    } finally {
      setBlacklistSearching(false);
    }
  };

  // Handle crowd-sourced report submission
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportIdentifier.trim()) {
      setReportErrorMsg('Vui lòng nhập số điện thoại hoặc số tài khoản cần báo cáo!');
      return;
    }

    setReportSuccessMsg('');
    setReportErrorMsg('');

    try {
      const res = await fetch('/api/blacklist/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          identifier: reportIdentifier.trim(),
          bankName: reportType === 'stk' ? reportBank.trim() : undefined,
          description: reportDesc.trim() || 'Mạo danh lừa đảo qua tin nhắn / cuộc gọi.'
        })
      });

      const data = await res.json();
      if (data.success) {
        setReportSuccessMsg('✓ Đã ghi nhận báo cáo (chưa xác minh). Nếu bạn là nạn nhân, hãy trình báo cơ quan công an nơi gần nhất.');
        setReportIdentifier('');
        setReportBank('');
        setReportDesc('');
      } else {
        setReportErrorMsg(data.error || 'Đã có lỗi xảy ra.');
      }
    } catch (err) {
      console.error('Error reporting:', err);
      setReportErrorMsg('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className="space-y-5 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80">
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Tra Cứu Danh Sách Đen SĐT & Số Tài Khoản Ngân Hàng:</span>
        </label>
        <p className="text-xs text-slate-400">
          Chỉ tra trong các báo cáo do người dùng ScamGuard gửi (chưa xác minh). ScamGuard không kết nối dữ liệu của Bộ Công an, NCSC hay nhà mạng.
        </p>
      </div>

      <form onSubmit={handleBlacklistSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nhập SĐT (098...) hoặc STK Ngân hàng (190...)..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
        />
        <button
          type="submit"
          disabled={blacklistSearching || !searchQuery.trim()}
          className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-1.5 font-mono"
        >
          <Search className="w-4 h-4" />
          <span>{blacklistSearching ? 'TRA...' : 'TRA CỨU'}</span>
        </button>
      </form>

      {/* Blacklist Search Results Render */}
      {blacklistResult && (
        <div className="p-4 rounded-2xl border bg-slate-900/40 border-slate-800 space-y-3">
          {blacklistResult.found ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/50 font-mono">
                  ⚠️ CÓ NGƯỜI DÙNG BÁO CÁO – CHƯA XÁC MINH
                </span>
                <span className="text-[10px] text-slate-400 font-medium font-mono">
                  Nguồn: báo cáo người dùng ScamGuard
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white font-mono">
                {blacklistResult.data.identifier} {blacklistResult.data.bankName ? `(${blacklistResult.data.bankName})` : '(Số điện thoại)'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-sans">
                {blacklistResult.data.details}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Số báo cáo: {blacklistResult.data.reportsCount} · Gần nhất: {blacklistResult.data.lastReported}
              </p>
              {blacklistResult.note && (
                <p className="text-[11px] text-amber-300 font-sans">{blacklistResult.note}</p>
              )}
            </div>
          ) : (
            <div className="flex items-start space-x-2 text-amber-300 text-xs font-bold font-sans">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-300" />
              <span>{blacklistResult.message}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Tự tra cứu ở nguồn chính thức:</p>
            {OFFICIAL_LOOKUP_LINKS.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                className="block text-xs text-cyan-400 hover:text-cyan-300 underline">
                {link.name}
              </a>
            ))}
            <p className="text-[11px] text-slate-400">Ứng dụng nTrust (Hiệp hội An ninh mạng quốc gia) tra được số điện thoại và số tài khoản.</p>
          </div>
        </div>
      )}

      {/* Crowd-sourcing Report Form Toggle */}
      <div className="pt-2 border-t border-slate-800/60">
        <button
          type="button"
          onClick={() => setShowReportForm(!showReportForm)}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-cyan-400" />
          <span>
            {showReportForm ? 'Thu gọn biểu mẫu báo cáo' : 'Đóng góp Báo cáo SĐT / STK lừa đảo mới'}
          </span>
        </button>

        {showReportForm && (
          <form onSubmit={handleReportSubmit} className="mt-3 space-y-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs">
            <p className="text-xs font-black text-white font-mono uppercase tracking-wider text-slate-300">
              Báo Cáo SĐT / STK Lừa Đảo Cho Cộng Đồng:
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Báo cáo lưu tạm trên máy chủ ScamGuard (có thể mất khi máy chủ khởi động lại), chưa ai xác minh. Chỉ báo cáo khi bạn chắc chắn; nếu đã bị lừa, hãy trình báo công an.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'phone' | 'stk')}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500"
              >
                <option value="phone">Số điện thoại</option>
                <option value="stk">Số tài khoản ngân hàng</option>
              </select>
              <input
                type="text"
                value={reportIdentifier}
                onChange={(e) => setReportIdentifier(e.target.value)}
                placeholder={reportType === 'stk' ? "Số tài khoản ngân hàng..." : "Số điện thoại..."}
                className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>
            {reportType === 'stk' && (
              <input
                type="text"
                value={reportBank}
                onChange={(e) => setReportBank(e.target.value)}
                placeholder="Tên ngân hàng phát hành (VD: Vietcombank, Techcombank)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            )}
            <textarea
              rows={2}
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
              placeholder="Mô tả cụ thể hành vi hoặc kịch bản lừa đảo (VD: Nhắn tin đòi phạt nguội, giả mạo biên lai chuyển khoản ngân hàng)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500 font-sans"
            />
            
            {reportErrorMsg && (
              <div className="p-2.5 bg-rose-950/80 rounded-xl border border-rose-800 text-rose-300 flex items-start space-x-1 font-mono text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>{reportErrorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-500 cursor-pointer font-mono shadow-md shadow-rose-950"
            >
              GỬI BÁO CÁO (CHƯA XÁC MINH)
            </button>
            {reportSuccessMsg && (
              <p className="text-xs text-emerald-400 font-bold leading-relaxed">{reportSuccessMsg}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
