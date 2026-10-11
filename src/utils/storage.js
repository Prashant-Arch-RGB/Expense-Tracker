// ============================================================
// storage.js — localStorage adapter
// Replace getAll/saveAll to switch to Firebase / Supabase / API
// ============================================================

const KEYS = {
  TRANSACTIONS: 'et_transactions',
  BUDGET: 'et_budget',
  THEME: 'et_theme',
  SELECTED_MONTH: 'et_month',
  CURRENCY: 'et_currency',
};

export const storage = {
  getTransactions() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');
    } catch (e) {
      console.warn('Corrupt localStorage data, resetting:', e);
      return [];
    }
  },

  saveTransactions(transactions) {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getBudget() {
    const v = parseFloat(localStorage.getItem(KEYS.BUDGET));
    return isNaN(v) ? 0 : v;
  },

  saveBudget(amount) {
    localStorage.setItem(KEYS.BUDGET, String(amount));
  },

  getTheme() {
    return localStorage.getItem(KEYS.THEME) || 'light';
  },

  saveTheme(theme) {
    localStorage.setItem(KEYS.THEME, theme);
  },

  getSelectedMonth() {
    return localStorage.getItem(KEYS.SELECTED_MONTH) || '';
  },

  saveSelectedMonth(month) {
    localStorage.setItem(KEYS.SELECTED_MONTH, month);
  },

  getCurrency() {
    return localStorage.getItem(KEYS.CURRENCY) || '₹';
  },

  saveCurrency(symbol) {
    localStorage.setItem(KEYS.CURRENCY, symbol);
  },

  clearAll() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
