import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  ThumbsUp,
  ThumbsDown,
  QrCode,
  Eye,
  Video,
  Database,
  Cpu,
  Globe,
  Lock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccessChime, playRewardTrophy } from '../utils/audioEffects';
import { lookupDomainAge, describeDomainAge } from '../services/domainAgeService';
import { OFFICIAL_LOOKUP_LINKS, SELF_CHECK_STEPS, detectIdentifierKind } from '../data/officialLookup';
import { checkDomain, riskLevelOf, DomainCheck } from '../utils/domainCheck';

interface DomainResult {
  check: DomainCheck;
  score: number;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  ageText?: string;
}

const LEVEL_STYLE = {
  HIGH: { box: 'bg-red-950/20 border-red-500/30', text: 'text-rose-400', label: 'NGUY HIỂM CAO' },
  MEDIUM: { box: 'bg-amber-950/20 border-amber-500/30', text: 'text-amber-400', label: 'ĐÁNG NGỜ' },
  LOW: { box: 'bg-emerald-950/20 border-emerald-500/30', text: 'text-emerald-400', label: 'CHƯA THẤY DẤU HIỆU' },
};

const SCHEME_TEXT = {
  https: 'Có dùng HTTPS (chưa kiểm tra chứng chỉ)',
  http: 'Dùng http:// – không mã hóa',
  none: 'Chưa rõ (bạn chưa nhập http:// hay https://)',
};

