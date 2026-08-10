import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { calculateTco, formatMoney } from '../domain/calculations';
import type { PumpProduct } from '../domain/types';

export function TcoCard({ product }: { product: PumpProduct }) {
  const [years, setYears] = useState<3 | 5>(5);
  const [editing, setEditing] = useState(false);
  const [hoursPerYear, setHours] = useState(8000);
  const [electricityRate, setRate] = useState(6.5);
  const result = useMemo(() => calculateTco(product, { years, hoursPerYear, electricityRate }), [product, years, hoursPerYear, electricityRate]);
  const circumference = 2 * Math.PI * 42;
  const purchaseShare = result.purchase / result.total;
  const energyShare = result.energy / result.total;
  return <section className="rail-card tco-card"><header><h2>Стоимость владения (TCO)</h2><div className="segmented"><button aria-pressed={years === 3} onClick={() => setYears(3)}>3 года</button><button aria-pressed={years === 5} onClick={() => setYears(5)}>5 лет</button></div></header><div className="tco-summary"><div><span>Итого за {years} {years === 3 ? 'года' : 'лет'}</span><strong>{formatMoney(result.total)}</strong></div><svg className="tco-donut" viewBox="0 0 100 100" aria-label="Структура стоимости владения"><circle cx="50" cy="50" r="42" className="donut-bg" /><circle cx="50" cy="50" r="42" className="donut-purchase" strokeDasharray={`${purchaseShare * circumference} ${circumference}`} /><circle cx="50" cy="50" r="42" className="donut-energy" strokeDasharray={`${energyShare * circumference} ${circumference}`} strokeDashoffset={-purchaseShare * circumference} /></svg></div><div className="tco-lines"><div><span><i className="blue" />Покупка</span><b>{formatMoney(result.purchase)}</b></div><div><span><i className="green" />Энергопотребление</span><b>{formatMoney(result.energy)}</b></div><div><span><i className="amber" />Обслуживание</span><b>{formatMoney(result.maintenance)}</b></div></div><div className="tco-assumptions"><span>{hoursPerYear.toLocaleString('ru-RU')} ч/год · {electricityRate.toFixed(1)} ₽/кВт·ч · обслуж. 5%/год</span><button onClick={() => setEditing((value) => !value)}>изменить <Pencil size={13} /></button></div>{editing && <div className="tco-fields"><label>Часы работы в год<input type="number" min="0" step="100" value={hoursPerYear} onChange={(event) => setHours(Math.max(0, Number(event.target.value)))} /></label><label>Тариф, ₽/кВт·ч<input type="number" min="0" step="0.1" value={electricityRate} onChange={(event) => setRate(Math.max(0, Number(event.target.value)))} /></label></div>}<div className="tco-saving"><span>Экономия vs аналог</span><b>126 000 ₽ ↗</b></div></section>;
}
