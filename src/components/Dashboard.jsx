// ============================================================
// Dashboard.jsx — Summary cards + mini charts + top expenses
// ============================================================
import { useMemo, useState } from 'react';
import { useChartTheme } from '../hooks/useChartTheme.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { TrendingDown, Wallet, Shield, BarChart3, Star, Hash } from 'lucide-react';
import { totalSpent, remaining, usagePct, byCategory, topCategory, topExpenses, dailyTotals, formatINR, formatDateDisplay, CAT_COLORS } from '../utils/calculations.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

function ExpandIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  );
}

function ChartModal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal modal-chart">
        <div className="modal-header">
          <h2 style={{ fontSize: 16 }}>{title}</h2>
          <button className="chart-expand-btn" onClick={onClose} title="Close" style={{ width: 30, height: 30 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="chart-expand-body">{children}</div>
      </div>
    </div>
  );
}

export default function Dashboard({ filteredTxns, budget, selectedMonth, onEdit, currency = '₹' }) {
  const { tickColor, gridColor } = useChartTheme();
  const [pieExpanded, setPieExpanded]   = useState(false);
  const [lineExpanded, setLineExpanded] = useState(false);
  const spent = totalSpent(filteredTxns);
  const rem   = remaining(budget, spent);
  const pct   = usagePct(budget, spent);
  const catMap = byCategory(filteredTxns);
  const { category: topCat, amount: topAmt } = topCategory(filteredTxns);
  const daily  = dailyTotals(filteredTxns);
  const top5   = topExpenses(filteredTxns, 5);

  const [y, mo] = selectedMonth.split('-');
  const monthLabel = new Date(parseInt(y), parseInt(mo) - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const progressColor = pct >= 100 ? '#ef4444' : pct >= 90 ? '#f59e0b' : '#6366f1';

  // Pie data
  const pieData = useMemo(() => ({
    labels: Object.keys(catMap),
    datasets: [{ data: Object.values(catMap), backgroundColor: Object.keys(catMap).map(k => CAT_COLORS[k] || '#94a3b8'), borderWidth: 0 }],
  }), [catMap]);

  // Line data
  const lineData = useMemo(() => ({
    labels: daily.map(d => { try { return new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short'}); } catch { return d.date; } }),
    datasets: [{
      label: 'Daily Spending', data: daily.map(d => d.amount),
      borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)',
      borderWidth: 2.5, pointRadius: 4, tension: 0.4, fill: true,
    }],
  }), [daily]);

  const chartOpts = (fmt = false) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    ...(fmt ? { scales: { x: { ticks: { color: tickColor, maxRotation: 45, font: { size: 11 } } }, y: { ticks: { color: tickColor, callback: v => currency + v.toLocaleString('en-IN'), font: { size: 11 } } } } } : {}),
  });

  return (
    <div>
      <div className="section-header">
        <h2>Dashboard</h2>
        <span style={{ fontSize: 13, color: 'var(--text2)' }}>{monthLabel}</span>
      </div>

      {/* Stat cards */}
      <div className="card-grid">
        <StatCard icon={<TrendingDown size={20}/>} label="Total Spent" value={formatINR(spent, currency)} sub={monthLabel}/>
        <StatCard icon={<Wallet size={20}/>} label="Monthly Budget" value={budget ? formatINR(budget, currency) : '—'} sub="Set in Budget section"/>
        <StatCard icon={<Shield size={20}/>} label="Remaining" value={budget ? formatINR(rem, currency) : '—'} valueColor={rem < 0 ? 'var(--danger)' : 'var(--success)'} sub="Budget remaining"/>
        <StatCard icon={<BarChart3 size={20}/>} label="Budget Used" value={budget ? pct + '%' : '—'}>
          <div className="progress" style={{ marginTop: 8 }}>
            <div className="progress-bar" style={{ width: Math.min(pct, 100) + '%', background: progressColor }}/>
          </div>
        </StatCard>
        <StatCard icon={<Star size={20}/>} label="Top Category" value={topCat || '—'} valueStyle={{ fontSize: 16 }} sub={topCat ? formatINR(topAmt, currency) : ''}/>
        <StatCard icon={<Hash size={20}/>} label="Transactions" value={filteredTxns.length} sub="This month"/>
      </div>

      {/* Charts */}
      <div className="dash-chart-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div className="chart-card-header">
            <span className="chart-card-header-title">Spending by Category</span>
            <button className="chart-expand-btn" onClick={() => setPieExpanded(true)} title="Expand"><ExpandIcon /></button>
          </div>
          {Object.keys(catMap).length > 0
            ? <div style={{ height: 220 }}><Doughnut data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: tickColor, font: { size: 11 }, padding: 10 } }, tooltip: { callbacks: { label: ctx => { const total = ctx.dataset.data.reduce((a,b)=>a+b,0); const pct = total ? ((ctx.parsed/total)*100).toFixed(1) : 0; return ` ${ctx.label}: ${currency}${ctx.parsed.toLocaleString('en-IN')} (${pct}%)`; } } } } }} /></div>
            : <EmptyChart/>}
        </div>
        <div className="card">
          <div className="chart-card-header">
            <span className="chart-card-header-title">Daily Spending Trend</span>
            <button className="chart-expand-btn" onClick={() => setLineExpanded(true)} title="Expand"><ExpandIcon /></button>
          </div>
          {daily.length > 0
            ? <div style={{ height: 220 }}><Line data={lineData} options={chartOpts(true)}/></div>
            : <EmptyChart/>}
        </div>
      </div>
      {pieExpanded  && <ChartModal title="Spending by Category"  onClose={() => setPieExpanded(false)}> <Doughnut data={pieData}  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: tickColor, font: { size: 12 }, padding: 14 } }, tooltip: { callbacks: { label: ctx => { const total = ctx.dataset.data.reduce((a,b)=>a+b,0); const pct = total ? ((ctx.parsed/total)*100).toFixed(1) : 0; return ` ${ctx.label}: ${currency}${ctx.parsed.toLocaleString('en-IN')} (${pct}%)`; } } } } }} /></ChartModal>}
      {lineExpanded && <ChartModal title="Daily Spending Trend"  onClose={() => setLineExpanded(false)}><Line   data={lineData} options={chartOpts(true)} /></ChartModal>}

      {/* Top 5 Expenses */}
      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Top 5 Expenses</div>
        {top5.length === 0
          ? <div className="empty-state" style={{ padding: 24 }}><p>No expenses this month.</p></div>
          : top5.map((t, i) => (
            <div key={t.id} className="top-expense-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="top-expense-rank">{i + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t.description}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{t.category} · {formatDateDisplay(t.date)}</div>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--danger)' }}>{formatINR(t.amount, currency)}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, valueColor, valueStyle = {}, sub, children }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: valueColor, ...valueStyle }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      {children}
    </div>
  );
}

function EmptyChart() {
  return <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 13 }}>No data for this period</div>;
}
