import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { analyzeScamContent, inspectFakeBillAnomalies, extractTransparentUrlFeatures } from './riskEngine';
import {
  calculateFormalDefenseScore,
  calculateScamDnaVector,
  recommendAdaptiveScenario,
  computeExperimentalStatistics,
  recordParticipantTrial,
  getAllParticipantTrials,
  getMachineLearningBenchmarks,
  getErrorTaxonomyAnalysis,
  simulateRiskWeights,
  getCommunitySurveyAnalytics,
  getAllCommunitySurveys,
  recordCommunitySurveySubmission,
  clearAllResearchData,
  seedStandardViSEFDataset,
  calculateSampleSizeAndPower,
  getExclusionLogs,
  logDataExclusion,
  getDataQualityMetrics,
  calculateCronbachAlpha,
  calculateMultipleComparisonCorrections,
  getLiteratureCitations,
  getJudgeDefenseQuestions,
  generateViSEFResearchReport,
  getAllPostAppCertifications,
  recordPostAppCertificationSubmission,
  getPrePostComparisonAnalysis,
} from './scientificEngine';

import { CAMGUARD_DATASET } from '../src/data/researchDataset';
import {
  createArenaSession,
  getArenaSession,
  processUserArenaMessage,
  concludeArenaSession,
} from './arenaEngine';
import { SCAM_SCENARIOS } from '../src/data/scenarios';
import { QUISHING_CASES } from '../src/data/quishingData';
import { DEEPFAKE_CASES } from '../src/data/deepfakeData';
import { QUICK_DRILLS } from '../src/data/quickDrills';
import { executeGeminiWithFallback, GEMINI_MODEL } from './gemini';
import {
  registerUser,
  loginUser,
  socialLogin,
  syncFirebaseUser,
  getUserByTokenOrId,
  updateUserProfile,
  getPresetDemoUsers,
  resetUserAccountData,
} from './auth';
import {
  createRateLimiter,
  validateBody,
  AnalyzeTextSchema,
  AnalyzeScreenshotSchema,
  StartArenaSessionSchema,
  ArenaMessageSchema,
  EndArenaSessionSchema,
  CoachAdviceSchema,
  QuishingAnswerSchema,
  FeedbackSubmissionSchema,
  evaluateContentSafetyPolicy,
  addAuditLog,
  getAuditLogs,
  getGeminiUsageMetrics,
  checkAndIncrementGeminiBudget,
} from './security';
import {
  getOrCreateUserProgress,
  recordProgressEvent,
  calculateScamDna,
  getCommunityScamDna,
  deleteUserData,
  exportUserData,
  resetAllUserProgress,
} from './progressEngine';

dotenv.config();

