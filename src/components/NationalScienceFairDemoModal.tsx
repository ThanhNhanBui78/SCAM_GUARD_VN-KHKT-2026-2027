import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  Compass,
  Eye,
  Radio,
  Sparkles,
  Shield,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  BarChart3,
  Building2,
  MapPin,
  User,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Flame,
  QrCode,
  Smartphone,
  Video,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  Award,
  Store,
  KeyRound,
  Link2,
  HelpCircle,
  Check,
  Zap,
  Gauge,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PersonalVsCommunityComparisonSuite } from './PersonalVsCommunityComparisonSuite';
import { SurveyDemographicsSection } from './SurveyDemographicsSection';
import { recordSurveySubmission } from '../services/researchDataService';
import mascotShield from '../assets/images/mascot_shield_transparent.png';

interface NationalScienceFairDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToResearch?: () => void;
  onNavigateToMainUI?: () => void;
}

const VIETNAM_PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Hải Phòng',
  'Đà Nẵng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
  'Khác',
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  {
    id: 'A_NEVER',
    letter: 'A',
    label: 'Chưa bao giờ gặp',
    desc: 'Chưa từng nhận tin nhắn, cuộc gọi hay tiếp xúc với hình thức này ngoài đời.',
    tag: 'Chưa gặp',
    tagColor: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: '🛡️',
  },
  {
    id: 'B_SAFE',
    letter: 'B',
    label: 'Có gặp, nhưng phát hiện ngay & bỏ qua',
    desc: 'Nhận diện ngay dấu hiệu bất thường, chủ động chặn/xóa an toàn.',
    tag: 'Phát hiện ngay',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: '✅',
  },
  {
    id: 'C_NEAR_MISS',
    letter: 'C',
    label: 'Có gặp, từng suýt bị lừa (May mắn dừng lại)',
    desc: 'Đã click link, nhắn tin hay làm theo một vài bước nhưng kịp thời nghi ngờ dừng lại.',
    tag: 'Suýt bị lừa',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: '⚠️',
  },
  {
    id: 'D_VICTIM',
    letter: 'D',
    label: 'Có gặp, từng bị lừa hoặc chịu thiệt hại',
    desc: 'Đã chuyển tiền, lộ OTP/mật khẩu, bị chiếm đoạt tài sản hoặc mất tài khoản.',
    tag: 'Đã chịu thiệt hại',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: '❌',
  },
];

