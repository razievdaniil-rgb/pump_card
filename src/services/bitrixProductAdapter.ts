import type { PumpCurvePoint, PumpProduct } from '../domain/types';
import { normalizeEngineeringCurves, parseCurveIds } from './pumpCurves';

export interface BitrixProductPayload {
  ID?: string | number;
  XML_ID?: string;
  NAME?: string;
  DETAIL_PICTURE?: string | { SRC?: string };
  PRICE?: number | string;
  QUANTITY?: number | string;
  CURVES?: unknown;
  PROPERTIES?: Record<string, unknown>;
}

const unwrap = (value: unknown): unknown => {
  if (value && typeof value === 'object' && 'VALUE' in value) return unwrap((value as { VALUE?: unknown }).VALUE);
  return value;
};

const text = (value: unknown, fallback: string) => {
  const unwrapped = unwrap(value);
  return typeof unwrapped === 'string' && unwrapped.trim() ? unwrapped.trim() : fallback;
};

const number = (value: unknown, fallback: number) => {
  const unwrapped = unwrap(value);
  const normalized = typeof unwrapped === 'string' ? unwrapped.replace(',', '.').replace(/[^0-9.-]/g, '') : unwrapped;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const image = (value: BitrixProductPayload['DETAIL_PICTURE'], fallback: string) => {
  if (typeof value === 'string' && value) return value;
  if (value && typeof value === 'object' && value.SRC) return value.SRC;
  return fallback;
};

const curve = (value: unknown, fallback: PumpCurvePoint[]) => {
  const unwrapped = unwrap(value);
  try {
    const parsed = typeof unwrapped === 'string' ? JSON.parse(unwrapped) : unwrapped;
    const points = Array.isArray(parsed) ? parsed : (parsed as { points?: unknown[] } | null)?.points;
    if (!Array.isArray(points)) return fallback;
    const normalized = points.map((point) => {
      const item = point as Record<string, unknown>;
      return { q: number(item.q, NaN), h: number(item.h, NaN), efficiency: number(item.efficiency, 0) };
    }).filter((point) => Number.isFinite(point.q) && Number.isFinite(point.h));
    return normalized.length >= 2 ? normalized : fallback;
  } catch {
    return fallback;
  }
};

export function mapBitrixPump(payload: BitrixProductPayload, fallback: PumpProduct): PumpProduct {
  const properties = payload.PROPERTIES ?? {};
  const property = (...codes: string[]) => codes.map((code) => properties[code]).find((value) => unwrap(value) != null);
  const xmlId = text(payload.XML_ID, fallback.xmlId);
  const curveIds = parseCurveIds(property('PMP_CURVES_JSON'));
  const engineeringCurves = normalizeEngineeringCurves(payload.CURVES ?? property('CURVES_JSON', 'PMP_CURVES_DATA'));

  return {
    ...fallback,
    id: String(payload.ID ?? fallback.id),
    xmlId,
    sku: text(property('ARTICLE', 'SKU', 'CML2_ARTICLE'), xmlId),
    name: text(payload.NAME, fallback.name),
    image: image(payload.DETAIL_PICTURE, fallback.image),
    type: text(property('PUMP_TYPE', 'TYPE'), fallback.type),
    construction: text(property('CONSTRUCTION'), fallback.construction),
    maxTemperature: number(property('MAX_TEMPERATURE', 'TEMPERATURE_MAX'), fallback.maxTemperature),
    powerKw: number(property('POWER'), fallback.powerKw),
    voltage: number(property('VOLTAGE'), fallback.voltage),
    dn: number(property('DISCHARGE_DN', 'SUCTION_DN', 'DN'), fallback.dn),
    pn: number(property('PN'), fallback.pn),
    efficiency: number(property('EFFICIENCY', 'EFF'), fallback.efficiency),
    npshr: number(property('NPSHR'), fallback.npshr),
    price: number(payload.PRICE ?? property('PRICE'), fallback.price),
    stock: number(payload.QUANTITY ?? property('QUANTITY'), fallback.stock),
    delivery: text(property('DELIVERY'), fallback.delivery),
    curveIds: curveIds.length ? curveIds : fallback.curveIds,
    curves: engineeringCurves.length ? engineeringCurves : fallback.curves,
    curve: curve(property('QH_CURVE', 'CURVE_QH'), fallback.curve),
    description: text(property('DETAIL_TEXT', 'DESCRIPTION'), fallback.description),
  };
}