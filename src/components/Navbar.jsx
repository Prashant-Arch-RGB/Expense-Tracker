// ============================================================
// Navbar.jsx — Sidebar navigation
// ============================================================
import { LayoutGrid, PlusCircle, ClipboardList, Clock, BarChart2, Calendar, Settings, Wallet } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutGrid },
  { id: 'add-expense',  label: 'Add Expense',  Icon: PlusCircle },
  { id: 'transactions', label: 'Transactions', Icon: ClipboardList },
  { id: 'budget',       label: 'Budget',       Icon: Clock },
  { id: 'analytics',   label: 'Analytics',    Icon: BarChart2 },
  { id: 'calendar',    label: 'Calendar',     Icon: Calendar },
  { id: 'settings',    label: 'Settings',     Icon: Settings },
];

export default function Navbar({ page, onNavigate }) {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <h1><Wallet size={20} style={{ verticalAlign: 'middle', marginRight: 6 }}/> ExpenseTrack</h1>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <div
            key={id}
            className={`nav-item${page === id ? ' active' : ''}`}
            onClick={() => {
              onNavigate(id);
              document.getElementById('sidebar').classList.remove('open');
              document.getElementById('sidebar-backdrop').classList.remove('show');
            }}
          >
            <Icon size={18}/> {label}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Personal Expense Tracker v1.0<br/>Data stored locally</div>
      </div>
    </aside>
  );
}
