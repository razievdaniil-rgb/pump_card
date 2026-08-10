import { useState, type FormEvent } from 'react';
import type { QuotePayload, SpecificationItem } from '../../domain/types';
import { Modal } from '../ui/Modal';

const errorStyle = { padding: '10px 12px', border: '1px solid #efc7c3', borderRadius: 8, background: '#fdecea', color: '#d23b30', fontSize: 12 };

export function QuoteModal({ open, items, onClose, onSubmit }: { open: boolean; items: SpecificationItem[]; onClose: () => void; onSubmit?: (payload: QuotePayload) => Promise<void> | void }) {
  const [company, setCompany] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const close = () => { setSent(false); setError(''); setSubmitting(false); onClose(); };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setError('');
    if (!onSubmit) {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      setSubmitting(false);
      setSent(true);
      return;
    }
    try {
      await onSubmit({ name: String(data.get('name')), phone: String(data.get('phone')), email: String(data.get('email') || ''), company, inn: String(data.get('inn') || ''), comment: String(data.get('comment') || ''), items });
      setSent(true);
    } catch {
      setError('Не удалось отправить заявку. Проверьте соединение и повторите попытку.');
    } finally {
      setSubmitting(false);
    }
  };
  return <Modal open={open} title="Получить коммерческое предложение" onClose={close}>{sent ? <div className="success-state"><span>✓</span><h3>Заявка принята</h3><p>{onSubmit ? 'Менеджер свяжется с вами и получит спецификацию вместе с Context каждой позиции.' : 'Демо-отправка выполнена. После подключения Bitrix API здесь будет создана реальная заявка.'}</p><button className="button button--dark" onClick={close}>Готово</button></div> : <form className="quote-form" onSubmit={submit}><div className="field-row"><label className="field">Имя*<input name="name" required autoComplete="name" /></label><label className="field">Телефон*<input name="phone" required type="tel" autoComplete="tel" /></label></div><div className="field-row"><label className="field">Email<input name="email" type="email" autoComplete="email" /></label><label className="field">Компания<input name="company" value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" /></label></div>{company.trim() && <label className="field">ИНН<input name="inn" inputMode="numeric" /></label>}<label className="field">Комментарий<textarea name="comment" rows={3} /></label><p className="form-note">К заявке будет приложено позиций: {items.length}</p>{error && <div style={errorStyle} role="alert">{error}</div>}<button className="button button--dark" type="submit" disabled={submitting}>{submitting ? 'Отправляем…' : 'Отправить заявку'}</button></form>}</Modal>;
}
