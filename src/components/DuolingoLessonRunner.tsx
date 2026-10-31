import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Award,
  RefreshCw,
  Check,
  ArrowUp,
  ArrowDown,
  Zap,
  Repeat,
  RotateCcw,
  Play,
  Flame,
  Target,
  Clock,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  DuolingoLesson,
  DuolingoUnit,
  PracticeQuestion,
  SequenceStepItem,
} from '../data/duolingoLessons';
import { generateAdaptiveReplacementQuestion } from '../data/adaptiveQuestionEngine';
import { shuffled } from '../utils/shuffle';

interface DuolingoLessonRunnerProps {
  lesson: DuolingoLesson;
  unit: DuolingoUnit;
  isOpen: boolean;
  onClose: () => void;
  onCompleteLesson: (lessonId: string, earnedXp: number, shieldBadge: string) => void;
}

type LessonPhase = 'briefing' | 'theory' | 'practice' | 'story' | 'reward';

export const DuolingoLessonRunner: React.FC<DuolingoLessonRunnerProps> = ({
  lesson,
  unit,
  isOpen,
  onClose,
  onCompleteLesson,
}) => {
  const [phase, setPhase] = useState<LessonPhase>('briefing');
  const [hearts, setHearts] = useState<number>(3);

  // Dynamic Adaptive Practice Queue
  const [practiceQueue, setPracticeQueue] = useState<PracticeQuestion[]>([]);
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [replacementCount, setReplacementCount] = useState<number>(0);
  const [lastQuestionResult, setLastQuestionResult] = useState<{
    isChecked: boolean;
    isCorrect: boolean;
    feedback: string;
    replacementNotice?: string;
  } | null>(null);

  // Question Interaction States
  const [selectedMcOption, setSelectedMcOption] = useState<string | null>(null);
  const [selectedTf, setSelectedTf] = useState<boolean | null>(null);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [shuffledRightItems, setShuffledRightItems] = useState<{ id: string; text: string; matchesLeftId: string }[]>([]);
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);
  const [tappedSpotIds, setTappedSpotIds] = useState<string[]>([]);
  const [dragAssignments, setDragAssignments] = useState<Record<string, 'safe' | 'suspicious' | 'scam'>>({});
  const [currentSequence, setCurrentSequence] = useState<SequenceStepItem[]>([]);
  const [selectedChatChoice, setSelectedChatChoice] = useState<string | null>(null);
  const [selectedUrlPart, setSelectedUrlPart] = useState<string | null>(null);
  const [selectedStoryChoice, setSelectedStoryChoice] = useState<string | null>(null);
  const [isStoryChecked, setIsStoryChecked] = useState<boolean>(false);

  // Initialize Lesson Data on Open
  useEffect(() => {
    if (isOpen) {
      setPhase('briefing');
      setHearts(3);
      setPracticeQueue([...lesson.practice]);
      setPracticeIndex(0);
      setReplacementCount(0);
      setLastQuestionResult(null);
      resetQuestionStates();
    }
  }, [isOpen, lesson.id]);

  const resetQuestionStates = () => {
    setSelectedMcOption(null);
    setSelectedTf(null);
    setSelectedLeftId(null);
    setMatchedPairs({});
    setShuffledRightItems([]);
    setWrongMatch(false);
    setTappedSpotIds([]);
    setDragAssignments({});
    setCurrentSequence([]);
    setSelectedChatChoice(null);
    setSelectedUrlPart(null);
    setSelectedStoryChoice(null);
    setIsStoryChecked(false);
    setLastQuestionResult(null);
  };

  const currentQuestion: PracticeQuestion | undefined = practiceQueue[practiceIndex];
  // Xáo phương án mỗi khi sang câu mới để đáp án đúng không luôn ở cùng vị trí
  const mcOptions = useMemo(() => shuffled(currentQuestion?.options ?? []), [currentQuestion]);

  // Initialize matching items with right column randomized
  useEffect(() => {
    if (currentQuestion?.type === 'matching' && currentQuestion.matchingPairs) {
      const rightItems = currentQuestion.matchingPairs.map((p) => p.right);
      // Fisher-Yates shuffle
      const shuffled = [...rightItems];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledRightItems(shuffled);
    }
  }, [practiceIndex, currentQuestion?.id]);

  // Initialize sequence question items with robust shuffle
  useEffect(() => {
    if (currentQuestion?.type === 'order_sequence' && currentQuestion.sequenceItems) {
      const shuffled = [...currentQuestion.sequenceItems];
      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // If by rare chance it's already in correct order, reverse to ensure user interacts
      const isAlreadySorted = shuffled.every((item, idx) => item.correctOrder === idx + 1);
      if (isAlreadySorted && shuffled.length > 1) {
        shuffled.reverse();
      }
      setCurrentSequence(shuffled);
    }
  }, [practiceIndex, currentQuestion?.id]);

  if (!isOpen) return null;

  // Helper to trigger adaptive replacement question when answer is wrong (MAX 4 REPLACEMENTS)
  const MAX_REPLACEMENTS = 4;
  const handleWrongAnswer = (explanation: string, typeName: string) => {
    setHearts((h) => Math.max(1, h - 1));
    const currentReplacements = replacementCount;
    const canReplace = currentReplacements < MAX_REPLACEMENTS;

    if (canReplace) {
      const nextAttempt = currentReplacements + 1;
      setReplacementCount(nextAttempt);

      if (currentQuestion) {
        const replacementQ = generateAdaptiveReplacementQuestion(currentQuestion, lesson, nextAttempt);
        // Append the replacement question of similar type into the queue
        setPracticeQueue((prev) => [...prev, replacementQ]);
      }

      setLastQuestionResult({
        isChecked: true,
        isCorrect: false,
        feedback: explanation,
        replacementNotice: `Hệ thống vừa bổ sung 1 tình huống bù (${nextAttempt}/${MAX_REPLACEMENTS}) dạng [${typeName}] vào cuối buổi học để bạn rèn luyện phản xạ!`,
      });
    } else {
      // Reached max 4 replacements, no more questions are added
      setLastQuestionResult({
        isChecked: true,
        isCorrect: false,
        feedback: explanation,
        replacementNotice: `⚠️ Đã đạt giới hạn tối đa ${MAX_REPLACEMENTS} lượt bù câu hỏi. Hệ thống sẽ không thêm câu mới, hãy tiếp tục hoàn thành các câu còn lại trong hàng đợi!`,
      });
    }
  };

  const handleCorrectAnswer = (explanation: string) => {
    setLastQuestionResult({
      isChecked: true,
      isCorrect: true,
      feedback: explanation || 'Chính xác tuyệt đối! Bạn đã nắm vững nguyên tắc bảo mật.',
    });
  };

  // 1. Multiple Choice Check
  const handleCheckMc = () => {
    if (!selectedMcOption || !currentQuestion) return;
    const chosen = currentQuestion.options?.find((o) => o.id === selectedMcOption);
    if (chosen?.isCorrect) {
      handleCorrectAnswer(chosen.explanation);
    } else {
      const correctOne = currentQuestion.options?.find((o) => o.isCorrect);
      handleWrongAnswer(
        `${chosen?.explanation || 'Lựa chọn chưa chính xác.'} Đáp án đúng: ${correctOne?.text}`,
        'Trắc nghiệm tình huống'
      );
    }
  };

  // 2. True / False Check
  const handleCheckTf = () => {
    if (selectedTf === null || !currentQuestion || !currentQuestion.trueFalseAnswer) return;
    const isCorrect = selectedTf === currentQuestion.trueFalseAnswer.isTrue;
    if (isCorrect) {
      handleCorrectAnswer(currentQuestion.trueFalseAnswer.explanation);
    } else {
      handleWrongAnswer(currentQuestion.trueFalseAnswer.explanation, 'Thử thách Đúng / Sai');
    }
  };

  // 3. Matching Pairs Check
  const handleLeftMatchClick = (id: string) => {
    if (matchedPairs[id] || lastQuestionResult?.isChecked) return;
    setSelectedLeftId(id);
    setWrongMatch(false);
  };

  const handleRightMatchClick = (rightItem: { id: string; text: string; matchesLeftId: string }) => {
    if (!selectedLeftId || lastQuestionResult?.isChecked) return;
    if (Object.values(matchedPairs).includes(rightItem.id)) return;

    if (rightItem.matchesLeftId === selectedLeftId) {
      const newMatched = { ...matchedPairs, [selectedLeftId]: rightItem.id };
      setMatchedPairs(newMatched);
      setSelectedLeftId(null);
      setWrongMatch(false);

      if (currentQuestion?.matchingPairs && Object.keys(newMatched).length === currentQuestion.matchingPairs.length) {
        handleCorrectAnswer('Xuất sắc! Bạn đã ghép nối chính xác tất cả các khái niệm và hành động phòng thủ.');
      }
    } else {
      setWrongMatch(true);
      setTimeout(() => setWrongMatch(false), 800);
      setHearts((h) => Math.max(1, h - 1));
    }
  };

  // 4. Spot Red Flags Check
  const handleToggleSpot = (spotId: string) => {
    if (lastQuestionResult?.isChecked) return;
    if (tappedSpotIds.includes(spotId)) {
      setTappedSpotIds((prev) => prev.filter((id) => id !== spotId));
    } else {
      setTappedSpotIds((prev) => [...prev, spotId]);
    }
  };

  const handleCheckSpot = () => {
    if (!currentQuestion?.spotData) return;
    const spots = currentQuestion.spotData.spots;
    const requiredRedFlagIds = spots.filter((s) => s.isRedFlag).map((s) => s.id);
    const chosenAreRedFlags = tappedSpotIds.every((id) => requiredRedFlagIds.includes(id));
    const allFound = requiredRedFlagIds.every((id) => tappedSpotIds.includes(id));

    if (chosenAreRedFlags && allFound) {
      handleCorrectAnswer('Tuyệt vời! Bạn đã soi ra chính xác 100% các cờ đỏ lừa đảo được ẩn giấu.');
    } else {
      handleWrongAnswer(
        'Bạn đã bỏ sót hoặc chọn nhầm cờ đỏ. Hãy xem kỹ phân tích giải mã các điểm nguy vấn.',
        'Soi điểm nghi vấn'
      );
    }
  };

  // 5. Drag / Drop Zone Check
  const handleAssignCategory = (itemId: string, category: 'safe' | 'suspicious' | 'scam') => {
    if (lastQuestionResult?.isChecked) return;
    setDragAssignments((prev) => ({ ...prev, [itemId]: category }));
  };

  const handleCheckDrag = () => {
    if (!currentQuestion?.dragDropItems) return;
    const items = currentQuestion.dragDropItems;
    const isAllCorrect = items.every((item) => dragAssignments[item.id] === item.correctCategory);

    if (isAllCorrect) {
      handleCorrectAnswer('Phân loại hoàn hảo! Bạn đã nhận diện chuẩn xác từng cấp độ rủi ro tin nhắn.');
    } else {
      handleWrongAnswer(
        'Có thông điệp bị phân loại chưa đúng. Hãy xem chi tiết giải thích cho từng mục bên dưới.',
        'Phân loại an toàn'
      );
    }
  };

  // 6. Order Sequence Check
  const handleMoveSequenceStep = (index: number, direction: 'up' | 'down') => {
    if (lastQuestionResult?.isChecked) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentSequence.length) return;

    const newSeq = [...currentSequence];
    const temp = newSeq[index];
    newSeq[index] = newSeq[targetIdx];
    newSeq[targetIdx] = temp;
    setCurrentSequence(newSeq);
  };

  const handleCheckSequence = () => {
    const isCorrectOrder = currentSequence.every((item, idx) => item.correctOrder === idx + 1);
    if (isCorrectOrder) {
      handleCorrectAnswer('Chính xác! Thứ tự các bước ứng phó khẩn cấp của bạn rất khoa học.');
    } else {
      handleWrongAnswer(
        'Thứ tự phản ứng chưa tối ưu. Việc khóa tài khoản/đổi mật khẩu luôn cần ưu tiên hàng đầu trước khi báo cáo.',
        'Sắp xếp quy trình'
      );
    }
  };

  // 7. URL Dissection Check
  const handleCheckUrl = () => {
    if (!selectedUrlPart || !currentQuestion?.urlData) return;
    if (selectedUrlPart === currentQuestion.urlData.deceptivePart) {
      handleCorrectAnswer(currentQuestion.urlData.explanation);
    } else {
      handleWrongAnswer(currentQuestion.urlData.explanation, 'Phẫu thuật URL & Tên miền');
    }
  };

  // 8. Chat Decision Check
  const handleCheckChat = () => {
    if (!selectedChatChoice || !currentQuestion?.chatData) return;
    const choice = currentQuestion.chatData.choices.find((c) => c.id === selectedChatChoice);
    if (choice?.isSafe) {
      handleCorrectAnswer(choice.feedback);
    } else {
      handleWrongAnswer(choice?.feedback || 'Phản ứng này tạo cơ hội cho kẻ gian khai thác.', 'Hội thoại phản ứng nhanh');
    }
  };

  // 9. Story Choice Check
  const handleCheckStory = () => {
    if (!selectedStoryChoice) return;
    setIsStoryChecked(true);
    const lastMsg = lesson.story.dialogue[lesson.story.dialogue.length - 1];
    const choice = lastMsg.choices?.find((c) => c.id === selectedStoryChoice);
    if (!choice?.isSafe) {
      setHearts((h) => Math.max(1, h - 1));
    }
  };

  // Next Question / Phase
  const handleAdvancePractice = () => {
    if (practiceIndex < practiceQueue.length - 1) {
      setPracticeIndex((i) => i + 1);
      resetQuestionStates();
    } else {
      setPhase('story');
    }
  };

  // Final Claim
  const handleFinalClaim = () => {
    onCompleteLesson(lesson.id, lesson.xpReward, lesson.shieldBadgeName);
    onClose();
  };

  // Progress percentage calculation
  const getProgressPercentage = () => {
    if (phase === 'briefing') return 0;
    if (phase === 'theory') return 15;
    if (phase === 'practice') {
      const total = practiceQueue.length || 1;
      return Math.min(88, Math.round(20 + ((practiceIndex + (lastQuestionResult?.isChecked ? 1 : 0)) / total) * 65));
    }
    if (phase === 'story') return 92;
    if (phase === 'reward') return 100;
    return 0;
  };

  const getQuestionTypeBadge = (type?: string) => {
    switch (type) {
      case 'multiple_choice':
        return { label: 'Tình Huống Trắc Nghiệm', icon: '🎯', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80' };
      case 'true_false':
        return { label: 'Thử Thách Đúng / Sai', icon: '⚖️', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80' };
      case 'matching':
        return { label: 'Ghép Cặp Phòng Thủ', icon: '🔗', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80' };
      case 'spot_red_flags':
        return { label: 'Soi Cờ Đỏ Lừa Đảo', icon: '🚩', color: 'bg-amber-950/80 text-amber-300 border-amber-800/80' };
      case 'drag_drop_zone':
        return { label: 'Phân Loại Mức Độ Rủi Ro', icon: '📥', color: 'bg-blue-950/80 text-blue-300 border-blue-800/80' };
      case 'order_sequence':
        return { label: 'Sắp Xếp Quy Trình Phản Ứng', icon: '🔢', color: 'bg-teal-950/80 text-teal-300 border-teal-800/80' };
      case 'url_dissection':
        return { label: 'Phẫu Thuật Tên Miền Giả', icon: '🔍', color: 'bg-purple-950/80 text-purple-300 border-purple-800/80' };
      case 'chat_decision':
        return { label: 'Hội Thoại Nhập Vai Đối Mặt', icon: '💬', color: 'bg-rose-950/80 text-rose-300 border-rose-800/80' };
      default:
        return { label: 'Luyện Tập Kỹ Năng', icon: '🛡️', color: 'bg-slate-900 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-slate-950/95 text-slate-100 overflow-hidden select-none backdrop-blur-xl animate-fade-in">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* ========================================================================= */}
      {/* 1. BRIEFING / START MODAL OVERLAY (NEW FEATURE: BẮT ĐẦU HOẶC THOÁT) */}
      {/* ========================================================================= */}
      {phase === 'briefing' && (
        <div className="relative z-50 flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900/90 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative backdrop-blur-xl animate-scale-up space-y-6">
            
            {/* Top Close / Exit Icon */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
              title="Đóng / Thoát"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                {lesson.shieldBadgeIcon}
              </div>
              <div className="space-y-1 pr-8">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded-full border border-cyan-700/80">
                    {unit.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{lesson.xpReward} XP</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                  Bài {lesson.number}: {lesson.title}
                </h2>
              </div>
            </div>

            {/* Mission Objective Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Mục tiêu huấn luyện:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {lesson.targetGoal}
              </p>
            </div>

            {/* Quick Highlights & Rewards Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl space-y-1">
                <Clock className="w-4 h-4 text-cyan-400 mx-auto" />
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Thời lượng</span>
                <span className="text-xs font-black text-slate-100">~3 Phút</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl space-y-1">
                <Flame className="w-4 h-4 text-amber-400 mx-auto" />
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Thực chiến</span>
                <span className="text-xs font-black text-amber-300">Tình huống thật</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Phần thưởng</span>
                <span className="text-xs font-black text-emerald-300 truncate block">Huy hiệu Khiên</span>
              </div>
            </div>

            {/* Action Buttons: BẮT ĐẦU HOẶC THOÁT */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setPhase('theory')}
                className="btn-tactile btn-tactile-cyan w-full py-4 text-sm sm:text-base font-black flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Bắt Đầu Học Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm border border-slate-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Để Sau / Thoát</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ACTIVE LESSON PHASES: HEADER + MAIN + ACTION FOOTER */}
      {/* ========================================================================= */}
      {phase !== 'briefing' && (
        <>
          {/* TOP HEADER BAR (CLEAN & SLEEK - NO 'CÂU ?/BAO NHIÊU' TEXT) */}
          <header className="h-16 flex-shrink-0 bg-slate-950/90 border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between gap-4 z-40 backdrop-blur-md">
            {/* Left: Close / Exit Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 shadow-sm"
              title="Thoát bài học"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Center: Clean Progress Bar & Lesson Label */}
            <div className="flex-1 max-w-xl mx-auto flex flex-col justify-center">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-1.5">
                <span className="truncate flex items-center gap-1.5">
                  <span className="text-cyan-400 font-extrabold">{unit.title}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-200">Bài {lesson.number}: {lesson.title}</span>
                </span>
                <span className="text-emerald-400 font-mono font-black">{getProgressPercentage()}%</span>
              </div>

              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            {/* Right: Adaptive Tag & Shield Hearts */}
            <div className="flex items-center space-x-2.5 flex-shrink-0">
              {replacementCount > 0 && phase === 'practice' && (
                <div
                  className="hidden md:flex items-center space-x-1 bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs px-2.5 py-1 rounded-full font-mono animate-pulse"
                  title="Hệ thống tự động bổ sung câu hỏi thay thế tương tự"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>+{replacementCount} Thích ứng</span>
                </div>
              )}

              <div className="flex items-center space-x-1.5 bg-rose-950/40 border border-rose-800/50 px-3 py-1.5 rounded-2xl shadow-inner">
                <span className="text-rose-400 text-sm">❤️</span>
                <span className="text-xs font-black text-rose-300 font-mono">{hearts}</span>
              </div>
            </div>
          </header>

          {/* MAIN SINGLE-PAGE VIEWPORT */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-start min-h-0 relative z-10">
            <div className="w-full max-w-3xl my-auto py-2">
              
              {/* ===================== PHASE 1: THEORY ===================== */}
              {phase === 'theory' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex items-center space-x-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-md flex-shrink-0">
                      {lesson.shieldBadgeIcon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800">
                          Giai đoạn 1: Lý thuyết & Nhận thức
                        </span>
                        <span className="text-xs text-amber-400 font-bold flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>+{lesson.xpReward} XP</span>
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                        Bài {lesson.number}: {lesson.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/60 text-xs sm:text-sm text-cyan-200 flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-white">Mục tiêu bài học: </strong>
                      {lesson.targetGoal}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-lg">
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                      <span>{lesson.theory.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                      {lesson.theory.summary}
                    </p>

                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Cốt lõi kiến thức phòng thủ:
                      </span>
                      <div className="space-y-2">
                        {lesson.theory.keyPoints.map((point, idx) => (
                          <div
                            key={idx}
                            className="text-xs sm:text-sm text-slate-200 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 leading-relaxed flex items-start space-x-2.5"
                          >
                            <span className="w-5 h-5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {lesson.theory.visualMockup && (
                    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-5 space-y-2.5 shadow-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                        <span className="flex items-center space-x-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span>Mô phỏng bẫy lừa đảo thực tế ({lesson.theory.visualMockup.sender})</span>
                        </span>
                        <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400 uppercase">
                          {lesson.theory.visualMockup.type}
                        </span>
                      </div>
                      <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
                        "{lesson.theory.visualMockup.content}"
                      </div>
                      {lesson.theory.visualMockup.highlightedRedFlags && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {lesson.theory.visualMockup.highlightedRedFlags.map((flag, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-bold font-mono bg-rose-950/70 text-rose-300 border border-rose-800/80 px-2.5 py-1 rounded-xl"
                            >
                              🚩 {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-bold flex items-center space-x-3 shadow-md">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <span className="text-amber-400 uppercase tracking-wider text-[10px] block">
                        Quy tắc vàng bất biến
                      </span>
                      <span className="text-white">{lesson.theory.goldenRule}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================== PHASE 2: ADAPTIVE PRACTICE ===================== */}
              {phase === 'practice' && currentQuestion && (
                <div className="space-y-4 sm:space-y-5 animate-fade-in">
                  
                  {/* 🚀 IN-EXERCISE MISSION PROGRESS BAR */}
                  {(() => {
                    const currentStep = practiceIndex + (lastQuestionResult?.isChecked ? 1 : 0);
                    const totalSteps = practiceQueue.length || 1;
                    const practiceProgress = Math.min(100, Math.round((currentStep / totalSteps) * 100));

                    let motivationalText = 'Khởi đầu vững chắc!';
                    if (practiceProgress >= 80) {
                      motivationalText = '🔥 Gần xong rồi! Sắp tiến vào Kịch bản Story chặng cuối';
                    } else if (practiceProgress >= 50) {
                      motivationalText = '⚡ Đã qua hơn nửa chặng đường, giữ vững phong độ!';
                    } else if (practiceProgress >= 25) {
                      motivationalText = '🚀 Đang tăng tốc rất tốt!';
                    }

                    return (
                      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-2.5 shadow-[0_0_25px_rgba(6,182,212,0.08)] relative overflow-hidden backdrop-blur-md">
                        {/* Top row with status & % */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <span className="font-bold text-slate-200">{motivationalText}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiến độ bài làm:</span>
                            <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-0.5 rounded-lg">
                              {practiceProgress}%
                            </span>
                          </div>
                        </div>

                        {/* Main Fluid Glowing Progress Track */}
                        <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 relative"
                            style={{ width: `${Math.max(6, practiceProgress)}%` }}
                          >
                            <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/60 rounded-full blur-[1px] animate-pulse" />
                          </div>
                        </div>

                        {/* Milestone Roadmap Indicators */}
                        <div className="flex items-center justify-between text-[11px] pt-0.5 text-slate-400 font-medium">
                          <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                            <span>✓</span>
                            <span>Lý thuyết</span>
                          </span>
                          <span className="flex items-center space-x-1 text-cyan-300 font-extrabold">
                            <span>🎯</span>
                            <span>Thực hành ({practiceProgress}%)</span>
                          </span>
                          <span className={`flex items-center space-x-1 ${practiceProgress >= 80 ? 'text-amber-300 font-bold animate-pulse' : 'text-slate-500'}`}>
                            <span>💬</span>
                            <span>Kịch bản Story</span>
                          </span>
                          <span className="flex items-center space-x-1 text-slate-500">
                            <span>🏆</span>
                            <span>Nhận Khiên</span>
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Question Category Badge (NO 'CÂU ?/BAO NHIÊU' TEXT) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const badgeInfo = getQuestionTypeBadge(currentQuestion.type);
                        return (
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border flex items-center space-x-1.5 shadow-sm ${badgeInfo.color}`}
                          >
                            <span>{badgeInfo.icon}</span>
                            <span>{badgeInfo.label}</span>
                          </span>
                        );
                      })()}

                      {currentQuestion.id.includes('retry') && (
                        <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-950/90 border border-purple-800 text-purple-300 flex items-center space-x-1">
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Tình huống thích ứng</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="bg-slate-900/80 border border-slate-800/90 p-4 sm:p-5 rounded-3xl shadow-md">
                    <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
                      {currentQuestion.prompt}
                    </h3>
                  </div>

                  {/* 1. TYPE: MULTIPLE CHOICE */}
                  {currentQuestion.type === 'multiple_choice' && (
                    <div className="space-y-3 pt-1">
                      {mcOptions.map((opt, idx) => {
                        const isSelected = selectedMcOption === opt.id;
                        const isChecked = lastQuestionResult?.isChecked;
                        let cardStyle = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200';

                        if (isSelected && !isChecked) {
                          cardStyle = 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg ring-2 ring-cyan-400/30';
                        } else if (isChecked) {
                          if (opt.isCorrect) {
                            cardStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg';
                          } else if (isSelected && !opt.isCorrect) {
                            cardStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-lg';
                          } else {
                            cardStyle = 'bg-slate-900/40 border-slate-800/50 text-slate-500 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={isChecked}
                            onClick={() => setSelectedMcOption(opt.id)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start space-x-3.5 ${cardStyle}`}
                          >
                            <div
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border ${
                                isSelected
                                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <div className="space-y-1 flex-1">
                              <span className="text-xs sm:text-sm font-semibold leading-relaxed block">{opt.text}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. TYPE: TRUE / FALSE */}
                  {currentQuestion.type === 'true_false' && (() => {
                    const isChecked = lastQuestionResult?.isChecked;
                    const isTrueCorrect = currentQuestion.trueFalseAnswer?.isTrue === true;
                    const isFalseCorrect = currentQuestion.trueFalseAnswer?.isTrue === false;

                    let trueStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700';
                    if (selectedTf === true && !isChecked) {
                      trueStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-xl ring-2 ring-emerald-400/40';
                    } else if (isChecked) {
                      if (isTrueCorrect) {
                        trueStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-xl';
                      } else if (selectedTf === true && !isTrueCorrect) {
                        trueStyle = 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-xl';
                      } else {
                        trueStyle = 'bg-slate-900/40 border-slate-800/50 text-slate-500 opacity-60';
                      }
                    }

                    let falseStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700';
                    if (selectedTf === false && !isChecked) {
                      falseStyle = 'bg-rose-950/90 border-rose-400 text-rose-300 shadow-xl ring-2 ring-rose-400/40';
                    } else if (isChecked) {
                      if (isFalseCorrect) {
                        falseStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-xl';
                      } else if (selectedTf === false && !isFalseCorrect) {
                        falseStyle = 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-xl';
                      } else {
                        falseStyle = 'bg-slate-900/40 border-slate-800/50 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <button
                            disabled={isChecked}
                            onClick={() => setSelectedTf(true)}
                            className={`p-5 sm:p-6 rounded-3xl border-2 text-center font-black text-base sm:text-lg transition-all cursor-pointer flex flex-col items-center space-y-2 ${trueStyle}`}
                          >
                            <span className="text-3xl">👍</span>
                            <span>ĐÚNG</span>
                          </button>

                          <button
                            disabled={isChecked}
                            onClick={() => setSelectedTf(false)}
                            className={`p-5 sm:p-6 rounded-3xl border-2 text-center font-black text-base sm:text-lg transition-all cursor-pointer flex flex-col items-center space-y-2 ${falseStyle}`}
                          >
                            <span className="text-3xl">👎</span>
                            <span>SAI</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3. TYPE: MATCHING PAIRS */}
                  {currentQuestion.type === 'matching' && (
                    <div className="space-y-3 pt-1">
                      {wrongMatch && (
                        <div className="p-3 bg-rose-950/90 border border-rose-700 text-rose-200 text-xs font-bold rounded-2xl flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                          <span>Ghép chưa đúng cặp! Hãy thử ghép lựa chọn khác.</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Cột Trái: Tình Huống / Dấu Hiệu
                          </span>
                          {currentQuestion.matchingPairs?.map((pair) => {
                            const isMatched = !!matchedPairs[pair.left.id];
                            const isSelected = selectedLeftId === pair.left.id;

                            return (
                              <button
                                key={pair.left.id}
                                disabled={isMatched || lastQuestionResult?.isChecked}
                                onClick={() => handleLeftMatchClick(pair.left.id)}
                                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-semibold ${
                                  isMatched
                                    ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400 line-through opacity-70'
                                    : isSelected
                                    ? 'bg-cyan-950 border-cyan-400 text-white shadow-lg scale-[1.01]'
                                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                                }`}
                              >
                                <span>{pair.left.text}</span>
                                {isMatched && <Check className="w-4 h-4 text-emerald-400" />}
                              </button>
                            );
                          })}
                        </div>

                        <div className="space-y-2.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Cột Phải: Hành Động Phòng Thủ
                          </span>
                          {(shuffledRightItems.length > 0
                            ? shuffledRightItems
                            : currentQuestion.matchingPairs?.map((p) => p.right) || []
                          ).map((rightItem) => {
                            const isMatched = Object.values(matchedPairs).includes(rightItem.id);

                            return (
                              <button
                                key={rightItem.id}
                                disabled={isMatched || lastQuestionResult?.isChecked}
                                onClick={() => handleRightMatchClick(rightItem)}
                                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-semibold ${
                                  isMatched
                                    ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400 opacity-70'
                                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500/60'
                                }`}
                              >
                                <span>{rightItem.text}</span>
                                {isMatched && <Check className="w-4 h-4 text-emerald-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. TYPE: SPOT RED FLAGS */}
                  {currentQuestion.type === 'spot_red_flags' && currentQuestion.spotData && (
                    <div className="space-y-3 pt-1">
                      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border-2 border-slate-800 space-y-3 shadow-lg">
                        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                          <span className="font-mono text-cyan-400 font-bold">
                            {currentQuestion.spotData.header}
                          </span>
                          <span className="text-slate-400 text-[11px]">Người gửi: {currentQuestion.spotData.sender}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed p-3.5 bg-slate-950 rounded-2xl border border-slate-850">
                          "{currentQuestion.spotData.bodyText}"
                        </p>

                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-bold text-amber-400 block">
                            👉 Nhấp chọn các phần tử nghi vấn (Red Flags):
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {currentQuestion.spotData.spots.map((spot) => {
                              const isTapped = tappedSpotIds.includes(spot.id);
                              const isChecked = lastQuestionResult?.isChecked;
                              let spotStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/50';

                              if (isTapped && !isChecked) {
                                spotStyle = 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-md';
                              } else if (isChecked) {
                                if (spot.isRedFlag && isTapped) {
                                  spotStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200';
                                } else if (spot.isRedFlag && !isTapped) {
                                  spotStyle = 'bg-rose-950/50 border-rose-700 text-rose-300';
                                }
                              }

                              return (
                                <button
                                  key={spot.id}
                                  disabled={isChecked}
                                  onClick={() => handleToggleSpot(spot.id)}
                                  className={`p-3 rounded-2xl border text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${spotStyle}`}
                                >
                                  <span className="font-bold">{spot.labelText}</span>
                                  {isTapped && <span className="text-amber-400 text-[11px] font-sans font-bold">🚩 Đã chọn</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. TYPE: DRAG & DROP / CATEGORIZATION */}
                  {currentQuestion.type === 'drag_drop_zone' && currentQuestion.dragDropItems && (
                    <div className="space-y-3 pt-1">
                      {currentQuestion.dragDropItems.map((item) => {
                        const assigned = dragAssignments[item.id];
                        const isChecked = lastQuestionResult?.isChecked;

                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-md"
                          >
                            <div className="text-[11px] text-cyan-400 font-bold">Từ: {item.sender}</div>
                            <p className="text-xs sm:text-sm text-slate-200 font-mono">"{item.text}"</p>

                            <div className="grid grid-cols-3 gap-2 pt-1">
                              <button
                                disabled={isChecked}
                                onClick={() => handleAssignCategory(item.id, 'safe')}
                                className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  assigned === 'safe'
                                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-md'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                🟢 An Toàn
                              </button>

                              <button
                                disabled={isChecked}
                                onClick={() => handleAssignCategory(item.id, 'suspicious')}
                                className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  assigned === 'suspicious'
                                    ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-md'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                🟡 Nghi Vấn
                              </button>

                              <button
                                disabled={isChecked}
                                onClick={() => handleAssignCategory(item.id, 'scam')}
                                className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  assigned === 'scam'
                                    ? 'bg-rose-950 border-rose-400 text-rose-300 shadow-md'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                🔴 Lừa Đảo
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 6. TYPE: ORDER SEQUENCE */}
                  {currentQuestion.type === 'order_sequence' && (
                    <div className="space-y-3 pt-1">
                      <p className="text-xs text-slate-400">
                        Sử dụng nút mũi tên Lên / Xuống để sắp xếp các bước ứng phó theo đúng thứ tự logic.
                      </p>

                      <div className="space-y-2.5">
                        {currentSequence.map((step, idx) => (
                          <div
                            key={step.id}
                            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all ${
                              lastQuestionResult?.isChecked
                                ? step.correctOrder === idx + 1
                                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                                  : 'bg-rose-950/70 border-rose-500 text-rose-200'
                                : 'bg-slate-900 border-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <span className="w-6 h-6 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{step.stepText}</span>
                            </div>

                            {!lastQuestionResult?.isChecked && (
                              <div className="flex items-center space-x-1.5 flex-shrink-0">
                                <button
                                  disabled={idx === 0}
                                  onClick={() => handleMoveSequenceStep(idx, 'up')}
                                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="w-4 h-4 text-cyan-400" />
                                </button>
                                <button
                                  disabled={idx === currentSequence.length - 1}
                                  onClick={() => handleMoveSequenceStep(idx, 'down')}
                                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="w-4 h-4 text-cyan-400" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7. TYPE: URL DISSECTION */}
                  {currentQuestion.type === 'url_dissection' && currentQuestion.urlData && (
                    <div className="space-y-3 pt-1">
                      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3.5 text-center shadow-lg">
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                          Đường dẫn URL mục tiêu cần giải mã:
                        </span>

                        <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs sm:text-sm p-4 bg-slate-950 rounded-2xl border border-slate-800">
                          {(
                            [
                              { key: 'protocol', label: currentQuestion.urlData.protocol },
                              { key: 'subdomain', label: `${currentQuestion.urlData.subdomain}.` },
                              { key: 'registrableDomain', label: currentQuestion.urlData.registrableDomain },
                              { key: 'tld', label: currentQuestion.urlData.tld },
                              { key: 'path', label: currentQuestion.urlData.path },
                            ] as const
                          ).map((part) => {
                            const isSelected = selectedUrlPart === part.key;
                            const isChecked = lastQuestionResult?.isChecked;
                            const isDeceptive = currentQuestion.urlData?.deceptivePart === part.key;

                            let partStyle = 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:border-cyan-500/60 hover:text-white';

                            if (isSelected && !isChecked) {
                              partStyle = 'bg-cyan-950 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-105';
                            } else if (isChecked) {
                              if (isDeceptive) {
                                partStyle = 'bg-emerald-950 border-2 border-emerald-400 text-emerald-200 shadow-md';
                              } else if (isSelected && !isDeceptive) {
                                partStyle = 'bg-rose-950 border-2 border-rose-400 text-rose-200 shadow-md';
                              } else {
                                partStyle = 'bg-slate-950 border border-slate-850 text-slate-600 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={part.key}
                                disabled={isChecked}
                                onClick={() => setSelectedUrlPart(part.key)}
                                className={`px-2.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm transition-all cursor-pointer ${partStyle}`}
                              >
                                {part.label}
                              </button>
                            );
                          })}
                        </div>

                        <p className="text-xs text-slate-300 font-medium">
                          👉 Nhấp chọn khối thành phần chứa bẫy giả mạo nguy hiểm nhất!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 8. TYPE: CHAT DECISION */}
                  {currentQuestion.type === 'chat_decision' && currentQuestion.chatData && (
                    <div className="space-y-3 pt-1">
                      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
                        <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <span>🎭</span>
                          <span>Tin nhắn từ đối tượng: {currentQuestion.chatData.senderName}</span>
                        </div>
                        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
                          "{currentQuestion.chatData.scammerText}"
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                          Chọn phản ứng an toàn nhất của bạn:
                        </span>
                        {currentQuestion.chatData.choices.map((choice) => {
                          const isSelected = selectedChatChoice === choice.id;
                          const isChecked = lastQuestionResult?.isChecked;
                          let style = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';

                          if (isSelected && !isChecked) {
                            style = 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg';
                          } else if (isChecked) {
                            if (choice.isSafe) {
                              style = 'bg-emerald-950 border-emerald-500 text-emerald-200';
                            } else if (isSelected && !choice.isSafe) {
                              style = 'bg-rose-950 border-rose-500 text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={choice.id}
                              disabled={isChecked}
                              onClick={() => setSelectedChatChoice(choice.id)}
                              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer text-xs sm:text-sm font-medium leading-relaxed ${style}`}
                            >
                              {choice.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ===================== PHASE 3: STORY SCENARIO ===================== */}
              {phase === 'story' && (
                <div className="space-y-5 animate-fade-in">
                  
                  {/* 🚀 IN-EXERCISE MISSION PROGRESS BAR (STORY PHASE) */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-2.5 shadow-[0_0_25px_rgba(245,158,11,0.08)] relative overflow-hidden backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span className="font-bold text-amber-300">🔥 Chặng cuối: Kịch bản đối thoại thực chiến!</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiến độ bài làm:</span>
                        <span className="text-xs font-mono font-black text-amber-300 bg-amber-950/80 border border-amber-800/80 px-2.5 py-0.5 rounded-lg">
                          92%
                        </span>
                      </div>
                    </div>

                    <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 rounded-full transition-all duration-500 relative"
                        style={{ width: `92%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/60 rounded-full blur-[1px] animate-pulse" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5 text-slate-400 font-medium">
                      <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                        <span>✓</span>
                        <span>Lý thuyết</span>
                      </span>
                      <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                        <span>✓</span>
                        <span>Thực hành</span>
                      </span>
                      <span className="flex items-center space-x-1 text-amber-300 font-extrabold animate-pulse">
                        <span>💬</span>
                        <span>Kịch bản Story (92%)</span>
                      </span>
                      <span className="flex items-center space-x-1 text-slate-400">
                        <span>🏆</span>
                        <span>Nhận Khiên</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4" />
                    <span>Giai đoạn 3: Thực chiến kịch bản huống (Story)</span>
                  </div>

                  <div className="p-4 rounded-3xl bg-amber-950/30 border border-amber-800/60 text-xs sm:text-sm text-amber-200">
                    <strong className="text-white font-bold">Bối cảnh: </strong>
                    {lesson.story.scenarioContext}
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {lesson.story.dialogue.map((msg, idx) => {
                      const isScammer = msg.sender === 'scammer';
                      const isAssistant = msg.sender === 'assistant';

                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                          <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md font-bold text-sm bg-slate-800 border border-slate-700">
                            {isScammer && '🎭'}
                            {isAssistant && '🦉'}
                            {msg.sender === 'user' && '👤'}
                          </div>

                          <div
                            className={`max-w-lg p-3.5 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-1 shadow-md ${
                              isScammer
                                ? 'bg-rose-950/70 border border-rose-800/80 text-rose-100 rounded-tl-none'
                                : isAssistant
                                ? 'bg-cyan-950/80 border border-cyan-800/80 text-cyan-100 rounded-tl-none'
                                : 'bg-slate-800 text-white rounded-tr-none'
                            }`}
                          >
                            <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
                              {msg.senderName}
                            </div>
                            <p>{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {(() => {
                    const actionMsg = lesson.story.dialogue.find((m) => m.actionRequired && m.choices);
                    if (!actionMsg || !actionMsg.choices) return null;

                    return (
                      <div className="space-y-3 pt-4 border-t border-slate-800">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                          ⚡ Bạn sẽ chọn phản ứng nào để xử lý?
                        </span>

                        <div className="space-y-2.5">
                          {actionMsg.choices.map((choice) => {
                            const isSelected = selectedStoryChoice === choice.id;
                            let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';

                            if (isSelected && !isStoryChecked) {
                              btnStyle = 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg';
                            } else if (isStoryChecked) {
                              if (choice.isSafe) {
                                btnStyle = 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg';
                              } else if (isSelected && !choice.isSafe) {
                                btnStyle = 'bg-rose-950/80 border-rose-400 text-white shadow-lg';
                              }
                            }

                            return (
                              <button
                                key={choice.id}
                                disabled={isStoryChecked}
                                onClick={() => setSelectedStoryChoice(choice.id)}
                                className={`w-full text-left p-4 rounded-3xl border-2 transition-all cursor-pointer space-y-1.5 ${btnStyle}`}
                              >
                                <div className="text-xs sm:text-sm font-semibold leading-relaxed">{choice.text}</div>
                                {isStoryChecked && (isSelected || choice.isSafe) && (
                                  <div
                                    className={`text-xs p-3 rounded-2xl ${
                                      choice.isSafe ? 'bg-emerald-900/60 text-emerald-200' : 'bg-rose-900/60 text-rose-200'
                                    }`}
                                  >
                                    <div className="font-bold">
                                      {choice.isSafe ? '✓ Quyết định an toàn: ' : '✗ Bẫy nguy hiểm: '}
                                      {choice.feedback}
                                    </div>
                                    <div className="text-[10px] opacity-80 mt-1">Hệ quả: {choice.consequence}</div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ===================== PHASE 4: REWARD ===================== */}
              {phase === 'reward' && (
                <div className="text-center py-6 sm:py-8 space-y-6 animate-scale-up">
                  <div className="relative inline-block mx-auto">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-500 via-emerald-400 to-cyan-400 p-1.5 shadow-2xl animate-pulse-glow flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center text-5xl shadow-inner border border-slate-800">
                        {lesson.shieldBadgeIcon}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border-2 border-slate-900">
                      ★ Hoàn Thành
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-black text-white">Xuất Sắc Vệ Binh!</h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                      Bạn đã hoàn thành xuất sắc{' '}
                      <strong className="text-cyan-400">
                        Bài {lesson.number}: {lesson.title}
                      </strong>
                      .
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-1 shadow-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Kinh Nghiệm Nhận Được
                      </span>
                      <div className="text-2xl font-black text-amber-400 flex items-center space-x-1.5">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span>+{lesson.xpReward} XP</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl space-y-1 shadow-md">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Huy Hiệu Khiên
                      </span>
                      <div className="text-xs font-black text-emerald-300 truncate">{lesson.shieldBadgeName}</div>
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        Đã kích hoạt hồ sơ
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>

          {/* BOTTOM STICKY ACTION BAR & SLIDING FEEDBACK DRAWER */}
          <footer className="flex-shrink-0 bg-slate-950/95 border-t border-slate-800/90 py-4 px-4 sm:px-8 z-40 relative backdrop-blur-md">
            
            {/* Dynamic Sliding Feedback Drawer */}
            {phase === 'practice' && lastQuestionResult && (
              <div
                className={`max-w-3xl mx-auto mb-3.5 p-4 rounded-3xl border text-left animate-slide-up shadow-2xl ${
                  lastQuestionResult.isCorrect
                    ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/95 border-rose-500 text-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 font-black text-sm sm:text-base">
                      {lastQuestionResult.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span>Chính xác! Phản xạ phòng thủ rất chuẩn.</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                          <span>Chưa chính xác!</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-100 font-medium">
                      {lastQuestionResult.feedback}
                    </p>

                    {/* Adaptive Replacement Notice */}
                    {lastQuestionResult.replacementNotice && (
                      <div className="mt-2.5 pt-2 border-t border-rose-800/60 flex items-center space-x-2 text-xs font-bold text-amber-300">
                        <Repeat className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />
                        <span>{lastQuestionResult.replacementNotice}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Controls Container */}
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
              {phase === 'theory' && (
                <button
                  onClick={() => setPhase('practice')}
                  className="btn-tactile btn-tactile-cyan w-full py-4 text-sm sm:text-base font-black flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
                >
                  <span>Bắt Đầu Thực Hành Kỹ Năng</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              {phase === 'practice' && (
                <div className="w-full flex items-center justify-between gap-3">
                  {!lastQuestionResult?.isChecked ? (
                    <>
                      {currentQuestion?.type === 'multiple_choice' && (
                        <button
                          disabled={!selectedMcOption}
                          onClick={handleCheckMc}
                          className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                            selectedMcOption
                              ? 'btn-tactile-cyan cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                          }`}
                        >
                          Kiểm Tra Đáp Án
                        </button>
                      )}

                      {currentQuestion?.type === 'true_false' && (
                        <button
                          disabled={selectedTf === null}
                          onClick={handleCheckTf}
                          className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                            selectedTf !== null
                              ? 'btn-tactile-cyan cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                          }`}
                        >
                          Kiểm Tra Đúng / Sai
                        </button>
                      )}

                      {currentQuestion?.type === 'matching' && (
                        <button
                          disabled={
                            !currentQuestion.matchingPairs ||
                            Object.keys(matchedPairs).length < currentQuestion.matchingPairs.length
                          }
                          onClick={handleAdvancePractice}
                          className={`btn-tactile w-full py-4 text-sm font-bold flex items-center justify-center space-x-2 shadow-xl ${
                            currentQuestion.matchingPairs &&
                            Object.keys(matchedPairs).length === currentQuestion.matchingPairs.length
                              ? 'btn-tactile-cyan cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                          }`}
                        >
                          <span>
                            {currentQuestion.matchingPairs &&
                            Object.keys(matchedPairs).length === currentQuestion.matchingPairs.length
                              ? 'Sang Thử Thách Tiếp Theo'
                              : `Ghép đủ ${currentQuestion.matchingPairs?.length || 3} cặp`}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      {currentQuestion?.type === 'spot_red_flags' && (
                        <button
                          disabled={tappedSpotIds.length === 0}
                          onClick={handleCheckSpot}
                          className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                            tappedSpotIds.length > 0
                              ? 'btn-tactile-cyan cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                          }`}
                        >
                          Kiểm Tra Cờ Đỏ ({tappedSpotIds.length} Điểm Đã Chọn)
                        </button>
                      )}

                      {currentQuestion?.type === 'drag_drop_zone' && (
                        <button
                          disabled={
                            Object.keys(dragAssignments).length < (currentQuestion.dragDropItems?.length || 1)
                          }
                          onClick={handleCheckDrag}
                          className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                            Object.keys(dragAssignments).length >= (currentQuestion.dragDropItems?.length || 1)
                              ? 'btn-tactile-cyan cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                          }`}
                        >
                          Kiểm Tra Phân Loại ({Object.keys(dragAssignments).length}/{currentQuestion.dragDropItems?.length})
                        </button>
                      )}

                      {currentQuestion?.type === 'order_sequence' && (
                        <button
                          onClick={handleCheckSequence}
                          className="btn-tactile btn-tactile-cyan w-full py-4 text-sm font-bold shadow-xl cursor-pointer"
                        >
                          Xác Nhận Thứ Tự Quy Trình
                        </button>
                      )}

                      {currentQuestion?.type === 'url_dissection' && (
                        <button
                          disabled={!selectedUrlPart}
                          onClick={handleCheckUrl}
                          className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                            selectedUrlPart
                              ? 'btn-tactile-cyan cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                          }`}
                        >
                          Xác Nhận Khối Tên Miền Đã Chọn
                        </button>
                      )}

                      {currentQuestion?.type === 'chat_decision' && (
                        <button
                          disabled={!selectedChatChoice}
                          onClick={handleCheckChat}
                          className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                            selectedChatChoice
                              ? 'btn-tactile-cyan cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                          }`}
                        >
                          Xác Nhận Phản Hồi
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={handleAdvancePractice}
                      className={`btn-tactile w-full py-4 text-sm font-bold flex items-center justify-center space-x-2 shadow-xl cursor-pointer ${
                        lastQuestionResult.isCorrect ? 'btn-tactile-emerald' : 'btn-tactile-cyan'
                      }`}
                    >
                      <span>
                        {practiceIndex < practiceQueue.length - 1
                          ? 'Tiếp Tục Thử Thách'
                          : 'Chuyển Sang Kịch Bản Thực Chiến'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {phase === 'story' && (
                <div className="w-full flex items-center justify-between gap-3">
                  {!isStoryChecked ? (
                    <button
                      disabled={!selectedStoryChoice}
                      onClick={handleCheckStory}
                      className={`btn-tactile w-full py-4 text-sm font-bold shadow-xl ${
                        selectedStoryChoice
                          ? 'btn-tactile-cyan cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
                      }`}
                    >
                      Xác Nhận Quyết Định Story
                    </button>
                  ) : (
                    <button
                      onClick={() => setPhase('reward')}
                      className="btn-tactile btn-tactile-emerald w-full py-4 text-sm font-bold flex items-center justify-center space-x-2 shadow-xl cursor-pointer"
                    >
                      <span>Xem Phần Thưởng & Khiên Vệ Binh</span>
                      <Award className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {phase === 'reward' && (
                <button
                  onClick={handleFinalClaim}
                  className="btn-tactile btn-tactile-emerald w-full py-4 text-sm font-black flex items-center justify-center space-x-2 shadow-2xl cursor-pointer"
                >
                  <span>Nhận Khiên & Hoàn Thành Bài Học</span>
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </footer>
        </>
      )}

    </div>
  );
};
