// ============================================================
// BudgetCard.jsx — Budget setting + progress + warnings
// ============================================================
import { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Zap } from 'lucide-react';
import { totalSpent, remaining, usagePct, formatINR } from '../utils/calculations.js';

export default function BudgetCard({ filteredTxns, budget, onSave, currency = '₹' }) {
  const [input, setInput] = useState(String(budget || ''));
  const spent = totalSpent(filteredTxns);
  const rem   = remaining(budget, spent);
  const pct   = usagePct(budget, spent);

  function handleSave() {
    const val = parseFloat(input);
    if (!val || val <= 0) return;
    onSave(val);
  }

  const barColor = pct >= 100 ? '#ef4444' : pct >= 90 ? '#f59e0b' : pct >= 70 ? '#f97316' : '#22c55e';

  let alertStyle = { background: 'var(--success-light)', color: 'var(--success)' };
  let alertIcon  = <CheckCircle2 size={14} style={{ flexShrink: 0 }}/>;
  let alertText  = "You're within your budget. Keep it up!";
  if (!budget) {
    alertStyle = { background: 'var(--surface2)', color: 'var(--text2)' };
    alertIcon  = null;
    alertText  = 'Set a monthly budget above to get started.';
  } else if (pct > 100) {
    alertStyle = { background: 'var(--danger-light)', color: 'var(--danger)' };
    alertIcon  = <AlertOctagon size={14} style={{ flexShrink: 0 }}/>;
    alertText  = 'You have exceeded your monthly budget!';
  } else if (pct >= 90) {
    alertStyle = { background: 'var(--danger-light)', color: 'var(--danger)' };
    alertIcon  = <AlertTriangle size={14} style={{ flexShrink: 0 }}/>;
    alertText  = 'You are close to reaching your budget.';
  } else if (pct >= 70) {
    alertStyle = { background: 'var(--warning-light)', color: 'var(--warning)' };
    alertIcon  = <Zap size={14} style={{ flexShrink: 0 }}/>;
    alertText  = "You're approaching your monthly budget.";
  }

  return (
    <div>
      <div className="section-header"><h2>Budget Management</h2></div>
      <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Set Monthly Budget</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0, flex: 1 }}>
              <label className="form-label">Monthly Limit ({currency})</label>
              <input
                className="form-control"
                type="number"
                min="1"
                placeholder="e.g. 10000"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Budget Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Row label="Monthly Budget" value={budget ? formatINR(budget, currency) : '—'}/>
            <Row label="Spent So Far" value={formatINR(spent, currency)} valueStyle={{ color: 'var(--danger)' }}/>
            <Row label="Remaining" value={budget ? formatINR(rem, currency) : '—'} valueStyle={{ color: rem < 0 ? 'var(--danger)' : 'var(--success)' }}/>
            <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }}/>
            <div style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span>Used</span><span>{budget ? pct + '%' : '—'}</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: budget ? Math.min(pct, 100) + '%' : '0%', background: barColor }}/>
            </div>
            <div className="budget-alert" style={{ ...alertStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
              {alertIcon}{alertText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueStyle = {} }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <span style={{ color: 'var(--text2)' }}>{label}</span>
      <span style={{ fontWeight: 600, ...valueStyle }}>{value}</span>
    </div>
  );
}
