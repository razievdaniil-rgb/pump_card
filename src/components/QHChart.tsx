import { Expand, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DutyPoint, PumpProduct } from '../domain/types';

const WIDTH = 760;
const HEIGHT = 330;
const PLOT = { left: 56, top: 64, right: 24, bottom: 46 };

function ChartSvg({ product, context }: { product: PumpProduct; context: DutyPoint }) {
  const maxQ = 80;
  const maxH = 80;
  const x = (q: number) => PLOT.left + (q / maxQ) * (WIDTH - PLOT.left - PLOT.right);
  const y = (h: number) => PLOT.top + (1 - h / maxH) * (HEIGHT - PLOT.top - PLOT.bottom);
  const curve = useMemo(() => product.curve.map((point, index) => `${index ? 'L' : 'M'}${x(point.q)} ${y(point.h)}`).join(' '), [product]);
  const systemCurve = `M${x(0)} ${y(8)} C${x(18)} ${y(18)} ${x(34)} ${y(53)} ${x(50)} ${y(78)}`;
  return (
    <svg className="qh-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Q-H график, рабочая точка Q ${context.q}, H ${context.h}`}>
      <g className="chart-grid">{[0, 20, 40, 60, 80].map((tick) => <g key={`h-${tick}`}><line x1={PLOT.left} x2={WIDTH - PLOT.right} y1={y(tick)} y2={y(tick)} /><text x={PLOT.left - 12} y={y(tick) + 4} textAnchor="end">{tick}</text></g>)}{[0, 10, 20, 30, 40, 50, 60, 70, 80].map((tick) => <g key={`q-${tick}`}><line y1={PLOT.top} y2={HEIGHT - PLOT.bottom} x1={x(tick)} x2={x(tick)} /><text x={x(tick)} y={HEIGHT - 18} textAnchor="middle">{tick}</text></g>)}</g>
      <rect className="bep-zone" x={x(24)} y={PLOT.top} width={x(40) - x(24)} height={HEIGHT - PLOT.top - PLOT.bottom} />
      <path className="system-curve" d={systemCurve} />
      <path className="pump-curve" d={curve} />
      <line className="working-guide" x1={x(context.q)} x2={x(context.q)} y1={PLOT.top} y2={HEIGHT - PLOT.bottom} />
      <circle className="working-point" cx={x(context.q)} cy={y(context.h)} r="7" />
      <text className="axis-label" x="12" y="24">H, м</text><text className="axis-label" x={WIDTH - 75} y={HEIGHT - 5}>Q, м³/ч</text>
      <g className="point-tooltip" transform={`translate(${Math.min(x(context.q) + 15, WIDTH - 175)} ${Math.max(y(context.h) - 56, 75)})`}><rect width="150" height="72" rx="8" /><text x="12" y="20">Рабочая точка</text><text x="12" y="40">Q {context.q.toFixed(1)} м³/ч</text><text x="12" y="59">H {context.h.toFixed(1)} м</text></g>
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
