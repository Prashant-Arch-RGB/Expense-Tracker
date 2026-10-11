// ============================================================
// Analytics.jsx — Charts + Monthly Comparison (combined)
// ============================================================
import { useState, useMemo } from 'react';
import { useChartTheme } from '../hooks/useChartTheme.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler,
} from 'chart.js';
import {
  byCategory, byPaymentMethod, dailyTotals,
  monthlyTotals, formatINR, CAT_COLORS, PAY_COLORS,
} from '../utils/calculations.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);


// ── shared sub-components ────────────────────────────────────
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

function ChartCard({ title, children, style = {} }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <div className="card" style={style}>
        <div className="chart-card-header">
          <span className="chart-card-header-title">{title}</span>
          <button className="chart-expand-btn" onClick={() => setExpanded(true)} title="Expand">
            <ExpandIcon />
          </button>
        </div>
        <div style={{ height: 260 }}>{children}</div>
      </div>
      {expanded && <ChartModal title={title} onClose={() => setExpanded(false)}>{children}</ChartModal>}
    </>
  );
}

function EmptyChart() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 13 }}>
      No data for this period
    </div>
  );
}

// ── Analytics tab ────────────────────────────────────────────
function AnalyticsTab({ filteredTxns, currency }) {
  const catData  = byCategory(filteredTxns);
  const payData  = byPaymentMethod(filteredTxns);
  const daily    = dailyTotals(filteredTxns);

  const catLabels = Object.keys(catData);
  const catValues = Object.values(catData);
  const payLabels = Object.keys(payData);
  const payValues = Object.values(payData);

  const pieChartData = useMemo(() => ({
    labels: catLabels,
    datasets: [{
      data: catValues,
      backgroundColor: catLabels.map(l => CAT_COLORS[l] || '#94a3b8'),
      borderWidth: 0,
    }],
  }), [catLabels, catValues]);

  const barChartData = useMemo(() => ({
    labels: catLabels,
    datasets: [{
      label: 'Spending',
      data: catValues,
      backgroundColor: catLabels.map(l => CAT_COLORS[l] || '#6366f1'),
      borderRadius: 6,
    }],
  }), [catLabels, catValues]);

  const lineChartData = useMemo(() => ({
    labels: daily.map(d => { try { return new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); } catch { return d.date; } }),
    datasets: [{
      label: 'Daily Spending',
      data: daily.map(d => d.amount),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.08)',
      borderWidth: 2.5, pointRadius: 4, tension: 0.4, fill: true,
    }],
  }), [daily]);

  const payChartData = useMemo(() => ({
    labels: payLabels,
    datasets: [{
      label: 'Amount',
      data: payValues,
      backgroundColor: payLabels.map(l => PAY_COLORS[l] || '#94a3b8'),
      borderRadius: 6,
    }],
  }), [payLabels, payValues]);

  const noData    = catLabels.length === 0;
  const { tickColor, gridColor } = useChartTheme();
  const tickStyle = { color: tickColor, callback: v => currency + Number(v).toLocaleString('en-IN'), font: { size: 11 } };
  const tooltipINR = { callbacks: { label: ctx => ` ${currency}${Number(ctx.parsed.y ?? ctx.parsed.x ?? ctx.parsed).toLocaleString('en-IN')}` } };

  return (
    <>
      <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <ChartCard title="Category Spending (Pie)">
          {noData ? <EmptyChart /> : (
            <Doughnut data={pieChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: tickColor, font: { size: 11 }, padding: 10 } }, tooltip: { callbacks: { label: ctx => { const total = ctx.dataset.data.reduce((a, b) => a + b, 0); const p = total ? ((ctx.parsed / total) * 100).toFixed(1) : 0; return ` ${ctx.label}: ${currency}${ctx.parsed.toLocaleString('en-IN')} (${p}%)`; } } } } }} />
          )}
        </ChartCard>

        <ChartCard title="Category Comparison (Bar)">
          {noData ? <EmptyChart /> : (
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false }, tooltip: tooltipINR }, scales: { x: { ticks: { ...tickStyle, callback: v => currency + v.toLocaleString('en-IN') }, grid: { color: gridColor } }, y: { ticks: { color: tickColor, font: { size: 11 } }, grid: { display: false } } } }} />
          )}
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ChartCard title="Daily Spending Trend (Line)">
          {daily.length === 0 ? <EmptyChart /> : (
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipINR }, scales: { x: { ticks: { color: tickColor, font: { size: 11 }, maxRotation: 45 }, grid: { color: gridColor } }, y: { ticks: tickStyle, grid: { color: gridColor } } } }} />
          )}
        </ChartCard>

        <ChartCard title="Payment Method Breakdown">
          {payLabels.length === 0 ? <EmptyChart /> : (
            <Bar data={payChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipINR }, scales: { x: { ticks: { color: tickColor, font: { size: 11 } }, grid: { display: false } }, y: { ticks: tickStyle, grid: { color: gridColor } } } }} />
          )}
        </ChartCard>
      </div>
    </>
  );
}

