// ============================================================
// calculations.js — Pure utility functions (no side effects)
// ============================================================

export const CATEGORIES = ['Food','Transportation','Shopping','Education','Entertainment','Bills','Healthcare','Travel','Other'];
export const PAYMENT_METHODS = ['Cash','UPI','Debit Card','Credit Card','Bank Transfer','Other'];

export const CAT_COLORS = {
  Food: '#f59e0b', Transportation: '#3b82f6', Shopping: '#ec4899',
  Education: '#22c55e', Entertainment: '#8b5cf6', Bills: '#ef4444',
  Healthcare: '#06b6d4', Travel: '#f97316', Other: '#94a3b8',
};

export const PAY_COLORS = {
  Cash: '#10b981', UPI: '#6366f1', 'Debit Card': '#f59e0b',
  'Credit Card': '#ef4444', 'Bank Transfer': '#3b82f6', Other: '#94a3b8',
};

export function formatINR(amount, symbol = '₹') {
  if (isNaN(amount)) return symbol + '0';
  return symbol + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0, maximumFractionDigits: 2,
  });
}

export function totalSpent(transactions) {
  return transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
}

export function remaining(budget, spent) {
  return budget - spent;
}

export function usagePct(budget, spent) {
  if (!budget) return 0;
  return Math.round((spent / budget) * 100);
}

export function byCategory(transactions) {
  return transactions.reduce((map, t) => {
    const cat = t.category || 'Other';
    map[cat] = (map[cat] || 0) + (parseFloat(t.amount) || 0);
    return map;
  }, {});
}

export function byPaymentMethod(transactions) {
  return transactions.reduce((map, t) => {
    const m = t.paymentMethod || 'Other';
    map[m] = (map[m] || 0) + (parseFloat(t.amount) || 0);
    return map;
  }, {});
}

export function dailyTotals(transactions) {
  const map = transactions.reduce((acc, t) => {
    if (!t.date) return acc;
    acc[t.date] = (acc[t.date] || 0) + (parseFloat(t.amount) || 0);
    return acc;
  }, {});
  return Object.keys(map).sort().map(date => ({ date, amount: map[date] }));
}

export function topExpenses(transactions, n = 5) {
  return [...transactions]
    .sort((a, b) => (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0))
    .slice(0, n);
}

export function topCategory(transactions) {
  const m = byCategory(transactions);
  let top = null, max = 0;
  Object.entries(m).forEach(([k, v]) => { if (v > max) { max = v; top = k; } });
  return { category: top, amount: max };
}

export function monthlyTotals(allTransactions) {
  return allTransactions.reduce((map, t) => {
    if (!t.date) return map;
    const month = t.date.slice(0, 7);
    map[month] = (map[month] || 0) + (parseFloat(t.amount) || 0);
    return map;
  }, {});
}

export function filterByMonth(transactions, yearMonth) {
  if (!yearMonth) return transactions;
  return transactions.filter(t => t.date && t.date.startsWith(yearMonth));
}

export function formatDateDisplay(isoDate) {
  if (!isoDate) return '';
  try {
    return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function currentYearMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
