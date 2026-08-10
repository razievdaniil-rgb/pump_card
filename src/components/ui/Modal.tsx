import { X } from 'lucide-react';
import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
  size?: 'default' | 'wide';
  footer?: ReactNode;
}

export function Modal({ open, title, onClose, size = 'default', footer, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const listener = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', listener);
    document.body.classList.add('is-modal-open');
    return () => {
      document.removeEventListener('keydown', listener);
      document.body.classList.remove('is-modal-open');
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal ${size === 'wide' ? 'modal--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal__header"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Закрыть"><X size={20} /></button></header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </section>
    </div>
  );
}
