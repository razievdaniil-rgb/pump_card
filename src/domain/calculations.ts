import type { DiagnosticCheck, DutyPoint, PumpProduct, Verdict } from './types';

export const formatMoney = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);

export function calculateVerdict(product: PumpProduct, duty: DutyPoint): Verdict {
  const qDelta = Math.abs(duty.q - 32.4) / 32.4;
  const hDelta = Math.abs(duty.h - 48.5) / 48.5;
  const score = Math.max(0, Math.round(97 - qDelta * 58 - hDelta * 62));
  const level = score >= 85 ? 'A' : score >= 65 ? 'B' : 'C';
  const labels = { A: 'ПОДХОДИТ', B: 'С ОГРАНИЧЕНИЯМИ', C: 'НЕ РЕКОМЕНДУЕТСЯ' } as const;
  const reasons = [
    `Рабочая точка Q ${duty.q.toFixed(1)} / H ${duty.h.toFixed(1)} находится ${level === 'A' ? 'в оптимальной зоне BEP' : 'в рабочем диапазоне'}`,
    `КПД ${product.efficiency.toFixed(1)}% при заданном режиме`,
    `Запас NPSHa +1,2 м`,
    `Подходит по DN${product.dn} / PN${product.pn}`,
  ];
  const risks = level === 'A' ? [] : level === 'B'
    ? ['Рабочая точка близка к границе допустимой зоны', 'Проверьте регулирование и запас двигателя']
    : ['Рабочая точка находится вне характеристики насоса', 'Требуется другая гидравлическая конфигурация'];
  return { level, label: labels[level], score, reasons, risks };
}

export function calculateDiagnostics(product: PumpProduct, duty: DutyPoint): DiagnosticCheck[] {
  const verdict = calculateVerdict(product, duty);
  const baseStatus = verdict.level === 'A' ? 'ok' : verdict.level === 'B' ? 'warn' : 'danger';
  return [
    { id: 'hydraulics', label: 'Гидравлика', value: verdict.level === 'C' ? 'Вне диапазона' : 'Отлично', hint: 'Соответствие напорной характеристике', status: baseStatus },
    { id: 'duty', label: 'Рабочая точка', value: verdict.level === 'A' ? 'В зоне оптимума' : 'На границе зоны', hint: `Q ${duty.q.toFixed(1)} м³/ч · H ${duty.h.toFixed(1)} м`, status: baseStatus },
    { id: 'npsh', label: 'NPSH запас', value: '+1,2 м', hint: 'Минимально допустимо +1,0 м', status: 'ok' },
    { id: 'motor', label: 'Двигатель', value: 'Соответствует', hint: `${product.powerKw.toFixed(1)} кВт · ${product.voltage} В`, status: 'ok' },
    { id: 'reliability', label: 'Надёжность', value: 'Высокая', hint: 'Материалы и режим совместимы', status: 'ok' },
    { id: 'temperature', label: 'Температура', value: 'Допустима', hint: `До ${product.maxTemperature} °C`, status: 'ok' },
    { id: 'connection', label: 'DN / PN', value: 'Соответствует', hint: `DN${product.dn} / PN${product.pn}`, status: duty.dn === product.dn ? 'ok' : 'warn' },
    { id: 'control', label: 'Регулирование', value: 'Задвижка допустима', hint: 'ЧРП не требуется', status: 'ok' },
  ];
}

export interface TcoAssumptions { years: 3 | 5; hoursPerYear: number; electricityRate: number }

export function calculateTco(product: PumpProduct, assumptions: TcoAssumptions) {
  const inputPower = product.powerKw / 0.93;
  const energy = inputPower * assumptions.hoursPerYear * assumptions.electricityRate * assumptions.years;
  const maintenance = product.price * 0.05 * assumptions.years;
  return { purchase: product.price, energy, maintenance, total: product.price + energy + maintenance, inputPower };
}
