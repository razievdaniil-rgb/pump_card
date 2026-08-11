import { Expand, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DutyPoint, PumpProduct } from '../domain/types';
import { calculateBepPoint, getQhPoints } from '../services/pumpCurves';

const WIDTH = 660;
const HEIGHT = 400;
const PLOT = { left: 62, top: 38, right: 18, bottom: 50 };

function ChartSvg({ product, context }: { product: PumpProduct; context: DutyPoint }) {
  const points = useMemo(() => getQhPoints(product), [product]);
  const bep = useMemo(() => calculateBepPoint(product), [product]);
  const qDataMax = Math.max(50, context.q, ...points.map((point) => point.q));
  const qAxisMax = Math.ceil(qDataMax / 10) * 10;
  const maxQ = qAxisMax * 1.04;
  const qTicks = Array.from({ length: qAxisMax / 10 + 1 }, (_, index) => index * 10);
  const maxH = Math.max(80, context.h * 1.2, ...points.map((point) => point.h)) * 1.05;
  const x = (q: number) => PLOT.left + (q / maxQ) * (WIDTH - PLOT.left - PLOT.right);
  const y = (h: number) => PLOT.top + (1 - h / maxH) * (HEIGHT - PLOT.top - PLOT.bottom);
  const curve = points.map((point, index) => `${index ? 'L' : 'M'}${x(point.q)} ${y(point.h)}`).join(' ');
  const zoneStart = Math.max(0, (bep?.q ?? context.q) * 0.85);
  const zoneEnd = (bep?.q ?? context.q) * 1.15;
  const systemCurve = `M${x(0)} ${y(8)} C${x(18)} ${y(18)} ${x(34)} ${y(53)} ${x(50)} ${y(78)}`;
  return (
    <svg className="qh-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Q-H график, рабочая точка Q ${context.q}, H ${context.h}`}>
      <g className="chart-grid">{[0, 20, 40, 60, 80].map((tick) => <g key={`h-${tick}`}><line x1={PLOT.left} x2={WIDTH - PLOT.right} y1={y(tick)} y2={y(tick)} /><text x={PLOT.left - 12} y={y(tick) + 4} textAnchor="end">{tick}</text></g>)}{qTicks.map((tick) => <g key={`q-${tick}`}><line y1={PLOT.top} y2={HEIGHT - PLOT.bottom} x1={x(tick)} x2={x(tick)} /><text x={x(tick)} y={HEIGHT - 18} textAnchor="middle">{tick}</text></g>)}</g>
      <rect className="bep-zone" x={x(zoneStart)} y={PLOT.top} width={x(zoneEnd) - x(zoneStart)} height={HEIGHT - PLOT.top - PLOT.bottom} />
      {bep && <><line className="working-guide" x1={x(bep.q)} x2={x(bep.q)} y1={PLOT.top} y2={HEIGHT - PLOT.bottom} /><text className="axis-label" x={x(bep.q) + 5} y={PLOT.top + 15}>BEP {bep.q.toFixed(1)}</text></>}
      <path className="system-curve" d={systemCurve} />
      <path className="pump-curve" d={curve} />
      <line className="working-guide" x1={x(context.q)} x2={x(context.q)} y1={PLOT.top} y2={HEIGHT - PLOT.bottom} />
      <circle className="working-point" cx={x(context.q)} cy={y(context.h)} r="9" />
      <text className="axis-label" x="12" y="24">H, м</text><text className="axis-label" x={WIDTH - 75} y={HEIGHT - 5}>Q, м³/ч</text>
      <g className="point-tooltip" transform={`translate(${Math.min(x(context.q) + 15, WIDTH - 190)} ${Math.max(y(context.h) - 56, 75)})`}><rect width="170" height="82" rx="9" /><text x="14" y="23">Рабочая точка</text><text x="14" y="47">Q {context.q.toFixed(1)} м³/ч</text><text x="14" y="69">H {context.h.toFixed(1)} м</text></g>
    </svg>
  );
}

export function QHChart({ product, context }: { product: PumpProduct; context: DutyPoint }) {
  const [fullscreen, setFullscreen] = useState(false);
  const legend = <div className="chart-legend"><span><i className="line-blue" />Кривая насоса</span><span><i className="line-green" />BEP</span><span><i className="zone-green" />Допустимая зона</span><span><i className="dot-green" />Рабочая точка</span><span><i className="line-red" />Требуемый напор</span></div>;
  return <>
    <section className="engineering-card chart-card"><header><h2>Q-H график</h2></header>{legend}<div className="chart-stage"><ChartSvg product={product} context={context} /><button className="chart-expand" onClick={() => setFullscreen(true)}><Expand size={16} />На весь экран</button></div></section>
    {fullscreen && <div className="fullscreen-chart" role="dialog" aria-modal="true"><button className="icon-button fullscreen-chart__close" onClick={() => setFullscreen(false)} aria-label="Закрыть"><X /></button><div><h2>Q-H характеристика {product.name}</h2>{legend}<ChartSvg product={product} context={context} /></div></div>}
  </>;
}