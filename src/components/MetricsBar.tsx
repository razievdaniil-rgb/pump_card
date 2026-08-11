import { Droplet, Gauge, MoveUp, Zap } from 'lucide-react';
import type { SVGProps } from 'react';
import type { DutyPoint, PumpProduct } from '../domain/types';

function FlangeIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/><circle cx="6.8" cy="6.8" r=".9" fill="currentColor"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/><circle cx="6.8" cy="17.2" r=".9" fill="currentColor"/><circle cx="17.2" cy="17.2" r=".9" fill="currentColor"/></svg>;
}

export function MetricsBar({ product, context }: { product: PumpProduct; context: DutyPoint }) {
  const metrics = [
    { label: 'Расход (Q)', value: `${context.q.toFixed(1)} м³/ч`, helper: 'ном. 32,0', icon: Droplet },
    { label: 'Напор (H)', value: `${context.h.toFixed(1)} м`, helper: '+1% к расчёту', icon: MoveUp },
    { label: 'Мощность', value: `${product.powerKw.toFixed(1)} кВт`, helper: `${product.voltage} В · IE3`, icon: Zap },
    { label: 'DN / PN', value: `DN${product.dn} / PN${product.pn}`, helper: 'фланец EN 1092', icon: FlangeIcon, compact: true },
    { label: 'КПД (раб. точка)', value: `${product.efficiency.toFixed(1)} %`, helper: 'классификация IE3', icon: Gauge },
    { label: 'NPSHa', value: '+1,2 м', helper: 'запас', icon: Droplet },
  ];
  return <section className="metrics-bar" aria-label="Ключевые характеристики">{metrics.map(({ label, value, helper, icon: Icon, compact }) => <div className={`metric${compact ? ' metric--compact' : ''}`} key={label}><span className="metric__icon"><Icon width={22} height={22} /></span><div><span className="metric__label">{label}</span><strong>{value}</strong><small>{helper}</small></div></div>)}</section>;
}