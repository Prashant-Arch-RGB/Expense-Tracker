// ============================================================
// Calendar.jsx — Daily & Monthly spend calendar + Period Calculator
// ============================================================
import { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, Calculator } from 'lucide-react';
import { formatINR, totalSpent } from '../utils/calculations.js';

// ── helpers ──────────────────────────────────────────────────
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sun
}
function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function isoMonth(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// Intensity colour based on spend relative to max day in that month
function dayBg(amount, maxAmount) {
  if (!amount || !maxAmount) return '';
  const ratio = amount / maxAmount;
  if (ratio > 0.75) return 'cal-high';
  if (ratio > 0.4)  return 'cal-med';
  return 'cal-low';
}

// ── Month View ────────────────────────────────────────────────
function MonthView({ year, month, dailyMap, currency, onDayClick, selectedDay }) {
  const days  = getDaysInMonth(year, month);
  const start = getFirstDayOfWeek(year, month);
  const amounts = Object.values(dailyMap);
  const maxDay  = amounts.length ? Math.max(...amounts) : 0;

  const cells = [];
  // Leading empty cells
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  // Compute today's key once using local date parts (avoids UTC offset issues)
  const _now = new Date();
  const todayKey = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;

  return (
    <div className="cal-grid">
      {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
      {cells.map((day, idx) => {
        if (day === null) return <div key={`e-${idx}`} className="cal-cell cal-cell--empty" />;
        const key    = isoDate(year, month, day);
        const amount = dailyMap[key] || 0;
        const isToday = key === todayKey;
        const isSelected = key === selectedDay;
        return (
          <div
            key={key}
            className={`cal-cell ${dayBg(amount, maxDay)}${isToday ? ' cal-today' : ''}${isSelected ? ' cal-selected' : ''}`}
            onClick={() => onDayClick(key, amount)}
          >
            <span className="cal-day-num">{day}</span>
            {amount > 0
              ? <span className="cal-amount">{formatINR(amount, currency)}</span>
              : <span className="cal-zero">—</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── Year View ─────────────────────────────────────────────────
function YearView({ year, monthlyMap, currency, onMonthClick, selectedMonth }) {
  const amounts = Object.values(monthlyMap);
  const maxMonth = amounts.length ? Math.max(...amounts) : 0;

  return (
    <div className="cal-year-grid">
      {MONTHS.map((label, idx) => {
        const key    = isoMonth(year, idx);
        const amount = monthlyMap[key] || 0;
        const ratio  = maxMonth ? amount / maxMonth : 0;
        const isSelected = key === selectedMonth;
        return (
          <div
            key={key}
            className={`cal-month-cell ${ratio > 0.75 ? 'cal-high' : ratio > 0.4 ? 'cal-med' : ratio > 0 ? 'cal-low' : ''}${isSelected ? ' cal-selected' : ''}`}
            onClick={() => onMonthClick(key, amount)}
          >
            <span className="cal-month-label">{label}</span>
            <span className="cal-month-amount">{amount > 0 ? formatINR(amount, currency) : '—'}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Period Calculator ─────────────────────────────────────────
function PeriodCalculator({ transactions, currency }) {
  const [from, setFrom] = useState('');
  const [to,   setTo]   = useState('');
  const [result, setResult] = useState(null);

  function calculate() {
    if (!from || !to) return;
    const start = from <= to ? from : to;
    const end   = from <= to ? to   : from;

    const filtered = transactions.filter(t => t.date && t.date >= start && t.date <= end);
    const total    = totalSpent(filtered);
    const days     = Math.round((new Date(end) - new Date(start)) / 86400000) + 1;

    // breakdown by category
    const byCat = filtered.reduce((acc, t) => {
      const cat = t.category || 'Other';
      acc[cat] = (acc[cat] || 0) + (parseFloat(t.amount) || 0);
      return acc;
    }, {});

    setResult({ total, days, count: filtered.length, start, end, byCat });
  }

  function clear() {
    setFrom(''); setTo(''); setResult(null);
  }

  return (
    <div className="card period-calc">
      <h3 className="period-calc-title">
        <Calculator size={16}/>
        Period Calculator
      </h3>
      <p className="period-calc-desc">Calculate total spend between any two dates</p>
      <div className="period-calc-row">
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label className="form-label">From</label>
          <input type="date" className="form-control" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label className="form-label">To</label>
          <input type="date" className="form-control" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <button className="btn btn-primary" onClick={calculate} disabled={!from || !to}>Calculate</button>
          {result && <button className="btn btn-ghost btn-sm" onClick={clear}>Clear</button>}
        </div>
      </div>

      {result && (
        <div className="period-result">
          <div className="period-result-summary">
            <div className="period-result-total">
              <span className="period-result-label">Total Spent</span>
              <span className="period-result-value">{formatINR(result.total, currency)}</span>
            </div>
            <div className="period-result-meta">
              <span>{result.days} day{result.days !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span>{result.count} transaction{result.count !== 1 ? 's' : ''}</span>
              <span>·</span>
              <span>Avg {formatINR(result.days ? result.total / result.days : 0, currency)}/day</span>
            </div>
          </div>
          {Object.keys(result.byCat).length > 0 && (
            <div className="period-cat-list">
              {Object.entries(result.byCat)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => (
                  <div key={cat} className="period-cat-row">
                    <span className="period-cat-name">{cat}</span>
                    <div className="period-cat-bar-wrap">
                      <div
                        className="period-cat-bar"
                        style={{ width: `${Math.round((amt / result.total) * 100)}%` }}
                      />
                    </div>
                    <span className="period-cat-amt">{formatINR(amt, currency)}</span>
                    <span className="period-cat-pct">{Math.round((amt / result.total) * 100)}%</span>
                  </div>
                ))}
            </div>
          )}
          {result.count === 0 && (
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
              No transactions found in this period.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Detail Panel (day/month clicked) ─────────────────────────
function DetailPanel({ label, transactions, currency, onClose }) {
  if (!transactions || transactions.length === 0) return null;
  return (
    <div className="cal-detail card">
      <div className="cal-detail-header">
        <span className="cal-detail-label">{label}</span>
        <button className="icon-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div className="cal-detail-total">{formatINR(totalSpent(transactions), currency)}</div>
      <div className="cal-detail-list">
        {transactions.map(t => (
          <div key={t.id} className="cal-detail-item">
            <span className="cal-detail-desc">{t.description || t.category}</span>
            <span className="cal-detail-amount">{formatINR(parseFloat(t.amount), currency)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Calendar Component ───────────────────────────────────
export default function Calendar({ transactions, currency }) {
  const getToday = () => new Date();
  const [view, setView]     = useState('month'); // 'month' | 'year'
  const [year, setYear]     = useState(() => getToday().getFullYear());
  const [month, setMonth]   = useState(() => getToday().getMonth());

  // Re-sync year/month to today if the date changes while app is open
  useEffect(() => {
    const tick = () => {
      const now = getToday();
      setYear(now.getFullYear());
      setMonth(now.getMonth());
    };
    // Check every minute
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  const [selected, setSelected] = useState(null); // { key, txns, label }

  // Build daily map for current month
  const dailyMap = useMemo(() => {
    const prefix = isoMonth(year, month);
    return transactions.reduce((acc, t) => {
      if (t.date && t.date.startsWith(prefix)) {
        acc[t.date] = (acc[t.date] || 0) + (parseFloat(t.amount) || 0);
      }
      return acc;
    }, {});
  }, [transactions, year, month]);

  // Build monthly map for current year
  const monthlyMap = useMemo(() => {
    const prefix = String(year);
    return transactions.reduce((acc, t) => {
      if (t.date && t.date.startsWith(prefix)) {
        const m = t.date.slice(0, 7);
        acc[m] = (acc[m] || 0) + (parseFloat(t.amount) || 0);
      }
      return acc;
    }, {});
  }, [transactions, year]);

  function handleDayClick(key, amount) {
    if (!amount) { setSelected(null); return; }
    const txns = transactions.filter(t => t.date === key);
    const d = new Date(key + 'T00:00:00');
    const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
    setSelected({ key, txns, label });
  }

  function handleMonthClick(key, amount) {
    if (!amount) { setSelected(null); return; }
    const txns = transactions.filter(t => t.date && t.date.startsWith(key));
    const [y, m] = key.split('-');
    const label = `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
    setSelected({ key, txns, label });
  }

  function prevPeriod() {
    if (view === 'month') {
      if (month === 0) { setMonth(11); setYear(y => y - 1); }
      else setMonth(m => m - 1);
    } else {
      setYear(y => y - 1);
    }
    setSelected(null);
  }

  function nextPeriod() {
    if (view === 'month') {
      if (month === 11) { setMonth(0); setYear(y => y + 1); }
      else setMonth(m => m + 1);
    } else {
      setYear(y => y + 1);
    }
    setSelected(null);
  }

  const periodTitle = view === 'month'
    ? `${MONTH_NAMES[month]} ${year}`
    : String(year);

  const totalThisPeriod = view === 'month'
    ? Object.values(dailyMap).reduce((s, v) => s + v, 0)
    : Object.values(monthlyMap).reduce((s, v) => s + v, 0);

  return (
    <div className="calendar-page">
      <div className="section-header">
        <h2><CalendarIcon size={20} style={{ verticalAlign: 'middle', marginRight: 6 }}/>Calendar</h2>
      </div>

      <div className="cal-main-area">
        {/* Calendar card */}
        <div className="card cal-card">
          {/* Header row */}
          <div className="cal-header">
            <div className="cal-view-toggle">
              <button
                className={`cal-view-btn${view === 'month' ? ' active' : ''}`}
                onClick={() => { setView('month'); setSelected(null); }}
              >Month</button>
              <button
                className={`cal-view-btn${view === 'year' ? ' active' : ''}`}
                onClick={() => { setView('year'); setSelected(null); }}
              >Year</button>
            </div>
            <div className="cal-nav">
              <button className="icon-btn" onClick={prevPeriod}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <span className="cal-period-title">{periodTitle}</span>
              <button className="icon-btn" onClick={nextPeriod}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
            <div className="cal-period-total">
              <span className="cal-period-total-label">Total</span>
              <span className="cal-period-total-value">{formatINR(totalThisPeriod, currency)}</span>
            </div>
          </div>

          {/* Grid */}
          {view === 'month'
            ? <MonthView
                year={year} month={month}
                dailyMap={dailyMap} currency={currency}
                onDayClick={handleDayClick}
                selectedDay={selected?.key}
              />
            : <YearView
                year={year}
                monthlyMap={monthlyMap} currency={currency}
                onMonthClick={handleMonthClick}
                selectedMonth={selected?.key}
              />
          }

          {/* Legend */}
          <div className="cal-legend">
            <span className="cal-legend-label">Spend:</span>
            <span className="cal-legend-item cal-low">Low</span>
            <span className="cal-legend-item cal-med">Medium</span>
            <span className="cal-legend-item cal-high">High</span>
          </div>
        </div>

        {/* Side panel — detail */}
        {selected && (
          <DetailPanel
            label={selected.label}
            transactions={selected.txns}
            currency={currency}
            onClose={() => setSelected(null)}
          />
        )}
      </div>

      {/* Period Calculator */}
      <PeriodCalculator transactions={transactions} currency={currency} />
    </div>
  );
}
