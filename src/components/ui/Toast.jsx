/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: { bg: '#F0FDF4', border: '#86EFAC', text: '#15803D', icon: '#22C55E' },
  error: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', icon: '#EF4444' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', icon: '#F59E0B' },
  info: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', icon: '#3B82F6' },
};

// Global counter for toast IDs
let toastIdCounter = 0;

// Create Toast Context
const ToastContext = createContext(null);

/**
 * Toast Provider to wrap the root application
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to use toast notifications from any component
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Toast notification component
 */
const Toast = ({ message, type = 'info', duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const IconComponent = ICONS[type] || Info;
  const colors = COLORS[type] || COLORS.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`toast ${isVisible ? 'toast--visible' : 'toast--hidden'}`}
      style={{
        backgroundColor: colors.bg,
        border: `1.5px solid ${colors.border}`,
      }}
    >
      <IconComponent size={18} color={colors.icon} aria-hidden="true" style={{ flexShrink: 0 }} />
      <p className="toast__message" style={{ color: colors.text }}>{message}</p>
      <button
        className="toast__close"
        onClick={() => { setIsVisible(false); setTimeout(() => onClose?.(), 300); }}
        aria-label="Tutup notifikasi"
        style={{ color: colors.text }}
      >
        <X size={14} />
      </button>

      <style>{`
        .toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          max-width: 340px;
          width: 100%;
          transition: all 0.3s ease;
        }
        .toast--visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          animation: toastIn 0.3s ease forwards;
        }
        .toast--hidden {
          opacity: 0;
          transform: translateY(-12px) scale(0.96);
        }
        .toast__message {
          flex: 1;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
          line-height: 1.4;
          color: inherit;
        }
        .toast__close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          opacity: 0.7;
          transition: opacity var(--transition-fast);
          flex-shrink: 0;
        }
        .toast__close:hover { opacity: 1; }
      `}</style>
    </div>
  );
};

/**
 * Toast container that renders at the top of the screen
 */
export const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div
      className="toast-container"
      aria-label="Notifikasi"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
        }
        .toast-container > * {
          pointer-events: all;
        }
      `}</style>
    </div>
  );
};

export default Toast;
