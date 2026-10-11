// ============================================================
// Topbar.jsx — Top header with month selector and theme toggle
// ============================================================
import { useMemo } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';

export default function Topbar({ transactions, selectedMonth, onMonthChange, theme, onThemeToggle }) {
  // Build month options from transactions + last 12 months
  const monthOptions = useMemo(() => {
    const set = new Set();
    transactions.forEach(t => { if (t.date) set.add(t.date.slice(0, 7)); });
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return [...set].sort().reverse();
  }, [transactions]);

  function label(m) {
    const [y, mo] = m.split('-');
    return new Date(parseInt(y), parseInt(mo) - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-backdrop').classList.toggle('show');
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={toggleSidebar}>
          <Menu size={18}/>
        </button>
      </div>
      <div className="topbar-right">
        <select className="form-control" value={selectedMonth} onChange={e => onMonthChange(e.target.value)} style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }}>
          {monthOptions.map(m => <option key={m} value={m}>{label(m)}</option>)}
        </select>
        <button className="icon-btn" onClick={onThemeToggle} title="Toggle theme">
          {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
        </button>
      </div>
    </header>
  );
}
