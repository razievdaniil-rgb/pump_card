export type VerdictLevel = 'A' | 'B' | 'C';
export type DiagnosticStatus = 'ok' | 'warn' | 'danger';

export interface DutyPoint {
  q: number;
  h: number;
  dn: number;
  source: 'selector' | 'catalog' | 'manual';
}

export interface PumpCurvePoint {
  q: number;
  h: number;
  efficiency: number;
}

export interface PumpProduct {
  id: string;
  sku: string;
  version: string;
  name: string;
  image: string;
  type: string;
  construction: string;
  maxTemperature: number;
  powerKw: number;
  voltage: number;
  dn: number;
  pn: number;
  efficiency: number;
  npshr: number;
  price: number;
  stock: number;
  delivery: string;
  curve: PumpCurvePoint[];
  description: string;
}

export interface DiagnosticCheck {
  id: string;
  label: string;
  value: string;
  hint: string;
  status: DiagnosticStatus;
}

export interface Verdict {
  level: VerdictLevel;
  label: 'ПОДХОДИТ' | 'С ОГРАНИЧЕНИЯМИ' | 'НЕ РЕКОМЕНДУЕТСЯ';
  score: number;
  reasons: string[];
  risks: string[];
}

export interface SpecificationItem {
  id: string;
  product: PumpProduct;
  quantity: number;
  comment: string;
  context: DutyPoint;
  addedAt: string;
}

export interface MountOptions {
  product?: PumpProduct;
  context?: DutyPoint;
  onQuoteSubmit?: (payload: QuotePayload) => Promise<void> | void;
  onOpenSelector?: (context: DutyPoint) => void;
}

export interface QuotePayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  inn?: string;
  comment?: string;
  items: SpecificationItem[];
}
