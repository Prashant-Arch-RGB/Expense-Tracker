// ============================================================
// Toast.jsx — Notification toast component
// ============================================================
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

const CONFIG = {
  success: { icon: <CheckCircle size={16} color="#22c55e"/>, borderColor: '#22c55e' },
  error:   { icon: <AlertCircle  size={16} color="#ef4444"/>, borderColor: '#ef4444' },
  warning: { icon: <AlertTriangle size={16} color="#f59e0b"/>, borderColor: '#f59e0b' },
};

export default function Toast({ message, type = 'success', onClose }) {
  const { icon, borderColor } = CONFIG[type] || CONFIG.success;
  return (
    <div className={`toast ${type}`} style={{ borderLeftColor: borderColor }}>
      {icon}
      <span className="toast-text">{message}</span>
      <span className="toast-close" onClick={onClose}><X size={14}/></span>
    </div>
  );
}
