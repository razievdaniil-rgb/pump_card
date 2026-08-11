import type { EngineeringCurve, EngineeringCurvePoint, PumpCurvePoint, PumpCurveType, PumpProduct } from '../domain/types';

export interface CurveSet {
  key: string;
  rpm?: number;
  impellerDiameterMm?: number;
  curves: Partial<Record<PumpCurveType, EngineeringCurve>>;
}

export interface BepPoint {
  q: number;
  h: number;
  efficiency: number;
}

const productKey = (curve: EngineeringCurve) => curve.product_id || 'unknown-product';

export function groupCurveSets(curves: EngineeringCurve[]): CurveSet[] {
  const groups = new Map<string, CurveSet>();
  curves.forEach((curve) => {
    const key = productKey(curve);
    const current = groups.get(key) ?? {
      key,
      rpm: curve.variant?.rpm ?? undefined,
      impellerDiameterMm: curve.variant?.impeller_diameter_mm ?? undefined,
      curves: {},
    };
    current.curves[curve.curve_type] = curve;
    groups.set(key, current);
  });
  return [...groups.values()];
}

export function getPreferredCurveSet(curves: EngineeringCurve[], productId?: string): CurveSet | undefined {
  const sets = groupCurveSets(curves);
  const candidates = productId ? sets.filter((set) => set.key === productId) : sets;
  return candidates.sort((a, b) => {
    const aScore = Number(Boolean(a.curves.QH)) * 2 + Number(Boolean(a.curves.EFF));
    const bScore = Number(Boolean(b.curves.QH)) * 2 + Number(Boolean(b.curves.EFF));
    return bScore - aScore;
  })[0];
}

const valueForType = (type: PumpCurveType, point: EngineeringCurvePoint) => {
  if (type === 'QH') return point.h;
  if (type === 'EFF') return point.eff;
  if (type === 'POWER') return point.power;
  return point.npsh;
};

export function normalizeEngineeringCurves(value: unknown): EngineeringCurve[] {
  let source = value;
  if (typeof source === 'string') {
    try { source = JSON.parse(source); } catch { return []; }
  }
  if (!Array.isArray(source)) return [];

  return source.flatMap((item): EngineeringCurve[] => {
    if (!item || typeof item !== 'object') return [];
    const curve = item as Record<string, unknown>;
    const type = curve.curve_type as PumpCurveType;
    if (!['QH', 'EFF', 'POWER', 'NPSH'].includes(type)) return [];
    const points = Array.isArray(curve.points) ? curve.points : [];
    const normalizedPoints = points.flatMap((raw): EngineeringCurvePoint[] => {
      if (!raw || typeof raw !== 'object') return [];
      const point = raw as Record<string, unknown>;
      const q = Number(point.q);
      const y = Number(type === 'QH' ? point.h : type === 'EFF' ? point.eff : type === 'POWER' ? point.power : point.npsh);
      if (!Number.isFinite(q) || !Number.isFinite(y)) return [];
      return [{ q, ...(type === 'QH' ? { h: y } : type === 'EFF' ? { eff: y } : type === 'POWER' ? { power: y } : { npsh: y }) }];
    });
    if (normalizedPoints.length < 2) return [];
    const units = curve.units as EngineeringCurve['units'] | undefined;
    return [{
      curve_id: String(curve.curve_id ?? ''),
      product_id: String(curve.product_id ?? ''),
      curve_type: type,
      units: units ?? { x: 'm3/h', y: type === 'EFF' ? '%' : type === 'POWER' ? 'kW' : 'm' },
      variant: curve.variant as EngineeringCurve['variant'],
      points: normalizedPoints.sort((a, b) => a.q - b.q),
    }];
  });
}

export function parseCurveIds(value: unknown): string[] {
  let source = value;
  if (source && typeof source === 'object' && 'VALUE' in source) source = (source as { VALUE?: unknown }).VALUE;
  if (typeof source === 'string') {
    const raw = source;
    try { source = JSON.parse(raw); } catch { source = raw.split(/[;,\s]+/); }
  }
  if (!Array.isArray(source)) return [];
  return [...new Set(source.map(String).map((id) => id.trim()).filter((id) => /^curve-RFZ-\d+-(?:QH|EFF|POWER|NPSH)-v\d+$/i.test(id)))];
}

export function getQhPoints(product: PumpProduct): PumpCurvePoint[] {
  const qh = getPreferredCurveSet(product.curves, product.xmlId)?.curves.QH;
  if (!qh) return product.curve;
  return qh.points.map((point) => ({ q: point.q, h: point.h ?? 0, efficiency: 0 }));
}

const interpolateH = (points: PumpCurvePoint[], q: number) => {
  const ordered = [...points].sort((a, b) => a.q - b.q);
  const exact = ordered.find((point) => point.q === q);
  if (exact) return exact.h;
  const upperIndex = ordered.findIndex((point) => point.q > q);
  if (upperIndex === -1) return ordered.at(-1)?.h ?? 0;
  if (upperIndex === 0) return ordered[0]?.h ?? 0;
  const lower = ordered[upperIndex - 1];
  const upper = ordered[upperIndex];
  const ratio = (q - lower.q) / (upper.q - lower.q);
  return lower.h + (upper.h - lower.h) * ratio;
};

export function calculateBepPoint(product: PumpProduct): BepPoint | undefined {
  const curveSet = getPreferredCurveSet(product.curves, product.xmlId);
  const efficiencyCurve = curveSet?.curves.EFF;
  const qhPoints = getQhPoints(product);

  if (efficiencyCurve) {
    const peak = efficiencyCurve.points.reduce((best, point) => (point.eff ?? -Infinity) > (best.eff ?? -Infinity) ? point : best);
    if (Number.isFinite(peak.eff)) return { q: peak.q, h: interpolateH(qhPoints, peak.q), efficiency: peak.eff ?? 0 };
  }

  const legacyPeak = product.curve.reduce((best, point) => point.efficiency > best.efficiency ? point : best, product.curve[0]);
  return legacyPeak ? { q: legacyPeak.q, h: legacyPeak.h, efficiency: legacyPeak.efficiency } : undefined;
}

export function curveValue(curve: EngineeringCurve, point: EngineeringCurvePoint) {
  return valueForType(curve.curve_type, point);
}