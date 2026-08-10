import type { PumpProduct } from '../domain/types';
import { formatMoney } from '../domain/calculations';

export function AlternativesCard({ alternatives }: { alternatives: PumpProduct[] }) {
  return <section className="rail-card alternatives-card"><header><h2>Альтернативы ({alternatives.length})</h2><button className="text-button">Смотреть все</button></header>{alternatives.slice(0, 2).map((product, index) => <article className="alternative" key={product.id}><img src={product.image} alt="" /><div><span className="alternative__status">{index ? 'С ограничениями' : '✓ Подходит'}</span><h3>{product.name}</h3><p>{index ? 'Меньше мощность, рабочая точка ближе к границе зоны' : 'Больше запас двигателя и ниже нагрузка'}</p><small>{index ? 87 : 94}% · {formatMoney(product.price)} · В наличии</small></div></article>)}</section>;
}
