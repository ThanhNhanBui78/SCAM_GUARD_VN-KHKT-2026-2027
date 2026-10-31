// Nơi người dùng TỰ tra cứu và trình báo. ScamGuard không kết nối dữ liệu của các nơi này:
// thông tin thuê bao, tài khoản ngân hàng là dữ liệu cá nhân, ứng dụng không được tự tra cứu hay gán nhãn.
export interface OfficialLookupLink {
  name: string;
  url: string;
  use: string;
}

export const OFFICIAL_LOOKUP_LINKS: OfficialLookupLink[] = [
  {
    name: 'Tín Nhiệm Mạng (NCSC – Bộ Công an)',
    url: 'https://tinnhiemmang.vn/',
    use: 'Tra cứu website, tổ chức đã được xác thực tín nhiệm; xem danh sách website lừa đảo đã ghi nhận.',
  },
  {
    name: 'Dự án Chống Lừa Đảo (chongluadao.vn)',
    url: 'https://chongluadao.vn/',
    use: 'Tra cứu và gửi báo cáo website lừa đảo (dự án cộng đồng, không phải cơ quan nhà nước).',
  },
];

export const SELF_CHECK_STEPS: Record<'phone' | 'stk' | 'email' | 'other', string[]> = {
  phone: [
    'Không gọi lại theo số trong tin nhắn. Tự tìm số tổng đài trên website hoặc ứng dụng chính thức của tổ chức được nhắc tên rồi gọi lại.',
    'Cơ quan công an không làm việc, không yêu cầu chuyển tiền qua điện thoại hay Zalo.',
    'Có thể dùng ứng dụng nTrust (Hiệp hội An ninh mạng quốc gia) để tra số điện thoại.',
  ],
  stk: [
    'Khi chuyển khoản, đọc kỹ tên chủ tài khoản hiện ra và cảnh báo của ứng dụng ngân hàng.',
    'Không chuyển tiền "bảo lãnh", "phí hồ sơ", "phí giải ngân" cho người lạ, kể cả khi họ gửi giấy tờ.',
    'Có thể dùng ứng dụng nTrust để tra số tài khoản.',
  ],
  email: [
    'Xem kỹ tên miền sau dấu @. Tổ chức thật dùng tên miền chính thức, không dùng gmail.com hay tên miền na ná.',
    'Không bấm đường link, không mở tệp đính kèm lạ. Tự gõ địa chỉ website chính thức vào trình duyệt.',
  ],
  other: [
    'Tự tìm thông tin liên hệ chính thức của tổ chức được nhắc tên và hỏi lại trực tiếp.',
  ],
};

export function detectIdentifierKind(raw: string): 'phone' | 'stk' | 'email' | 'other' {
  const q = raw.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q)) return 'email';
  const digits = q.replace(/[\s.\-()]/g, '');
  if (/^(\+84|84|0)\d{8,10}$/.test(digits) || /^1[89]00\d{4,6}$/.test(digits)) return 'phone';
  if (/^\d{6,19}$/.test(digits)) return 'stk';
  return 'other';
}