// Thẻ kết quả dùng chung cho Domain Reputation và kiểm tra link QR
const DomainResultCard: React.FC<{ result: DomainResult }> = ({ result }) => {
  const style = LEVEL_STYLE[result.level];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-5 rounded-2xl border space-y-4 text-slate-100 ${style.box}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <p className="text-[10px] font-mono font-bold text-slate-500">TÊN MIỀN:</p>
          <p className="text-sm font-black font-mono text-cyan-400 break-all">{result.check.host}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono font-bold text-slate-500">ĐIỂM RỦI RO:</p>
          <p className={`text-xl font-black font-mono ${style.text}`}>{result.score}/100</p>
          <p className={`text-[10px] font-black font-mono ${style.text}`}>{style.label}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        {result.ageText && (
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-bold">• TUỔI TÊN MIỀN (TRA RDAP):</p>
            <p className="text-slate-200 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{result.ageText}</span>
            </p>
          </div>
        )}
        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 font-bold">• GIAO THỨC:</p>
          <p className="text-slate-200 flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>{SCHEME_TEXT[result.check.scheme]}</span>
          </p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Dấu hiệu tìm thấy:</p>
        {result.check.findings.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            {result.check.findings.map((f, idx) => (
              <li key={idx}>{f}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-300">Không thấy dấu hiệu giả mạo trong tên miền.</p>
        )}
      </div>

      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs font-sans leading-relaxed">
        <p className="font-bold text-white mb-1">Lời khuyên:</p>
        <p className="text-slate-300">
          {result.level === 'LOW'
            ? 'Chưa thấy dấu hiệu đáng ngờ trong tên miền. Điểm thấp không có nghĩa là trang an toàn: ScamGuard chỉ xét tên miền, không mở trang. Với ngân hàng, cơ quan, hãy tự gõ địa chỉ chính thức thay vì bấm link được gửi đến.'
            : 'Không bấm link, không nhập mật khẩu hay mã OTP. Muốn vào trang của tổ chức, hãy tự gõ tên miền chính thức hoặc dùng ứng dụng chính thức.'}
        </p>
      </div>
    </motion.div>
  );
};

interface CommunityNote {
  id: string;
  target: string;
  type: 'url' | 'phone' | 'stk';
  scamType: string;
  description: string;
  upvotes: number;
  downvotes: number;
  userVoted?: 'up' | 'down';
  verifiedStatus: 'PENDING' | 'VERIFIED' | 'DISPUTED';
  timestamp: string;
}

// Không có dữ liệu gõ sẵn: ghi chú chỉ do người dùng thêm và chỉ nằm trên trình duyệt này
const INITIAL_NOTES: CommunityNote[] = [];

export const DomainReputationTab: React.FC = () => {
  // Navigation for Sub-modules
  const [activeSubTab, setActiveSubTab] = useState<'reputation' | 'community' | 'qr_sandbox' | 'deepfake' | 'osint'>('reputation');

  // 1. Reputation Engine States
  const [domainInput, setDomainInput] = useState('');
  const [repResult, setRepResult] = useState<DomainResult | null>(null);
  const [repLoading, setRepLoading] = useState(false);
  const [repError, setRepError] = useState('');

  // 2. Community Feed States
  const [communityNotes, setCommunityNotes] = useState<CommunityNote[]>(INITIAL_NOTES);
  const [newTarget, setNewTarget] = useState('');
  const [newType, setNewType] = useState<'url' | 'phone' | 'stk'>('url');
  const [newScamType, setNewScamType] = useState('Giả Mạo Thương Hiệu');
  const [newDesc, setNewDesc] = useState('');

  // 3. Kiểm tra link đọc từ mã QR
  const [qrInputUrl, setQrInputUrl] = useState('https://vietcombank-xacminh.xyz/digibank/verify-otp');
  const [qrResult, setQrResult] = useState<DomainResult | null>(null);
  const [qrError, setQrError] = useState('');

  // 5. OSINT States
  const [osintQuery, setOsintQuery] = useState('');
  const [osintResult, setOsintResult] = useState<any | null>(null);
  const [osintLoading, setOsintLoading] = useState(false);

  // Kiểm tra tên miền: so tên miền chính thức, đuôi giá rẻ, ký tự đồng hình, link rút gọn + tuổi tên miền (RDAP)
  const handleCheckReputation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    const check = checkDomain(domainInput);
    setRepResult(null);
    if (!check) {
      setRepError('Không đọc được tên miền. Hãy nhập dạng ten-mien.com hoặc dán cả đường link.');
      return;
    }
    setRepError('');
    setRepLoading(true);
    const age = await lookupDomainAge(check.registrable);
    let score = check.score;
    const findings = [...check.findings];
    if (age.available && age.ageDays !== undefined && age.ageDays < 30 && !check.officialBrand) {
      score = Math.min(99, score + 15);
      findings.push(`Tên miền mới đăng ký được ${age.ageDays} ngày.`);
    }
    setRepResult({ check: { ...check, findings }, score, level: riskLevelOf(score), ageText: describeDomainAge(age) });
    setRepLoading(false);
    playSuccessChime();
  };

  // Handle Note Voting
  const handleVote = (id: string, voteType: 'up' | 'down') => {
    setCommunityNotes(prev => prev.map(note => {
      if (note.id !== id) return note;
      
      let upvotes = note.upvotes;
      let downvotes = note.downvotes;
      let userVoted = note.userVoted;

      if (userVoted === voteType) {
        // undo vote
        if (voteType === 'up') upvotes--;
        else downvotes--;
        userVoted = undefined;
      } else {
        // undo previous vote if any
        if (userVoted === 'up') upvotes--;
        else if (userVoted === 'down') downvotes--;

        // apply new vote
        if (voteType === 'up') upvotes++;
        else downvotes++;
        userVoted = voteType;
      }

      return {
        ...note,
        upvotes,
        downvotes,
        userVoted
      };
    }));
    playSuccessChime();
  };

  // Handle Note Submission
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget.trim() || !newDesc.trim()) return;

    const note: CommunityNote = {
      id: `note-${Date.now()}`,
      target: newTarget.trim(),
      type: newType,
      scamType: newScamType,
      description: newDesc.trim(),
      upvotes: 1,
      downvotes: 0,
      userVoted: 'up',
      verifiedStatus: 'PENDING',
      timestamp: 'Vừa xong'
    };

    setCommunityNotes([note, ...communityNotes]);
    setNewTarget('');
    setNewDesc('');
    playRewardTrophy();
  };

  // Kiểm tra link đọc từ mã QR bằng cùng bộ kiểm tra tên miền (không giải mã ảnh QR, không mở trang)
  const handleQRScan = () => {
    const check = checkDomain(qrInputUrl);
    setQrResult(check ? { check, score: check.score, level: riskLevelOf(check.score) } : null);
    setQrError(check ? '' : 'Không đọc được tên miền trong link này.');
    if (check) playSuccessChime();
  };

  // Hướng dẫn tự tra cứu SĐT / STK / email. Ứng dụng KHÔNG tự tra hay chấm điểm người khác:
  // không có cổng dữ liệu công khai, và thông tin thuê bao, tài khoản là dữ liệu cá nhân.
  const handleOSINTCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!osintQuery.trim()) return;
    const kind = detectIdentifierKind(osintQuery);
    setOsintResult({
      identifier: osintQuery.trim(),
      kindLabel: { phone: 'Số điện thoại', stk: 'Số tài khoản ngân hàng', email: 'Email', other: 'Chưa nhận dạng được' }[kind],
      steps: SELF_CHECK_STEPS[kind],
    });
  };

  return (
    <div className="space-y-6">
      {/* Visual Tab Bar */}
      <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'reputation', label: '🌐 Domain Reputation', icon: Globe },
          { id: 'community', label: '🤝 Ghi chú cộng đồng (bản thử)', icon: Database },
          { id: 'qr_sandbox', label: '📱 Kiểm tra link QR', icon: QrCode },
          { id: 'deepfake', label: '🎥 Nhận biết Deepfake', icon: Video },
          { id: 'osint', label: '🔎 OSINT Cross-check', icon: Search }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'reputation' && (
          <motion.div
            key="reputation"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>KIỂM TRA TÊN MIỀN (DOMAIN REPUTATION)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                So tên miền với tên miền chính thức của ngân hàng, ví điện tử, cơ quan và các thương hiệu hay bị giả mạo (kể cả tên gõ lệch 1–2 ký tự); xét đuôi tên miền giá rẻ, ký tự đồng hình, link rút gọn; tra ngày đăng ký qua RDAP (chưa tra được đuôi .vn). ScamGuard không mở trang web và không kiểm tra nội dung trang.
              </p>
            </div>

            <form onSubmit={handleCheckReputation} className="flex gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Ví dụ: vietcomBank-xacminh.xyz, mbbanks.online, vneid-gov.vip..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={repLoading || !domainInput.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 font-mono cursor-pointer disabled:opacity-40"
              >
                {repLoading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>DANG QUET...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>THẨM ĐỊNH TÊN MIỀN</span>
                  </>
                )}
              </button>
            </form>

            {repError && <p className="text-xs text-amber-400 font-mono">{repError}</p>}
            {repResult && <DomainResultCard result={repResult} />}
          </motion.div>
        )}

        {activeSubTab === 'community' && (
          <motion.div
            key="community"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Notes List Feed */}
            <div className="lg:col-span-7 space-y-4">
              <div className="cartoon-card p-5 bg-slate-900/40 border-slate-800 space-y-3">
                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>GHI CHÚ CỘNG ĐỒNG (BẢN THỬ GIAO DIỆN)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Bản thử nghiệm giao diện: ghi chú chỉ lưu trên trình duyệt của bạn, tải lại trang là mất, người khác không thấy và chưa có ai xác minh. Muốn báo cáo chính thức, hãy dùng tinnhiemmang.vn hoặc chongluadao.vn.
                </p>
              </div>

              {communityNotes.length === 0 && (
                <div className="cartoon-card p-5 bg-slate-950/60 border-slate-800 text-xs text-slate-400 text-center">
                  Chưa có ghi chú nào. Thêm ghi chú ở khung bên cạnh để xem thử giao diện.
                </div>
              )}

              {communityNotes.map(note => (
                <div key={note.id} className="cartoon-card p-5 bg-slate-950/60 border-slate-800 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black font-mono text-cyan-400">{note.target}</p>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">{note.scamType}</p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                      note.verifiedStatus === 'VERIFIED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {note.verifiedStatus === 'VERIFIED' ? 'ĐÃ XÁC MINH' : 'CHƯA XÁC MINH'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{note.description}</p>

                  <div className="flex items-center justify-between pt-2 text-[10px] border-t border-slate-900/60 text-slate-500">
                    <span>Cập nhật: {note.timestamp}</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleVote(note.id, 'up')}
                        className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                          note.userVoted === 'up'
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{note.upvotes}</span>
                      </button>

                      <button
                        onClick={() => handleVote(note.id, 'down')}
                        className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                          note.userVoted === 'down'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>{note.downvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Report Sidebar */}
            <div className="lg:col-span-5">
              <div className="cartoon-card p-6 bg-slate-900/60 border-slate-800 space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center space-x-1.5">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>THÊM GHI CHÚ</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Ghi chú chỉ lưu trên máy này, chưa gửi cho ai. Đừng ghi số điện thoại, số tài khoản của người khác khi chưa chắc chắn họ lừa đảo.
                </p>

                <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Loại đối tượng:</label>
                    <div className="flex gap-1.5">
                      {['url', 'phone', 'stk'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewType(type as any)}
                          className={`flex-1 py-2 rounded-xl font-bold border cursor-pointer transition-all uppercase font-mono text-[10px] ${
                            newType === type
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Link / SĐT / STK:</label>
                    <input
                      type="text"
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value)}
                      placeholder={newType === 'url' ? 'vietcombank-xacminh.xyz' : (newType === 'phone' ? '0912...' : 'STK ngân hàng...')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Kịch bản lừa đảo:</label>
                    <select
                      value={newScamType}
                      onChange={(e) => setNewScamType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="Giả Mạo Thương Hiệu">Giả Mạo Thương Hiệu</option>
                      <option value="Giả danh Công An/VKS">Giả danh Công An/VKS</option>
                      <option value="Bẫy Tuyển Dụng / Nhiệm vụ Telegram">Bẫy Tuyển Dụng / Nhiệm vụ Telegram</option>
                      <option value="Lừa Đảo Giao Hàng (COD)">Lừa Đảo Giao Hàng (COD)</option>
                      <option value="Đầu Tư Sàn Ảo / Coin rác">Đầu Tư Sàn Ảo / Coin rác</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold uppercase font-mono">Chi tiết & chứng cứ ban đầu:</label>
                    <textarea
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Nêu rõ đòn tâm lý họ sử dụng và tên miền/STK họ yêu cầu tương tác..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!newTarget.trim() || !newDesc.trim()}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all uppercase tracking-wider font-mono cursor-pointer disabled:opacity-40"
                  >
                    LƯU GHI CHÚ (CHỈ TRÊN MÁY NÀY)
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'qr_sandbox' && (
          <motion.div
            key="qr_sandbox"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>KIỂM TRA LINK TRONG MÃ QR</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Dùng camera điện thoại đọc mã QR nhưng đừng mở link, rồi dán link vào đây để kiểm tra tên miền trước khi truy cập. ScamGuard chưa giải mã được ảnh QR và không mở trang web: chỉ kiểm tra tên miền giống mục Domain Reputation.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 font-mono uppercase">Link đọc được từ mã QR:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrInputUrl}
                  onChange={(e) => setQrInputUrl(e.target.value)}
                  placeholder="Dán link đọc được từ mã QR..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleQRScan}
                  disabled={!qrInputUrl.trim()}
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 font-mono cursor-pointer disabled:opacity-40"
                >
                  <Search className="w-4 h-4" />
                  <span>KIỂM TRA LINK</span>
                </button>
              </div>
              {qrError && <p className="text-xs text-amber-400 font-mono">{qrError}</p>}
            </div>

            {qrResult && <DomainResultCard result={qrResult} />}

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300">
              <p className="font-bold text-white mb-1">Lưu ý khi quét mã QR:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kẻ gian có thể dán mã QR giả đè lên mã thật ở bãi xe, quán ăn, tờ rơi.</li>
                <li>Khi chuyển tiền bằng QR, kiểm tra kỹ tên người nhận hiện trong app ngân hàng trước khi xác nhận.</li>
                <li>Không nhập mật khẩu, mã OTP vào trang mở ra từ mã QR lạ.</li>
              </ul>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'deepfake' && (
          <motion.div
            key="deepfake"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Video className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>NHẬN BIẾT CUỘC GỌI VIDEO DEEPFAKE</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ScamGuard chưa có công cụ phân tích video, giọng nói deepfake. Mục này là bảng tự kiểm tra khi bạn nhận cuộc gọi video đáng ngờ từ "người quen".
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-xs">
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Dấu hiệu đáng ngờ:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>Khuôn mặt ít biểu cảm, mắt ít chớp hoặc chớp bất thường.</li>
                  <li>Khẩu hình miệng không khớp với tiếng nói.</li>
                  <li>Viền mặt, tóc, tai bị nhòe khi người trong video quay nghiêng.</li>
                  <li>Cuộc gọi rất ngắn, hình mờ, lấy cớ "mạng yếu" rồi tắt máy.</li>
                  <li>Vừa thấy mặt đã nhờ chuyển tiền gấp, nhất là vào tài khoản của người khác.</li>
                </ul>
              </div>
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Cách kiểm tra nhanh:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>Tắt máy, tự gọi lại vào số điện thoại cũ bạn đã lưu của người đó.</li>
                  <li>Hỏi một chuyện riêng chỉ hai người biết.</li>
                  <li>Nhờ người đó quay mặt sang ngang hoặc đưa tay qua mặt.</li>
                  <li>Không chuyển tiền khi chưa xác minh được; báo người thân và trình báo công an nếu nghi ngờ.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'osint' && (
          <motion.div
            key="osint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="cartoon-card p-6 bg-slate-900/40 border-slate-800 space-y-6"
          >
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Search className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>HƯỚNG DẪN TỰ TRA CỨU SĐT / STK / EMAIL</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ScamGuard không tự tra cứu hay chấm điểm số điện thoại, tài khoản của người khác: không có cổng dữ liệu công khai, và đây là dữ liệu cá nhân. Nhập thông tin để xem cách tự kiểm tra ở nguồn chính thức.
              </p>
            </div>

            <form onSubmit={handleOSINTCheck} className="flex gap-2">
              <input
                type="text"
                value={osintQuery}
                onChange={(e) => setOsintQuery(e.target.value)}
                placeholder="Ví dụ: 0988112344, 19038291029..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={osintLoading || !osintQuery.trim()}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 font-mono cursor-pointer"
              >
                {osintLoading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>ĐANG XỬ LÝ...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>XEM CÁCH KIỂM TRA</span>
                  </>
                )}
              </button>
            </form>

            {osintResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 rounded-2xl border space-y-4 bg-slate-950/40 border-slate-700"
              >
                <div className="border-b border-slate-800 pb-3">
                  <p className="text-[10px] font-mono font-bold text-slate-500">THÔNG TIN CẦN KIỂM TRA ({osintResult.kindLabel}):</p>
                  <p className="text-sm font-black font-mono text-cyan-400">{osintResult.identifier}</p>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Cách tự kiểm tra:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    {osintResult.steps.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>

                  <p className="text-[10px] text-slate-500 font-bold uppercase font-mono">Nguồn tra cứu chính thức:</p>
                  <div className="space-y-2">
                    {OFFICIAL_LOOKUP_LINKS.map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="block p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50">
                        <span className="text-cyan-400 font-bold underline">{link.name}</span>
                        <span className="block text-slate-400 mt-0.5">{link.use}</span>
                      </a>
                    ))}
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs leading-relaxed">
                    <p className="font-bold text-white mb-1">Nếu đã chuyển tiền hoặc lộ mã OTP:</p>
                    <p className="text-slate-300">Gọi ngay tổng đài chính thức của ngân hàng để khóa tài khoản, rồi trình báo cơ quan công an nơi gần nhất.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
