import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import type { MountOptions } from './domain/types';
import { pumpProduct } from './domain/mockProduct';
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
  mountApGsProductCard(standaloneRoot, {
    mode,
    xmlId: standaloneRoot.dataset.xmlId,
    product: window.APGS_PRODUCT_DATA ?? (window.APGS_BITRIX_PRODUCT ? mapBitrixPump(window.APGS_BITRIX_PRODUCT, pumpProduct) : undefined),
  });
}
