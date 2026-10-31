// Kiểm tra tên miền ngay trên trình duyệt (tab Domain Reputation và tab kiểm tra link QR).
// Danh sách thương hiệu giữ giống SENDER_BRANDS trong server/riskEngine.ts.
export const BRAND_DOMAINS: { brand: string; official: string[] }[] = [
  { brand: 'vietcombank', official: ['vietcombank.com.vn'] },
  { brand: 'vcb', official: ['vietcombank.com.vn'] },
  { brand: 'techcombank', official: ['techcombank.com', 'techcombank.com.vn'] },
  { brand: 'vietinbank', official: ['vietinbank.vn'] },
  { brand: 'agribank', official: ['agribank.com.vn'] },
  { brand: 'bidv', official: ['bidv.com.vn'] },
  { brand: 'mbbank', official: ['mbbank.com.vn'] },
  { brand: 'acb', official: ['acb.com.vn'] },
  { brand: 'vpbank', official: ['vpbank.com.vn'] },
  { brand: 'tpbank', official: ['tpb.vn', 'tpbank.vn'] },
  { brand: 'sacombank', official: ['sacombank.com', 'sacombank.com.vn'] },
  { brand: 'momo', official: ['momo.vn'] },
  { brand: 'zalopay', official: ['zalopay.vn'] },
  { brand: 'zalo', official: ['zalo.me', 'zalo.vn'] },
  { brand: 'viettel', official: ['viettel.com.vn', 'viettel.vn'] },
  { brand: 'vneid', official: ['vneid.gov.vn'] },
  { brand: 'dichvucong', official: ['dichvucong.gov.vn'] },
  { brand: 'vnpost', official: ['vnpost.vn'] },
  { brand: 'shopee', official: ['shopee.vn', 'shopee.com'] },
  { brand: 'lazada', official: ['lazada.vn', 'lazada.com'] },
  { brand: 'tiktok', official: ['tiktok.com'] },
  { brand: 'netflix', official: ['netflix.com'] },
  { brand: 'facebook', official: ['facebook.com', 'fb.com'] },
  { brand: 'telegram', official: ['telegram.org', 't.me'] },
  { brand: 'google', official: ['google.com', 'google.com.vn'] },
  { brand: 'apple', official: ['apple.com', 'icloud.com'] },
  { brand: 'microsoft', official: ['microsoft.com', 'live.com', 'outlook.com'] },
  { brand: 'paypal', official: ['paypal.com'] },
];

// Đuôi hai cấp (vd .com.vn): phải lấy 3 phần mới ra tên miền gốc, nếu không sẽ đem "com", "gov" đi so với thương hiệu
const SECOND_LEVEL_SUFFIXES = new Set(['com.vn', 'net.vn', 'org.vn', 'edu.vn', 'gov.vn', 'info.vn', 'biz.vn', 'name.vn', 'pro.vn', 'health.vn', 'ac.vn', 'int.vn', 'co.uk', 'org.uk', 'com.au', 'co.jp', 'com.cn', 'com.sg']);
const SUSPICIOUS_TLDS = ['top', 'xyz', 'vip', 'cc', 'work', 'club', 'online', 'site', 'ru', 'click', 'gq', 'cf', 'tk', 'ml', 'fit'];
const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'rebrand.ly', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly', 'shorturl.at'];

function levenshtein(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

export interface DomainCheck {
  host: string;
  registrable: string;
  scheme: 'https' | 'http' | 'none';
  officialBrand?: string;
  impersonatedBrand?: string;
  typoDistance?: number;
  suspiciousTld: boolean;
  punycode: boolean;
  shortener: boolean;
  score: number;
  findings: string[];
}

export function checkDomain(input: string): DomainCheck | null {
  const raw = input.trim().toLowerCase();
  const scheme: DomainCheck['scheme'] = raw.startsWith('https://') ? 'https' : raw.startsWith('http://') ? 'http' : 'none';
  let host: string;
  try {
    host = new URL(/^[a-z]+:\/\//.test(raw) ? raw : `http://${raw}`).hostname;
  } catch {
    return null;
  }
  host = host.replace(/^www\./, '').replace(/\.$/, '');
  if (!/^[a-z0-9.-]+$/.test(host) || !host.includes('.')) return null;

  const labels = host.split('.');
  const take = SECOND_LEVEL_SUFFIXES.has(labels.slice(-2).join('.')) ? 3 : 2;
  const registrable = labels.slice(-take).join('.');
  const tld = labels[labels.length - 1];
  const isOfficial = (d: string) => registrable === d || host === d || host.endsWith(`.${d}`);
  // Chỉ xét phần trước đuôi tên miền (bỏ "com.vn", "xyz"…) để tìm tên thương hiệu
  const nameTokens = labels.slice(0, labels.length - (take - 1)).join('.').split(/[.-]/).filter(Boolean);

  const findings: string[] = [];
  let score = 10;
  let officialBrand: string | undefined;
  let impersonatedBrand: string | undefined;
  let typoDistance: number | undefined;

  const contained = BRAND_DOMAINS.find(({ brand }) => (brand.length <= 4 ? nameTokens.includes(brand) : nameTokens.some((t) => t.includes(brand))));
  if (contained) {
    if (contained.official.some(isOfficial)) officialBrand = contained.brand;
    else impersonatedBrand = contained.brand;
  } else {
    // Gõ nhầm có chủ ý (vd "vietconbank", "shoppe"): chỉ xét tên dài, lệch 1–2 ký tự, để tránh "tiki" bị coi là "tiktok"
    for (const token of nameTokens.filter((t) => t.length >= 5)) {
      for (const { brand } of BRAND_DOMAINS.filter((b) => b.brand.length >= 5)) {
        const d = levenshtein(token, brand);
        const limit = brand.length >= 6 ? 2 : 1;
        if (d > 0 && d <= limit && (typoDistance === undefined || d < typoDistance)) {
          typoDistance = d;
          impersonatedBrand = brand;
        }
      }
    }
  }

  if (officialBrand) {
    findings.push(`Đây là tên miền chính thức của ${officialBrand.toUpperCase()} (${registrable}).`);
  } else if (impersonatedBrand) {
    score += 50;
    findings.push(
      typoDistance
        ? `Tên miền gần giống thương hiệu ${impersonatedBrand.toUpperCase()} (lệch ${typoDistance} ký tự) nhưng không phải tên miền chính thức.`
        : `Tên miền có chữ ${impersonatedBrand.toUpperCase()} nhưng không phải tên miền chính thức (${BRAND_DOMAINS.find((b) => b.brand === impersonatedBrand)!.official.join(', ')}).`
    );
  }
  const suspiciousTld = SUSPICIOUS_TLDS.includes(tld);
  if (suspiciousTld) {
    score += 25;
    findings.push(`Đuôi tên miền .${tld} giá rẻ, hay bị dùng cho trang lừa đảo.`);
  }
  const punycode = host.includes('xn--');
  if (punycode) {
    score += 35;
    findings.push('Tên miền dùng ký tự đồng hình (Punycode), dễ nhìn nhầm với tên miền thật.');
  }
  const shortener = SHORTENERS.includes(registrable) || SHORTENERS.includes(host);
  if (shortener) {
    score += 20;
    findings.push('Link rút gọn che giấu trang đích thật.');
  }
  if (scheme === 'http') {
    score += 10;
    findings.push('Link dùng http:// (không mã hóa).');
  }

  return { host, registrable, scheme, officialBrand, impersonatedBrand, typoDistance, suspiciousTld, punycode, shortener, score: Math.min(score, 99), findings };
}

export function riskLevelOf(score: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  return score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
}
