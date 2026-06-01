'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="w-full max-w-lg rounded-xl p-0 backdrop:bg-black/50 open:animate-in open:fade-in"
      onClose={onClose}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        {title && <h2 className="text-lg font-semibold text-navy">{title}</h2>}
        <button
          onClick={onClose}
          className="ml-auto p-1 text-gray-500 hover:text-gray-800 rounded"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  );
}
