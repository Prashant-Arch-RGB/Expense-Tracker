// ============================================================
// Settings.jsx — App settings page
// ============================================================
import { useRef, useState } from 'react';
import { Download, Upload, FlaskConical } from 'lucide-react';

const CURRENCIES = [
  { symbol: '₹', label: 'Indian Rupee (₹)' },
  { symbol: '$', label: 'US Dollar ($)' },
  { symbol: '€', label: 'Euro (€)' },
  { symbol: '£', label: 'British Pound (£)' },
  { symbol: '¥', label: 'Japanese Yen (¥)' },
];

const SYMBOL_TO_CODE = {
  '₹': 'INR', '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY',
};

// All known currency symbols (for stripping from amount strings)
const ALL_SYMBOLS = Object.keys(SYMBOL_TO_CODE);

export default function Settings({ theme, onThemeToggle, onImportCSV, onClearAll, onLoadSample, transactions, currency, onCurrencyChange }) {
  const fileInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [converting, setConverting] = useState(false);

  function exportCSV() {
    if (!transactions.length) return;
    // Embed the current currency symbol in the Amount column header so
    // any future import knows which currency the amounts are in.
    const header = `Date,Description,Category,Payment Method,Amount (${currency}),Notes`;
    const rows = transactions.map(t =>
      `${t.date},"${(t.description||'').replace(/"/g,'""')}","${t.category}","${t.paymentMethod}",${t.amount},"${(t.notes||'').replace(/"/g,'""')}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function handleClearAll() {
    if (window.confirm('⚠️ This will permanently delete ALL transactions and reset your budget. Are you sure?')) {
      onClearAll();
    }
  }

  function handleLoadSample() {
    if (window.confirm('This will clear all existing data and load 120 sample transactions across 12 months. Continue?')) {
      onLoadSample();
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be picked again
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) {
        alert('CSV appears empty or has no data rows.');
        return;
      }

      // ── Detect the currency embedded in the Amount column header ──
      // Supports both "Amount (₹)" (new format) and plain "Amount" (old format).
      const headerCols = parseCSVRow(lines[0]);
      const amountColHeader = (headerCols[4] || '').trim();
      const symbolMatch = amountColHeader.match(/\((.+)\)$/);
      const csvSymbol = symbolMatch ? symbolMatch[1].trim() : null; // e.g. "₹" or null

      if (!amountColHeader.toLowerCase().startsWith('amount')) {
        const expectedHeader = `Date,Description,Category,Payment Method,Amount (${currency}),Notes`;
        if (!window.confirm('CSV header does not match the expected format:\n' + expectedHeader + '\n\nTry importing anyway?')) return;
      }

      const parsed = [];
      const errors = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVRow(lines[i]);
        if (cols.length < 5) { errors.push(`Row ${i + 1}: too few columns`); continue; }
        const [date, description, category, paymentMethod, rawAmount, notes = ''] = cols;
        // Strip any currency symbol prefix from the amount value itself
        const cleanedAmount = rawAmount.trim().replace(new RegExp(`^[${ALL_SYMBOLS.join('')}]`), '');
        const amount = parseFloat(cleanedAmount);
        if (isNaN(amount) || amount < 0) { errors.push(`Row ${i + 1}: invalid amount "${rawAmount}"`); continue; }
        parsed.push({ date: date.trim(), description: description.trim(), category: category.trim(), paymentMethod: paymentMethod.trim(), amount, notes: notes.trim() });
      }

      if (errors.length) {
        console.warn('CSV import errors:', errors);
      }

      if (!parsed.length) {
        alert('No valid rows found in CSV.');
        return;
      }

      // ── Offer conversion if the CSV currency differs from the app currency ──
      let finalRows = parsed;
      if (csvSymbol && csvSymbol !== currency) {
        const fromCode = SYMBOL_TO_CODE[csvSymbol];
        const toCode   = SYMBOL_TO_CODE[currency];
        if (fromCode && toCode) {
          const doConvert = window.confirm(
            `The CSV was exported in ${csvSymbol} (${fromCode}), but your app is currently set to ${currency} (${toCode}).\n\n` +
            `• OK — fetch live rate and convert amounts to ${currency}\n` +
            `• Cancel — import amounts as-is (no conversion)`
          );
          if (doConvert) {
            setImporting(true);
            try {
              const rate = await fetchRateLocal(fromCode, toCode);
              finalRows = parsed.map(r => ({
                ...r,
                amount: parseFloat((r.amount * rate).toFixed(2)),
              }));
            } catch {
              alert(`Could not fetch live exchange rate. Amounts will be imported as-is.`);
            } finally {
              setImporting(false);
            }
          }
        }
      }

      const existing = transactions.length;
      const msg = existing > 0
        ? `Import ${finalRows.length} row(s) from CSV?\nThis will ADD to your existing ${existing} transaction(s).`
        : `Import ${finalRows.length} row(s) from CSV?`;

      if (!window.confirm(msg)) return;

      setImporting(true);
      onImportCSV(finalRows);
      setImporting(false);
    };
    reader.readAsText(file);
  }

  async function handleCurrencyChange(newSymbol) {
    if (newSymbol === currency) return;
    setConverting(true);
    try {
      await onCurrencyChange(newSymbol);
    } finally {
      setConverting(false);
    }
  }

  return (
    <div>
      <div className="section-header"><h2>Settings</h2></div>
      <div style={{ maxWidth: 520 }}>
        <div className="card">
          <SettingsRow label="Dark Mode" desc="Switch to dark colour scheme">
            <label className="toggle">
              <input type="checkbox" checked={theme === 'dark'} onChange={onThemeToggle}/>
              <span className="toggle-slider"/>
            </label>
          </SettingsRow>
          <SettingsRow
            label="Currency"
            desc={
              converting
                ? '⏳ Fetching live rate & converting transactions…'
                : `Currently using ${currency} — ${CURRENCIES.find(c => c.symbol === currency)?.label || currency}`
            }
          >
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: 170, fontSize: 13 }}
              value={currency}
              onChange={e => handleCurrencyChange(e.target.value)}
              disabled={converting}
            >
              {CURRENCIES.map(c => (
                <option key={c.symbol} value={c.symbol}>{c.label}</option>
              ))}
            </select>
          </SettingsRow>
          <SettingsRow label="Import CSV" desc="Import transactions from a CSV file (same format as Export)">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              <Upload size={13}/> Import
            </button>
          </SettingsRow>
          <SettingsRow label="Export Transactions" desc="Download all data as CSV">
            <button className="btn btn-outline btn-sm" onClick={exportCSV}><Download size={13}/> Export</button>
          </SettingsRow>
          <SettingsRow label="Load Sample Data" desc="Replace all data with 120 realistic demo transactions across 12 months">
            <button className="btn btn-outline btn-sm" onClick={handleLoadSample}>
              <FlaskConical size={13}/> Load Sample
            </button>
          </SettingsRow>
          <SettingsRow label="Clear All Data" desc="Delete all transactions and reset budget">
            <button className="btn btn-danger btn-sm" onClick={handleClearAll}>Clear All</button>
          </SettingsRow>
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8 }}>
            <strong>About ExpenseTrack</strong><br/>
            Personal Expense Tracker v1.0 — built for college students &amp; young adults.<br/>
            Data is stored locally in your browser's <code>localStorage</code>.<br/>
            <em>This is an educational project and not financial advice.</em>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsRow({ label, desc, children }) {
  return (
    <div className="settings-row">
      <div>
        <div className="settings-row-label">{label}</div>
        <div className="settings-row-desc">{desc}</div>
      </div>
      {children}
    </div>
  );
}

// Fetch live exchange rate using open.er-api.com (free, no key, CORS-enabled)
async function fetchRateLocal(fromCode, toCode) {
  const res = await fetch(`https://open.er-api.com/v6/latest/${fromCode}`);
  if (!res.ok) throw new Error(`Rate fetch failed: ${res.status}`);
  const data = await res.json();
  if (data.result !== 'success') throw new Error(`API error: ${data['error-type'] || 'unknown'}`);
  const rate = data.rates?.[toCode];
  if (!rate) throw new Error(`No rate for ${fromCode}→${toCode}`);
  return rate;
}

// Parse a single CSV row, respecting double-quoted fields
function parseCSVRow(line) {
  const result = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuote = false; }
      else { cur += ch; }
    } else {
      if (ch === '"') { inQuote = true; }
      else if (ch === ',') { result.push(cur); cur = ''; }
      else { cur += ch; }
    }
  }
  result.push(cur);
  return result;
}
