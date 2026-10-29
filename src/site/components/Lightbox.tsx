// Full-screen photo viewer with keyboard support (←/→/Esc).

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface LightboxItem {
  image: string;
  title: string;
  caption?: string;
}

export function Lightbox({ items, index, onIndex, onClose }: { items: LightboxItem[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const item = items[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, items.length, onClose, onIndex]);

  return createPortal(
    <div className="s-lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={item.image} alt={item.title} />
        <figcaption>
          <strong>{item.title}</strong>
          {item.caption && <span>{item.caption}</span>}
          <span className="s-lightbox-count">
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>
      <button type="button" className="s-lightbox-btn close" onClick={onClose} aria-label="Close" autoFocus>
        <X size={22} />
      </button>
      <button type="button" className="s-lightbox-btn prev" onClick={(e) => (e.stopPropagation(), onIndex((index - 1 + items.length) % items.length))} aria-label="Previous photo">
        <ChevronLeft size={26} />
      </button>
      <button type="button" className="s-lightbox-btn next" onClick={(e) => (e.stopPropagation(), onIndex((index + 1) % items.length))} aria-label="Next photo">
        <ChevronRight size={26} />
      </button>
    </div>,
    document.body,
  );
}
