"use client";
import React from 'react';
import '@/styles/toast.css';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  type: ToastType;
  message: string;
  ttl?: number;
};

export default function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: number) => void }) {
  return (
    <div className="toast-root" aria-live="polite" aria-atomic>
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <div className="toast-body">
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => onClose(t.id)} aria-label="Cerrar">×</button>
          </div>
        </div>
      ))}
    </div>
  );
}