import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Shield,
  ShieldCheck,
  Zap,
  BookOpen,
  FileCheck2,
  Lock,
  ChevronRight,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getQuestionsForSector, CertificationQuestion } from '../data/certificationTopic1Questions';
import { CAMPAIGN_SECTORS } from '../data/campaignData';
import { shuffled } from '../utils/shuffle';
import { PostAppCertificationRecord } from '../types';

interface SectorTopic1CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectorNumber?: number;
  sectorTitle?: string;
  preAppScore?: number;
  onCertificateIssued?: (record: PostAppCertificationRecord) => void;
}

export const SectorTopic1CertificationModal: React.FC<SectorTopic1CertificationModalProps> = ({
  isOpen,
  onClose,
  sectorNumber = 1,
  sectorTitle = 'Khu Vực 1: Vành Đai Ngoại Ô Cảnh Giác',
  preAppScore = 45,
  onCertificateIssued,
}) => {
  // Dữ liệu đặt đáp án đúng ở B gần hết: xáo phương án và gán lại chữ cái theo vị trí mới,
  // để chấm điểm và phần đối soát đáp án vẫn khớp
  const examQuestions = useMemo(
    () =>
      getQuestionsForSector(sectorNumber).map((q) => {
        const order = shuffled(q.options);
        const letters = ['A', 'B', 'C', 'D'] as const;
        return {
          ...q,
          options: order.map((o, i) => ({ ...o, id: letters[i] })),
          correctAnswer: letters[order.findIndex((o) => o.id === q.correctAnswer)],
        };
      }),
    [sectorNumber]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedRecord, setCompletedRecord] = useState<PostAppCertificationRecord | null>(null);
  const [showReviewDetails, setShowReviewDetails] = useState(false);

  // Sector and prerequisite completion verification
  const sectorData = useMemo(() => {
    return CAMPAIGN_SECTORS.find((s) => s.sectorNumber === sectorNumber);
  }, [sectorNumber]);

  const completionStats = useMemo(() => {
    try {
      const stored = localStorage.getItem('scamguard_campaign_completed_nodes');
      const completedNodeIds: string[] = stored ? JSON.parse(stored) : [];
      const totalNodes = sectorData?.nodes || [];
      const completedCount = totalNodes.filter((n) => completedNodeIds.includes(n.id)).length;
      const isCompleted = totalNodes.length > 0 && completedCount === totalNodes.length;
      return {
        completedCount,
        totalCount: totalNodes.length,
        isCompleted,
        remainingCount: Math.max(0, totalNodes.length - completedCount),
        nodes: totalNodes.map((n) => ({
          ...n,
          isDone: completedNodeIds.includes(n.id),
        })),
      };
    } catch {
      return {
        completedCount: 0,
        totalCount: 10,
        isCompleted: false,
        remainingCount: 10,
        nodes: [],
      };
    }
  }, [sectorData, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setSelectedAnswers({});
      setStartTime(Date.now());
      setIsSubmitted(false);
      setSubmitting(false);
      setCompletedRecord(null);
      setShowReviewDetails(false);
    }
  }, [isOpen, sectorNumber]);

  if (!isOpen) return null;

  const currentQ: CertificationQuestion = examQuestions[currentIndex] || examQuestions[0];
  const totalQuestions = examQuestions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (questionId: number, optionId: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (answeredCount < totalQuestions) {
      const confirmIncomplete = window.confirm(
        `Bạn mới trả lời ${answeredCount}/${totalQuestions} câu hỏi. Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?`
      );
      if (!confirmIncomplete) return;
    }

    try {
      setSubmitting(true);

      // Compute score
      let correctCount = 0;
      const questionDetails = examQuestions.map((q) => {
        const userAnswer = selectedAnswers[q.id] || '';
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          userAnswer,
          isCorrect,
        };
      });

      const scorePct = Math.round((correctCount / totalQuestions) * 100);
      const isPassed = scorePct > 50; // Pass criteria: > 50%
      const postAppScore = Math.min(100, Math.round(50 + (correctCount / totalQuestions) * 50));
      const timeSpentSec = Math.round((Date.now() - startTime) / 1000);
      // Mã chứng nhận của ứng dụng (không phải văn bằng của cơ quan, cuộc thi nào)
      const certCode = `SG-KV${sectorNumber}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

      // Participant info from localStorage if present
      const savedUserStr = localStorage.getItem('scamguard_auth_user');
      let pName = 'Học viên ScamGuard';
      let anonCode = `HV-${Math.floor(1000 + Math.random() * 9000)}`;
      let demoGroup = 'STUDENT';
      let effectivePreScore = preAppScore;

      // Check if user completed 5-minute pre-survey
      try {
        const surveyRecord = localStorage.getItem('visef_my_latest_survey');
        if (surveyRecord) {
          const s = JSON.parse(surveyRecord);
          if (s.calculatedScore) effectivePreScore = s.calculatedScore;
          if (s.participantName) pName = s.participantName;
          if (s.demographicGroup) demoGroup = s.demographicGroup;
        }
      } catch (e) {
        // ignore
      }

      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u.name) pName = u.name;
          if (u.anonymousCode) anonCode = u.anonymousCode;
          if (u.demographicGroup) demoGroup = u.demographicGroup;
        } catch (e) {
          // ignore
        }
      }

      const deltaScore = postAppScore - effectivePreScore;

      const record: PostAppCertificationRecord = {
        id: `CERT-EXAM-${Date.now()}`,
        participantName: pName,
        anonymousCode: anonCode,
        demographicGroup: demoGroup as any,
        sectorId: `sector-${sectorNumber}`,
        sectorNumber,
        sectorTitle,
        totalQuestions,
        correctAnswersCount: correctCount,
        scorePct,
        isPassed,
        preAppScore: effectivePreScore,
        postAppScore,
        deltaScore,
        timeSpentSeconds: timeSpentSec,
        questionDetails,
        certificateCode: certCode,
        completedAt: new Date().toISOString(),
      };

      // Save locally for instant persistence
      try {
        const existingCertListStr = localStorage.getItem('visef_post_app_certifications');
        const list: PostAppCertificationRecord[] = existingCertListStr ? JSON.parse(existingCertListStr) : [];
        list.unshift(record);
        localStorage.setItem('visef_post_app_certifications', JSON.stringify(list));
      } catch (e) {
        console.error('Save local cert error', e);
      }

      // Send to server research endpoint
      try {
        await fetch('/api/research/post-app-certifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
      } catch (err) {
        console.warn('Could not post to server cert endpoint, local saved', err);
      }

      // Notify other views & research tabs
      window.dispatchEvent(new CustomEvent('visef_post_cert_updated', { detail: record }));
      window.dispatchEvent(new CustomEvent('visef_survey_updated'));

      setCompletedRecord(record);
      setIsSubmitted(true);

      if (isPassed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#6366f1', '#f59e0b'],
        });
      }

      if (onCertificateIssued) {
        onCertificateIssued(record);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setCompletedRecord(null);
    setShowReviewDetails(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shadow-md">
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  Bài kiểm tra cuối khu vực
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Chứng nhận của ứng dụng ScamGuard VN
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                Kiểm Tra Cuối Khu Vực {sectorNumber}: {sectorTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB-HEADER / PROGRESS BAR */}
        {!isSubmitted && completionStats.isCompleted && (
          <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-slate-300 font-bold">
                Câu {currentIndex + 1}/{totalQuestions}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                Đã trả lời: <strong className="text-cyan-400">{answeredCount}</strong>/{totalQuestions}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold">Tiêu chuẩn qua: &gt; 50% (≥ {Math.floor(totalQuestions / 2) + 1}/{totalQuestions} câu)</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-cyan-400 font-bold">{progressPct}%</span>
            </div>
          </div>
        )}

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!completionStats.isCompleted ? (
            /* LOCKED GATE: SECTOR NOT FINISHED YET */
            <div className="py-8 px-4 max-w-xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center mx-auto text-rose-400 shadow-xl shadow-rose-500/10">
                <Lock className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Chưa Đủ Điều Kiện Sát Hạch</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Chưa Hoàn Thành Toàn Bộ Trạm Khu Vực {sectorNumber}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                  Theo quy định của ScamGuard: học viên <strong className="text-white">chỉ được làm bài kiểm tra cuối khu vực</strong> sau khi đã trải nghiệm và vượt qua toàn bộ <strong>{completionStats.totalCount} trạm phòng thủ</strong> trong Khu Vực {sectorNumber}: <em>{sectorTitle}</em>.
                </p>
              </div>

              {/* Station Progress Card */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 text-left">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Tiến độ trạm thực hành:</span>
                  <span className="font-bold text-amber-400">
                    {completionStats.completedCount} / {completionStats.totalCount} Trạm (Còn thiếu {completionStats.remainingCount} trạm)
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.round((completionStats.completedCount / Math.max(1, completionStats.totalCount)) * 100)}%`,
                    }}
                  />
                </div>

                {/* Stations List Preview */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {completionStats.nodes.map((n, idx) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        n.isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate mr-2">
                        {n.isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="font-bold font-mono">Trạm {idx + 1}:</span>
                        <span className="truncate">{n.title}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                          n.isDone
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {n.isDone ? 'ĐÃ HỌC' : 'CHƯA HỌC'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Vào Lộ Trình Hoàn Thành Các Trạm Còn Lại</span>
                </button>
              </div>
            </div>
          ) : !isSubmitted ? (
            /* ACTIVE EXAM QUESTION VIEW */
            <div className="space-y-6">
              {/* Question Card */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-indigo-950/90 text-indigo-300 border border-indigo-500/30">
                      CÂU {currentQ.id}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                        currentQ.difficulty === 'EASY'
                          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                          : currentQ.difficulty === 'MEDIUM'
                          ? 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                          : 'bg-rose-950/60 text-rose-300 border-rose-500/50 shadow-sm'
                      }`}
                    >
                      {currentQ.difficulty === 'EASY'
                        ? '🟢 MỨC ĐỘ DỄ'
                        : currentQ.difficulty === 'MEDIUM'
                        ? '🟡 MỨC ĐỘ TRUNG BÌNH'
                        : '🔴 MỨC ĐỘ KHÓ (BẪY CHUYÊN SÂU)'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    Chủ đề: <strong className="text-slate-200">{currentQ.topic}</strong>
                  </span>
                </div>

                <div className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                  {currentQ.scenario}
                </div>

                {currentQ.difficulty === 'HARD' && (
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      <strong>Lưu ý:</strong> Kịch bản này không có từ khóa gợi ý như &quot;Không&quot; hay &quot;Luôn luôn&quot;. Hãy cân nhắc tính hợp lý trong quy trình thao tác bảo mật thực tế.
                    </span>
                  </div>
                )}
              </div>

              {/* 4 Multiple Choice Options */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Chọn 01 phương án xử lý an toàn nhất:
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {currentQ.options.map((option) => {
                    const isSelected = selectedAnswers[currentQ.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, option.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start space-x-3 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/70 border-indigo-400 text-white ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-500/10 scale-[1.01]'
                            : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-indigo-500/40'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {option.id}
                        </span>
                        <span className="text-sm font-medium leading-snug pt-0.5">{option.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Navigation Bar (Grid 1-20) */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
                  <span>Ma trận {totalQuestions} câu:</span>
                  <span className="text-slate-500">Màu xanh = Đã chọn • Đỏ viền = Câu khó</span>
                </div>
                <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
                  {examQuestions.map((q, idx) => {
                    const isAnswered = !!selectedAnswers[q.id];
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-7 rounded-md font-mono text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-900 bg-cyan-600 text-white'
                            : isAnswered
                            ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/40'
                            : q.difficulty === 'HARD'
                            ? 'bg-slate-900 text-rose-300 border border-rose-900/60 hover:bg-slate-800'
                            : 'bg-slate-900 text-slate-500 border border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* SUBMITTED / CERTIFICATE RESULT VIEW */
            <div className="space-y-6 animate-fade-in">
              {completedRecord && (
                <>
                  {/* HERO RESULT BADGE */}
                  <div
                    className={`p-6 rounded-3xl border text-center space-y-4 ${
                      completedRecord.isPassed
                        ? 'bg-gradient-to-b from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/50 shadow-2xl shadow-emerald-500/10'
                        : 'bg-gradient-to-b from-rose-950/60 via-slate-900 to-slate-950 border-rose-500/50 shadow-2xl shadow-rose-500/10'
                    }`}
                  >
                    <div className="inline-flex p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner">
                      {completedRecord.isPassed ? (
                        <ShieldCheck className="w-12 h-12 text-emerald-400 animate-bounce-subtle" />
                      ) : (
                        <AlertTriangle className="w-12 h-12 text-rose-400 animate-pulse" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs uppercase font-mono tracking-widest text-slate-400">
                        {completedRecord.isPassed
                          ? `CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH KHU VỰC ${completedRecord.sectorNumber}`
                          : 'KẾT QUẢ KIỂM TRA CHƯA ĐẠT'}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                        {completedRecord.isPassed
                          ? 'ĐẠT BÀI KIỂM TRA CUỐI KHU VỰC'
                          : 'CẦN ÔN TẬP LẠI KHU VỰC & THI LẠI'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
                        {completedRecord.isPassed
                          ? 'Kết quả bài kiểm tra đã được gửi lên máy chủ ScamGuard để tổng hợp cho đề tài.'
                          : `Cần đúng trên 50% (hơn ${Math.floor(completedRecord.totalQuestions / 2)} trên ${completedRecord.totalQuestions} câu). Bạn hãy xem lại các câu sai và thử lại nhé!`}
                      </p>
                    </div>

                    {/* SCORE METRIC TILES */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                      <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Số câu đúng</div>
                        <div className="text-xl font-mono font-black text-cyan-400">
                          {completedRecord.correctAnswersCount}/{completedRecord.totalQuestions}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Tỷ lệ chính xác</div>
                        <div
                          className={`text-xl font-mono font-black ${
                            completedRecord.isPassed ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {completedRecord.scorePct}%
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Điểm sau học</div>
                        <div className="text-xl font-mono font-black text-indigo-400">
                          {completedRecord.postAppScore}/100
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Tăng trưởng Δ</div>
                        <div className="text-xl font-mono font-black text-emerald-400">
                          +{completedRecord.deltaScore}đ
                        </div>
                      </div>
                    </div>

                    {/* OFFICIAL CERTIFICATE BADGE CARD */}
                    {completedRecord.isPassed && (
                      <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-950 to-emerald-950/40 border border-indigo-500/40 text-left max-w-xl mx-auto relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-indigo-400/20">
                          <Award className="w-24 h-24" />
                        </div>
                        <div className="relative z-10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-300 font-bold">
                              CHỨNG NHẬN HOÀN THÀNH – SCAMGUARD VN
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                              DO ỨNG DỤNG CẤP
                            </span>
                          </div>
                          <div className="text-base font-bold text-white">
                            Chứng nhận hoàn thành Khu vực {completedRecord.sectorNumber}: {completedRecord.sectorTitle}
                          </div>
                          <div className="text-xs text-slate-300">
                            Cấp cho: <strong>{completedRecord.participantName}</strong> ({completedRecord.anonymousCode})
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                            <span>Mã chứng nhận: <strong className="text-cyan-400">{completedRecord.certificateCode}</strong></span>
                            <span>Điểm: {completedRecord.correctAnswersCount}/{completedRecord.totalQuestions} câu đúng</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Chứng nhận do ứng dụng ScamGuard VN (sản phẩm dự thi KHKT) tự cấp, không phải văn bằng, chứng chỉ chính thức.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewDetails(!showReviewDetails)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center space-x-2 cursor-pointer border border-slate-700"
                    >
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>{showReviewDetails ? 'Ẩn Lời Giải Chi Tiết' : 'Xem Lời Giải Chi Tiết 20 Câu'}</span>
                    </button>

                    {!completedRecord.isPassed && (
                      <button
                        type="button"
                        onClick={handleRetake}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center space-x-2 cursor-pointer shadow-lg shadow-rose-600/20"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Thi Lại Ngay</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center space-x-2 cursor-pointer shadow-lg shadow-indigo-600/20"
                    >
                      <span>Đóng</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* QUESTION-BY-QUESTION AUDIT REVIEW */}
                  {showReviewDetails && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                        <FileCheck2 className="w-4 h-4 text-cyan-400" />
                        <span>Đối soát đáp án & giải thích ({completedRecord.totalQuestions} câu):</span>
                      </h4>

                      <div className="space-y-3">
                        {examQuestions.map((q) => {
                          const userAns = selectedAnswers[q.id];
                          const isCorrect = userAns === q.correctAnswer;
                          return (
                            <div
                              key={q.id}
                              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                                isCorrect
                                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                                  : 'bg-rose-950/20 border-rose-500/30 text-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between font-mono">
                                <span className="font-bold">
                                  Câu {q.id} ({q.difficulty}): {q.topic}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded font-bold ${
                                    isCorrect
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-rose-500/20 text-rose-300'
                                  }`}
                                >
                                  {isCorrect ? '✓ Đúng' : `✗ Sai (Bạn chọn ${userAns || 'Chưa chọn'} - Đáp án đúng là ${q.correctAnswer})`}
                                </span>
                              </div>

                              <p className="text-slate-300 leading-relaxed">{q.scenario}</p>

                              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-300 space-y-1">
                                <div className="font-bold text-cyan-400 flex items-center space-x-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Giải thích cơ chế an ninh:</span>
                                </div>
                                <div className="text-slate-400">{q.explanation}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS (FOR EXAM IN PROGRESS) */}
        {!isSubmitted && (
          <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                currentIndex === 0
                  ? 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed'
                  : 'text-slate-300 bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <div className="flex items-center space-x-3">
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-500/25"
                >
                  <span>Câu kế tiếp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer shadow-xl shadow-indigo-500/30"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>Nộp Bài Sát Hạch</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
