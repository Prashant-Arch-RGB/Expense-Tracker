# 💰 ExpenseTrack — Personal Expense Tracker

> A modern personal finance dashboard for college students and young adults.
> Track expenses, manage budgets, and visualize your spending — all in your browser.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [AI Feature — Smart Categorization](#-smart-expense-categorization)
- [Analytics & Charts](#-analytics--charts)
- [Technology Stack](#-technology-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Data Flow](#-data-flow)
- [Future Improvements](#-future-improvements)
- [Disclaimer](#-disclaimer)

---

## 🎯 Overview

**The Problem:**  
College students and young adults often lose track of their daily spending — food deliveries, subscriptions, travel, textbooks — and hit the end of the month wondering where their money went.

**The Solution:**  
ExpenseTrack is a fully local, zero-signup personal finance dashboard that helps you:
- Log every expense in seconds
- Set a monthly budget and track your progress
- Understand your spending patterns through interactive charts
- Get AI-powered category suggestions just by typing a description

---

## ✨ Features

### Core
- ✅ **Add / Edit / Delete** expenses
- ✅ **9 categories**: Food, Transportation, Shopping, Education, Entertainment, Bills, Healthcare, Travel, Other
- ✅ **6 payment methods**: Cash, UPI, Debit Card, Credit Card, Bank Transfer, Other
- ✅ **Local persistence** — data survives page refresh and browser restart
- ✅ **Realistic sample data** loaded on first launch

### Dashboard
- Total spent this month
- Monthly budget and remaining balance
- Budget usage percentage with colour-coded progress bar
- Highest spending category
- Transaction count
- Top 5 expenses
- Mini pie chart + trend line

### Transactions
- Search by description, category, or payment method
- Filter by category and payment method
- Sort by: Newest, Oldest, Highest Amount, Lowest Amount
- Confirmation dialog before deletion
- CSV export

### Budget Management
- Set any monthly budget limit
- Visual progress bar
- Smart warnings:
  - ✅ Under 70% — within budget
  - ⚡ 70–90% — approaching limit
  - ⚠️ 90–100% — close to limit
  - 🚨 Over 100% — budget exceeded

### Analytics (4 chart types)
1. **Pie/Donut chart** — category spending breakdown
2. **Line chart** — daily spending trend
3. **Bar chart** — category comparison (horizontal)
4. **Bar chart** — payment method analysis

### Monthly Comparison
- View up to 6 months of spending side by side
- Percentage change vs previous month

### Smart Categorization
- Keyword-based AI-style category suggestions
- Debounced as you type (350ms delay)
- Accept or dismiss with one click

### UI/UX
- 🌙 Dark mode / ☀️ Light mode (remembered across sessions)
- Fully responsive (desktop, tablet, mobile)
- Toast notifications for all actions
- Empty state illustrations
- Form validation with field-level error messages
- Month selector in topbar to view any past month

---

## 🤖 Smart Expense Categorization

When you type a description like:

| Description                      | Suggested Category |
|----------------------------------|--------------------|
| "Uber to college"                | Transportation     |
| "Had lunch at McDonald's"        | Food               |
| "Bought Python programming book" | Education          |
| "Netflix subscription"           | Entertainment      |
| "Headphones from Amazon"         | Shopping           |

**How it works:**
The categorizer in [`utils/categorizer.js`](react-src/src/utils/categorizer.js) uses a keyword lookup table. When you type, it checks your description against lists of keywords for each category and returns the best match.

**To upgrade to a real AI:**
Replace the `suggest()` function in `categorizer.js` with an async API call:

```javascript
export async function suggest(description) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Categorize this expense: "${description}". Reply with one word from: Food, Transportation, Shopping, Education, Entertainment, Bills, Healthcare, Travel, Other` }]
    })
  });
  const data = await res.json();
  return { category: data.choices[0].message.content.trim(), confidence: 'high' };
}
```

---

## 📊 Analytics & Charts

### A. Pie / Donut Chart — Category Spending
Shows the proportion of your total spending by category.
Hover to see: category name, amount, and percentage.
Auto-updates whenever you add, edit, or delete an expense.

### B. Line Chart — Daily Spending Trend
Shows how much you spent on each day of the selected month.
Helps identify spikes (payday splurges, unexpected costs).
Auto-updates on data changes.

### C. Bar Chart — Category Comparison
Horizontal bar chart comparing total spending across all categories.
Makes it easy to instantly spot where most money is going.

### D. Payment Method Chart
Vertical bar chart showing total spending per payment method.
See whether you're overspending on credit, or mostly using UPI.

### E. Monthly Comparison
Bar chart + breakdown table for up to 6 months of spending.
Shows % change month-over-month with colour coding (red = up, green = down).

---

## 🛠 Technology Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 18 (JSX) + Vite               |
| Styling     | Custom CSS with CSS variables (no framework dependency — easy to understand) |
| Charts      | Chart.js 4 + react-chartjs-2        |
| Icons       | Lucide React                        |
| Storage     | localStorage (browser-native)       |
| Categorizer | Keyword-based (no external API)     |

**Standalone version:** Pure HTML + CSS + vanilla JavaScript + Chart.js CDN.  
No build step, no Node.js required — just open `index.html` in a browser.

---

## 📸 Screenshots

> _Add screenshots after running the app locally_

| Dashboard (Light) | Dashboard (Dark) |
|-------------------|------------------|
| `[screenshot]`    | `[screenshot]`   |

| Analytics | Budget Management |
|-----------|-------------------|
| `[screenshot]` | `[screenshot]` |

---

## 🚀 Installation

### Option A: No Setup — Open Directly in Browser (Recommended for Demo)

```bash
# Clone the repo
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