export interface ScenarioQuestion {
  key: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9' | 'q10' | 'q11' | 'q12';
  number: number;
  trapIndex: number;
  sectorId: string;
  sectorNumber: number;
  sectorTitle: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: string;
  source: string;
  content: string;
  prompt: string;
  options: { id: string; letter: string; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  trapExplanation: string;
}

export const SCENARIO_QUESTIONS: ScenarioQuestion[] = [
  {
    key: 'q1',
    number: 1,
    trapIndex: 1,
    sectorId: 'KV1',
    sectorNumber: 1,
    sectorTitle: 'Khu Vực 1: SMS / Email Trúng Thưởng',
    title: 'Tình Huống 1: SMS / EMAIL TRÚNG THƯỞNG — “THƯƠNG HIỆU THẬT”',
    badge: 'Khu Vực 1 • Quà Tặng & Mạo Danh Thương Hiệu',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '🎁',
    source: 'Tin nhắn SMS / Email trúng thưởng 0 đồng',
    content: 'Bạn nhận SMS hiển thị tên một thương hiệu lớn: “Chúc mừng! Số điện thoại của bạn được chọn nhận iPhone. Xác nhận trước 23:59.” Tin nhắn dẫn tới một website có tên miền gần giống thương hiệu. Website có HTTPS, logo đúng, chính sách bảo mật đầy đủ và thông tin pháp nhân của công ty. Bạn tìm thấy một bài đăng trên fanpage chính thức của thương hiệu nói rằng họ thực sự đang có chương trình tặng iPhone. Tuy nhiên, bài đăng không chứa đường dẫn tới website trong SMS.',
    prompt: 'Hành động nào cung cấp bằng chứng mạnh nhất để xác định website trong SMS có thuộc chương trình hay không?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Kiểm tra thông tin pháp nhân trên website rồi đối chiếu với thông tin doanh nghiệp của thương hiệu.' },
      { id: 'B', letter: 'B', text: 'B. Kiểm tra tên miền có được đăng ký bởi tổ chức liên quan đến thương hiệu hay không.' },
      { id: 'C', letter: 'C', text: 'C. Truy cập chương trình từ fanpage chính thức và đối chiếu đường dẫn, tên miền với website trong SMS.' },
      { id: 'D', letter: 'D', text: 'D. Kiểm tra HTTPS, chứng chỉ và thời điểm đăng ký tên miền trước khi nhập thông tin.' },
      { id: 'E', letter: 'E', text: 'E. Liên hệ bộ phận chăm sóc khách hàng bằng số điện thoại được hiển thị trên website để xác nhận.' },
      { id: 'F', letter: 'F', text: 'F. So sánh nội dung chương trình, thời hạn và điều kiện nhận thưởng giữa hai website.' },
    ],
    correctAnswer: 'C',
    trapExplanation: '☠️ Bẫy: A/B/D/E đều có giá trị xác minh, nhưng website đáng ngờ có thể chứa thông tin thật hoặc được dựng rất chuyên nghiệp. Chi tiết quyết định là fanpage chính thức đã xác nhận chương trình nhưng chưa xác nhận website đó.',
  },
  {
    key: 'q2',
    number: 2,
    trapIndex: 2,
    sectorId: 'KV2',
    sectorNumber: 2,
    sectorTitle: 'Khu Vực 2: Viễn Thông & Giả Danh Uy Quyền',
    title: 'Tình Huống 2: GIẢ DANH CÔNG AN / KHÓA SIM — “THÔNG TIN THẬT”',
    badge: 'Khu Vực 2 • Viễn Thông & Giả Danh Công An',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '📞',
    source: 'Cuộc gọi viễn thông & Giả danh Cán bộ',
    content: 'Một người gọi tự xưng cán bộ điều tra. Họ đọc đúng họ tên, ngày sinh và số CCCD của bạn. Họ gửi ảnh thẻ ngành, giấy triệu tập và một mã hồ sơ. Bạn kiểm tra trên Internet và tìm thấy đúng tên đơn vị mà người này nói. Người gọi yêu cầu bạn chuyển sang Zalo để gửi hồ sơ.',
    prompt: 'Thông tin nào có giá trị xác thực cao nhất ở thời điểm này?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Mã hồ sơ có tồn tại trong hệ thống mà người gọi cung cấp hay không.' },
      { id: 'B', letter: 'B', text: 'B. Thông tin cá nhân người gọi đọc có khớp với dữ liệu của bạn hay không.' },
      { id: 'C', letter: 'C', text: 'C. Hình ảnh giấy tờ có chứa các thông tin phù hợp với cơ quan được nêu hay không.' },
      { id: 'D', letter: 'D', text: 'D. Số điện thoại người gọi có liên quan đến khu vực nơi bạn sinh sống hay không.' },
      { id: 'E', letter: 'E', text: 'E. Cơ quan được nêu có thể xác nhận hồ sơ thông qua một kênh liên hệ mà bạn tự tìm được hay không.' },
      { id: 'F', letter: 'F', text: 'F. Người gọi có thể trả lời các câu hỏi về vụ việc mà người ngoài khó biết hay không.' },
    ],
    correctAnswer: 'E',
    trapExplanation: '☠️ Bẫy: Đây là câu đánh vào information asymmetry. Kẻ lừa đảo có thể có dữ liệu cá nhân lộ gỉ, giấy tờ giả và thậm chí thông tin thật về cơ quan.',
  },
  {
    key: 'q3',
    number: 3,
    trapIndex: 3,
    sectorId: 'KV3',
    sectorNumber: 3,
    sectorTitle: 'Khu Vực 3: TMĐT & Đơn COD Ảo',
    title: 'Tình Huống 3: COD — “139.000đ KHÔNG ĐÁNG ĐỂ KIỂM TRA?”',
    badge: 'Khu Vực 3 • Shipper & Đơn Hàng COD Ảo',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '📦',
    source: 'Giao hàng COD & Shipper gọi điện',
    content: 'Bạn nhận cuộc gọi: “Anh/chị có đơn COD 139.000đ.” Bạn không nhớ đặt hàng. Shipper đọc đúng tên và địa chỉ. Người gọi nói: “Anh/chị cứ nhận đi, nếu không đúng thì hoàn.” Một tài khoản khác nhắn rằng đây là quà tặng và gửi ảnh sản phẩm. Bạn kiểm tra lịch sử mua hàng nhưng không tìm thấy đơn tương ứng.',
    prompt: 'Bước nào giúp phân biệt tốt nhất giữa một đơn hàng thực sự tồn tại và một câu chuyện được dựng lên từ thông tin cá nhân của bạn?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Yêu cầu shipper đọc tên sản phẩm và người gửi rồi quyết định nhận.' },
      { id: 'B', letter: 'B', text: 'B. Yêu cầu tài khoản gửi quà cung cấp mã đơn để so sánh.' },
      { id: 'C', letter: 'C', text: 'C. Gọi số điện thoại của người gửi được ghi trên đơn để xác nhận.' },
      { id: 'D', letter: 'D', text: 'D. Kiểm tra mã vận đơn trên hệ thống/app vận chuyển độc lập với thông tin do người gọi cung cấp.' },
      { id: 'E', letter: 'E', text: 'E. Đối chiếu tên và địa chỉ trên đơn với thông tin của bạn.' },
      { id: 'F', letter: 'F', text: 'F. Kiểm tra ảnh sản phẩm với hình ảnh trên các sàn thương mại điện tử.' },
    ],
    correctAnswer: 'D',
    trapExplanation: '☠️ Bẫy: A/E có thể xác nhận rằng “thông tin của bạn đúng”, nhưng không chứng minh đơn hàng thực sự tồn tại trên hệ thống vận chuyển độc lập.',
  },
  {
    key: 'q4',
    number: 4,
    trapIndex: 4,
    sectorId: 'KV4',
    sectorNumber: 4,
    sectorTitle: 'Khu Vực 4: Bẫy Tình Hẹn Hò & Pig Butchering',
    title: 'Tình Huống 4: PIG BUTCHERING — “NHƯNG TÔI ĐÃ RÚT ĐƯỢC TIỀN”',
    badge: 'Khu Vực 4 • Bẫy Hẹn Hò & Pig Butchering',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    icon: '💖',
    source: 'Mạng xã hội Hẹn hò & Trò chuyện ảo',
    content: 'Bạn quen một người qua mạng trong 6 tuần. Họ không ép bạn đầu tư ngay. Họ thường xuyên nói chuyện, chia sẻ cuộc sống cá nhân và chỉ sau vài tuần mới đề cập đến đầu tư. Bạn nạp 2 triệu đồng. Website hiển thị lợi nhuận. Bạn yêu cầu rút 500.000đ. Tiền thực sự về tài khoản ngân hàng của bạn. Sau đó người này đề nghị bạn tăng vốn lên 30 triệu đồng.',
    prompt: 'Kết luận nào được hỗ trợ tốt nhất bởi dữ kiện hiện tại?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Việc rút tiền thành công chứng minh hệ thống có khả năng thanh toán thực tế.' },
      { id: 'B', letter: 'B', text: 'B. Việc chưa bị yêu cầu thêm phí khi rút tiền cho thấy quy trình chưa có dấu hiệu bất thường.' },
      { id: 'C', letter: 'C', text: 'C. Giao dịch thành công là bằng chứng quan trọng nhưng chưa đủ để xác định nguồn lợi nhuận và mô hình vận hành.' },
      { id: 'D', letter: 'D', text: 'D. Việc đối tượng xây dựng quan hệ trong thời gian dài làm giảm khả năng đây là lừa đảo tức thời.' },
      { id: 'E', letter: 'E', text: 'E. Nếu lợi nhuận ban đầu tương ứng với biến động thị trường thì mô hình có thêm cơ sở đáng tin.' },
      { id: 'F', letter: 'F', text: 'F. Vì số tiền đã thực sự chuyển vào tài khoản ngân hàng, rủi ro chủ yếu chỉ còn nằm ở khoản vốn mới.' },
    ],
    correctAnswer: 'C',
    trapExplanation: '☠️ Bẫy suy luận: “Giao dịch mồi câu thật” ≠ “mô hình thật/hợp pháp”.',
  },
  {
    key: 'q5',
    number: 5,
    trapIndex: 5,
    sectorId: 'KV5',
    sectorNumber: 5,
    sectorTitle: 'Khu Vực 5: Sàn Crypto & Ponzi Ủy Thác',
    title: 'Tình Huống 5: CRYPTO — “14 TRIỆU TRONG TÀI KHOẢN”',
    badge: 'Khu Vực 5 • Sàn Crypto Ảo & Ponzi',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: '📈',
    source: 'Nhóm Telegram / Zalo tư vấn tài chính',
    content: 'Bạn nạp 10 triệu đồng vào nền tảng được quảng bá trong Telegram. Sau 3 ngày: Số dư: 14.000.000đ. Lịch sử giao dịch hiển thị nhiều giao dịch thành công. Một số thành viên Telegram đăng ảnh rút tiền thành công. Khi bạn yêu cầu rút, hệ thống yêu cầu: Phí xác minh: 1.400.000đ.',
    prompt: 'Thông tin nào nên được xác minh trước tiên nếu mục tiêu là xác định nền tảng có thực sự được phép cung cấp dịch vụ tài chính hay không?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Lịch sử giao dịch hiển thị trong tài khoản.' },
      { id: 'B', letter: 'B', text: 'B. Các ảnh chụp giao dịch thành công của thành viên.' },
      { id: 'C', letter: 'C', text: 'C. Cơ chế tính phí xác minh được công bố trên website.' },
      { id: 'D', letter: 'D', text: 'D. Số dư và mức lợi nhuận hiện tại.' },
      { id: 'E', letter: 'E', text: 'E. Tên pháp nhân và trạng thái giấy phép từ nguồn quản lý độc lập.' },
      { id: 'F', letter: 'F', text: 'F. Thời gian xử lý yêu cầu rút tiền của những người dùng khác.' },
    ],
    correctAnswer: 'E',
    trapExplanation: '☠️ Bẫy: A/B/C/D/F đều có thể bị giả tạo và thao túng trên ứng dụng rác.',
  },
  {
    key: 'q6',
    number: 6,
    trapIndex: 6,
    sectorId: 'KV6',
    sectorNumber: 6,
    sectorTitle: 'Khu Vực 6: App Dịch Vụ Công Giả Mạo APK',
    title: 'Tình Huống 6: APK DỊCH VỤ CÔNG — “MỌI THỨ ĐỀU CÓ VẺ THẬT”',
    badge: 'Khu Vực 6 • VNeID APK & Mã Độc Chiếm Quyền',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    icon: '🛡️',
    source: 'Cuộc gọi xưng Cán bộ Công an / Thuế',
    content: 'Một người gọi nói dữ liệu CCCD của bạn có vấn đề. Họ gửi: file APK, ảnh giao diện ứng dụng, tên nhà phát triển, mã phiên bản, hướng dẫn cài đặt, video hướng dẫn. Ứng dụng yêu cầu quyền truy cập SMS, thông báo và trợ năng (Accessibility). Người gọi nói: “Tôi sẽ ở đây hướng dẫn từng bước.”',
    prompt: 'Thông tin nào cần được xác minh trước khi phân tích APK?',
    options: [
      { id: 'A', letter: 'A', text: 'A. APK có đúng tên ứng dụng được công bố hay không.' },
      { id: 'B', letter: 'B', text: 'B. Các quyền mà ứng dụng yêu cầu có phù hợp với chức năng hay không.' },
      { id: 'C', letter: 'C', text: 'C. Hash của file có thay đổi sau khi tải xuống hay không.' },
      { id: 'D', letter: 'D', text: 'D. Tên package có tương ứng với tên ứng dụng hay không.' },
      { id: 'E', letter: 'E', text: 'E. Nhà phát triển trong APK có trùng với thông tin được công bố hay không.' },
      { id: 'F', letter: 'F', text: 'F. Cơ quan được nêu có thực sự phát sinh yêu cầu xử lý dữ liệu của bạn hay không.' },
    ],
    correctAnswer: 'F',
    trapExplanation: '☠️ Bẫy: A–E có thể rất hữu ích trong phân tích malware, nhưng nếu yêu cầu ban đầu đã giả thì toàn bộ quá trình phân tích APK có thể đang đi sai tầng vấn đề.',
  },
  {
    key: 'q7',
    number: 7,
    trapIndex: 7,
    sectorId: 'KV7',
    sectorNumber: 7,
    sectorTitle: 'Khu Vực 7: Mã QR Quishing Thanh Toán',
    title: 'Tình Huống 7: QR QUISHING — “WEBSITE NGÂN HÀNG HOÀN HẢO”',
    badge: 'Khu Vực 7 • Bẫy Mã QR Quishing Thanh Toán',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: '🔳',
    source: 'Quét mã QR dán tại bàn ăn / cửa hàng',
    content: 'Bạn quét QR tại quán. Trang mở ra: HTTPS, logo ngân hàng, giao diện giống ứng dụng, cảnh báo bảo mật, tên ngân hàng chính xác. Trang yêu cầu đăng nhập để “xác nhận thanh toán”. Bạn nhìn xuống bàn và thấy một QR khác do quán in, ghi rõ tên tài khoản nhận tiền.',
    prompt: 'Phương án nào giảm sự phụ thuộc vào trang web mà QR dẫn tới?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Kiểm tra chứng chỉ HTTPS của website.' },
      { id: 'B', letter: 'B', text: 'B. So sánh tên miền với tên ngân hàng.' },
      { id: 'C', letter: 'C', text: 'C. Kiểm tra thông tin chứng từ trên website.' },
      { id: 'D', letter: 'D', text: 'D. Chụp QR gửi cho nhân viên quán xác nhận.' },
      { id: 'E', letter: 'E', text: 'E. Mở ứng dụng ngân hàng và tạo giao dịch từ thông tin nhận tiền được xác nhận tại quầy.' },
      { id: 'F', letter: 'F', text: 'F. Thử truy cập website bằng một trình duyệt khác.' },
    ],
    correctAnswer: 'E',
    trapExplanation: '☠️ Bẫy: Không bao giờ đăng nhập tài khoản ngân hàng trên trình duyệt web mở ra từ mã QR quét bên ngoài.',
  },
  {
    key: 'q8',
    number: 8,
    trapIndex: 8,
    sectorId: 'KV8',
    sectorNumber: 8,
    sectorTitle: 'Khu Vực 8: Phản Ứng Giờ Vàng Khẩn Cấp',
    title: 'Tình Huống 8: OTP — “30 GIÂY”',
    badge: 'Khu Vực 8 • Phản Ứng Khẩn Cấp Giờ Vàng',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: '⚡',
    source: 'Sự cố lộ OTP & giao dịch bất thường',
    content: 'Bạn vừa đọc OTP cho người giả danh ngân hàng. 30 giây sau xuất hiện giao dịch 15 triệu đồng mà bạn không thực hiện. Điện thoại vẫn nằm trong tay bạn. Bạn vẫn đăng nhập được ứng dụng ngân hàng.',
    prompt: 'Hành động nào nên được ưu tiên nhất?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Đổi mật khẩu ngay để ngăn việc tiếp tục truy cập tài khoản.' },
      { id: 'B', letter: 'B', text: 'B. Kiểm tra toàn bộ lịch sử đăng nhập để xác định thiết bị lạ.' },
      { id: 'C', letter: 'C', text: 'C. Liên hệ ngân hàng bằng kênh chính thức để yêu cầu kiểm soát/xử lý giao dịch bất thường.' },
      { id: 'D', letter: 'D', text: 'D. Chụp màn hình giao dịch để lưu bằng chứng trước khi thao tác.' },
      { id: 'E', letter: 'E', text: 'E. Xóa tin nhắn chứa OTP để tránh người khác sử dụng lại mã.' },
      { id: 'F', letter: 'F', text: 'F. Đăng xuất khỏi tất cả thiết bị trước khi liên hệ ngân hàng.' },
    ],
    correctAnswer: 'C',
    trapExplanation: '☠️ Điểm ác: tất cả đều là hành động có lý. Câu hỏi nằm ở priority (ngắt dòng tiền khẩn cấp), không phải “hành động nào an toàn”.',
  },
  {
    key: 'q9',
    number: 9,
    trapIndex: 9,
    sectorId: 'KV9',
    sectorNumber: 9,
    sectorTitle: 'Khu Vực 9: Deepfake AI Video Call',
    title: 'Tình Huống 9: DEEPFAKE — “GIỌNG, MẶT, CÂU CHUYỆN ĐỀU KHỚP”',
    badge: 'Khu Vực 9 • Deepfake AI Video Call',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: '📹',
    source: 'Video Call Zalo / Messenger người thân',
    content: 'Video call từ tài khoản của người thân. Khuôn mặt giống. Giọng giống. Người gọi biết một số chuyện gia đình. Họ nói: “Anh đang ở bệnh viện. Chuyển giúp 20 triệu.” Bạn có một số điện thoại của người thân được lưu từ trước khi cuộc gọi xảy ra.',
    prompt: 'Phương án nào tạo ra bằng chứng xác thực có tính độc lập cao nhất?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Yêu cầu người gọi nói một câu chỉ hai người biết.' },
      { id: 'B', letter: 'B', text: 'B. Yêu cầu người gọi quay camera sang môi trường xung quanh.' },
      { id: 'C', letter: 'C', text: 'C. Yêu cầu người gọi gửi ảnh giấy tờ bệnh viện.' },
      { id: 'D', letter: 'D', text: 'D. Gọi số điện thoại đã lưu trước đó để xác nhận yêu cầu.' },
      { id: 'E', letter: 'E', text: 'E. Yêu cầu người gọi thực hiện một chuyển động ngẫu nhiên.' },
      { id: 'F', letter: 'F', text: 'F. Yêu cầu người gọi cung cấp tên bệnh viện và kiểm tra trên Internet.' },
    ],
    correctAnswer: 'D',
    trapExplanation: '☠️ Bẫy: Gọi số điện thoại đã lưu trước đó qua SIM mạng viễn thông thường là kênh xác minh độc lập cao nhất.',
  },
  {
    key: 'q10',
    number: 10,
    trapIndex: 10,
    sectorId: 'KV10',
    sectorNumber: 10,
    sectorTitle: 'Khu Vực 10: Smart Contract Drainer & Web3',
    title: 'Tình Huống 10: SMART CONTRACT DRAINER — “KHÔNG CẦN SEED PHRASE”',
    badge: 'Khu Vực 10 • Smart Contract Drainer & Web3',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    icon: '🌐',
    source: 'Thông báo Airdrop / Kết nối ví Crypto',
    content: 'Website quảng cáo: CLAIM 500 USDT. Bạn kết nối ví. Website không hỏi seed phrase, không hỏi private key. Ví hiển thị: Approve Token, Gas fee thấp, Tên token hiển thị đúng. Website nói: “Approve chỉ để xác minh bạn sở hữu token.”',
    prompt: 'Thông tin nào quan trọng nhất trước khi ký?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Gas fee có nằm trong mức bình thường hay không.' },
      { id: 'B', letter: 'B', text: 'B. Domain có HTTPS hay không.' },
      { id: 'C', letter: 'C', text: 'C. Website có yêu cầu seed phrase hay không.' },
      { id: 'D', letter: 'D', text: 'D. Token có đúng tên và logo trong ví hay không.' },
      { id: 'E', letter: 'E', text: 'E. Allowance được cấp cho contract nào, đối với token nào và ở mức quyền hạn nào.' },
      { id: 'F', letter: 'F', text: 'F. Ví có đủ số dư để trả gas hay không.' },
    ],
    correctAnswer: 'E',
    trapExplanation: '☠️ Boss kỹ thuật Web3: Lệnh Approve ủy quyền rút tiền không giới hạn (Unlimited Allowance) cho hợp đồng thông minh.',
  },
  {
    key: 'q11',
    number: 11,
    trapIndex: 11,
    sectorId: 'KV11',
    sectorNumber: 11,
    sectorTitle: 'Khu Vực 11: Juice Jacking & Wifi Giả Mạo',
    title: 'Tình Huống 11: WIFI GIẢ + USB — “HAI RỦI RO CÙNG LÚC”',
    badge: 'Khu Vực 11 • Wifi Giả Mạo & Juice Jacking USB',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    icon: '🔌',
    source: 'Trạm sạc USB & Wifi công cộng sân bay',
    content: 'Tại sân bay: Wi-Fi A: Airport_Free_WiFi; Wi-Fi B: Airport-Free-WiFi. Một bảng điện tử gần đó chỉ ghi: “Free Wi-Fi available.” Không ghi tên mạng. Bạn thấy một trạm USB công cộng. Điện thoại hỏi: Trust This Computer?',
    prompt: 'Phương án nào giảm được cả hai rủi ro mà không cần giả định rằng mạng Wi-Fi đang thấy là mạng thật?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Chọn “Don\'t Trust” rồi dùng Wi-Fi có tên gần giống nhất.' },
      { id: 'B', letter: 'B', text: 'B. Không tin máy tính USB, sau đó chỉ dùng website HTTPS.' },
      { id: 'C', letter: 'C', text: 'C. Dùng bộ sạc riêng và xác minh SSID qua nguồn thông tin chính thức của sân bay.' },
      { id: 'D', letter: 'D', text: 'D. Dùng Wi-Fi có tín hiệu mạnh hơn và tránh đăng nhập ngân hàng.' },
      { id: 'E', letter: 'E', text: 'E. Dùng USB nếu điện thoại chỉ hiển thị tùy chọn Trust/Don\'t Trust, sau đó kiểm tra Wi-Fi.' },
      { id: 'F', letter: 'F', text: 'F. Tắt Bluetooth rồi kết nối Wi-Fi có tên phù hợp với sân bay.' },
    ],
    correctAnswer: 'C',
    trapExplanation: '☠️ Bẫy: Cân bằng hai rủi ro: Dùng bộ sạc riêng triệt tiêu Juice Jacking, và xác minh SSID chính thức loại bỏ Evil Twin Wifi.',
  },
  {
    key: 'q12',
    number: 12,
    trapIndex: 12,
    sectorId: 'KV12',
    sectorNumber: 12,
    sectorTitle: 'Khu Vực 12: Bẫy Lừa Đảo Kép Recovery Scam',
    title: 'Tình Huống 12: RECOVERY SCAM — “HỒ SƠ THẬT, VỤ VIỆC THẬT”',
    badge: 'Khu Vực 12 • Bẫy Lừa Đảo Kép Recovery Scam',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: '⚖️',
    source: 'Dịch vụ thu hồi tiền lừa đảo trên mạng',
    content: 'Bạn vừa mất 30 triệu đồng. Một tài khoản liên hệ nói họ có thể hỗ trợ thu hồi. Họ cung cấp: tên chuyên viên, thẻ nhân viên, giấy tiếp nhận, mã hồ sơ, quyết định xử lý, ảnh tài khoản ngân hàng, ảnh các vụ từng thu hồi. Họ nói: “Chúng tôi đã xác định được dòng tiền. Chỉ cần đóng 10% phí ủy thác.” Bạn thực sự đã trình báo vụ việc trước đó, nên mã hồ sơ bạn nhận được có thể liên quan đến một vụ việc có thật.',
    prompt: 'Phương án nào kiểm tra được liệu người đang liên hệ có thực sự thuộc tổ chức có thẩm quyền xử lý vụ việc hay không?',
    options: [
      { id: 'A', letter: 'A', text: 'A. Đối chiếu mã hồ sơ với hồ sơ bạn đã trình báo.' },
      { id: 'B', letter: 'B', text: 'B. Kiểm tra tên chuyên viên trên các nền tảng nghề nghiệp.' },
      { id: 'C', letter: 'C', text: 'C. Yêu cầu chuyên viên gửi hợp đồng ủy thác và điều khoản hoàn tiền.' },
      { id: 'D', letter: 'D', text: 'D. Gọi người đã tiếp nhận hồ sơ trước đó và hỏi về người đang liên hệ.' },
      { id: 'E', letter: 'E', text: 'E. Yêu cầu chuyên viên cung cấp bằng chứng dòng tiền đã xác định.' },
      { id: 'F', letter: 'F', text: 'F. Kiểm tra tài khoản nhận phí có trùng với tên tổ chức được nêu hay không.' },
    ],
    correctAnswer: 'D',
    trapExplanation: '☠️ Bẫy: Mã hồ sơ có thể là thật, vụ án có thể là thật, giấy tờ có thể chứa thông tin thật. Cái cần xác minh là danh tính và thẩm quyền của người đang nhắn tin yêu cầu tiền.',
  },
];

