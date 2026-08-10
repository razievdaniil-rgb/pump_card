import { useState } from 'react';
import type { DutyPoint, PumpProduct } from '../../domain/types';
import { useSpecificationStore } from '../../store/specificationStore';
import { Modal } from '../ui/Modal';

export function AddSpecificationModal({ open, product, context, onClose }: { open: boolean; product: PumpProduct; context: DutyPoint; onClose: () => void }) {
  const add = useSpecificationStore((state) => state.add);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const submit = () => { add(product, context, quantity, comment.trim()); onClose(); setQuantity(1); setComment(''); };
  return <Modal open={open} title="Добавить в спецификацию" onClose={onClose} footer={<><button className="button button--outline" onClick={onClose}>Отмена</button><button className="button button--dark" onClick={submit}>Добавить</button></>}><div className="modal-product"><img src={product.image} alt="" /><div><b>{product.name}</b><span>{product.sku}</span><small>Q {context.q.toFixed(1)} м³/ч · H {context.h.toFixed(1)} м</small></div></div><label className="field">Количество<input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} /></label><label className="field">Комментарий<textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Например: насос для контура отопления" /></label></Modal>;
}
