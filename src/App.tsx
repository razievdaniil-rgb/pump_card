import { ArrowLeft, Box, GitCompareArrows } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AlternativesCard } from './components/AlternativesCard';
import { ContextBar } from './components/ContextBar';
import { DiagnosticsPanel } from './components/DiagnosticsPanel';
import { EdgeStateNotice } from './components/EdgeStateNotice';
import { MetricsBar } from './components/MetricsBar';
import { ProductTabs } from './components/ProductTabs';
import { PurchaseRail } from './components/PurchaseRail';
import { QHChart } from './components/QHChart';
import { SpecificationDrawer } from './components/SpecificationDrawer';
import { TcoCard } from './components/TcoCard';
import { VerdictPanel } from './components/VerdictPanel';
import { AddSpecificationModal } from './components/forms/AddSpecificationModal';
import { EditContextModal } from './components/forms/EditContextModal';
import { QuoteModal } from './components/forms/QuoteModal';
import { calculateDiagnostics, calculateVerdict, formatMoney } from './domain/calculations';
import { alternatives, defaultDutyPoint, pumpProduct } from './domain/mockProduct';
import type { DutyPoint, MountOptions, PumpProduct } from './domain/types';
import { useSpecificationStore } from './store/specificationStore';

export function App({ options = {} }: { options?: MountOptions }) {
  const product: PumpProduct = options.product ?? pumpProduct;
  const [context, setContext] = useState<DutyPoint>(options.context ?? defaultDutyPoint);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [compared, setCompared] = useState(false);
  const items = useSpecificationStore((state) => state.items);
  const openSpecification = useSpecificationStore((state) => state.open);
  const verdict = useMemo(() => calculateVerdict(product, context), [product, context]);
  const diagnostics = useMemo(() => calculateDiagnostics(product, context), [product, context]);

  const openQuote = () => {
    if (!items.length) setAddOpen(true);
    else setQuoteOpen(true);
  };

  return <div className={`apgs-app apgs-app--${options.mode ?? 'standalone'}`} data-xml-id={options.xmlId ?? product.xmlId}>
    <header className="app-toolbar"><div className="breadcrumbs">Каталог / Насосы / InLine / <b>{product.name}</b></div><div className="toolbar-actions"><button onClick={() => options.onOpenSelector?.(context)}><ArrowLeft size={16} /><span className="desktop-label">В подборщик</span><span className="mobile-label">Назад</span></button><button className={compared ? 'is-active' : ''} onClick={() => setCompared((value) => !value)}><GitCompareArrows size={16} />{compared ? 'В сравнении' : 'Сравнить'}</button><button onClick={openSpecification}><Box size={16} />Спецификация <b>{items.reduce((sum, item) => sum + item.quantity, 0)}</b></button></div></header>
    <EdgeStateNotice state={options.edgeState ?? null} onRetry={options.onRetry} />
    <main className="product-layout">
      <div className="product-main">
        <section className="product-card">
          <div className="product-hero"><div><h1>{product.name}</h1><p className="sku">XML_ID: <b>{product.xmlId}</b> · Артикул: <b>{product.sku}</b> · {product.version} · <button>история изменений</button></p><div className="product-tags"><span>{product.type}</span><span>{product.construction}</span><span>до {product.maxTemperature} °C</span></div></div><div className="product-image"><img src={product.image} alt={`Насос ${product.name}`} /></div></div>
          <ContextBar context={context} onEdit={() => setEditOpen(true)} />
          <VerdictPanel verdict={verdict} />
          <MetricsBar product={product} context={context} /><section className="mobile-price-summary"><strong>{formatMoney(product.price)}</strong><span>с НДС · <b>дешевле аналога на 8%</b> · В наличии: {product.stock} шт.</span></section>
          <div className="engineering-grid"><QHChart product={product} context={context} /><DiagnosticsPanel checks={diagnostics} /></div>
          <ProductTabs product={product} />
        </section>
      </div>
      <aside className="product-rail"><PurchaseRail product={product} onAdd={() => setAddOpen(true)} onQuote={openQuote} onSelector={() => options.onOpenSelector?.(context)} onCompare={() => setCompared((value) => !value)} /><TcoCard product={product} /><AlternativesCard alternatives={alternatives} /></aside>
    </main>
    <div className="mobile-sticky"><button onClick={() => setAddOpen(true)}>Добавить в спецификацию</button><button onClick={openQuote}>Получить КП</button></div>
    <AddSpecificationModal open={addOpen} product={product} context={context} onClose={() => setAddOpen(false)} />
    <EditContextModal key={`${context.q}-${context.h}-${editOpen}`} open={editOpen} context={context} onClose={() => setEditOpen(false)} onSave={(next) => { setContext(next); setEditOpen(false); }} />
    <QuoteModal open={quoteOpen} items={items} onClose={() => setQuoteOpen(false)} onSubmit={options.onQuoteSubmit} />
    <SpecificationDrawer onQuote={() => { useSpecificationStore.getState().close(); setQuoteOpen(true); }} />
  </div>;
}
