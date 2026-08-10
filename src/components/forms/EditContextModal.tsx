import { useState } from 'react';
import type { DutyPoint } from '../../domain/types';
import { Modal } from '../ui/Modal';

export function EditContextModal({ open, context, onClose, onSave }: { open: boolean; context: DutyPoint; onClose: () => void; onSave: (context: DutyPoint) => void }) {
  const [q, setQ] = useState(context.q);
  const [h, setH] = useState(context.h);
  return <Modal open={open} title="Изменить рабочую точку" onClose={onClose} footer={<><button className="button button--outline" onClick={onClose}>Отмена</button><button className="button button--dark" onClick={() => onSave({ ...context, q, h, source: 'manual' })}>Применить</button></>}><p className="modal-copy">Изменение создаёт локальный сценарий карточки. Исходная точка из подборщика останется доступна при возврате.</p><div className="field-row"><label className="field">Расход Q, м³/ч<input type="number" min="0" step="0.1" value={q} onChange={(event) => setQ(Number(event.target.value))} /></label><label className="field">Напор H, м<input type="number" min="0" step="0.1" value={h} onChange={(event) => setH(Number(event.target.value))} /></label></div></Modal>;
}
