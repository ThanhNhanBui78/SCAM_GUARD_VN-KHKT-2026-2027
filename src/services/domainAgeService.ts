// Gọi /api/analyze/domain-age (tra RDAP thật trên máy chủ). Không tra được thì trả về lý do, không đoán.
export interface DomainAgeResult {
  available: boolean;
  domain?: string;
  registeredAt?: string;
  ageDays?: number;
  source?: string;
  checkedAt?: string;
  reason?: string;
}

export async function lookupDomainAge(input: string): Promise<DomainAgeResult> {
  try {
    const res = await fetch(`/api/analyze/domain-age?domain=${encodeURIComponent(input)}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { available: false, reason: 'Không tra được: máy chủ ScamGuard không phản hồi.' };
    }
    const data = await res.json();
    return data.error ? { available: false, reason: data.error } : data;
  } catch {
    return { available: false, reason: 'Không tra được: không kết nối được máy chủ ScamGuard.' };
  }
}

export function describeDomainAge(r: DomainAgeResult): string {
  if (!r.available || r.ageDays === undefined || !r.registeredAt) {
    return r.reason || 'Không tra được tuổi tên miền.';
  }
  const regDate = new Date(r.registeredAt).toLocaleDateString('vi-VN');
  const checked = r.checkedAt ? new Date(r.checkedAt).toLocaleString('vi-VN') : '';
  return `${r.ageDays} ngày (đăng ký ${regDate}) – nguồn ${r.source}, tra lúc ${checked}`;
}
