// ============================================================
// sampleData.js — Realistic demo transactions
// ============================================================
import { generateId, currentYearMonth } from '../utils/calculations.js';

function buildDate(day, monthOffset = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() + monthOffset);
  d.setDate(day);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getSampleData() {
  return [
    // Current month
    { id: generateId(), amount: 250, description: "Lunch at Domino's", category: 'Food', date: buildDate(2), paymentMethod: 'UPI', notes: 'College lunch' },
    { id: generateId(), amount: 180, description: 'Uber to college', category: 'Transportation', date: buildDate(3), paymentMethod: 'UPI', notes: '' },
    { id: generateId(), amount: 600, description: 'Python Programming Book', category: 'Education', date: buildDate(4), paymentMethod: 'Debit Card', notes: 'From Amazon' },
    { id: generateId(), amount: 199, description: 'Netflix subscription', category: 'Entertainment', date: buildDate(5), paymentMethod: 'Credit Card', notes: 'Monthly' },
    { id: generateId(), amount: 1499, description: 'Wireless headphones', category: 'Shopping', date: buildDate(5), paymentMethod: 'Debit Card', notes: 'From Amazon' },
    { id: generateId(), amount: 85, description: 'Metro card recharge', category: 'Transportation', date: buildDate(6), paymentMethod: 'UPI', notes: '' },
    { id: generateId(), amount: 320, description: 'Dinner with friends', category: 'Food', date: buildDate(7), paymentMethod: 'Cash', notes: 'Birthday celebration' },
    { id: generateId(), amount: 2500, description: 'Laptop accessories', category: 'Shopping', date: buildDate(8), paymentMethod: 'Credit Card', notes: 'Mouse + keyboard' },
    { id: generateId(), amount: 1200, description: 'Udemy course – Data Structures', category: 'Education', date: buildDate(9), paymentMethod: 'Debit Card', notes: '' },
    { id: generateId(), amount: 450, description: 'Grocery shopping', category: 'Food', date: buildDate(10), paymentMethod: 'UPI', notes: '' },
    { id: generateId(), amount: 150, description: 'Electricity bill', category: 'Bills', date: buildDate(11), paymentMethod: 'Bank Transfer', notes: '' },
    { id: generateId(), amount: 300, description: 'Doctor consultation', category: 'Healthcare', date: buildDate(12), paymentMethod: 'Cash', notes: '' },
    { id: generateId(), amount: 1800, description: 'New shoes from Myntra', category: 'Shopping', date: buildDate(13), paymentMethod: 'Debit Card', notes: '' },
    { id: generateId(), amount: 100, description: 'Coffee at Starbucks', category: 'Food', date: buildDate(14), paymentMethod: 'UPI', notes: '' },
    { id: generateId(), amount: 750, description: 'Goa trip hotel booking', category: 'Travel', date: buildDate(15), paymentMethod: 'Credit Card', notes: 'Weekend trip' },
    // Previous month
    { id: generateId(), amount: 3200, description: 'Semester exam fees', category: 'Education', date: buildDate(5, -1), paymentMethod: 'Bank Transfer', notes: '' },
    { id: generateId(), amount: 900, description: 'Monthly groceries', category: 'Food', date: buildDate(10, -1), paymentMethod: 'Cash', notes: '' },
    { id: generateId(), amount: 1500, description: 'Internship travel', category: 'Transportation', date: buildDate(15, -1), paymentMethod: 'UPI', notes: '' },
    { id: generateId(), amount: 600, description: 'Spotify + Netflix combo', category: 'Entertainment', date: buildDate(20, -1), paymentMethod: 'Credit Card', notes: '' },
    { id: generateId(), amount: 2200, description: 'Winter jacket', category: 'Shopping', date: buildDate(25, -1), paymentMethod: 'Debit Card', notes: '' },
  ];
}
