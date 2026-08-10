import type { DutyPoint, PumpProduct } from './types';

export const defaultDutyPoint: DutyPoint = {
  q: 32.4,
  h: 48.5,
  dn: 50,
  source: 'selector',
};

export const pumpProduct: PumpProduct = {
  id: 'apgs-inline-50-200-55',
  sku: 'APGS-IL-50200-55',
  version: 'v2.1',
  name: 'APGS-InLine 50-200/5.5',
  image: '/pump.png',
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
  curve: [
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
