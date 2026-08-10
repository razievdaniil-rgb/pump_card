import { CircleCheck, CircleGauge, Droplets, Gauge, ScanLine, ShieldCheck, Thermometer, Zap } from 'lucide-react';
import { useState } from 'react';
import type { DiagnosticCheck } from '../domain/types';

const icons = [Droplets, CircleGauge, Gauge, Zap, ShieldCheck, Thermometer, ScanLine, CircleCheck];

export function DiagnosticsPanel({ checks }: { checks: DiagnosticCheck[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? checks : checks.slice(0, 5);
  const issues = checks.filter((check) => check.status !== 'ok');
  return <section className="engineering-card diagnostics-card"><header><h2>Диагностика</h2><button className="text-button" onClick={() => setExpanded((value) => !value)}>{expanded ? 'Свернуть' : 'Подробнее'}</button></header><div className="diagnostics-list">{visible.map((check, index) => { const Icon = icons[index]; return <div className="diagnostic-row" key={check.id} title={check.hint}><Icon size={18} /><span>{check.label}</span><strong className={`status-${check.status}`}>{check.value}</strong></div>; })}</div><div className={`diagnostic-banner ${issues.length ? 'diagnostic-banner--warning' : ''}`}>{issues.length ? `Требуют внимания: ${issues.length}` : <><CircleCheck size={17} />Критических проблем не выявлено</>}</div><button className="diagnostic-toggle" onClick={() => setExpanded((value) => !value)}>{expanded ? 'Скрыть дополнительные проверки' : 'Показать все 8 проверок →'}</button></section>;
}
