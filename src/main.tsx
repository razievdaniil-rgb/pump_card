import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import type { MountOptions } from './domain/types';
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
  }
}

window.APGSProductCard = { mount: mountApGsProductCard };

const standaloneRoot = document.getElementById('root');
if (standaloneRoot) mountApGsProductCard(standaloneRoot);
