import { Check, ShieldCheck, TriangleAlert } from 'lucide-react';
import type { Verdict } from '../domain/types';

export function VerdictPanel({ verdict }: { verdict: Verdict }) {
  const tone = verdict.level === 'A' ? 'success' : verdict.level === 'B' ? 'warning' : 'danger';
  return (
    <section className={`verdict-panel verdict-panel--${tone}`} aria-labelledby="verdict-title">
      <div className="verdict-main">
        <div className="verdict-heading" id="verdict-title"><span className="verdict-check"><Check size={19} /></span>{verdict.label}</div>
        <div className="verdict-stars" aria-label="Пять звёзд">★★★★★</div>
        <div className="match-score"><span>Match Score</span><b>{verdict.score}%</b><i>Класс {verdict.level}</i></div>
      </div>
      <div className="verdict-reasons">
        <h3><Check size={16} />Почему рекомендуем</h3>
        <ul>{verdict.reasons.map((reason) => <li key={reason}><span><Check size={11} /></span>{reason}</li>)}</ul>
      </div>
      <div className="verdict-risks">
        {verdict.risks.length ? <><h3><TriangleAlert size={16} />Ограничения и риски</h3><ul>{verdict.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></> : <div className="risk-clear"><ShieldCheck size={20} /><div><b>Критических проблем не выявлено</b><small>Все ограничения соблюдены</small></div></div>}
      </div>
    </section>
  );
}
