// ============================================================
// Navbar.jsx — Sidebar navigation
// ============================================================

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',         icon: 'grid' },
  { id: 'add-expense', label: 'Add Expense',        icon: 'plus-circle' },
  { id: 'transactions',label: 'Transactions',       icon: 'list' },
  { id: 'budget',      label: 'Budget',             icon: 'clock' },
  { id: 'analytics',   label: 'Analytics',          icon: 'activity' },
  { id: 'calendar',    label: 'Calendar',           icon: 'calendar' },
  { id: 'settings',    label: 'Settings',           icon: 'settings' },
];

const ICONS = {
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  'plus-circle': <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>,
  list: <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></>,
  clock: <><path d="M12 2a10 10 0 110 20A10 10 0 0112 2z"/><path d="M12 6v6l4 2"/></>,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
  'bar-chart': <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
};

function Icon({ name }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {ICONS[name]}
    </svg>
  );
}

export default function Navbar({ page, onNavigate }) {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <h1><span>💰</span> ExpenseTrack</h1>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`nav-item${page === item.id ? ' active' : ''}`}
            onClick={() => {
              onNavigate(item.id);
              document.getElementById('sidebar').classList.remove('open');
              document.getElementById('sidebar-backdrop').classList.remove('show');
            }}
          >
            <Icon name={item.icon}/> {item.label}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Personal Expense Tracker v1.0<br/>Data stored locally</div>
      </div>
    </aside>
  );
}