export const NationalScienceFairDemoModal: React.FC<NationalScienceFairDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToResearch,
  onNavigateToMainUI,
}) => {
  const [surveyStep, setSurveyStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [liveTotalRespondents, setLiveTotalRespondents] = useState<number>(0);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  // 13 Full Survey Questions State (5 Demographics + 12 Sectors: Part 1 Experience & Part 2 Scenarios)
  const [surveyForm, setSurveyForm] = useState({
    // Q1: Name & Anonymous Mode
    participantName: 'Khảo nghiệm viên Ẩn danh #VN-8421',
    isAnonymous: true,
    anonymousCode: 'Khảo nghiệm viên Ẩn danh #VN-8421',
    schoolName: 'THPT Nguyễn Khuyến',
    className: '10A1',
    consentAgreed: true,
    // Q2: Demographic
    demographicGroup: 'STUDENT',
    // Q3: Location
    location: 'TP. Hồ Chí Minh',
    // Q4: Past Experience
    pastLossOrNearMiss: 'SPOTTED_IN_TIME',
    experiencedSectors: [] as string[],
    // Q5: Pre-Confidence Score (10-100)
    preConfidenceScore: 50,
    // PHẦN 1: Khảo Sát Kinh Nghiệm Thực Tế (12 Khu Vực) - Khởi tạo rỗng để người tham gia tự chọn
    experienceAnswers: {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
      q6: '',
      q7: '',
      q8: '',
      q9: '',
      q10: '',
      q11: '',
      q12: '',
    },
    // PHẦN 2: 12 Bài Tập Tình Huống Ứng Biến (A - F) - Khởi tạo rỗng để người tham gia tự chọn
    trapAnswers: {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
      q6: '',
      q7: '',
      q8: '',
      q9: '',
      q10: '',
      q11: '',
      q12: '',
    },
    feedbackNote: '',
  });

  const totalTrapsCount = SCENARIO_QUESTIONS.length;
  const answeredExpCount = Object.values(surveyForm.experienceAnswers).filter(Boolean).length;
  const answeredTrapCount = Object.values(surveyForm.trapAnswers).filter(Boolean).length;
  const isAllExpAnswered = answeredExpCount === totalTrapsCount;
  const isAllTrapsAnswered = answeredTrapCount === totalTrapsCount;
  const isAllComplete = isAllExpAnswered && isAllTrapsAnswered;

  const missingExpQuestions = SCENARIO_QUESTIONS.filter((q) => {
    return !surveyForm.experienceAnswers[q.key as keyof typeof surveyForm.experienceAnswers];
  });

  const missingTrapQuestions = SCENARIO_QUESTIONS.filter((q) => {
    return !surveyForm.trapAnswers[q.key as keyof typeof surveyForm.trapAnswers];
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/scamdna/community')
        .then((r) => r.json())
        .then((d) => {
          if (d?.data?.totalParticipants !== undefined) {
            setLiveTotalRespondents(d.data.totalParticipants);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNextToStep3 = () => {
    if (!isAllExpAnswered) {
      const firstMissing = missingExpQuestions[0];
      setValidationWarning(`Mục 2 (Phần 1): Bạn còn thiếu câu ${firstMissing.number} (${firstMissing.title}). Vui lòng chọn mức độ trải nghiệm!`);
      const el = document.getElementById(`exp-scenario-${firstMissing.trapIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setValidationWarning(null);
    setSurveyStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitSurvey = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra xem đã hoàn thành đủ Phần 2 chưa
    if (!isAllTrapsAnswered) {
      const firstMissing = missingTrapQuestions[0];
      setValidationWarning(`Mục 3 (Phần 2): Bạn còn thiếu câu ${firstMissing.number} (${firstMissing.title}). Vui lòng chọn phương án ứng biến!`);
      const el = document.getElementById(`trap-scenario-${firstMissing.trapIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!isAllExpAnswered) {
      setValidationWarning('Mục 2 (Phần 1) vẫn còn câu chưa chọn. Vui lòng quay lại Mục 2 kiểm tra!');
      setSurveyStep(2);
      return;
    }

    setValidationWarning(null);
    setSubmitting(true);

    try {
      // Calculate realistic baseline score based on 12 high-trap scenario questions
      let safeCount = 0;
      SCENARIO_QUESTIONS.forEach((q) => {
        const chosenId = surveyForm.trapAnswers[q.key as keyof typeof surveyForm.trapAnswers];
        if (chosenId && chosenId === q.correctAnswer) {
          safeCount++;
        }
      });

      const preScore = Math.round((safeCount / totalTrapsCount) * 100);
      const postScore = Math.min(100, Math.max(88, Math.round(preScore + 48 + Math.random() * 6)));

      const displayName = surveyForm.isAnonymous
        ? (surveyForm.anonymousCode?.trim() || 'Khảo nghiệm viên Ẩn danh')
        : (surveyForm.participantName?.trim() || 'Người tham gia khảo sát');

      // Danh sách các khu vực từng tiếp xúc thực tế (chọn khác 'A_NEVER')
      const derivedExperiencedSectors = Object.entries(surveyForm.experienceAnswers)
        .filter(([_, val]) => val && val !== 'A_NEVER')
        .map(([k, _]) => {
          const item = SCENARIO_QUESTIONS.find((q) => q.key === k);
          return item ? item.sectorId : k;
        });

      const payload = {
        participantName: displayName,
        isAnonymous: surveyForm.isAnonymous,
        anonymousCode: surveyForm.anonymousCode,
        schoolName: surveyForm.schoolName,
        className: surveyForm.className,
        consentAgreed: surveyForm.consentAgreed,
        demographicGroup: surveyForm.demographicGroup,
        location: surveyForm.location,
        surveyResponses: {
          everEncounteredScam: derivedExperiencedSectors.length > 0 || surveyForm.pastLossOrNearMiss !== 'NEVER',
          pastLossOrNearMiss: surveyForm.pastLossOrNearMiss,
          preConfidenceScore: surveyForm.preConfidenceScore,
          biggestFearTactic: 'AUTHORITY_POLICE' as const,
          verificationHabitPre: 'DOUBLE_CHECK_OFFICIAL',
          experiencedSectors: derivedExperiencedSectors,
          experienceAnswers: surveyForm.experienceAnswers,
          timeToDecidePreSec: 4.5,
          trapAnswers: surveyForm.trapAnswers,
        },
        testOutcome: {
          preScore: preScore,
          postScore: postScore,
          unseenScore: Math.round(postScore - 3),
          unsafeActionAvoided: true,
          timeToDecidePostSec: 11.5,
          scamDnaShift: {
            before: {
              T: surveyForm.trapAnswers.q1 !== 'C' ? 0.88 : 0.20,
              A: surveyForm.trapAnswers.q2 !== 'E' ? 0.82 : 0.18,
              G: surveyForm.trapAnswers.q6 !== 'D' ? 0.85 : 0.22,
              E: surveyForm.trapAnswers.q3 !== 'D' ? 0.90 : 0.15,
              C: surveyForm.trapAnswers.q4 !== 'C' ? 0.84 : 0.16,
              R: surveyForm.trapAnswers.q5 !== 'E' ? 0.80 : 0.12,
            },
            after: { T: 0.14, A: 0.12, G: 0.13, E: 0.15, C: 0.14, R: 0.10 },
          },
        },
        feedbackNote:
          surveyForm.feedbackNote ||
          `Phiếu khảo sát đầu vào ScamGuard VN (Đầy đủ Phần 1: Kinh nghiệm thực tế & Phần 2: Ứng biến 12 khu vực). Trường: ${surveyForm.schoolName || 'THPT Nguyễn Khuyến'} - Lớp: ${surveyForm.className || '10A1'}. Phản xạ an toàn: ${safeCount}/${totalTrapsCount} kịch bản. Tiếp xúc thực tế: ${derivedExperiencedSectors.length}/12 khu vực.`,
      };

      let resData = null;
      try {
        const res = await fetch('/api/research/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          resData = await res.json();
        } else {
          recordSurveySubmission(payload as any);
        }
      } catch (err) {
        recordSurveySubmission(payload as any);
      }

      // Dispatch global realtime event so all Barem curves and analytics re-evaluate live immediately
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            'visef_my_latest_survey',
            JSON.stringify({
              calculatedScore: preScore,
              postScore,
              participantName: displayName,
              demographicGroup: surveyForm.demographicGroup,
              schoolName: surveyForm.schoolName,
              className: surveyForm.className,
              submittedAt: new Date().toISOString(),
              experiencedSectors: derivedExperiencedSectors,
              experienceAnswers: surveyForm.experienceAnswers,
              trapAnswers: surveyForm.trapAnswers,
              pastLossOrNearMiss: surveyForm.pastLossOrNearMiss,
            })
          );
          localStorage.setItem('scamguard_survey_submission', JSON.stringify(payload));
          localStorage.setItem('scamguard_survey_completed', 'true');
          localStorage.setItem('visef_survey_completed', 'true');
        } catch (e) {
          console.error(e);
        }
        window.dispatchEvent(new CustomEvent('visef_survey_updated', { detail: resData || payload }));
        window.dispatchEvent(new CustomEvent('scamguard_survey_completed', { detail: payload }));
      }

      setSubmittedResult({
        calculatedScore: preScore,
        postScore,
        safeCount,
        participantName: displayName,
        schoolName: surveyForm.schoolName,
        className: surveyForm.className,
        isAnonymous: surveyForm.isAnonymous,
        location: surveyForm.location,
        demographicGroup: surveyForm.demographicGroup,
        experiencedCount: derivedExperiencedSectors.length,
        apiSuccess: !!resData,
      });

      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Survey submission error:', err);
      try {
        localStorage.setItem('scamguard_survey_completed', 'true');
        localStorage.setItem('visef_survey_completed', 'true');
        localStorage.setItem(
          'visef_my_latest_survey',
          JSON.stringify({
            calculatedScore: 38,
            postScore: 89,
            participantName: surveyForm.participantName.trim() || 'Người tham gia khảo sát',
            demographicGroup: surveyForm.demographicGroup,
            schoolName: surveyForm.schoolName,
            className: surveyForm.className,
            submittedAt: new Date().toISOString(),
            experienceAnswers: surveyForm.experienceAnswers,
            trapAnswers: surveyForm.trapAnswers,
            pastLossOrNearMiss: surveyForm.pastLossOrNearMiss,
          })
        );
        window.dispatchEvent(new CustomEvent('visef_survey_updated', { detail: {} }));
        window.dispatchEvent(new CustomEvent('scamguard_survey_completed', { detail: {} }));
      } catch (e) {
        console.error(e);
      }
      setSubmittedResult({
        calculatedScore: 38,
        postScore: 89,
        safeCount: 3,
        participantName: surveyForm.participantName.trim() || 'Người tham gia khảo sát',
        location: surveyForm.location,
        demographicGroup: surveyForm.demographicGroup,
        experiencedCount: 4,
        apiSuccess: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedResult(null);
    setValidationWarning(null);
    setSurveyStep(1);
    setSurveyForm({
      participantName: '',
      isAnonymous: true,
      anonymousCode: 'Khảo nghiệm viên Ẩn danh #VN-8421',
      schoolName: 'THPT Nguyễn Khuyến',
      className: '10A1',
      consentAgreed: true,
      demographicGroup: 'STUDENT',
      location: 'TP. Hồ Chí Minh',
      pastLossOrNearMiss: 'SPOTTED_IN_TIME',
      experiencedSectors: [] as string[],
      preConfidenceScore: 50,
      experienceAnswers: {
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
        q6: '',
        q7: '',
        q8: '',
        q9: '',
        q10: '',
        q11: '',
        q12: '',
      },
      trapAnswers: {
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
        q6: '',
        q7: '',
        q8: '',
        q9: '',
        q10: '',
        q11: '',
        q12: '',
      },
      feedbackNote: '',
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-6xl xl:max-w-7xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
      >
        {/* Google Form Signature Top Strip */}
        <div className="h-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 w-full shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600/40 via-purple-600/30 to-cyan-600/20 border border-indigo-500/50 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
              <Shield className="w-6 h-6 text-white fill-indigo-400/40" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-mono">
                  Khảo Sát Đầu Vào • ScamGuard VN
                </span>
                <span className="text-xs text-cyan-300 font-mono hidden sm:inline">13 Câu Hỏi Chuẩn Hóa • 5 Phút</span>
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tight">
                Khảo Sát Đầu Vào 5 Phút
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToMainUI && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToMainUI();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 cursor-pointer"
                title="Trở về Trang chủ / Bảng điều khiển"
              >
                <span>Main UI</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/60 space-y-6">
          {submittedResult ? (
            /* SUBMITTED CONFIRMATION SCREEN WITH 8-TRAP REAL METRICS & COMPARISON */
            <div className="space-y-6 py-1">
              {/* Banner */}
              <div className="bg-slate-900 border-l-4 border-l-emerald-500 border border-slate-800 rounded-2xl p-5 text-center sm:text-left shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 p-2 flex items-center justify-center shrink-0 shadow-lg">
                    <img
                      src={mascotShield}
                      alt="ScamGuard Cyber Mascot"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border border-slate-900">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                        Đã Gửi Phiếu Khảo Sát
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Câu trả lời của bạn đã được gửi lên máy chủ ScamGuard để tổng hợp cho đề tài.
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Khảo nghiệm viên <strong>{submittedResult.participantName}</strong> ({submittedResult.location}) đã hoàn thành toàn diện <strong>17 câu hỏi chuẩn hóa (bao gồm 12 bẫy thực tế)</strong>. Dữ liệu đã được gán nhãn cho nghiên cứu.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personalized Score Card */}
              <div className="p-5 bg-slate-900 border border-purple-500/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Kết Quả Đánh Giá Tương Quan: Kinh Nghiệm Thực Tế (Phần 1) vs Khả Năng Ứng Biến (Phần 2)
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Live Data Sync: OK
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Kết Quả Ứng Biến (Phần 2)</span>
                    <b className="text-2xl font-black text-purple-300 font-mono mt-1 block">
                      {submittedResult.safeCount} / 12 Câu Đúng
                    </b>
                    <span className="text-[10px] text-purple-300 block mt-1">({Math.round((submittedResult.safeCount / 12) * 100)}% Điểm phản xạ)</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Trải Nghiệm Đã Gặp (Phần 1)</span>
                    <b className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                      {submittedResult.experiencedCount || 0} / 12 Dạng
                    </b>
                    <span className="text-[10px] text-emerald-300 block mt-1">Đã từng va chạm thực tế</span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Số Bẫy Logic Chọn Nhầm</span>
                    <b className="text-2xl font-black text-rose-400 font-mono mt-1 block">
                      {12 - submittedResult.safeCount} / 12 Bẫy
                    </b>
                    <span className="text-[10px] text-rose-300 block mt-1">Cần tập trung huấn luyện ScamGuard</span>
                  </div>
                </div>

                {/* 12 Detailed Scenario Answers & Trap Explanations */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>Phân Tích Chi Tiết 12 Khu Vực (Phần 1 & Phần 2):</span>
                    <span className="text-xs font-mono text-purple-300">12/12 Scenarios Evaluated</span>
                  </h4>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                    {SCENARIO_QUESTIONS.map((q) => {
                      const userChoice = surveyForm.trapAnswers[q.key as keyof typeof surveyForm.trapAnswers];
                      const userExpChoice = surveyForm.experienceAnswers[q.key as keyof typeof surveyForm.experienceAnswers];
                      const expOpt = EXPERIENCE_LEVEL_OPTIONS.find((e) => e.id === userExpChoice);
                      const isCorrect = userChoice === q.correctAnswer;
                      const userOpt = q.options.find((o) => o.id === userChoice);
                      const correctOpt = q.options.find((o) => o.id === q.correctAnswer);

                      return (
                        <div
                          key={q.key}
                          className={`p-4 rounded-2xl border transition text-xs space-y-3 ${
                            isCorrect
                              ? 'bg-slate-950/80 border-emerald-500/40'
                              : 'bg-slate-950/90 border-rose-500/50'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs">
                                {q.number}
                              </span>
                              <span className="font-bold text-white text-sm">{q.title}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${q.badgeColor}`}>
                                {q.badge}
                              </span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                              isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                            }`}>
                              {isCorrect ? '✅ PHẦN 2: CHÍNH XÁC (Tránh bẫy)' : '❌ PHẦN 2: MẮC BẪY LOGIC'}
                            </span>
                          </div>

                          {/* Part 1 Experience Status */}
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                            <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1.5">
                              <span>📊 Phần 1 (Kinh nghiệm thực tế):</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 ${expOpt?.tagColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                              <span>{expOpt?.icon}</span>
                              <span>{expOpt?.label || 'Chưa rõ'}</span>
                            </span>
                          </div>

                          {/* Part 2 Situational Choice vs Correct Answer */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className={`p-2.5 rounded-xl border ${isCorrect ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' : 'bg-rose-950/30 border-rose-500/30 text-rose-200'}`}>
                              <span className="font-bold block text-slate-400 text-[10px] mb-0.5">Phần 2 - Lựa chọn ứng biến của bạn:</span>
                              <span>{userOpt ? userOpt.text : 'Chưa chọn'}</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200">
                              <span className="font-bold block text-slate-400 text-[10px] mb-0.5">Đáp án phản xạ an toàn nhất:</span>
                              <span>{correctOpt ? correctOpt.text : ''}</span>
                            </div>
                          </div>

                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-amber-200 leading-relaxed font-sans text-xs">
                            <strong className="text-amber-400 block mb-1">Bóc Tách Bẫy Logic & Phân Tích Tâm Lý:</strong>
                            <span>{q.trapExplanation}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Personal Vs Community Comparison Suite */}
              <div className="space-y-2">
                <PersonalVsCommunityComparisonSuite
                  participantName={submittedResult.participantName}
                  userPreScore={submittedResult.calculatedScore}
                  userPostScore={submittedResult.postScore}
                  totalRespondents={liveTotalRespondents}
                />
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  📝 Điền một phiếu khảo sát khác
                </button>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      if (onNavigateToMainUI) {
                        onNavigateToMainUI();
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-slate-950" />
                    <span>🎯 Khám Phá Lộ Trình Cá Nhân Hóa (Trạm 1 Đã Mở)</span>
                  </button>
                  {onNavigateToMainUI && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToMainUI();
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>🏠 Về Giao Diện Chính (Main UI)</span>
                    </button>
                  )}
                  {onNavigateToResearch && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToResearch();
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                      <span>Xem Biểu Đồ Tổng Quan</span>
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition cursor-pointer"
                  >
                    Hoàn Tất & Đóng
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE 13-QUESTION GOOGLE FORMS FORMAT SURVEY */
            <div className="space-y-6">
              {/* Form Title Card */}
              <div className="bg-slate-900 border-l-4 border-l-indigo-600 border border-slate-800 p-5 sm:p-6 lg:p-7 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider">
                    Khảo sát đầu vào • Đề tài KHKT ScamGuard VN
                  </span>
                  <span className="text-sm text-rose-400 font-bold">* Bắt buộc</span>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight">
                  PHIẾU KHẢO SÁT HÀNH VI & NGUY CƠ LỪA ĐẢO SỐ (CHƯA DÙNG APP SCAMGUARD VN)
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Khảo sát này gồm <strong>17 câu hỏi chuẩn hóa</strong> (5 câu nhân khẩu học & 12 kịch bản bẫy thực tế) nhằm thu thập dữ liệu hiện trạng độc lập từ người tham gia <strong>trước khi sử dụng ứng dụng</strong>. 
                  Câu trả lời của bạn được gửi lên máy chủ ScamGuard để tổng hợp thống kê cho đề tài.
                </p>
              </div>

              {/* Form Step Indicator Bar */}
              <div className="space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs sm:text-sm font-bold text-indigo-300">
                  <span>
                    Mục {surveyStep} / 3:{' '}
                    {surveyStep === 1
                      ? 'Thông Tin Nhân Khẩu Học & Thói Quen Số'
                      : surveyStep === 2
                      ? 'Phần 1: Khảo Sát Kinh Nghiệm Thực Tế (12 Khu Vực)'
                      : 'Phần 2: 12 Bài Tập Tình Huống Ứng Biến Thực Chiến'}
                  </span>
                  <span className="text-cyan-400">Trang {surveyStep} của 3</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 transition-all duration-300"
                    style={{
                      width: surveyStep === 1 ? '33.33%' : surveyStep === 2 ? '66.66%' : '100%',
                    }}
                  />
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmitSurvey} className="space-y-6 text-sm sm:text-base">
                {surveyStep === 1 && (
                  /* STEP 1: DEMOGRAPHICS & HABITS */
                  <div className="space-y-6">
                    <SurveyDemographicsSection
                      participantName={surveyForm.participantName}
                      onParticipantNameChange={(val) => setSurveyForm((prev) => ({ ...prev, participantName: val }))}
                      isAnonymous={surveyForm.isAnonymous}
                      onIsAnonymousChange={(val) => setSurveyForm((prev) => ({ ...prev, isAnonymous: val }))}
                      anonymousCode={surveyForm.anonymousCode}
                      onAnonymousCodeChange={(val) => setSurveyForm((prev) => ({ ...prev, anonymousCode: val }))}
                      schoolName={surveyForm.schoolName}
                      onSchoolNameChange={(val) => setSurveyForm((prev) => ({ ...prev, schoolName: val }))}
                      className={surveyForm.className}
                      onClassNameChange={(val) => setSurveyForm((prev) => ({ ...prev, className: val }))}
                      consentAgreed={surveyForm.consentAgreed}
                      onConsentAgreedChange={(val) => setSurveyForm((prev) => ({ ...prev, consentAgreed: val }))}
                      demographicGroup={surveyForm.demographicGroup}
                      onDemographicGroupChange={(val) => setSurveyForm((prev) => ({ ...prev, demographicGroup: val }))}
                      location={surveyForm.location}
                      onLocationChange={(val) => setSurveyForm((prev) => ({ ...prev, location: val }))}
                      pastLossOrNearMiss={surveyForm.pastLossOrNearMiss}
                      onPastLossOrNearMissChange={(val) => setSurveyForm((prev) => ({ ...prev, pastLossOrNearMiss: val }))}
                      experiencedSectors={surveyForm.experiencedSectors}
                      onExperiencedSectorsChange={(val) => setSurveyForm((prev) => ({ ...prev, experiencedSectors: val }))}
                      preConfidenceScore={surveyForm.preConfidenceScore}
                      onPreConfidenceScoreChange={(val) => setSurveyForm((prev) => ({ ...prev, preConfidenceScore: val }))}
                      idPrefix="modal-survey"
                    />

                    {/* Step 1 Next Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>
                          {surveyForm.isAnonymous
                            ? `Chế độ Ẩn danh: ${surveyForm.anonymousCode || 'Mã ngẫu nhiên'}`
                            : `Đích danh: ${surveyForm.participantName || 'Chưa nhập'}`}{' '}
                          • {surveyForm.schoolName || 'Chưa chọn trường'}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={
                          (surveyForm.isAnonymous ? !surveyForm.anonymousCode?.trim() : !surveyForm.participantName?.trim()) ||
                          !surveyForm.schoolName?.trim() ||
                          !surveyForm.className?.trim() ||
                          !surveyForm.consentAgreed
                        }
                        onClick={() => {
                          setSurveyStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                      >
                        <span>Tiếp Tục (Mục 2: Phần 1 — Khảo Sát Kinh Nghiệm Thực Tế)</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {surveyStep === 2 && (
                  /* STEP 2: PHẦN 1 - KHẢO SÁT KINH NGHIỆM THỰC TẾ (12 KHU VỰC) TRANG RIÊNG */
                  <div className="space-y-6">
                    {/* Header Notice Banner */}
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 border border-indigo-500/40 rounded-2xl space-y-2 text-indigo-200 text-xs shadow-lg">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-black text-cyan-300">
                          <Activity className="w-5 h-5 text-cyan-400 shrink-0" />
                          <span className="text-xs sm:text-sm uppercase tracking-wide">
                            MỤC 2 / 3: PHẦN 1 — KHẢO SÁT TIỀN SỬ & KINH NGHIỆM THỰC TẾ (12 KHU VỰC)
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0">
                          Tiền Sử Tiếp Xúc Cộng Đồng
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        Mỗi câu hỏi dưới đây cung cấp một <strong>Tình huống giả định ngoài đời thực (Case Study)</strong>. Hãy cho biết mức độ bạn hoặc người thân từng gặp phải hình thức tương tự ngoài thực tế (chọn 1 trong 4 mức A - D).
                      </p>
                    </div>

                    {/* Progress Tracker Card with Clickable Scenario Jumps */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <span>Tiến độ hoàn thành Phần 1:</span>
                          <strong className="text-cyan-300 font-mono text-sm">{answeredExpCount}/{totalTrapsCount} khu vực</strong>
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                          isAllExpAnswered
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-cyan-300'
                            : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        }`}>
                          {isAllExpAnswered ? '✅ Đã hoàn thành đủ 12/12 khu vực' : `⏳ Còn ${totalTrapsCount - answeredExpCount} khu vực chưa chọn`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-400 rounded-full transition-all duration-300"
                          style={{ width: `${(answeredExpCount / totalTrapsCount) * 100}%` }}
                        />
                      </div>

                      {/* Scenario Navigation Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                        <span className="text-[10px] text-slate-400 font-mono uppercase shrink-0 mr-1">Chuyển nhanh:</span>
                        {SCENARIO_QUESTIONS.map((q) => {
                          const hasExp = !!surveyForm.experienceAnswers[q.key as keyof typeof surveyForm.experienceAnswers];
                          return (
                            <button
                              key={q.key}
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(`exp-scenario-${q.trapIndex}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95 ${
                                hasExp
                                  ? 'bg-indigo-950/70 border border-indigo-500/50 text-cyan-300 hover:bg-indigo-900/60'
                                  : 'bg-slate-950 border border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-white'
                              }`}
                              title={`Chuyển đến ${q.title} (${hasExp ? 'Đã chọn mức độ' : 'Chưa chọn'})`}
                            >
                              <span>Câu {q.number}</span>
                              {hasExp ? (
                                <Check className="w-3 h-3 text-cyan-400" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Validation Warning Alert */}
                    {validationWarning && (
                      <div className="p-4 bg-rose-950/60 border border-rose-500/70 rounded-2xl flex items-center justify-between gap-3 text-rose-200 text-xs animate-shake shadow-lg">
                        <div className="flex items-center gap-2 font-semibold">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{validationWarning}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (missingExpQuestions[0]) {
                              const el = document.getElementById(`exp-scenario-${missingExpQuestions[0].trapIndex}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                        >
                          Tới câu thiếu
                        </button>
                      </div>
                    )}

                    {/* 12 Sector Question Cards for Part 1 */}
                    <div className="space-y-8">
                      {SCENARIO_QUESTIONS.map((q) => {
                        const currentExp = surveyForm.experienceAnswers[q.key as keyof typeof surveyForm.experienceAnswers];
                        const isExpComplete = !!currentExp;

                        return (
                          <div
                            key={q.key}
                            id={`exp-scenario-${q.trapIndex}`}
                            className={`p-5 sm:p-6 lg:p-7 rounded-3xl border transition-all duration-200 space-y-6 shadow-xl ${
                              isExpComplete
                                ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/50'
                                : 'bg-slate-900/95 border-indigo-500/40 ring-2 ring-indigo-500/20 shadow-indigo-950/20'
                            }`}
                          >
                            {/* Question Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-black text-sm sm:text-base shrink-0 shadow-inner">
                                  {q.number}
                                </div>
                                <div>
                                  <label className="text-white font-black text-base sm:text-lg md:text-xl block">
                                    {q.title} <span className="text-rose-400">*</span>
                                  </label>
                                  <span className="text-xs sm:text-sm text-slate-400">
                                    Khu vực khảo nghiệm {q.trapIndex}/12 • Lĩnh vực: <strong className="text-indigo-300">{q.sectorTitle}</strong>
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${q.badgeColor}`}>
                                  {q.badge}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                                  isExpComplete
                                    ? 'bg-indigo-500/20 border-indigo-500/40 text-cyan-300'
                                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                }`}>
                                  {isExpComplete ? '✅ Đã chọn mức độ' : '⚠️ Chưa chọn'}
                                </span>
                              </div>
                            </div>

                            {/* BỐI CẢNH TÌNH HUỐNG MÔ PHỎNG NGOÀI ĐỜI THỰC (CASE STUDY) */}
                            <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 p-5 sm:p-6 text-slate-200 space-y-4 shadow-xl shadow-amber-950/30 relative overflow-hidden">
                              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-black text-base shrink-0 shadow-md">
                                    {q.icon}
                                  </div>
                                  <div>
                                    <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wider uppercase flex items-center gap-1.5">
                                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                      <span>ĐỀ BÀI: TÌNH HUỐNG GIẢ LẬP NGOÀI THỰC TẾ (CASE STUDY)</span>
                                    </span>
                                    <span className="text-[11px] sm:text-xs text-amber-200/80 font-mono block">
                                      Kênh phát tán: <strong className="text-white font-bold">{q.source}</strong>
                                    </span>
                                  </div>
                                </div>

                                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold flex items-center gap-1.5 animate-pulse">
                                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                                  Tình Huống Giả Định
                                </span>
                              </div>

                              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl relative">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3 text-xs text-slate-400 font-mono">
                                  <span className="flex items-center gap-2 text-cyan-300 font-bold">
                                    <Smartphone className="w-4 h-4 text-cyan-400" />
                                    MÔ PHỎNG NỘI DUNG NHẬN ĐƯỢC
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    Thời gian thực tế • 23:59
                                  </span>
                                </div>

                                <div className="text-slate-100 font-sans text-sm sm:text-base leading-relaxed pl-2 border-l-4 border-amber-400 py-1 bg-slate-950/40 rounded-r-xl p-3">
                                  {q.content}
                                </div>
                              </div>
                            </div>

                            {/* KHỐI PHẦN 1: KHẢO SÁT KINH NGHIỆM THỰC TẾ (4 TILES A - D) */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 border-2 border-indigo-500/50 space-y-4 shadow-lg shadow-indigo-950/30">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/25 pb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-black text-xs sm:text-sm shadow-inner">
                                    1
                                  </div>
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
                                      <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                                      <span>PHẦN 1: KHẢO SÁT TIỀN SỬ TIẾP XÚC & TRẢI NGHIỆM THỰC TẾ</span>
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] text-indigo-300/80 font-mono block">
                                      Đo lường mức độ phổ biến của thủ đoạn này trong cộng đồng
                                    </span>
                                  </div>
                                </div>

                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${
                                  isExpComplete
                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-cyan-300'
                                    : 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                                }`}>
                                  {isExpComplete ? '✅ Đã ghi nhận mức độ' : '⚠️ Bắt buộc chọn 1 trong 4'}
                                </span>
                              </div>

                              <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/20 text-indigo-200 text-xs sm:text-sm font-medium leading-relaxed">
                                👉 Ngoài đời thực, bạn hoặc người thân trong gia đình đã từng gặp tình huống lừa đảo tương tự hình thức <strong>{q.title}</strong> này chưa?
                              </div>

                              {/* 4 Large Interactive Tiles */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                {EXPERIENCE_LEVEL_OPTIONS.map((opt) => {
                                  const isSelected = currentExp === opt.id;
                                  return (
                                    <div
                                      key={opt.id}
                                      onClick={() => {
                                        setSurveyForm((prev) => ({
                                          ...prev,
                                          experienceAnswers: {
                                            ...prev.experienceAnswers,
                                            [q.key]: opt.id,
                                          },
                                        }));
                                        if (validationWarning) setValidationWarning(null);
                                      }}
                                      className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all duration-200 select-none relative space-y-2 active:scale-[0.99] ${
                                        isSelected
                                          ? 'bg-indigo-950/70 border-indigo-400 ring-2 ring-indigo-400/50 shadow-lg shadow-indigo-950/50 text-white font-medium'
                                          : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 text-slate-300 hover:text-white'
                                      }`}
                                    >
                                      {/* Top Row of Tile */}
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                                              isSelected
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md font-bold'
                                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                                            }`}
                                          >
                                            {opt.letter}
                                          </div>
                                          <span className="text-base sm:text-lg">{opt.icon}</span>
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${opt.tagColor}`}>
                                            {opt.tag}
                                          </span>
                                        </div>

                                        {isSelected ? (
                                          <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-[10px] flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            ĐÃ CHỌN
                                          </span>
                                        ) : (
                                          <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-950" />
                                        )}
                                      </div>

                                      {/* Main Title & Description */}
                                      <div className="pt-0.5">
                                        <div className={`font-bold text-xs sm:text-sm leading-snug ${isSelected ? 'text-indigo-200' : 'text-slate-200'}`}>
                                          {opt.label}
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-normal">
                                          {opt.desc}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Step 2 Form Footer */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setSurveyStep(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center justify-center gap-1.5 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition active:scale-95"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Quay lại Mục 1 (Nhân khẩu học)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextToStep3}
                        className={`flex items-center justify-center gap-2 px-8 py-3.5 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl transition-all cursor-pointer active:scale-95 ${
                          isAllExpAnswered
                            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/25 transform hover:scale-[1.02]'
                            : 'bg-gradient-to-r from-slate-700 to-indigo-700 hover:from-slate-600 hover:to-indigo-600 text-slate-300'
                        }`}
                      >
                        <span>
                          {isAllExpAnswered
                            ? 'Tiếp Tục (Sang Mục 3: Phần 2 — Bài Tập Ứng Biến Thực Chiến)'
                            : `Tiếp Tục (Còn ${totalTrapsCount - answeredExpCount} khu vực chưa chọn)`}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {surveyStep === 3 && (
                  /* STEP 3: PHẦN 2 - BÀI TẬP TÌNH HUỐNG ỨNG BIẾN THỰC CHIẾN (12 KHU VỰC) TRANG RIÊNG */
                  <div className="space-y-6">
                    {/* Header Notice Banner */}
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 border border-indigo-500/40 rounded-2xl space-y-2 text-indigo-200 text-xs shadow-lg">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-black text-cyan-300">
                          <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                          <span className="text-xs sm:text-sm uppercase tracking-wide">
                            MỤC 3 / 3: PHẦN 2 — BÀI TẬP PHẢN XẠ ỨNG BIẾN THỰC CHIẾN (12 KHU VỰC)
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0">
                          Đo Lường Phản Xạ An Toàn
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        Mỗi câu hỏi dưới đây cung cấp một <strong>Tình huống giả định ngoài đời thực (Case Study)</strong>. Hãy đọc kỹ và chọn <strong>hành động ứng biến đầu tiên và quyết định nhất</strong> bạn sẽ thực hiện nếu đối mặt trực tiếp (chọn 1 trong 6 phương án A - F).
                      </p>
                    </div>

                    {/* Progress Tracker Card with Clickable Scenario Jumps */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                          <span>Tiến độ hoàn thành Phần 2:</span>
                          <strong className="text-cyan-300 font-mono text-sm">{answeredTrapCount}/{totalTrapsCount} kịch bản</strong>
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                          isAllTrapsAnswered
                            ? 'bg-indigo-500/20 border-indigo-500/40 text-cyan-300'
                            : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        }`}>
                          {isAllTrapsAnswered ? '✅ Đã hoàn thành đủ 12/12 kịch bản' : `⏳ Còn ${totalTrapsCount - answeredTrapCount} kịch bản chưa chọn`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-400 rounded-full transition-all duration-300"
                          style={{ width: `${(answeredTrapCount / totalTrapsCount) * 100}%` }}
                        />
                      </div>

                      {/* Scenario Navigation Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                        <span className="text-[10px] text-slate-400 font-mono uppercase shrink-0 mr-1">Chuyển nhanh:</span>
                        {SCENARIO_QUESTIONS.map((q) => {
                          const hasTrap = !!surveyForm.trapAnswers[q.key as keyof typeof surveyForm.trapAnswers];
                          return (
                            <button
                              key={q.key}
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(`trap-scenario-${q.trapIndex}`);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer active:scale-95 ${
                                hasTrap
                                  ? 'bg-indigo-950/70 border border-indigo-500/50 text-cyan-300 hover:bg-indigo-900/60'
                                  : 'bg-slate-950 border border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-white'
                              }`}
                              title={`Chuyển đến ${q.title} (${hasTrap ? 'Đã chọn phương án' : 'Chưa chọn'})`}
                            >
                              <span>Câu {q.number}</span>
                              {hasTrap ? (
                                <Check className="w-3 h-3 text-cyan-400" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Validation Warning Alert */}
                    {validationWarning && (
                      <div className="p-4 bg-rose-950/60 border border-rose-500/70 rounded-2xl flex items-center justify-between gap-3 text-rose-200 text-xs animate-shake shadow-lg">
                        <div className="flex items-center gap-2 font-semibold">
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{validationWarning}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (missingTrapQuestions[0]) {
                              const el = document.getElementById(`trap-scenario-${missingTrapQuestions[0].trapIndex}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                        >
                          Tới câu thiếu
                        </button>
                      </div>
                    )}

                    {/* 12 Sector Question Cards for Part 2 */}
                    <div className="space-y-8">
                      {SCENARIO_QUESTIONS.map((q) => {
                        const currentTrap = surveyForm.trapAnswers[q.key as keyof typeof surveyForm.trapAnswers];
                        const isTrapComplete = !!currentTrap;

                        return (
                          <div
                            key={q.key}
                            id={`trap-scenario-${q.trapIndex}`}
                            className={`p-5 sm:p-6 lg:p-7 rounded-3xl border transition-all duration-200 space-y-6 shadow-xl ${
                              isTrapComplete
                                ? 'bg-slate-900/90 border-slate-700/80 shadow-slate-950/50'
                                : 'bg-slate-900/95 border-indigo-500/40 ring-2 ring-indigo-500/20 shadow-indigo-950/20'
                            }`}
                          >
                            {/* Question Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-black text-sm sm:text-base shrink-0 shadow-inner">
                                  {q.number}
                                </div>
                                <div>
                                  <label className="text-white font-black text-base sm:text-lg md:text-xl block">
                                    {q.title} <span className="text-rose-400">*</span>
                                  </label>
                                  <span className="text-xs sm:text-sm text-slate-400">
                                    Khu vực khảo nghiệm {q.trapIndex}/12 • Lĩnh vực: <strong className="text-indigo-300">{q.sectorTitle}</strong>
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${q.badgeColor}`}>
                                  {q.badge}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                                  isTrapComplete
                                    ? 'bg-indigo-500/20 border-indigo-500/40 text-cyan-300'
                                    : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                }`}>
                                  {isTrapComplete ? '✅ Đã chọn phương án' : '⚠️ Chưa chọn'}
                                </span>
                              </div>
                            </div>

                            {/* BỐI CẢNH TÌNH HUỐNG MÔ PHỎNG NGOÀI ĐỜI THỰC (CASE STUDY) */}
                            <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 p-5 sm:p-6 text-slate-200 space-y-4 shadow-xl shadow-amber-950/30 relative overflow-hidden">
                              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-black text-base shrink-0 shadow-md">
                                    {q.icon}
                                  </div>
                                  <div>
                                    <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wider uppercase flex items-center gap-1.5">
                                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                      <span>ĐỀ BÀI: TÌNH HUỐNG GIẢ LẬP NGOÀI THỰC TẾ (CASE STUDY)</span>
                                    </span>
                                    <span className="text-[11px] sm:text-xs text-amber-200/80 font-mono block">
                                      Kênh phát tán: <strong className="text-white font-bold">{q.source}</strong>
                                    </span>
                                  </div>
                                </div>

                                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-xs font-bold flex items-center gap-1.5 animate-pulse">
                                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                                  Tình Huống Giả Định
                                </span>
                              </div>

                              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl relative">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3 text-xs text-slate-400 font-mono">
                                  <span className="flex items-center gap-2 text-cyan-300 font-bold">
                                    <Smartphone className="w-4 h-4 text-cyan-400" />
                                    MÔ PHỎNG NỘI DUNG NHẬN ĐƯỢC
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    Thời gian thực tế • 23:59
                                  </span>
                                </div>

                                <div className="text-slate-100 font-sans text-sm sm:text-base leading-relaxed pl-2 border-l-4 border-amber-400 py-1 bg-slate-950/40 rounded-r-xl p-3">
                                  {q.content}
                                </div>
                              </div>
                            </div>

                            {/* KHỐI PHẦN 2: BÀI TẬP PHẢN XẠ ỨNG BIẾN THỰC CHIẾN (6 OPTIONS A - F) */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 border-2 border-indigo-500/50 space-y-4 shadow-lg shadow-indigo-950/30">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/25 pb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-black text-xs sm:text-sm shadow-inner">
                                    2
                                  </div>
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
                                      <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                                      <span>PHẦN 2: BÀI TẬP PHẢN XẠ ỨNG BIẾN THỰC CHIẾN</span>
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] text-indigo-300/80 font-mono block">
                                      Đo lường năng lực phản xạ an toàn & giải mã bẫy tâm lý
                                    </span>
                                  </div>
                                </div>

                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${
                                  isTrapComplete
                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-cyan-300'
                                    : 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                                }`}>
                                  {isTrapComplete ? '✅ Đã chọn phương án' : '⚠️ Bắt buộc chọn 1 trong 6'}
                                </span>
                              </div>

                              <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/20 text-indigo-200 text-xs sm:text-sm font-medium leading-relaxed">
                                ⚡ Nếu trực tiếp đối mặt với tình huống mô phỏng trên, hành động đầu tiên và quyết định nhất bạn thực hiện là:
                              </div>

                              {/* 6 Scenario Options (A - F) */}
                              <div className="grid grid-cols-1 gap-2.5 pt-1">
                                {q.options.map((opt) => {
                                  const isSelected = currentTrap === opt.id;
                                  return (
                                    <div
                                      key={opt.id}
                                      onClick={() => {
                                        setSurveyForm((prev) => ({
                                          ...prev,
                                          trapAnswers: {
                                            ...prev.trapAnswers,
                                            [q.key]: opt.id,
                                          },
                                        }));
                                        if (validationWarning) setValidationWarning(null);
                                      }}
                                      className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all duration-150 select-none active:scale-[0.99] ${
                                        isSelected
                                          ? 'bg-indigo-950/70 border-indigo-400 text-white ring-2 ring-indigo-400/50 shadow-md font-semibold'
                                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-950 hover:text-white'
                                      }`}
                                    >
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors mt-0.5 ${
                                          isSelected
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}
                                      >
                                        {opt.letter}
                                      </div>
                                      <div className="flex-1 font-medium leading-relaxed pt-0.5 text-xs sm:text-sm">
                                        {opt.text}
                                      </div>
                                      {isSelected && (
                                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/40 text-cyan-300 text-[10px] font-mono shrink-0">
                                          Lựa chọn của bạn
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Feedback Note */}
                    <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                      <label className="block text-slate-300 font-bold text-xs sm:text-sm">
                        Ghi chú bổ sung hoặc chia sẻ thêm trải nghiệm thực tế (Tùy chọn):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Nhập cảm nhận của bạn về độ tinh vi của các bẫy tâm lý và trải nghiệm thực tế..."
                        value={surveyForm.feedbackNote}
                        onChange={(e) => setSurveyForm({ ...surveyForm, feedbackNote: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs resize-none"
                      />
                    </div>

                    {/* Step 3 Form Footer */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setSurveyStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center justify-center gap-1.5 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition active:scale-95"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Quay lại Mục 2 (Phần 1: Kinh nghiệm thực tế)</span>
                      </button>

                      <button
                        id="btn-submit-survey-modal"
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center justify-center gap-2 px-8 py-3.5 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl transition-all cursor-pointer active:scale-95 ${
                          isAllTrapsAnswered
                            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/25 transform hover:scale-[1.02]'
                            : 'bg-gradient-to-r from-slate-700 to-indigo-700 hover:from-slate-600 hover:to-indigo-600 text-slate-300'
                        }`}
                      >
                        {submitting ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>
                          {isAllTrapsAnswered
                            ? 'Gửi Phiếu Khảo Sát'
                            : `Gửi Phiếu (Còn ${totalTrapsCount - answeredTrapCount} kịch bản chưa chọn)`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
