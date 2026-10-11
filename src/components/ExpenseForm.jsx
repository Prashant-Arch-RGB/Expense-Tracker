// ============================================================
// ExpenseForm.jsx — Add / Edit expense with smart categorization
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { suggest } from '../utils/categorizer.js';
import { generateId, CATEGORIES, PAYMENT_METHODS } from '../utils/calculations.js';
import { CheckCircle, X, Sparkles } from 'lucide-react';

const EMPTY = { amount: '', description: '', category: '', date: '', paymentMethod: '', notes: '' };

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ExpenseForm({ editTarget, onAdd, onUpdate, onCancel, onDone, currency = '₹' }) {
  const [form, setForm] = useState({ ...EMPTY, date: today() });
  const [errors, setErrors] = useState({});
  const [suggestion, setSuggestion] = useState(null);
  const debounce = useRef(null);
  const isEdit = Boolean(editTarget);

  // Populate form when editing
  useEffect(() => {
    if (editTarget) {
      setForm({
        amount: String(editTarget.amount),
        description: editTarget.description || '',
        category: editTarget.category || '',
        date: editTarget.date || today(),
        paymentMethod: editTarget.paymentMethod || '',
        notes: editTarget.notes || '',
      });
    } else {
      setForm({ ...EMPTY, date: today() });
    }
    setErrors({});
    setSuggestion(null);
  }, [editTarget]);

  // Smart categorization on description change
  function handleDescriptionChange(e) {
    const val = e.target.value;
    setForm(f => ({ ...f, description: val }));
    clearTimeout(debounce.current);
    if (val.trim().length >= 3) {
      debounce.current = setTimeout(() => {
        const { category } = suggest(val);
        setSuggestion(category);
      }, 350);
    } else {
      setSuggestion(null);
    }
  }

  function acceptSuggestion() {
    setForm(f => ({ ...f, category: suggestion }));
    setSuggestion(null);
  }

  function validate() {
    const errs = {};
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Please enter a valid positive amount.';
    if (!form.category) errs.category = 'Please select a category.';
    if (!form.paymentMethod) errs.paymentMethod = 'Please select a payment method.';
    if (!form.date) errs.date = 'Please select a date.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      amount: parseFloat(form.amount),
      description: form.description.trim(),
      category: form.category,
      date: form.date,
      paymentMethod: form.paymentMethod,
      notes: form.notes.trim(),
    };
    if (isEdit) {
      onUpdate(editTarget.id, data);
    } else {
      onAdd({ id: generateId(), ...data });
    }
    onDone();
  }

  return (
    <div>
      <div className="section-header">
        <h2>{isEdit ? 'Edit Expense' : 'Add Expense'}</h2>
      </div>
      <div style={{ maxWidth: 600 }}>
        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <Field label={`Amount (${currency})`} required error={errors.amount}>
                <input className={`form-control${errors.amount ? ' error' : ''}`} type="number" min="0.01" step="0.01" placeholder="e.g. 250" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}/>
              </Field>
              <Field label="Date" required error={errors.date}>
                <input className={`form-control${errors.date ? ' error' : ''}`} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}/>
              </Field>
            </div>

            <Field label="Description" error={errors.description}>
              <input className={`form-control${errors.description ? ' error' : ''}`} type="text" maxLength={120} placeholder="e.g. Lunch at Domino's" value={form.description} onChange={handleDescriptionChange}/>
              {suggestion && form.category !== suggestion && (
                <div className="suggestion-box">
                  <span className="suggestion-text"><Sparkles size={14} style={{ display: 'inline', marginRight: 4 }}/>Suggested Category: <strong>{suggestion}</strong></span>
                  <div className="suggestion-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={acceptSuggestion}>Accept</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSuggestion(null)}>Change</button>
                  </div>
                </div>
              )}
            </Field>

            <div className="form-grid">
              <Field label="Category" required error={errors.category}>
                <select className={`form-control${errors.category ? ' error' : ''}`} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Payment Method" required error={errors.paymentMethod}>
                <select className={`form-control${errors.paymentMethod ? ' error' : ''}`} value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                  <option value="">Select method...</option>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Notes (optional)">
              <textarea className="form-control" placeholder="Any additional details..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
            </Field>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">
                <CheckCircle size={15}/> {isEdit ? 'Update Expense' : 'Save Expense'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={onCancel}>
                <X size={15}/> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && <span style={{ color: 'var(--danger)' }}> *</span>}</label>
      {children}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
