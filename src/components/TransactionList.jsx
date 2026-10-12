// ============================================================
// TransactionList.jsx — Searchable, filterable, sortable table
// ============================================================
import { useState } from 'react';
import { Edit2, Trash2, Download, Search } from 'lucide-react';
import { formatINR, formatDateDisplay, CATEGORIES, PAYMENT_METHODS } from '../utils/calculations.js';

const CAT_CLASS = {
  Food: 'cat-food', Transportation: 'cat-transportation', Shopping: 'cat-shopping',
  Education: 'cat-education', Entertainment: 'cat-entertainment', Bills: 'cat-bills',
  Healthcare: 'cat-healthcare', Travel: 'cat-travel', Other: 'cat-other',
};

export default function TransactionList({ filteredTxns, onEdit, onDelete, currency = '₹' }) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [payFilter, setPayFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter
  let txns = filteredTxns;
  if (search) txns = txns.filter(t =>
    (t.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.paymentMethod || '').toLowerCase().includes(search.toLowerCase())
  );
  if (catFilter) txns = txns.filter(t => t.category === catFilter);
  if (payFilter) txns = txns.filter(t => t.paymentMethod === payFilter);

  // Sort
  const sorters = {
    newest: (a, b) => b.date.localeCompare(a.date),
    oldest: (a, b) => a.date.localeCompare(b.date),
    highest: (a, b) => parseFloat(b.amount) - parseFloat(a.amount),
    lowest: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
  };
  txns = [...txns].sort(sorters[sort] || sorters.newest);

  function exportCSV() {
    if (!filteredTxns.length) return;
    const header = 'Date,Description,Category,Payment Method,Amount,Notes';
    const rows = filteredTxns.map(t =>
      `${t.date},"${(t.description||'').replace(/"/g,'""')}","${t.category}","${t.paymentMethod}",${t.amount},"${(t.notes||'').replace(/"/g,'""')}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="section-header">
        <h2>Transactions</h2>
        <button className="btn btn-outline btn-sm" onClick={exportCSV}><Download size={14}/> Export CSV</button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }}/>
          <input className="form-control" style={{ paddingLeft: 30 }} placeholder="Search description, category, method..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <select className="form-control" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="form-control" value={payFilter} onChange={e => setPayFilter(e.target.value)}>
          <option value="">All Methods</option>
          {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className="form-control" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>

      {txns.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or add a new expense.</p>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Date</th><th>Description</th><th>Category</th>
                <th>Method</th><th>Amount</th><th>Notes</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {txns.map(t => (
                  <tr key={t.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDateDisplay(t.date)}</td>
                    <td><span style={{ fontWeight: 500 }}>{t.description}</span></td>
                    <td><span className={`badge ${CAT_CLASS[t.category] || 'cat-other'}`}>{t.category || 'Other'}</span></td>
                    <td style={{ color: 'var(--text2)' }}>{t.paymentMethod || '—'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--danger)' }}>{currency}{parseFloat(t.amount).toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--text3)', fontSize: 12, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.notes}>{t.notes || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(t)}><Edit2 size={13}/> Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(t)}><Trash2 size={13}/> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text2)' }}>
            Showing {txns.length} transaction{txns.length !== 1 ? 's' : ''}
          </div>
        </>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <h2>Delete Transaction?</h2>
              <button className="icon-btn" onClick={() => setDeleteTarget(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text2)' }}>This action cannot be undone.</p>
            <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginTop: 12, fontSize: 13 }}>
              <strong>{deleteTarget.description}</strong> — {formatINR(deleteTarget.amount, currency)} ({deleteTarget.category})
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { onDelete(deleteTarget.id); setDeleteTarget(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
