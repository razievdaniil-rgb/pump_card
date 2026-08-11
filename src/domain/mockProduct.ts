import type { DutyPoint, PumpProduct } from './types';

export const defaultDutyPoint: DutyPoint = {
  q: 32.4,
  h: 48.5,
  dn: 50,
  source: 'selector',
};

export const pumpProduct: PumpProduct = {
  id: 'apgs-inline-50-200-55',
  xmlId: 'RFZ-000001',
  sku: 'APGS-IL-50200-55',
  version: 'v2.1',
  name: 'APGS-InLine 50-200/5.5',
  image: `${import.meta.env.BASE_URL}pump.png`,
  type: 'Центробежный · InLine',
  construction: 'Вертикальный',
  maxTemperature: 120,
  powerKw: 5.5,
  voltage: 380,
  dn: 50,
  pn: 16,
  efficiency: 78.2,
  npshr: 2.8,
  price: 182000,
  stock: 4,
  delivery: 'Москва · +2 Екб (2–3 дня)',
  curveIds: [
    'curve-RFZ-000001-QH-v1', 'curve-RFZ-000001-EFF-v1',
    'curve-RFZ-000001-POWER-v1', 'curve-RFZ-000001-NPSH-v1',
  ],
  curves: [
    { curve_id: 'curve-RFZ-000001-QH-v1', product_id: 'RFZ-000001', curve_type: 'QH', units: { x: 'm3/h', y: 'm' }, variant: { rpm: 2900, impeller_diameter_mm: 200 }, points: [{ q: 0, h: 78 }, { q: 10, h: 75 }, { q: 20, h: 69 }, { q: 30, h: 58 }, { q: 32.4, h: 48.5 }, { q: 40, h: 41 }, { q: 50, h: 21 }] },
    { curve_id: 'curve-RFZ-000001-EFF-v1', product_id: 'RFZ-000001', curve_type: 'EFF', units: { x: 'm3/h', y: '%' }, variant: { rpm: 2900, impeller_diameter_mm: 200 }, points: [{ q: 10, eff: 56 }, { q: 20, eff: 70 }, { q: 30, eff: 78 }, { q: 32.4, eff: 78.2 }, { q: 40, eff: 74 }, { q: 50, eff: 58 }] },
    { curve_id: 'curve-RFZ-000001-POWER-v1', product_id: 'RFZ-000001', curve_type: 'POWER', units: { x: 'm3/h', y: 'kW' }, variant: { rpm: 2900, impeller_diameter_mm: 200 }, points: [{ q: 0, power: 3.8 }, { q: 20, power: 4.7 }, { q: 32.4, power: 5.1 }, { q: 50, power: 5.5 }] },
    { curve_id: 'curve-RFZ-000001-NPSH-v1', product_id: 'RFZ-000001', curve_type: 'NPSH', units: { x: 'm3/h', y: 'm' }, variant: { rpm: 2900, impeller_diameter_mm: 200 }, points: [{ q: 0, npsh: 1.2 }, { q: 20, npsh: 2.1 }, { q: 32.4, npsh: 2.8 }, { q: 50, npsh: 4.3 }] },
  ],  curve: [
    { q: 0, h: 78, efficiency: 32 },
    { q: 10, h: 75, efficiency: 56 },
    { q: 20, h: 69, efficiency: 70 },
    { q: 30, h: 58, efficiency: 78 },
    { q: 32.4, h: 48.5, efficiency: 78.2 },
    { q: 40, h: 41, efficiency: 74 },
    { q: 50, h: 21, efficiency: 58 },
  ],
  description:
    'Вертикальный центробежный насос для систем водоснабжения, отопления, кондиционирования и повышения давления.',
};

export const alternatives: PumpProduct[] = [
  { ...pumpProduct, id: 'apgs-inline-50-200-75', sku: 'APGS-IL-50200-75', name: 'APGS-InLine 50-200/7.5', powerKw: 7.5, price: 188500, stock: 2 },
  { ...pumpProduct, id: 'apgs-inline-50-160-40', sku: 'APGS-IL-50160-40', name: 'APGS-InLine 50-160/4.0', powerKw: 4, price: 169000, efficiency: 74.8 },
];
