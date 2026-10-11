// ============================================================
// App.jsx — Root component, state manager, data flow hub
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { storage } from './utils/storage.js';
import { getSampleData } from './data/sampleData.js';
import { currentYearMonth, filterByMonth, generateId } from './utils/calculations.js';
import Navbar from './components/Navbar.jsx';
import Topbar from './components/Topbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import ExpenseForm from './components/ExpenseForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import BudgetCard from './components/BudgetCard.jsx';
import Analytics from './components/Analytics.jsx';
import Settings from './components/Settings.jsx';
import Calendar from './components/Calendar.jsx';
import Toast from './components/Toast.jsx';

// ── Currency codes mapped to their symbol ──────────────────────
const SYMBOL_TO_CODE = {
  '₹': 'INR',
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
};

/**
 * Fetch the conversion rate from `fromCode` to `toCode` using the
 * free open.er-api.com API (no key required, CORS-enabled).
 * Returns the numeric rate, or throws on failure.
 */
async function fetchRate(fromCode, toCode) {
  const res = await fetch(`https://open.er-api.com/v6/latest/${fromCode}`);
  if (!res.ok) throw new Error(`Rate fetch failed: ${res.status}`);
  const data = await res.json();
  if (data.result !== 'success') throw new Error(`API error: ${data['error-type'] || 'unknown'}`);
  const rate = data.rates?.[toCode];
  if (!rate) throw new Error(`No rate returned for ${fromCode}→${toCode}`);
  return rate;
}

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth());
  const [page, setPage] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [editTarget, setEditTarget] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [currency, setCurrency] = useState('₹');

  // --- Load from localStorage on first render ---
  useEffect(() => {
    const txns = storage.getTransactions();
    const bgt  = storage.getBudget();
    const thm  = storage.getTheme();
    const month = storage.getSelectedMonth() || currentYearMonth();
    const cur   = storage.getCurrency();

    setTransactions(txns);

    if (bgt) setBudget(bgt);
    else { storage.saveBudget(10000); setBudget(10000); }

    setTheme(thm);
    setSelectedMonth(month);
    setCurrency(cur);
  }, []);

  // --- Apply theme to document ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.saveTheme(theme);
  }, [theme]);

  // --- Persist selected month ---
  useEffect(() => {
    storage.saveSelectedMonth(selectedMonth);
  }, [selectedMonth]);

  // --- Toast helpers ---
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // --- Transaction operations ---
  const addTransaction = useCallback((txn) => {
    setTransactions(prev => {
      const updated = [...prev, txn];
      storage.saveTransactions(updated);
      return updated;
    });
    addToast(`Expense added! ${currency}${txn.amount} — ${txn.description}`, 'success');
  }, [addToast, currency]);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      storage.saveTransactions(updated);
      return updated;
    });
    addToast('Expense updated successfully!', 'success');
  }, [addToast]);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id);
      storage.saveTransactions(updated);
      return updated;
    });
    addToast('Transaction deleted.', 'warning');
  }, [addToast]);

  const handleEditExpense = useCallback((txn) => {
    setEditTarget(txn);
    setPage('add-expense');
  }, []);

  const handleBudgetSave = useCallback((amount) => {
    setBudget(amount);
    storage.saveBudget(amount);
    addToast(`Budget set to ${currency}${amount.toLocaleString('en-IN')} ✅`, 'success');
  }, [addToast, currency]);

  // --- Import CSV ---
  const handleImportCSV = useCallback((rows) => {
    // Assign fresh IDs so imported rows never clash with existing ones
    const withIds = rows.map(r => ({ ...r, id: generateId() }));
    setTransactions(prev => {
      const updated = [...prev, ...withIds];
      storage.saveTransactions(updated);
      return updated;
    });
    addToast(`${withIds.length} transaction(s) imported from CSV! ✅`, 'success');
  }, [addToast]);

  const handleClearAll = useCallback(() => {
    storage.clearAll();
    setTransactions([]);
    setBudget(0);
    setSelectedMonth(currentYearMonth());
    addToast('All data cleared.', 'warning');
  }, [addToast]);

  const handleLoadSample = useCallback(() => {
    const sample = getSampleData();
    storage.clearAll();
    storage.saveTransactions(sample);
    storage.saveBudget(10000);
    setTransactions(sample);
    setBudget(10000);
    setSelectedMonth(currentYearMonth());
    addToast('Sample data loaded! 120 transactions across 12 months. 🎉', 'success');
  }, [addToast]);

  const filteredTxns = filterByMonth(transactions, selectedMonth);

  // --- Currency change with live conversion ---
  const handleCurrencyChange = useCallback(async (newSymbol) => {
    const fromCode = SYMBOL_TO_CODE[currency];
    const toCode   = SYMBOL_TO_CODE[newSymbol];

    if (fromCode && toCode && fromCode !== toCode) {
      try {
        const rate = await fetchRate(fromCode, toCode);
        setTransactions(prev => {
          const converted = prev.map(t => ({
            ...t,
            amount: parseFloat((parseFloat(t.amount) * rate).toFixed(2)),
          }));
          storage.saveTransactions(converted);
          return converted;
        });
        // Also convert the budget
        setBudget(prev => {
          const newBudget = parseFloat((prev * rate).toFixed(2));
          storage.saveBudget(newBudget);
          return newBudget;
        });
        addToast(`Currency converted to ${newSymbol} (rate: 1${currency} = ${rate.toFixed(4)}${newSymbol}) ✅`, 'success');
      } catch (err) {
        console.error('Currency conversion failed:', err);
        addToast(`⚠️ Could not fetch live rate. Symbol updated but amounts unchanged.`, 'warning');
      }
    }

    setCurrency(newSymbol);
    storage.saveCurrency(newSymbol);
  }, [currency, addToast]);

  const sharedProps = { transactions, filteredTxns, budget, selectedMonth, addToast, currency };

  return (
    <div id="app">
      <Navbar page={page} onNavigate={setPage} />
      <div className="main">
        <Topbar
          transactions={transactions}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          theme={theme}
          onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        />
        <main className="content">
          {page === 'dashboard' && (
            <Dashboard {...sharedProps} onEdit={handleEditExpense} />
          )}
          {page === 'add-expense' && (
            <ExpenseForm
              editTarget={editTarget}
              onAdd={addTransaction}
              onUpdate={updateTransaction}
              onCancel={() => { setEditTarget(null); setPage('transactions'); }}
              onDone={() => { setEditTarget(null); setPage('transactions'); }}
              currency={currency}
            />
          )}
          {page === 'transactions' && (
            <TransactionList
              {...sharedProps}
              onEdit={handleEditExpense}
              onDelete={deleteTransaction}
            />
          )}
          {page === 'budget' && (
            <BudgetCard {...sharedProps} onSave={handleBudgetSave} />
          )}
          {page === 'analytics' && (
            <Analytics {...sharedProps} />
          )}
          {page === 'calendar' && (
            <Calendar transactions={transactions} currency={currency} />
          )}
          {page === 'settings' && (
            <Settings
              theme={theme}
              onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              onImportCSV={handleImportCSV}
              onClearAll={handleClearAll}
              onLoadSample={handleLoadSample}
              transactions={transactions}
              currency={currency}
              onCurrencyChange={handleCurrencyChange}
            />
          )}
        </main>
      </div>
      {/* Toast notifications */}
      <div id="toast-container">
        {toasts.map(t => <Toast key={t.id} {...t} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />)}
      </div>
    </div>
  );
}