// ── Monthly Comparison tab ────────────────────────────────────
function monthName(yearMonth) {
  const [y, m] = yearMonth.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function monthShort(yearMonth) {
  const [y, m] = yearMonth.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

function MonthlyTab({ transactions, currency }) {
  const [expanded, setExpanded] = useState(false);
  const { tickColor, gridColor } = useChartTheme();
  const monthly = monthlyTotals(transactions);
  const months  = Object.keys(monthly).sort().slice(-6);
  const hasData = months.length > 0;

  const chartData = useMemo(() => ({
    labels: months.map(monthShort),
    datasets: [{
      label: 'Monthly Spending',
      data: months.map(m => monthly[m]),
      backgroundColor: '#6366f1',
      borderRadius: 6,
    }],
  }), [months, monthly]);

  const max = hasData ? Math.max(...months.map(m => monthly[m])) : 0;

  let compSummary = null;
  if (months.length >= 2) {
    const [m1, m2] = months.slice(-2);
    const diff = ((monthly[m2] - monthly[m1]) / monthly[m1]) * 100;
    const dir  = diff > 0 ? 'increased' : 'decreased';
    const col  = diff > 0 ? 'var(--danger)' : 'var(--success)';
    compSummary = (
      <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 13, marginTop: 12 }}>
        Spending <strong style={{ color: col }}>{dir} by {Math.abs(diff).toFixed(1)}%</strong> from {monthName(m1).split(' ')[0]} to {monthName(m2).split(' ')[0]}.
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        <h3>No data yet</h3>
        <p>Add some expenses across multiple months to see comparison.</p>
      </div>
    );
  }

  const barEl = <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${currency}${ctx.parsed.y.toLocaleString('en-IN')}` } } }, scales: { x: { ticks: { color: tickColor, font: { size: 12 } }, grid: { display: false } }, y: { ticks: { color: tickColor, callback: v => currency + v.toLocaleString('en-IN'), font: { size: 11 } }, grid: { color: gridColor } } } }} />;

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="chart-card-header">
          <span className="chart-card-header-title">Monthly Spending</span>
          <button className="chart-expand-btn" onClick={() => setExpanded(true)} title="Expand"><ExpandIcon /></button>
        </div>
        <div style={{ height: 300 }}>{barEl}</div>
      </div>
      {expanded && <ChartModal title="Monthly Spending" onClose={() => setExpanded(false)}><div style={{ height: '100%' }}>{barEl}</div></ChartModal>}

      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Monthly Summary</div>
        {months.slice().reverse().map((m, i, arr) => {
          const pct   = max ? Math.round((monthly[m] / max) * 100) : 0;
          const prevM = arr[i + 1];
          let changeEl = null;
          if (prevM) {
            const d   = ((monthly[m] - monthly[prevM]) / monthly[prevM]) * 100;
            const col = d > 0 ? 'var(--danger)' : 'var(--success)';
            changeEl = <span style={{ fontSize: 12, color: col }}>{d > 0 ? '↑' : '↓'} {Math.abs(d).toFixed(1)}%</span>;
          }
          return (
            <div key={m} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>
                <span>{monthName(m)}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatINR(monthly[m], currency)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="progress" style={{ flex: 1 }}>
                  <div className="progress-bar" style={{ width: pct + '%', background: 'var(--primary)' }} />
                </div>
                {changeEl}
              </div>
            </div>
          );
        })}
        {compSummary}
      </div>
    </>
  );
}

// ── Root export ───────────────────────────────────────────────
export default function Analytics({ filteredTxns, transactions, currency = '₹' }) {
  const [tab, setTab] = useState('analytics');

  return (
    <div>
      <div className="section-header">
        <h2>Analytics</h2>
        <div className="cal-view-toggle">
          <button
            className={`cal-view-btn${tab === 'analytics' ? ' active' : ''}`}
            onClick={() => setTab('analytics')}
          >
            Charts
          </button>
          <button
            className={`cal-view-btn${tab === 'monthly' ? ' active' : ''}`}
            onClick={() => setTab('monthly')}
          >
            Monthly Compare
          </button>
        </div>
      </div>

      {tab === 'analytics'
        ? <AnalyticsTab filteredTxns={filteredTxns} currency={currency} />
        : <MonthlyTab transactions={transactions} currency={currency} />
      }
    </div>
  );
}
