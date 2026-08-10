import { Pencil, SlidersHorizontal } from 'lucide-react';
import type { DutyPoint } from '../domain/types';

export function ContextBar({ context, onEdit }: { context: DutyPoint; onEdit: () => void }) {
  return (
    <div className="context-bar">
      <SlidersHorizontal size={17} aria-hidden="true" />
      <strong>Рабочая точка из подборщика</strong>
      <span>Q <b>{context.q.toFixed(1)} м³/ч</b></span>
      <span>H <b>{context.h.toFixed(1)} м</b></span>
      <button type="button" onClick={onEdit}>Изменить <Pencil size={15} /></button>
    </div>
  );
}
