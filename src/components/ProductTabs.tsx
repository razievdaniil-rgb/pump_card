import { useState } from 'react';
import type { PumpProduct } from '../domain/types';

type Tab = 'overview' | 'specs' | 'chart' | 'diagnostics' | 'tco' | 'docs';

export function ProductTabs({ product }: { product: PumpProduct }) {
  const [tab, setTab] = useState<Tab>('overview');
  const tabs: Array<[Tab, string]> = [['overview', 'Обзор'], ['specs', 'Характеристики'], ['chart', 'Q-H график'], ['diagnostics', 'Диагностика'], ['tco', 'TCO'], ['docs', 'Документы']];
  return <section className="product-tabs"><div className="tabs" role="tablist">{tabs.map(([id, label]) => <button role="tab" aria-selected={tab === id} key={id} onClick={() => setTab(id)}>{label}</button>)}</div><div className="tab-content">{tab === 'overview' && <><p>{product.description}</p><div className="trust-row"><span><b>Сделано в России</b>Корпусное производство</span><span><b>Гарантия 24 мес.</b>Расширенная гарантия</span><span><b>Сервис 24/7</b>Техническая поддержка</span></div></>}{tab === 'specs' && <dl className="spec-grid"><div><dt>Артикул</dt><dd>{product.sku}</dd></div><div><dt>Мощность</dt><dd>{product.powerKw} кВт</dd></div><div><dt>Фланцы</dt><dd>DN{product.dn} / PN{product.pn}</dd></div><div><dt>Температура</dt><dd>до {product.maxTemperature} °C</dd></div></dl>}{tab === 'chart' && <p>Интерактивная характеристика расположена выше. При интеграции данные кривой поступят из PostgreSQL через API.</p>}{tab === 'diagnostics' && <p>Все восемь инженерных проверок рассчитаны относительно текущего Context Q/H.</p>}{tab === 'tco' && <p>TCO учитывает цену покупки, потребление в рабочей точке, часы работы, тариф и обслуживание.</p>}{tab === 'docs' && <ul className="documents"><li><button>Паспорт изделия (PDF)</button></li><li><button>Габаритный чертёж</button></li><li><button>Руководство по монтажу</button></li></ul>}</div></section>;
}
