"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from './ToastContainer';

export type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: number;
  type: ToastType;
  message: string;
  ttl?: number;
};

type ToastContextValue = {
  addToast: (type: ToastType, message: string, ttl?: number) => number;
  removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((s) => s.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, ttl = 4000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const toast: Toast = { id, type, message, ttl };
    setToasts((s) => [toast, ...s]);

    if (ttl > 0) {
      setTimeout(() => removeToast(id), ttl);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};