# Simply open the file:
open index.html
# OR double-click index.html in your file explorer
```

That's it. No Node.js, no npm, no build step.

---

### Option B: React + Vite (For Development)

**Prerequisites:** Node.js 18+ and npm

```bash
cd expense-tracker/react-src

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` in your browser.

---

## 📖 Usage

### Adding an Expense
1. Click **Add Expense** in the sidebar
2. Enter amount, description, category, date, and payment method
3. As you type the description, a smart category suggestion may appear — click **Accept** to use it
4. Click **Save Expense**
5. The dashboard, charts, and budget all update instantly

### Setting a Budget
1. Go to **Budget** in the sidebar
2. Enter your monthly limit (e.g. ₹10,000)
3. Click **Save**
4. The budget bar will now track your spending in real time

### Filtering Transactions
1. Go to **Transactions**
2. Use the search box to search by description, category, or method
3. Use the dropdowns to filter by category or payment method
4. Use the sort dropdown to change the order

### Switching Months
Use the **month selector** in the top bar to view any past month's data.

### Dark Mode
Click the 🌙 icon in the top-right corner. Your preference is saved.

### Export Data
Go to **Settings** and click **Export Transactions** to download a CSV.

---

## 📁 Project Structure

```
expense-tracker/
│
├── index.html              ← Standalone version (no build step)
├── app.js                  ← All JavaScript logic for standalone version
│
└── react-src/              ← React + Vite version
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx        ← React entry point
        ├── App.jsx         ← Root component, global state management
        ├── index.css       ← All styles
        │
        ├── components/
        │   ├── Navbar.jsx          ← Sidebar navigation
        │   ├── Topbar.jsx          ← Header, month selector, theme toggle
        │   ├── Dashboard.jsx       ← Summary cards + mini charts + top 5
        │   ├── ExpenseForm.jsx     ← Add/Edit form with smart categorization
        │   ├── TransactionList.jsx ← Searchable/filterable table
        │   ├── BudgetCard.jsx      ← Budget setting + progress + warnings
        │   ├── Analytics.jsx       ← All 4 chart types
        │   ├── MonthlyComparison.jsx ← Month-over-month comparison
        │   ├── Settings.jsx        ← App settings
        │   └── Toast.jsx           ← Notification toasts
        │
        ├── utils/
        │   ├── storage.js      ← localStorage adapter (swap for Firebase here)
        │   ├── calculations.js ← Pure math functions (no side effects)
        │   └── categorizer.js  ← Smart keyword-based category suggester
        │
        └── data/
            └── sampleData.js   ← Realistic demo transactions
```

---

## 🔄 Data Flow

```
User Action (add/edit/delete expense)
         │
         ▼
   ExpenseForm.jsx / TransactionList.jsx
         │
         ▼
   App.jsx (central state: transactions[], budget, selectedMonth)
         │
    ┌────┴────────────────────────────┐
    ▼                                 ▼
storage.js                    All components re-render
(localStorage)                with fresh data
                              ├── Dashboard (stats + mini charts)
                              ├── TransactionList (filtered table)
                              ├── BudgetCard (progress bar)
                              └── Analytics (all 4 charts)
```

**localStorage structure:**
```json
{
  "et_transactions": "[{\"id\":\"abc\",\"amount\":250,\"description\":\"Lunch\",\"category\":\"Food\",\"date\":\"2026-06-10\",\"paymentMethod\":\"UPI\",\"notes\":\"\"}]",
  "et_budget": "10000",
  "et_theme": "dark",
  "et_month": "2026-06"
}
```

---

## 🔮 Future Improvements

| Feature | Description |
|---------|-------------|
| 🔐 User Authentication | Login with Google/email via Firebase Auth |
| ☁️ Cloud Database | Sync to Firestore, Supabase, or PostgreSQL |
| 📷 Receipt OCR | Scan a receipt photo to auto-fill expense details |
| 🤖 AI Spending Insights | GPT-powered monthly spending analysis and tips |
| 📈 Expense Prediction | ML model to predict end-of-month spending |
| 🔔 Anomaly Detection | Alert when a category exceeds its usual range |
| 📱 Mobile Application | React Native version for iOS and Android |
| 🔄 Auto-Import | Connect bank accounts via Plaid / RazorpayX |
| 🏷️ Tags & Custom Categories | User-defined tags and custom category creation |
| 📊 Budget per Category | Set individual limits per category |

---

## ⚠️ Disclaimer

> **ExpenseTrack is a personal budgeting and educational project.**
>
> This application is **not** a banking application, financial advice tool, or investment platform.
> It does not connect to any bank account, payment gateway, or financial institution.
> All data is stored locally in your browser and is never transmitted to any server.
>
> Use this tool to build healthy financial habits, understand your spending patterns,
> and practice budgeting. For professional financial advice, consult a certified financial planner.

---

## 👨‍💻 Author

Built as a college portfolio project.

**Stack:** React · Chart.js · Vanilla CSS · localStorage

**License:** MIT — free to use, modify, and share.

---

*"The first step to financial freedom is knowing where your money goes."*
