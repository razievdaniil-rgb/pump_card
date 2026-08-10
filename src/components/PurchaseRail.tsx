import { ArrowLeftRight, FileText } from 'lucide-react';
import { formatMoney } from '../domain/calculations';
import type { PumpProduct } from '../domain/types';

interface PurchaseRailProps { product: PumpProduct; onAdd: () => void; onQuote: () => void; onSelector: () => void; onCompare: () => void }

export function PurchaseRail({ product, onAdd, onQuote, onSelector, onCompare }: PurchaseRailProps) {
  return <section className="rail-card purchase-card"><div className="price">{formatMoney(product.price)}</div><p>с НДС · <b>дешевле аналога на 8%</b></p><div className="stock"><i />В наличии: {product.stock} шт.</div><small>{product.delivery}</small><button className="button button--dark" onClick={onAdd}>+ Добавить в спецификацию</button><button className="button button--outline" onClick={onQuote}>Получить КП</button><div className="rail-actions"><button onClick={() => window.print()}><FileText size={15} />Паспорт</button><button onClick={onSelector}><ArrowLeftRight size={15} />В подборщик</button></div><button className="compare-link" onClick={onCompare}>Сравнить модель</button></section>;
}
