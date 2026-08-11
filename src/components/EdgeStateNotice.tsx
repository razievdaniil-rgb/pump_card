import { AlertTriangle, DatabaseZap, FileQuestion } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { EdgeState } from '../domain/types';

const edgeContent: Record<Exclude<EdgeState, null>, [LucideIcon, string, string]> = {
  'no-context': [FileQuestion, 'Рабочая точка не задана', 'Укажите Q и H, чтобы получить инженерный вердикт.'],
  'no-curve': [FileQuestion, 'Q-H кривая недоступна', 'Вердикт сформирован по характеристикам, график появится после загрузки данных.'],
  'insufficient-data': [AlertTriangle, 'Недостаточно данных', 'Проверьте параметры среды и присоединения.'],
  'api-error': [DatabaseZap, 'Не удалось загрузить инженерные данные', 'Повторите запрос или вернитесь в подборщик.'],
};

export function EdgeStateNotice({ state, onRetry }: { state: EdgeState; onRetry?: () => void }) {
  if (!state) return null;
  const [Icon, title, description] = edgeContent[state];
  return <section className="edge-notice"><Icon size={22} /><div><b>{title}</b><p>{description}</p></div><button type="button" onClick={onRetry}>Повторить</button></section>;
}
