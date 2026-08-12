import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import type { EdgeState, MountOptions } from './domain/types';
import { defaultDutyPoint, pumpProduct } from './domain/mockProduct';
import { mapBitrixPump, type BitrixProductPayload } from './services/bitrixProductAdapter';
import './styles/tokens.css';
import './styles/global.css';
import './styles/product-card.css';

export function mountApGsProductCard(element: HTMLElement, options: MountOptions = {}) {
  const root = ReactDOM.createRoot(element);
  root.render(<React.StrictMode><App options={options} /></React.StrictMode>);
  return () => root.unmount();
}

declare global {
  interface Window {
    APGSProductCard?: { mount: typeof mountApGsProductCard };
    APGS_PRODUCT_DATA?: MountOptions['product'];
    APGS_BITRIX_PRODUCT?: BitrixProductPayload;
  }
}

window.APGSProductCard = { mount: mountApGsProductCard };

const standaloneRoot = document.getElementById('root') ?? document.getElementById('apgs-product-card');
if (standaloneRoot) {
  const mode = standaloneRoot.dataset.mode === 'embedded' ? 'embedded' : 'standalone';
  const queryEdgeState = new URLSearchParams(window.location.search).get('edgeState');
  const edgeState = (standaloneRoot.dataset.edgeState || queryEdgeState || null) as EdgeState;
  const query = new URLSearchParams(window.location.search);
  const storedContext = (() => {
    try { return JSON.parse(localStorage.getItem('apgs-selection-context') || 'null'); }
    catch { return null; }
  })();
  const q = Number(query.get('q') ?? storedContext?.q);
  const h = Number(query.get('h') ?? storedContext?.h);
  const context = Number.isFinite(q) && Number.isFinite(h) ? { ...defaultDutyPoint, q, h } : undefined;
  mountApGsProductCard(standaloneRoot, {
    mode,
    edgeState,
    context,
    onOpenSelector: () => { window.location.href = '../pumpselect/'; },
    xmlId: standaloneRoot.dataset.xmlId,
    product: window.APGS_PRODUCT_DATA ?? (window.APGS_BITRIX_PRODUCT ? mapBitrixPump(window.APGS_BITRIX_PRODUCT, pumpProduct) : undefined),
  });
}