export function createExpressApp() {
  const app = express();

  // Security Headers using Helmet (with frame config compatible for iFrame preview)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      frameguard: false,
    })
  );

  // Payload body parsing
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // CORS headers for flexibility
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Rate limiters
  const analyzerLimiter = createRateLimiter('analyzer', 30, 60 * 1000);
  const arenaLimiter = createRateLimiter('arena', 40, 60 * 1000);
  const coachLimiter = createRateLimiter('coach', 20, 60 * 1000);
  const accountLimiter = createRateLimiter('account', 15, 60 * 1000);

  // Helper router to mount routes on both /api/* and /* (handling Vercel path rewrites)
  const apiRouter = express.Router();

  // --- AUTHENTICATION & MULTI-USER API ROUTES ---
  apiRouter.post('/auth/register', (req, res) => {
    try {
      const { name, username, email, password, mode } = req.body;
      const result = registerUser({ name, username, email, password, mode });
      if (!result.success) {
        return res.status(400).json(result);
      }
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Lỗi đăng ký tài khoản.' });
    }
  });

  apiRouter.post('/auth/login', (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      const result = loginUser({ usernameOrEmail, password });
      if (!result.success) {
        return res.status(401).json(result);
      }
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Lỗi đăng nhập.' });
    }
  });

  apiRouter.post('/auth/social', (req, res) => {
    try {
      const { provider, name, email, avatarUrl, mode } = req.body;
      if (!provider || !['google', 'facebook', 'github'].includes(provider)) {
        return res.status(400).json({ success: false, error: 'Phương thức đăng nhập không hợp lệ.' });
      }
      const result = socialLogin({ provider, name, email, avatarUrl, mode });
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Lỗi đăng nhập mạng xã hội.' });
    }
  });

  apiRouter.post('/auth/firebase-sync', (req, res) => {
    try {
      const { uid, name, email, username, avatarUrl, provider, mode, profile } = req.body;
      if (!uid) {
        return res.status(400).json({ success: false, error: 'Thiếu Firebase UID.' });
      }
      const account = syncFirebaseUser({
        uid,
        name,
        email,
        username,
        avatarUrl,
        provider,
        mode,
        profile,
      });
      return res.json({ success: true, user: account });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Lỗi đồng bộ phiên Firebase.' });
    }
  });

  apiRouter.get('/auth/presets', (req, res) => {
    res.json({ presets: getPresetDemoUsers() });
  });

  apiRouter.get('/auth/me', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.replace('Bearer ', '') : (req.headers['x-user-id'] as string);
    const user = getUserByTokenOrId(token);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Chưa đăng nhập.' });
    }
    return res.json({ success: true, user });
  });

  apiRouter.put('/auth/profile', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.replace('Bearer ', '') : (req.headers['x-user-id'] as string);
    const user = getUserByTokenOrId(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Chưa xác thực người dùng.' });
    }
    const updated = updateUserProfile(user.id, req.body);
    return res.json({ success: true, user: updated });
  });

  apiRouter.post('/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Đã đăng xuất an toàn.' });
  });

  // Health check & System stats
  apiRouter.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SCAMGUARD Defense Platform',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      geminiMetrics: getGeminiUsageMetrics(),
      timestamp: new Date().toISOString(),
    });
  });

  // Scenarios Data & Search / Filter Endpoint
  apiRouter.get('/scenarios', (req, res) => {
    const { category, difficulty, ageGroup, channel, q } = req.query;
    let results = [...SCAM_SCENARIOS];

    if (category) {
      results = results.filter((s) => s.category.toLowerCase() === String(category).toLowerCase());
    }
    if (difficulty) {
      results = results.filter((s) => s.difficulty.toLowerCase() === String(difficulty).toLowerCase());
    }
    if (ageGroup && ageGroup !== 'All') {
      results = results.filter((s) => s.ageGroup === 'All' || s.ageGroup === ageGroup);
    }
    if (channel) {
      results = results.filter((s) => s.channel === channel);
    }
    if (q) {
      const search = String(q).toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(search) ||
          s.subtitle.toLowerCase().includes(search) ||
          s.tactics.some((t) => t.toLowerCase().includes(search))
      );
    }

    res.json({ scenarios: results, total: results.length });
  });

  apiRouter.get('/quishing', (req, res) => {
    const { industry } = req.query;
    let list = QUISHING_CASES;
    if (industry) {
      list = list.filter((c) => c.category.toLowerCase() === String(industry).toLowerCase());
    }
    res.json({ cases: list, total: list.length });
  });

  apiRouter.get('/deepfakes', (req, res) => {
    res.json({ cases: DEEPFAKE_CASES });
  });

  apiRouter.get('/drills', (req, res) => {
    res.json({ drills: QUICK_DRILLS });
  });

  // Text & URL Scam Analysis
  apiRouter.post('/analyze/text', analyzerLimiter, validateBody(AnalyzeTextSchema), async (req, res) => {
    try {
      const { text, url, sender, channel } = req.body;
      const userId = (req.headers['x-user-id'] as string) || 'guest_user';

      const safetyCheck = evaluateContentSafetyPolicy(text || url || '');
      if (!safetyCheck.safe) {
        addAuditLog({
          ip: req.ip || 'unknown',
          userId,
          action: 'POLICY_VIOLATION_BLOCKED',
          status: 'BLOCKED',
          details: { reason: safetyCheck.reason },
        });
        return res.status(400).json({ error: safetyCheck.reason });
      }

      const result = await analyzeScamContent({ text, url, sender, channel });

      addAuditLog({
        ip: req.ip || 'unknown',
        userId,
        action: 'SCAM_TEXT_ANALYZED',
        status: 'SUCCESS',
        details: { riskLevel: result.riskLevel, riskScore: result.riskScore },
      });

      return res.json(result);
    } catch (err: any) {
      console.error('Error analyzing scam text:', err);
      return res.status(500).json({ error: err.message || 'Failed to analyze content' });
    }
  });

  // Screenshot / Multimodal Image Scam Analysis
  apiRouter.post('/analyze/screenshot', analyzerLimiter, validateBody(AnalyzeScreenshotSchema), async (req, res) => {
    try {
      const { base64Image, mimeType, optionalContext } = req.body;
      const userId = (req.headers['x-user-id'] as string) || 'guest_user';

      const result = await analyzeScamContent({
        text: optionalContext || 'Giám định pháp y số ảnh chụp màn hình tin nhắn hoặc link nghi vấn.',
        base64Image,
        mimeType: mimeType || 'image/png',
      });

      addAuditLog({
        ip: req.ip || 'unknown',
        userId,
        action: 'SCREENSHOT_ANALYZED',
        status: 'SUCCESS',
        details: { riskLevel: result.riskLevel, riskScore: result.riskScore },
      });

      return res.json(result);
    } catch (err: any) {
      console.error('Error analyzing screenshot:', err);
      return res.status(500).json({ error: err.message || 'Failed to analyze screenshot' });
    }
  });

  // Forensic Anomaly Inspection for Fake Invoices & Bank Transfer Receipts
  apiRouter.post(['/analyze/bill', '/analyze/fakebill'], analyzerLimiter, async (req, res) => {
    try {
      const { base64Image, mimeType, declaredBank, declaredAmount, optionalContext } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: 'Cần đính kèm hình ảnh biên lai để thực hiện giám định quang học.' });
      }

      const report = await inspectFakeBillAnomalies({
        base64Image,
        mimeType: mimeType || 'image/png',
        declaredBank,
        declaredAmount,
        context: optionalContext,
      });

      const sm = report.structuralMetrics;
      // Ảnh không đọc được, chưa có AI, hoặc không phải biên lai chuyển khoản: nói rõ là chưa giám định, không đưa cảnh báo dựng sẵn
      const notReceipt = report.aiAnalyzed && report.isBankTransferReceipt === false;
      const notAssessed = report.verdictClassification === 'INSUFFICIENT_IMAGE_QUALITY';
      const notAssessedReason = !notAssessed
        ? undefined
        : !report.aiAnalyzed
          ? 'Chưa có AI phân tích ảnh nên chưa giám định được biên lai này.'
          : notReceipt
            ? `Ảnh này là ${report.documentType || 'giấy tờ khác'}, không phải biên lai chuyển khoản. ScamGuard chỉ giám định biên lai chuyển khoản ngân hàng hoặc ví điện tử.`
            : 'AI chưa đánh giá được ảnh này (ảnh mờ hoặc thiếu thông tin).';
      const riskScore = notAssessed ? 0 : report.anomalySuspicionScore;
      // Cùng ngưỡng với giao diện (ThreatAssessmentResult): Cao từ 70, Trung bình từ 40
      let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE' = 'LOW';
      if (riskScore >= 70) riskLevel = 'HIGH';
      else if (riskScore >= 40) riskLevel = 'MEDIUM';
      const BILL_VERDICT_LABEL: Record<string, string> = {
        HIGH_ANOMALY_SUSPECTED: 'Nghi biên lai bị chỉnh sửa',
        MODERATE_ANOMALIES: 'Có điểm bất thường cần kiểm tra thêm',
        LOW_ANOMALY_CONSISTENT: 'Chưa thấy dấu hiệu chỉnh sửa rõ ràng',
      };

      const signals = [
        {
          name: 'Độ lệch phông chữ & Kerning',
          scoreContribution: sm.fontScore ?? 70,
          description: sm.fontMismatchDetected
            ? 'Phát hiện sự không đồng nhất về độ đậm nét và căn dòng chữ số tiền'
            : 'Phông chữ đồng nhất trong giới hạn chấp nhận',
          category: 'Typography',
        },
        {
          name: 'Nhiễu nén ảnh (Compression Artifacts)',
          scoreContribution: sm.artifactScore ?? 75,
          description: sm.compressionArtifactDetected
            ? 'Có quầng mờ xung quanh chữ số tiền do chắp vá chỉnh sửa hình ảnh'
            : 'Mức nén ảnh bình thường',
          category: 'Forensics',
        },
        {
          name: 'Con dấu & Watermark',
          scoreContribution: sm.watermarkSealStatus === 'BLURRED_SYNTHETIC' ? 30 : 5,
          description: `Trạng thái watermark: ${sm.watermarkSealStatus || 'NOT_APPLICABLE'}`,
          category: 'Integrity',
        },
      ];

      // Chỉ những vùng AI thực sự chỉ ra; AI không chỉ ra vùng nào thì để trống
      const rawRegions = notReceipt ? [] : report.explainableSuspiciousRegions;

      const evidenceFound = rawRegions.map((reg: any) => ({
        severity: reg.severity || 'medium',
        title: reg.areaName || 'Khu vực bất thường',
        description: reg.description || 'Dấu hiệu chỉnh sửa hoặc không đồng nhất cấu trúc.',
      }));

      const randomHex = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();

      const combinedResult = {
        ...report,
        riskLevel,
        riskScore,
        notAssessedReason,
        summary: notAssessed
          ? `Chưa giám định: ${notAssessedReason} Muốn biết tiền đã chuyển thật hay chưa, hãy kiểm tra biến động số dư trong ứng dụng ngân hàng.`
          : `AI nhận xét ảnh biên lai: chỉ số bất thường ${riskScore}/100 (${BILL_VERDICT_LABEL[report.verdictClassification] || 'chưa phân loại'}). Đây là nhận xét của AI, không phải kết luận giám định.`,
        signals: notAssessed ? [] : signals,
        // Cảnh báo lấy từ những gì AI thực sự thấy, không dùng câu dựng sẵn
        redFlags: notReceipt ? [] : [...evidenceFound.slice(0, 2).map((ev: any) => ev.description), report.scientificCaveat].filter(Boolean),
        analysisEngine: report?.aiAnalyzed ? 'AI_GEMINI' : 'RULES_ONLY',
        recommendedSteps: [
          'KHÔNG giao hàng hoặc chuyển khoản đối ứng khi chưa thấy tiền về tài khoản ngân hàng thực tế.',
          'Mở ứng dụng Mobile Banking của người nhận để kiểm tra lịch sử biến động số dư chính thức.',
          'Không tin vào hình chụp màn hình hay thông báo từ ứng dụng bên thứ ba.',
        ],
        piiRedacted: false,
        // Tab bill chỉ xét ảnh: không có thông tin về link, mạo danh thương hiệu hay hối thúc
        threatBreakdown: {
          maliciousUrl: 0,
          impersonation: 0,
          urgency: 0,
          credentialHarvesting: 0,
          socialEngineering: riskScore,
        },
        evidenceFound,
        // Phân loại theo kết luận của AI; không có độ tin cậy đo được nên không ghi con số
        threatClassification: {
          primaryThreat: notAssessed ? 'Chưa giám định' : BILL_VERDICT_LABEL[report.verdictClassification] || 'Chưa phân loại',
          attackVector: notReceipt ? 'Không phải biên lai chuyển khoản' : 'Ảnh biên lai chuyển khoản',
          target: 'Không xác định',
          potentialImpact: [],
        },
        attackChain: [],
        assessmentId: `SG-BILL-${randomHex}`,
      };

      return res.json(combinedResult);
    } catch (err: any) {
      console.error('Error in bill anomaly inspection:', err);
      return res.status(500).json({ error: err.message || 'Lỗi khi giám định hóa đơn' });
    }
  });

  // Transparent URL Feature Extractor
  apiRouter.get('/analyze/url-features', (req, res) => {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'Thiếu tham số url để phân tích đặc trưng.' });
    }
    const features = extractTransparentUrlFeatures(String(url));
    return res.json(features);
  });

  // Tuổi tên miền tra thật qua RDAP (rdap.org chuyển tiếp tới máy chủ đăng ký của từng đuôi tên miền).
  // Không tra được thì trả available: false, giao diện phải nói rõ "không tra được", không đoán.
  const SECOND_LEVEL_SUFFIXES = new Set(['com.vn', 'net.vn', 'org.vn', 'edu.vn', 'gov.vn', 'info.vn', 'biz.vn', 'name.vn', 'pro.vn', 'health.vn', 'ac.vn', 'int.vn', 'co.uk', 'org.uk', 'com.au', 'co.jp', 'com.cn', 'com.sg']);

  function toRegistrableDomain(input: string): string | null {
    let host = input.trim().toLowerCase();
    try {
      host = new URL(/^[a-z]+:\/\//.test(host) ? host : `http://${host}`).hostname;
    } catch {
      return null;
    }
    host = host.replace(/^www\./, '').replace(/\.$/, '');
    if (!/^[a-z0-9.-]+$/.test(host) || !host.includes('.')) return null;
    const labels = host.split('.');
    const lastTwo = labels.slice(-2).join('.');
    const take = SECOND_LEVEL_SUFFIXES.has(lastTwo) ? 3 : 2;
    return labels.slice(-take).join('.');
  }

  apiRouter.get('/analyze/domain-age', async (req, res) => {
    const domain = toRegistrableDomain(String(req.query.domain || ''));
    const checkedAt = new Date().toISOString();
    if (!domain) {
      return res.status(400).json({ available: false, error: 'Tên miền không hợp lệ.' });
    }
    const source = 'RDAP (rdap.org)';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
      const r = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
        headers: { Accept: 'application/rdap+json', 'User-Agent': 'ScamGuardVN/1.0 (du an KHKT hoc sinh)' },
        signal: controller.signal,
      });
      if (!r.ok) {
        return res.json({
          available: false,
          domain,
          source,
          checkedAt,
          reason: r.status === 404
            ? 'Không tra được: đuôi tên miền này chưa hỗ trợ RDAP (ví dụ .vn) hoặc tên miền chưa được đăng ký.'
            : `Không tra được: máy chủ RDAP trả mã ${r.status}.`,
        });
      }
      const data: any = await r.json();
      const reg = Array.isArray(data.events) ? data.events.find((e: any) => e.eventAction === 'registration') : null;
      if (!reg?.eventDate) {
        return res.json({ available: false, domain, source, checkedAt, reason: 'Không tra được: dữ liệu RDAP không có ngày đăng ký.' });
      }
      const ageDays = Math.floor((Date.now() - new Date(reg.eventDate).getTime()) / 86400000);
      return res.json({ available: true, domain, registeredAt: reg.eventDate, ageDays, source, checkedAt });
    } catch (err: any) {
      return res.json({
        available: false,
        domain,
        source,
        checkedAt,
        reason: err?.name === 'AbortError' ? 'Không tra được: máy chủ RDAP không phản hồi trong 6 giây.' : 'Không tra được: lỗi kết nối tới máy chủ RDAP.',
      });
    } finally {
      clearTimeout(timer);
    }
  });

  // Báo cáo SĐT / STK do người dùng gửi trong ứng dụng.
  // Đây KHÔNG phải cơ sở dữ liệu của Bộ Công an hay NCSC: không có dữ liệu gõ sẵn, mọi báo cáo đều chưa xác minh.
  const COMMUNITY_BLACKLIST: any[] = [];

  apiRouter.get('/blacklist/search', (req, res) => {
    const query = String(req.query.query || '').trim().replace(/[^0-9a-zA-Z]/g, '');
    if (!query) {
      return res.status(400).json({ found: false, message: 'Vui lòng cung cấp số điện thoại hoặc số tài khoản cần tra cứu.' });
    }
    const matched = COMMUNITY_BLACKLIST.find((item) => item.identifier.includes(query) || query.includes(item.identifier));
    if (matched) {
      return res.json({
        found: true,
        data: matched,
        note: 'Đây là báo cáo của người dùng ScamGuard, chưa được xác minh. Hãy kiểm tra lại ở nguồn chính thức trước khi kết luận.',
      });
    }
    return res.json({
      found: false,
      message: `Chưa có người dùng ScamGuard nào báo cáo [${query}]. ScamGuard không kết nối với cơ sở dữ liệu của cơ quan chức năng, nên kết quả này KHÔNG có nghĩa là số an toàn. Hãy tự tra cứu ở nguồn chính thức và gọi lại tổng đài chính thức của tổ chức được nhắc tên.`,
    });
  });

  apiRouter.post('/blacklist/report', (req, res) => {
    const { type, identifier, bankName, description } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Thiếu số điện thoại hoặc số tài khoản báo cáo.' });
    }
    COMMUNITY_BLACKLIST.unshift({
      identifier: String(identifier).trim(),
      type: type === 'stk' ? 'stk' : 'phone',
      bankName: bankName ? String(bankName).trim() : undefined,
      riskLevel: 'UNVERIFIED',
      reportsCount: 1,
      lastReported: new Date().toISOString().split('T')[0],
      tags: ['Người dùng báo cáo – chưa xác minh'],
      details: description || 'Người dùng gửi phản ánh về hành vi lừa đảo qua ứng dụng.',
    });
    return res.json({ success: true, message: 'Đã ghi nhận báo cáo (chưa xác minh). Nếu bạn là nạn nhân, hãy trình báo cơ quan công an nơi gần nhất.' });
  });

  // Arena routes
  apiRouter.post('/arena/start', arenaLimiter, (req, res) => {
    try {
      const scenarioId = req.body.scenarioId || 'scam-01';
      const session = createArenaSession(scenarioId);
      return res.json({ session, ...session });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  });

  apiRouter.get('/arena/:sessionId', (req, res) => {
    const session = getArenaSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    return res.json({ session, ...session });
  });

  const handleArenaMessageRoute = async (req: any, res: any) => {
    try {
      const sessionId = req.params.sessionId || req.body.sessionId || `arena_${Date.now()}`;
      const messageText = req.body.message || req.body.content || req.body.text || '';
      const fallbackContext = {
        scenarioId: req.body.scenarioId,
        messages: req.body.messages,
      };
      const response = await processUserArenaMessage(sessionId, messageText, fallbackContext);
      return res.json(response);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  apiRouter.post('/arena/message', arenaLimiter, handleArenaMessageRoute);
  apiRouter.post('/arena/:sessionId/message', arenaLimiter, handleArenaMessageRoute);

  const handleArenaEndRoute = (req: any, res: any) => {
    try {
      const sessionId = req.params.sessionId || req.body.sessionId || req.body.sessionData?.id || '';
      const fallbackData = {
        scenarioId: req.body.scenarioId,
        messages: req.body.messages,
        sessionData: req.body.sessionData,
      };
      const finalReport = concludeArenaSession(sessionId, fallbackData);
      return res.json({ session: finalReport, ...finalReport });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  apiRouter.post('/arena/end', handleArenaEndRoute);
  apiRouter.post('/arena/:sessionId/end', handleArenaEndRoute);

  // Scientific research endpoints
  apiRouter.get('/research/statistics', (req, res) => {
    try {
      const stats = computeExperimentalStatistics();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.get('/research/benchmarks', (req, res) => {
    try {
      const bm = getMachineLearningBenchmarks();
      res.json(bm);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.get('/research/taxonomy-errors', (req, res) => {
    try {
      const errors = getErrorTaxonomyAnalysis();
      res.json(errors);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.get('/research/surveys', (req, res) => {
    try {
      const surveys = getAllCommunitySurveys();
      res.json({ surveys, total: surveys.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post('/research/survey', (req, res) => {
    try {
      const submission = recordCommunitySurveySubmission(req.body);
      const allSurveys = getAllCommunitySurveys();
      res.json({ success: true, submission, total: allSurveys.length });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  apiRouter.get('/research/survey-analytics', (req, res) => {
    try {
      const data = getCommunitySurveyAnalytics();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.get('/research/dataset', (req, res) => {
    res.json({ dataset: CAMGUARD_DATASET, count: CAMGUARD_DATASET.length });
  });

  // Post App Certification & Pre/Post Comparison
  apiRouter.get('/research/post-app-certifications', (req, res) => {
    try {
      res.json({ certifications: getAllPostAppCertifications() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post('/research/post-app-certifications', (req, res) => {
    try {
      const record = recordPostAppCertificationSubmission(req.body);
      res.json({ success: true, record });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  apiRouter.get('/research/pre-post-comparison', (req, res) => {
    try {
      const comparison = getPrePostComparisonAnalysis();
      res.json(comparison);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // User progress & Scam DNA
  apiRouter.get('/user/progress', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'guest_user';
    const progress = getOrCreateUserProgress(userId);
    res.json(progress);
  });

  apiRouter.post('/user/progress/event', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'guest_user';
    const { eventType, eventData } = req.body;
    const updated = recordProgressEvent(userId, eventType, eventData);
    res.json(updated);
  });

  apiRouter.get('/user/scam-dna', (req, res) => {
    const userId = (req.headers['x-user-id'] as string) || 'guest_user';
    const dna = calculateScamDna(userId);
    res.json(dna);
  });

  apiRouter.get('/community/scam-dna', (req, res) => {
    res.json(getCommunityScamDna());
  });

  apiRouter.post('/account/reset-all', accountLimiter, (req, res) => {
    try {
      const userId = (req.headers['x-user-id'] as string) || 'guest_user';
      deleteUserData(userId);
      resetUserAccountData(userId);
      resetAllUserProgress();
      clearAllResearchData();
      res.json({
        success: true,
        message: 'Đã reset hoàn tất toàn bộ bài học, khảo sát thực nghiệm và dữ liệu cá nhân!',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Lỗi khi reset dữ liệu' });
    }
  });

  // Nhật ký có địa chỉ IP người dùng: chỉ xem được khi gửi đúng khóa quản trị (biến môi trường ADMIN_KEY)
  apiRouter.get('/admin/audit-logs', (req, res) => {
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey || req.headers['x-admin-key'] !== adminKey) {
      return res.status(403).json({ error: 'Không có quyền xem nhật ký quản trị.' });
    }
    res.json({ logs: getAuditLogs(100), metrics: getGeminiUsageMetrics() });
  });

  // Mount API routes under both /api and / to handle Vercel routing
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  return app;
}

export const app = createExpressApp();
