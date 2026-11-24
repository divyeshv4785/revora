'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-cardHover border bg-white animate-slide-up transition-all ${
              toast.type === 'success'
                ? 'border-emerald-200 text-emerald-950'
                : toast.type === 'warning'
                ? 'border-amber-200 text-amber-950'
                : 'border-revora-steel/20 text-revora-textPrimary'
            }`}
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-revora-success shrink-0 mt-0.5" />
            )}
            {toast.type === 'warning' && (
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-revora-sky shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs">
              <p className="font-semibold text-revora-textPrimary">{toast.title}</p>
              {toast.message && <p className="text-revora-textSecondary mt-0.5">{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
