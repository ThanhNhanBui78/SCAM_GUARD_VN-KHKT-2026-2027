import {
  ArenaMessage,
  ArenaSession,
  ArenaTimelineEvent,
  DefenseScoreBreakdown,
  DefenseTier,
  ScamScenario,
  ScamTactic,
} from '../src/types';
import { SCAM_SCENARIOS } from '../src/data/scenarios';
import { executeGeminiWithFallback, GEMINI_MODEL, stripHanCharacters } from './gemini';
import { sanitizeAndRedactPII, defendPromptInjection } from './safety';

// In-memory active session store
const sessionsMap = new Map<string, ArenaSession>();

export function clearAllArenaSessions() {
  sessionsMap.clear();
}

export function createArenaSession(scenarioId: string, userId?: string): ArenaSession {
  const scenario = SCAM_SCENARIOS.find((s) => s.id === scenarioId) || SCAM_SCENARIOS[0];
  const sessionId = `arena_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const initialMsg: ArenaMessage = {
    id: `msg_0_${Date.now()}`,
    sender: 'scammer',
    text: scenario.initialMessage,
    timestamp: timeStr,
    detectedTactic: scenario.tactics[0] || 'Authority',
    tacticExplanation: `Đối tượng mở đầu bằng đòn tâm lý ${scenario.tactics[0] || 'Authority'}.`,
    psychPressureDelta: 40,
  };

  const initialEvent: ArenaTimelineEvent = {
    timeLabel: timeStr,
    actor: 'Kẻ Lừa Đảo',
    action: `Bắt đầu tấn công qua kênh ${scenario.channel.toUpperCase()}`,
    type: 'tactic',
    description: `Mở màn kịch bản bằng thủ thuật thao túng: ${scenario.tactics[0]}`,
  };

  const session: ArenaSession = {
    id: sessionId,
    scenarioId: scenario.id,
    scenario,
    messages: [initialMsg],
    currentPressure: 40,
    trustLevel: 20,
    detectedTactics: [scenario.tactics[0] || 'Authority'],
    timeline: [initialEvent],
    status: 'active',
    startTime: Date.now(),
    exposedInfoWarning: {
      financial: false,
      identity: false,
      credentials: false,
      none: true,
    },
  };

  sessionsMap.set(sessionId, session);
  return session;
}

export function getArenaSession(sessionId: string): ArenaSession | undefined {
  return sessionsMap.get(sessionId);
}

export interface UserTurnEvaluation {
  scammerResponse: string;
  nextTactic: ScamTactic;
  tacticExplanation: string;
  pressureDelta: number;
  userVerificationDetected: boolean;
  complianceDetected: boolean;
  sessionEnded: boolean;
  aiCoachTip?: string;
}

export async function processUserArenaMessage(
  sessionId: string,
  userMessageText: string,
  fallbackContext?: { scenarioId?: string; messages?: ArenaMessage[] }
): Promise<{ session: ArenaSession; evaluation: UserTurnEvaluation }> {
  let session = sessionsMap.get(sessionId);
  if (!session) {
    const sc = SCAM_SCENARIOS.find((s) => s.id === fallbackContext?.scenarioId) || SCAM_SCENARIOS[0];
    const initialMsgs: ArenaMessage[] =
      fallbackContext?.messages && fallbackContext.messages.length > 0
        ? [...fallbackContext.messages]
        : [
            {
              id: `msg_0_${Date.now()}`,
              sender: 'scammer',
              text: sc.initialMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              detectedTactic: sc.tactics[0] || 'Authority',
              tacticExplanation: `Đối tượng mở đầu bằng đòn tâm lý ${sc.tactics[0] || 'Authority'}.`,
              psychPressureDelta: 40,
            },
          ];

    session = {
      id: sessionId,
      scenarioId: sc.id,
      scenario: sc,
      messages: initialMsgs,
      currentPressure: 40,
      trustLevel: 20,
      detectedTactics: [sc.tactics[0] || 'Authority'],
      timeline: [],
      status: 'active',
      startTime: Date.now(),
      exposedInfoWarning: {
        financial: false,
        identity: false,
        credentials: false,
        none: true,
      },
    };
    sessionsMap.set(sessionId, session);
  }

  const { text: cleanUserText } = sanitizeAndRedactPII(userMessageText);
  const safeUserText = defendPromptInjection(cleanUserText);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add User Message
  const userMsgId = `msg_user_${Date.now()}`;
  const userMsg: ArenaMessage = {
    id: userMsgId,
    sender: 'user',
    text: safeUserText,
    timestamp: timeStr,
  };
  session.messages.push(userMsg);

  // Deterministic evaluation heuristics (Vietnamese & English keywords)
  const lower = safeUserText.toLowerCase();
  const isVerifying =
    lower.includes('xác minh') ||
    lower.includes('gọi lại') ||
    lower.includes('trực tiếp') ||
    lower.includes('trụ sở') ||
    lower.includes('mặt sau') ||
    lower.includes('chi nhánh') ||
    lower.includes('hotline') ||
    lower.includes('mật khẩu') ||
    lower.includes('giấy mời') ||
    lower.includes('triệu tập') ||
    lower.includes('verify') ||
    lower.includes('call back') ||
    lower.includes('official');

  const isRefusing =
    lower.includes('không') ||
    lower.includes('từ chối') ||
    lower.includes('lừa đảo') ||
    lower.includes('dừng lại') ||
    lower.includes('cúp máy') ||
    lower.includes('báo công an') ||
    lower.includes('no') ||
    lower.includes('refuse') ||
    lower.includes('scam');

  const isComplying =
    lower.includes('vâng') ||
    lower.includes('dạ') ||
    lower.includes('đây') ||
    lower.includes('đã chuyển') ||
    lower.includes('mã otp') ||
    lower.includes('mật khẩu là') ||
    lower.includes('gửi rồi') ||
    lower.includes('ok') ||
    lower.includes('here is') ||
    lower.includes('sent');

  // Timeline entry for user
  if (isVerifying) {
    session.timeline.push({
      timeLabel: timeStr,
      actor: 'Bạn',
      action: 'Yêu Cầu Xác Minh Độc Lập',
      type: 'verification',
      description: 'Bạn đã chủ động yêu cầu xác minh qua kênh liên lạc chính thức hoặc hỏi mật mã an toàn.',
    });
  } else if (isRefusing) {
    session.timeline.push({
      timeLabel: timeStr,
      actor: 'Bạn',
      action: 'Kiên Quyết Từ Chối & Vạch Trần',
      type: 'success',
      description: 'Bạn đã dứt khoát bác bỏ yêu cầu vô lý và không để đối tượng dẫn dắt tâm lý.',
    });
  } else if (isComplying) {
    session.timeline.push({
      timeLabel: timeStr,
      actor: 'Bạn',
      action: 'Có Dấu Hiệu Lúng Túng / Nghe Theo',
      type: 'danger',
      description: 'Bạn đã có xu hướng làm theo lời đối phương hoặc lộ thông tin quan trọng.',
    });
  }

  // Tactic escalation state machine
  const availableTactics = session.scenario.tactics;
  const currentIndex = session.detectedTactics.length % availableTactics.length;
  let nextTactic: ScamTactic = availableTactics[currentIndex] || 'Urgency';

  // If user verified, switch to Authority or Fear to intimidate
  if (isVerifying) {
    nextTactic = 'Authority';
  } else if (isRefusing) {
    nextTactic = 'Fear';
  }

  let scammerResponse = '';
  let tacticExplanation = `Đối tượng tăng cường đòn tâm lý ${nextTactic} nhằm phản kích phản xạ phòng vệ của bạn.`;
  let pressureDelta = isComplying ? -10 : isVerifying ? +15 : +10;
  // Never automatically terminate after just a few turns. Allow deep, continuous natural conversation!
  let sessionEnded = false;
  let aiCoachTip = '';

  try {
    const historyContext = session.messages
      .map((m) => `${m.sender === 'user' ? 'NẠN NHÂN (NGƯỜI DÙNG)' : 'KẺ LỪA ĐẢO'}: ${m.text}`)
      .join('\n');

    const prompt = `Bạn là hệ thống huấn luyện phòng thủ an ninh mạng ViSEF / SCAMGUARD.
Nhiệm vụ của bạn là NHẬP VAI KẺ LỪA ĐẢO (Scammer) để đối thoại TRỰC TIẾP, LIÊN TỤC và CHUYÊN SÂU với người dùng (đang đóng vai nạn nhân) theo đúng chủ đề kịch bản đang diễn tập.

THÔNG TIN KỊCH BẢN ĐANG DIỄN TẬP:
- Tiêu đề: ${session.scenario.title} (${session.scenario.subtitle})
- Lĩnh vực: ${session.scenario.category}
- Danh tính kẻ lừa đảo: ${session.scenario.attackerProfile.name} (${session.scenario.attackerProfile.avatarRole} tại ${session.scenario.attackerProfile.organization})
- Kênh liên lạc: ${session.scenario.channel} (${session.scenario.attackerProfile.contactHandle})
- Bối cảnh tình huống: ${session.scenario.subtitle}. ${session.scenario.systemContext} (Đối tượng nhắm tới: ${session.scenario.targetPersona})
- Thủ thuật tâm lý hiện tại: ${nextTactic} (trong bộ chiến thuật: ${session.scenario.tactics.join(', ')})

LỊCH SỬ HỘI THOẠI TRƯỚC ĐÓ GIỮA HAI BÊN:
${historyContext}

TIN NHẮN MỚI NHẤT VỪA NHẬN TỪ NGƯỜI DÙNG:
"${safeUserText}"

QUY TẮC NHẬP VAI & GIAO TIẾP ĐỜI THƯỜNG (CỰC KỲ QUAN TRỌNG):
1. ĐÂY LÀ CUỘC TRÒ CHUYỆN THÔNG THƯỜNG HẰNG NGÀY GIỮA KẺ LỪA ĐẢO VÀ NẠN NHÂN TẠI VIỆT NAM (nhắn tin Zalo/Telegram/Messenger hoặc giả lập gọi điện thoại).
2. PHẢI ĐỐI THOẠI TỰ NHIÊN, LIỀN MẠCH, TRẢ LỜI ĐÚNG VÀO CÂU HỎI VÀ Ý TỨ CỦA NGƯỜI DÙNG VỪA NHẮN:
   - Nếu người dùng nghi ngờ/hỏi danh tính: Bịa ra số hiệu, mã cán bộ, lý do vì sao gọi số lạ (đường dây vệ tinh bảo mật, tổng đài tự động), trấn an hoặc dọa nạt ngược lại.
   - Nếu người dùng ngập ngừng/sợ mất tiền: Đóng vai người đồng cảm, chia sẻ bằng chứng giả mạo (hóa đơn tiền về, ảnh chụp thẻ ngành giả, số quyết định thụ lý án) để củng cố niềm tin.
   - Nếu người dùng đòi ra trụ sở/ngân hàng: Bịa lý do ngăn cản khẩn cấp ("vụ án thuộc diện bảo mật quốc gia, anh ra phường là làm lộ án", "hôm nay hệ thống khóa tự động, ra quầy không kịp hủy lệnh trừ tiền").
   - Nếu người dùng từ chối dứt khoát hoặc mắng mỏ: Đối tượng công an sẽ đe dọa lệnh truy nã/phong tỏa tài sản; đối tượng tuyển dụng/forex sẽ đe dọa mất toàn bộ tiền cọc hoặc lôi kéo người dùng quay lại.
3. KHÔNG ĐƯỢC TỰ Ý KẾT THÚC CUỘC HỘI THOẠI. Hãy giữ cuộc đối thoại tiếp diễn tự nhiên nhiều lượt như trò chuyện hàng ngày.
4. ĐỘ DÀI: 2-4 câu tự nhiên, dùng từ ngữ giao tiếp tiếng Việt đời thường, xưng hô phù hợp bối cảnh (Anh/Chị - Em, Đồng chí - Công dân, Bạn - Mình).
5. TUYỆT ĐỐI AN TOÀN: Dùng link và số tài khoản giả lập an toàn (ví dụ: https://congan-vneid-dieu-tra.site/xacminh).

TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON HỢP LỆ:
{
  "scammerResponse": "Câu thoại tiếng Việt tự nhiên của kẻ lừa đảo",
  "nextTactic": "${nextTactic}",
  "tacticExplanation": "1 câu ngắn giải thích thủ thuật tâm lý vừa sử dụng",
  "pressureDelta": 10,
  "userVerificationDetected": true/false,
  "complianceDetected": true/false,
  "shouldConcludeSession": false,
  "aiCoachTip": "1 câu ngắn lời khuyên phòng thủ từ Cố vấn AI cho người dùng"
}`;

    const response = await executeGeminiWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction:
          'Bạn là Bộ máy Mô phỏng Tác chiến Lừa Đảo Chuyên Sâu SCAMGUARD / ViSEF. Nhập vai kẻ lừa đảo giao tiếp tiếng Việt đời thường chân thực, tự nhiên và an toàn trong môi trường giáo dục. Chỉ dùng tiếng Việt, không dùng chữ Hán/Trung Quốc.',
      },
    });

    if (response?.text) {
      const parsed = JSON.parse(stripHanCharacters(response.text.trim()));
      if (parsed.scammerResponse) scammerResponse = parsed.scammerResponse;
      if (parsed.nextTactic) nextTactic = parsed.nextTactic;
      if (parsed.tacticExplanation) tacticExplanation = parsed.tacticExplanation;
      if (typeof parsed.pressureDelta === 'number') pressureDelta = parsed.pressureDelta;
      if (parsed.aiCoachTip) aiCoachTip = parsed.aiCoachTip;
      // Never force early exit unless explicit instruction
      sessionEnded = false;
    }
  } catch (err: any) {
    console.warn('Gemini arena simulation fallback triggered:', err?.message || err);
  }

  // Multi-turn realistic fallback response in Vietnamese if offline/rate limited
  if (!scammerResponse) {
    const scenarioTitle = session.scenario.title.toLowerCase();
    const userTurnCount = session.messages.filter((m) => m.sender === 'user').length;

    if (scenarioTitle.includes('công an') || scenarioTitle.includes('police') || scenarioTitle.includes('vneid')) {
      if (isVerifying) {
        scammerResponse = `Hồ sơ chuyên án V06 của Cục Cảnh sát Hình sự thuộc diện ĐẶC BIỆT NGUY HIỂM. Đường dây này được Viện Kiểm sát Tối cao giám sát ghi âm độc lập. Anh/chị thắc mắc gì thì cán bộ sẽ giải thích rõ, nhưng tuyệt đối không được tự ý ngắt kết nối làm gián đoạn tiến trình điều tra!`;
        tacticExplanation = 'Đối tượng sử dụng vỏ bọc Pháp lý & Áp chế tâm lý để ngăn nạn nhân cúp máy gọi người thân.';
        aiCoachTip = 'Công an Việt Nam KHÔNG BAO GIỜ làm việc qua điện thoại hay yêu cầu chuyển tiền vào tài khoản tạm giữ!';
      } else if (isRefusing) {
        scammerResponse = `Tôi nhắc nhở anh/chị, việc trốn tránh và có lời lẽ bất hợp tác sẽ bị coi là hành vi cản trở người thi hành công vụ theo Điều 330 Bộ Luật Hình Sự! Trong vòng 20 phút tới, nếu anh/chị không hoàn tất xác minh danh tính, lệnh tạm giữ tài khoản sẽ có hiệu lực ngay lập tức!`;
        tacticExplanation = 'Đối tượng tung đòn Dọa nạt chế tài pháp luật và dồn ép mốc thời gian.';
        aiCoachTip = 'Giữ bình tĩnh, không sợ hãi trước các lời đe dọa suông. Hãy yêu cầu giấy triệu tập chính thức gửi về địa phương.';
      } else if (userTurnCount > 3) {
        scammerResponse = `Bây giờ cán bộ sẽ gửi cho anh/chị một mã định danh bảo mật 6 số qua hệ thống tin nhắn nội bộ. Anh/chị hãy đọc ngay mã này lên đường dây để tôi cập nhật gỡ bỏ tên anh/chị khỏi danh sách rửa tiền!`;
        tacticExplanation = 'Đối tượng chuyển sang bước quyết định: Chiếm đoạt mã OTP trong lớp vỏ hỗ trợ gỡ án.';
        aiCoachTip = 'Tuyệt đối KHÔNG đọc mã OTP hoặc mật khẩu cho bất kỳ ai, kể cả người xưng là công an!';
      } else {
        scammerResponse = `Tốt lắm, anh/chị hãy giữ máy và di chuyển vào phòng kín, không cho người thứ 3 nghe thấy để bảo vệ bí mật nghiệp vụ. Tôi đang kết nối trực tiếp với cán bộ thụ lý hồ sơ.`;
        tacticExplanation = 'Đối tượng áp dụng đòn Cô lập nạn nhân khỏi sự trợ giúp của gia đình.';
        aiCoachTip = 'Chiêu trò cô lập: Kẻ gian luôn ép nạn nhân ở một mình để dễ bề thao túng tâm lý.';
      }
    } else if (scenarioTitle.includes('ngân hàng') || scenarioTitle.includes('bank') || scenarioTitle.includes('khóa')) {
      if (isVerifying) {
        scammerResponse = `Hệ thống phòng chống gian lận tự động của ngân hàng đang phát hiện lệnh trừ 28.500.000đ tại máy POS nước ngoài. Nếu anh/chị chờ ra quầy thì lệnh sẽ hoàn tất không thể thu hồi. Em đang hỗ trợ chặn dòng tiền khẩn cấp cho anh/chị đây ạ!`;
        tacticExplanation = 'Đối tượng tạo cảm giác cấp bách tột độ (Urgency) nhằm làm tê liệt khả năng suy xét logic.';
        aiCoachTip = 'Hãy cúp máy và tự gọi số hotline in ở MẶT SAU THẺ ngân hàng vật lý của bạn.';
      } else if (isRefusing) {
        scammerResponse = `Dạ em hiểu anh/chị đang e ngại, nhưng mã giao dịch bất thường này chỉ còn 90 giây để hủy trên cổng liên ngân hàng. Nếu anh/chị không xác nhận ngay, số tiền bị thất thoát phía ngân hàng sẽ từ chối bồi hoàn đấy ạ!`;
        tacticExplanation = 'Đối tượng thoái thác trách nhiệm và đánh vào nỗi sợ mất tiền của khách hàng.';
        aiCoachTip = 'Ngân hàng không bao giờ bắt buộc khách hàng phải cung cấp mật khẩu hoặc OTP để hủy lệnh.';
      } else if (userTurnCount > 2) {
        scammerResponse = `Em vừa kích hoạt cổng bảo vệ khẩn cấp. Hệ thống đã gửi 1 tin nhắn SMS có mã hủy 6 số về máy anh/chị. Anh/chị đọc nhanh 6 số đó để em nhấn nút hoàn tiền lại tài khoản ngay nhé!`;
        tacticExplanation = 'Bẫy đoạt mã OTP cuối cùng bằng cách giả vờ là mã hủy giao dịch.';
        aiCoachTip = 'Mã SMS gửi về thực chất là mã OTP chuyển tiền hoặc đăng nhập tài khoản của bạn!';
      } else {
        scammerResponse = `Dạ anh/chị cho em xin đúng 4 số cuối của số tài khoản để em đối soát thông tin với trung tâm thẻ xem có đúng giao dịch vừa phát sinh không ạ?`;
        tacticExplanation = 'Thu thập từng phần thông tin để tạo lòng tin ban đầu trước khi đánh vào OTP.';
        aiCoachTip = 'Không chia sẻ bất kỳ thông tin thẻ hay số dư nào cho người gọi đến xưng là nhân viên ngân hàng.';
      }
    } else if (scenarioTitle.includes('việc làm') || scenarioTitle.includes('shopee') || scenarioTitle.includes('ctv') || scenarioTitle.includes('tiktok')) {
      if (isVerifying) {
        scammerResponse = `Dạ chị yên tâm, công ty em là đối tác chiến lược cấp 1 của sàn thương mại điện tử, có mã số thuế và văn phòng đại diện tại Landmark 81. Rất nhiều mẹ bỉm sữa và sinh viên đang làm kiếm 300k - 500k/ngày đều đặn ạ.`;
        tacticExplanation = 'Sử dụng Bằng chứng xã hội (Social Proof) và tên tuổi thương hiệu lớn để tạo uy tín giả.';
        aiCoachTip = 'Các sàn TMĐT lớn như Shopee, Lazada, TikTok đều khẳng định không tuyển CTV làm nhiệm vụ nạp tiền nhận hoa hồng!';
      } else if (isRefusing) {
        scammerResponse = `Tiếc quá chị ơi, suất nhiệm vụ hôm nay chỉ còn đúng 2 chỉ tiêu thôi ạ. Chị không cần làm đơn lớn đâu, chỉ cần thử đơn 100k là 3 phút sau nhận lại 130k cả vốn lẫn lãi về ATM liền để kiểm chứng ạ!`;
        tacticExplanation = 'Chiêu thả con săn sắt bắt con cá rô: dùng số tiền nhỏ ban đầu để dẫn dụ vào bẫy lớn.';
        aiCoachTip = 'Kẻ lừa đảo sẵn sàng trả hoa hồng cho 1-2 đơn đầu tiên để bạn tin tưởng nạp tiền triệu vào các đơn sau.';
      } else if (userTurnCount > 2) {
        scammerResponse = `Chúc mừng chị đã hoàn thành nhiệm vụ trước! Bây giờ là đơn hàng vip cuối cùng trong ngày trị giá 2.500.000đ để nhận hoa hồng 40% (1.000.000đ). Chị chuyển khoản vào mã kế toán này để tất toán tiền về nhé!`;
        tacticExplanation = 'Nâng dần số tiền nhiệm vụ và giam tiền cọc không cho rút.';
        aiCoachTip = 'Một khi đã nạp số tiền lớn, kẻ lừa đảo sẽ liên tục báo lỗi hệ thống để ép bạn nạp thêm tiền!';
      } else {
        scammerResponse = `Dạ công việc rất đơn giản ạ, chị chỉ cần bấm thích video và đánh giá 5 sao cho sản phẩm. Mỗi lượt nhận ngay 30.000đ về tài khoản, không cọc không mất phí gì đâu ạ!`;
        tacticExplanation = 'Dụ dỗ bằng công việc nhẹ lương cao, thao tác đơn giản.';
        aiCoachTip = 'Không có công việc nào chỉ bấm like hay đánh giá dạo mà kiếm được tiền trăm nghìn mỗi ngày.';
      }
    } else {
      if (isVerifying) {
        scammerResponse = `Anh/chị cứ bình tĩnh, em giải thích rất rõ ràng cho anh/chị hiểu mà. Chúng ta làm việc minh bạch, anh/chị xem giấy tờ em gửi qua tin nhắn là biết ngay em nói thật hay nói đùa ạ.`;
        tacticExplanation = 'Đối tượng khéo léo xoa dịu sự hoài nghi bằng thái độ chân thành giả tạo.';
        aiCoachTip = 'Luôn kiểm tra chéo thông tin qua các kênh chính thống độc lập trước khi tin lời người lạ qua mạng.';
      } else if (isRefusing) {
        scammerResponse = `Anh/chị từ chối như vậy là tự đánh mất quyền lợi rất lớn của mình đấy. Sau cuộc gọi này hệ thống sẽ tự động hủy tư cách tham gia của anh/chị và chuyển sang người khác!`;
        tacticExplanation = 'Đối tượng đánh vào tâm lý sợ bỏ lỡ cơ hội (FOMO) và tiếc nuối.';
        aiCoachTip = 'Bất cứ đề nghị nào quá tốt hoặc tạo sức ép bắt quyết định tức thì đều là dấu hiệu của lừa đảo.';
      } else {
        scammerResponse = `Dạ vâng, anh/chị chỉ cần làm theo đúng từng bước em hướng dẫn trên màn hình là xong ngay trong 2 phút thôi ạ, vô cùng đơn giản!`;
        tacticExplanation = 'Dẫn dắt nạn nhân từng bước nhỏ để nạn nhân không kịp tỉnh táo nhận ra bẫy.';
        aiCoachTip = 'Dừng lại 5 giây: Tự hỏi tại sao người này lại cần mình thao tác gấp gáp như vậy.';
      }
    }
  }

  // Update session pressure
  session.currentPressure = Math.max(10, Math.min(100, session.currentPressure + pressureDelta));
  if (!session.detectedTactics.includes(nextTactic)) {
    session.detectedTactics.push(nextTactic);
  }

  // Add scammer message to session
  const scammerMsg: ArenaMessage = {
    id: `msg_scammer_${Date.now()}`,
    sender: 'scammer',
    text: scammerResponse,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    detectedTactic: nextTactic,
    tacticExplanation,
    psychPressureDelta: pressureDelta,
    userVerificationDetected: isVerifying,
    complianceDetected: isComplying,
  };
  session.messages.push(scammerMsg);

  session.timeline.push({
    timeLabel: scammerMsg.timestamp,
    actor: 'Kẻ Lừa Đảo',
    action: `Tăng Cường Đòn ${nextTactic}`,
    type: 'tactic',
    description: tacticExplanation,
  });

  const evaluation: UserTurnEvaluation = {
    scammerResponse,
    nextTactic,
    tacticExplanation,
    pressureDelta,
    userVerificationDetected: isVerifying,
    complianceDetected: isComplying,
    sessionEnded,
    aiCoachTip,
  };

  return { session, evaluation };
}

export function concludeArenaSession(
  sessionId: string,
  fallbackData?: {
    scenarioId?: string;
    messages?: ArenaMessage[];
    sessionData?: Partial<ArenaSession>;
  }
): ArenaSession {
  let session = sessionsMap.get(sessionId);
  if (!session) {
    const scenarioId =
      fallbackData?.scenarioId ||
      fallbackData?.sessionData?.scenarioId ||
      SCAM_SCENARIOS[0].id;
    const scenario = SCAM_SCENARIOS.find((s) => s.id === scenarioId) || SCAM_SCENARIOS[0];
    const initialMessages: ArenaMessage[] =
      fallbackData?.messages && fallbackData.messages.length > 0
        ? fallbackData.messages
        : fallbackData?.sessionData?.messages && fallbackData.sessionData.messages.length > 0
        ? fallbackData.sessionData.messages
        : [
            {
              id: `msg_0_${Date.now()}`,
              sender: 'scammer',
              text: scenario.initialMessage,
              timestamp: 'Vừa xong',
              detectedTactic: scenario.tactics[0] || 'Authority',
            },
          ];

    session = {
      id: sessionId,
      scenarioId: scenario.id,
      scenario,
      messages: initialMessages,
      currentPressure: fallbackData?.sessionData?.currentPressure || 40,
      trustLevel: fallbackData?.sessionData?.trustLevel || 20,
      detectedTactics: fallbackData?.sessionData?.detectedTactics || [scenario.tactics[0] || 'Authority'],
      timeline: fallbackData?.sessionData?.timeline || [],
      status: 'active',
      startTime: fallbackData?.sessionData?.startTime || Date.now() - 60000,
      exposedInfoWarning: fallbackData?.sessionData?.exposedInfoWarning || {
        financial: false,
        identity: false,
        credentials: false,
        none: true,
      },
    };
    sessionsMap.set(sessionId, session);
  }

  session.status = 'completed';
  session.endTime = Date.now();

  // Multi-dimensional defense scoring calculation
  let verificationCount = 0;
  let refusalCount = 0;
  let complianceCount = 0;

  for (const msg of session.messages) {
    if (msg.sender === 'user') {
      const lower = msg.text.toLowerCase();
      if (lower.includes('xác minh') || lower.includes('mặt sau') || lower.includes('gọi lại') || lower.includes('trực tiếp') || lower.includes('verify')) {
        verificationCount++;
      }
      if (lower.includes('không') || lower.includes('từ chối') || lower.includes('lừa đảo') || lower.includes('dừng') || lower.includes('refuse')) {
        refusalCount++;
      }
      if (lower.includes('vâng') || lower.includes('dạ') || lower.includes('chuyển rồi') || lower.includes('mã là') || lower.includes('ok')) {
        complianceCount++;
      }
    }
  }

  // Dimension scores (0 - 100)
  const scamRecognition = Math.min(100, Math.max(30, 60 + refusalCount * 20 - complianceCount * 30));
  const verificationBehavior = Math.min(100, Math.max(20, verificationCount * 45 + (refusalCount > 0 ? 20 : 0)));
  const emotionalControl = Math.max(20, Math.min(100, 100 - (session.currentPressure > 70 ? 30 : 10) - complianceCount * 25));
  const refusalBehavior = Math.min(100, Math.max(20, refusalCount * 40 + (complianceCount === 0 ? 30 : 0)));
  const informationProtection = complianceCount === 0 ? 95 : Math.max(20, 80 - complianceCount * 40);
  const independentVerification = verificationCount > 0 ? 90 : 40;
  const responseTimeScore = 85;

  // Weighted Final Score (0 - 100)
  const overallScore = Math.round(
    scamRecognition * 0.2 +
      verificationBehavior * 0.2 +
      emotionalControl * 0.15 +
      refusalBehavior * 0.15 +
      informationProtection * 0.15 +
      independentVerification * 0.1 +
      responseTimeScore * 0.05
  );

  let tier: DefenseTier = 'Developing';
  if (overallScore >= 92) tier = 'Vệ Binh Tinh Nhuệ' as DefenseTier;
  else if (overallScore >= 80) tier = 'Vệ Binh Vững Vàng' as DefenseTier;
  else if (overallScore >= 65) tier = 'Đang Rèn Luyện' as DefenseTier;
  else if (overallScore >= 40) tier = 'Có Rủi Ro' as DefenseTier;
  else tier = 'Rất Dễ Tổn Thương' as DefenseTier;

  const defenseScore: DefenseScoreBreakdown = {
    overallScore,
    tier,
    scamRecognition,
    verificationBehavior,
    emotionalControl,
    refusalBehavior,
    informationProtection,
    independentVerification,
    responseTimeScore,
  };

  session.defenseScore = defenseScore;
  session.feedbackSummary =
    overallScore >= 80
      ? `Khả năng phòng thủ xuất sắc! Bạn đã hóa giải hoàn toàn các đòn thao túng tâm lý bằng phản xạ đòi hỏi xác minh độc lập và kiên quyết bảo vệ thông tin mật.`
      : overallScore >= 60
      ? `Nhận thức phòng thủ khá tốt, tuy nhiên cần chú ý bẫy dồn ép thời gian. Khi bị thúc ép, hãy luôn nhớ quy tắc vàng: Dừng lại và gọi số hotline ở mặt sau thẻ ngân hàng.`
      : `Phát hiện điểm yếu khi chịu áp lực cao. Kẻ lừa đảo đã lợi dụng tâm lý sợ hãi và quyền lực để dẫn dắt bạn. Hãy luyện tập thêm các câu thoại mẫu để phản xạ tự nhiên hơn.`;

  session.whatCouldYouHaveDone = [
    'Thực hiện quy tắc "Mặt sau của thẻ": cúp máy ngay và tự bấm số hotline in trên thẻ ngân hàng vật lý.',
    'Chủ động hỏi số hiệu cán bộ, quyết định thụ lý vụ án và yêu cầu gửi giấy triệu tập về công an phường nơi cư trú.',
    'Tuyệt đối không vội vàng: Các cơ quan nhà nước và ngân hàng chính thống không bao giờ ép giải quyết án hay phong tỏa tài khoản qua mạng xã hội trong 5-15 phút.',
  ];

  return session;
}
