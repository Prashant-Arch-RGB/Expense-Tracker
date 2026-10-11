// ============================================================
// sampleData.js — Realistic demo transactions (12 months)
// ============================================================
import { generateId } from '../utils/calculations.js';

/** Returns an ISO date string for a given day and monthOffset from today. */
function buildDate(day, monthOffset = 0) {
  const d = new Date();
  d.setDate(1); // avoid overshooting short months
  d.setMonth(d.getMonth() + monthOffset);
  const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, maxDay));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function tx(amount, description, category, monthOffset, day, paymentMethod, notes = '') {
  return { id: generateId(), amount, description, category, date: buildDate(day, monthOffset), paymentMethod, notes };
}

export function getSampleData() {
  return [
    // ── Current month (0) ────────────────────────────────────
    tx(250,  "Lunch at Domino's",            'Food',           0,  2,  'UPI',           'College lunch'),
    tx(180,  'Uber to college',              'Transportation', 0,  3,  'UPI',           ''),
    tx(600,  'Python Programming Book',      'Education',      0,  4,  'Debit Card',    'From Amazon'),
    tx(199,  'Netflix subscription',         'Entertainment',  0,  5,  'Credit Card',   'Monthly'),
    tx(1499, 'Wireless headphones',          'Shopping',       0,  5,  'Debit Card',    'From Amazon'),
    tx(85,   'Metro card recharge',          'Transportation', 0,  6,  'UPI',           ''),
    tx(320,  'Dinner with friends',          'Food',           0,  7,  'Cash',          'Birthday celebration'),
    tx(2500, 'Laptop accessories',           'Shopping',       0,  8,  'Credit Card',   'Mouse + keyboard'),
    tx(1200, 'Udemy course – Data Structures','Education',     0,  9,  'Debit Card',    ''),
    tx(450,  'Grocery shopping',             'Food',           0, 10,  'UPI',           ''),
    tx(150,  'Electricity bill',             'Bills',          0, 11,  'Bank Transfer', ''),
    tx(300,  'Doctor consultation',          'Healthcare',     0, 12,  'Cash',          ''),
    tx(1800, 'New shoes from Myntra',        'Shopping',       0, 13,  'Debit Card',    ''),
    tx(100,  'Coffee at Starbucks',          'Food',           0, 14,  'UPI',           ''),
    tx(750,  'Goa trip hotel booking',       'Travel',         0, 15,  'Credit Card',   'Weekend trip'),
    tx(540,  'Monthly mobile recharge',      'Bills',          0, 16,  'UPI',           'Jio 84-day plan'),
    tx(220,  'Pharmacy — vitamins',          'Healthcare',     0, 18,  'Cash',          ''),
    tx(3500, 'New t-shirts & jeans',         'Shopping',       0, 20,  'Debit Card',    'Seasonal sale'),
    tx(400,  'Swiggy order',                 'Food',           0, 22,  'UPI',           'Late-night'),
    tx(1100, 'Train tickets – home visit',   'Travel',         0, 25,  'Credit Card',   'Round trip'),

    // ── 1 month ago (-1) ─────────────────────────────────────
    tx(3200, 'Semester exam fees',           'Education',     -1,  5,  'Bank Transfer', ''),
    tx(900,  'Monthly groceries',            'Food',          -1, 10,  'Cash',          ''),
    tx(1500, 'Internship travel',            'Transportation',-1, 15,  'UPI',           ''),
    tx(600,  'Spotify + Netflix combo',      'Entertainment', -1, 20,  'Credit Card',   ''),
    tx(2200, 'Winter jacket',                'Shopping',      -1, 25,  'Debit Card',    ''),
    tx(350,  'Auto-rickshaw rides (weekly)', 'Transportation',-1,  8,  'Cash',          ''),
    tx(180,  'Internet bill',                'Bills',         -1,  3,  'Bank Transfer', 'Broadband'),
    tx(800,  'Pharmacist – cold medicine',   'Healthcare',    -1, 17,  'Cash',          ''),
    tx(1200, 'React JS Bootcamp',            'Education',     -1, 22,  'Debit Card',    'Frontend course'),
    tx(600,  'Weekend movie outing',         'Entertainment', -1, 28,  'UPI',           ''),

    // ── 2 months ago (-2) ────────────────────────────────────
    tx(750,  'Biryani dinner, family',       'Food',          -2,  4,  'Cash',          ''),
    tx(4500, 'Smartwatch – Boat',            'Shopping',      -2,  6,  'Credit Card',   'Festive offer'),
    tx(990,  'Prime + Hotstar annual',       'Entertainment', -2,  9,  'Credit Card',   'Yearly plan'),
    tx(2800, 'Flight – Mumbai',              'Travel',        -2, 12,  'Credit Card',   'Conference'),
    tx(1600, 'College project materials',    'Education',     -2, 14,  'Debit Card',    ''),
    tx(450,  'Vegetable & fruit market',     'Food',          -2, 18,  'Cash',          ''),
    tx(200,  'Water purifier service',       'Bills',         -2, 21,  'Bank Transfer', 'AMC charge'),
    tx(500,  'Eye check-up',                 'Healthcare',    -2, 24,  'UPI',           ''),
    tx(1300, 'Books – competitive exams',    'Education',     -2, 26,  'Debit Card',    ''),
    tx(280,  'Coffee + snacks, library',     'Food',          -2, 29,  'Cash',          ''),

    // ── 3 months ago (-3) ────────────────────────────────────
    tx(6000, 'College hostel rent',          'Bills',         -3,  1,  'Bank Transfer', 'Monthly'),
    tx(900,  'Grocery haul',                 'Food',          -3,  5,  'UPI',           ''),
    tx(1800, 'Shoes – campus run',           'Shopping',      -3,  8,  'Debit Card',    ''),
    tx(350,  'Bus pass renewal',             'Transportation',-3, 10,  'Cash',          ''),
    tx(499,  'YouTube Premium',              'Entertainment', -3, 12,  'Credit Card',   ''),
    tx(1000, 'Dental check-up + X-ray',      'Healthcare',    -3, 15,  'Cash',          ''),
    tx(2400, 'Goa trip – activities',        'Travel',        -3, 18,  'Credit Card',   ''),
    tx(780,  'DSA course on Coursera',       'Education',     -3, 20,  'Debit Card',    ''),
    tx(300,  'Pizza night',                  'Food',          -3, 23,  'UPI',           ''),
    tx(550,  'Gas cylinder refill',          'Bills',         -3, 27,  'Cash',          ''),

    // ── 4 months ago (-4) ────────────────────────────────────
    tx(6000, 'College hostel rent',          'Bills',         -4,  1,  'Bank Transfer', 'Monthly'),
    tx(1200, 'Diwali sweets & gifts',        'Shopping',      -4,  4,  'Cash',          'Festival'),
    tx(850,  'Auto + cab rides',             'Transportation',-4,  7,  'UPI',           ''),
    tx(3200, 'New phone cover + screen guard','Shopping',     -4, 10,  'Debit Card',    ''),
    tx(700,  'Restaurant dinner',            'Food',          -4, 13,  'Credit Card',   ''),
    tx(180,  'Mobile bill',                  'Bills',         -4, 16,  'Bank Transfer', ''),
    tx(2500, 'Weekend trip – Pondicherry',   'Travel',        -4, 19,  'Credit Card',   ''),
    tx(400,  'Pharmacy',                     'Healthcare',    -4, 22,  'Cash',          ''),
    tx(1500, 'ML Specialisation – Coursera', 'Education',     -4, 25,  'Debit Card',    ''),
    tx(350,  'Snacks & cold drinks',         'Food',          -4, 28,  'Cash',          ''),

    // ── 5 months ago (-5) ────────────────────────────────────
    tx(6000, 'College hostel rent',          'Bills',         -5,  1,  'Bank Transfer', 'Monthly'),
    tx(1100, 'Grocery shopping',             'Food',          -5,  6,  'UPI',           ''),
    tx(4200, 'New backpack – Wildcraft',     'Shopping',      -5,  9,  'Debit Card',    ''),
    tx(600,  'Metro monthly pass',           'Transportation',-5, 11,  'UPI',           ''),
    tx(299,  'Spotify annual plan',          'Entertainment', -5, 14,  'Debit Card',    ''),
    tx(350,  'Blood test panel',             'Healthcare',    -5, 17,  'Cash',          ''),
    tx(5500, 'Bangalore trip',               'Travel',        -5, 20,  'Credit Card',   ''),
    tx(900,  'DSA book – Cormen',            'Education',     -5, 23,  'Debit Card',    ''),
    tx(500,  'Electric bill',                'Bills',         -5, 26,  'Bank Transfer', ''),
    tx(250,  'Biryani takeaway',             'Food',          -5, 29,  'UPI',           ''),

    // ── 6 months ago (-6) ────────────────────────────────────
    tx(6000, 'College hostel rent',          'Bills',         -6,  1,  'Bank Transfer', 'Monthly'),
    tx(2000, 'Raincoat & umbrella',          'Shopping',      -6,  3,  'Debit Card',    'Monsoon prep'),
    tx(700,  'Grocery + vegetables',         'Food',          -6,  7,  'UPI',           ''),
    tx(1400, 'Cab rides (monsoon)',          'Transportation',-6, 10,  'UPI',           ''),
    tx(450,  'Internet bill',                'Bills',         -6, 13,  'Bank Transfer', ''),
    tx(3000, 'AWS Cloud course',             'Education',     -6, 16,  'Debit Card',    ''),
    tx(1800, 'Kerala trip – transport',      'Travel',        -6, 19,  'Credit Card',   ''),
    tx(600,  'Streaming services combo',     'Entertainment', -6, 22,  'Credit Card',   ''),
    tx(250,  'Cough syrup + mask',           'Healthcare',    -6, 25,  'Cash',          ''),
    tx(480,  'Street food binge',            'Food',          -6, 28,  'Cash',          ''),

    // ── 7 months ago (-7) ────────────────────────────────────
    tx(6000, 'College hostel rent',          'Bills',         -7,  1,  'Bank Transfer', 'Monthly'),
    tx(1500, 'Summer internship fare',       'Transportation',-7,  5,  'UPI',           ''),
    tx(800,  'Groceries',                    'Food',          -7,  9,  'UPI',           ''),
    tx(2200, 'Formal shirt & trousers',      'Shopping',      -7, 12,  'Debit Card',    'Internship wear'),
    tx(499,  'Game purchase – Steam',        'Entertainment', -7, 15,  'Credit Card',   ''),
    tx(1200, 'Internship project book',      'Education',     -7, 18,  'Debit Card',    ''),
    tx(400,  'Physiotherapy session',        'Healthcare',    -7, 21,  'Cash',          ''),
    tx(3800, 'Delhi trip – flight',          'Travel',        -7, 24,  'Credit Card',   ''),
    tx(200,  'Electricity bill split',       'Bills',         -7, 27,  'Bank Transfer', 'Shared flat'),
    tx(350,  'Lunch canteen',                'Food',          -7, 30,  'Cash',          ''),

    // ── 8 months ago (-8) ────────────────────────────────────
    tx(6000, 'College hostel rent',          'Bills',         -8,  1,  'Bank Transfer', 'Monthly'),
    tx(950,  'Grocery shopping',             'Food',          -8,  4,  'Cash',          ''),
    tx(1700, 'Sunglasses – Fastrack',        'Shopping',      -8,  7,  'Debit Card',    ''),
    tx(600,  'Cab to airport',               'Transportation',-8, 11,  'UPI',           ''),
    tx(199,  'Netflix subscription',         'Entertainment', -8, 14,  'Credit Card',   'Monthly'),
    tx(850,  'Full body check-up',           'Healthcare',    -8, 17,  'Cash',          ''),
    tx(4200, 'Manali trip – bus + stay',     'Travel',        -8, 20,  'Credit Card',   ''),
    tx(700,  'Algorithms textbook',          'Education',     -8, 23,  'Debit Card',    ''),
    tx(300,  'Gas bill',                     'Bills',         -8, 26,  'Bank Transfer', ''),
    tx(420,  'Fast food – group order',      'Food',          -8, 29,  'UPI',           ''),

    // ── 9 months ago (-9) ────────────────────────────────────
    tx(6000, 'College hostel rent',          'Bills',         -9,  1,  'Bank Transfer', 'Monthly'),
    tx(2500, 'Holi special shopping',        'Shopping',      -9,  4,  'Cash',          'Colours + clothes'),
    tx(700,  'Auto rides (weekly)',          'Transportation',-9,  8,  'Cash',          ''),
    tx(1100, 'Swiggy + Zomato orders',       'Food',          -9, 12,  'UPI',           ''),
    tx(399,  'Prime Video monthly',          'Entertainment', -9, 15,  'Credit Card',   ''),
    tx(3000, 'Sikkim trip – shared cab',     'Travel',        -9, 18,  'Credit Card',   ''),
    tx(1400, 'Python + Flask book',          'Education',     -9, 21,  'Debit Card',    ''),
    tx(500,  'Paracetamol + ointment',       'Healthcare',    -9, 24,  'Cash',          ''),
    tx(180,  'Mobile recharge',              'Bills',         -9, 27,  'UPI',           ''),
    tx(600,  'Bakery celebration cake',      'Food',          -9, 29,  'Cash',          'Friend\'s birthday'),

    // ── 10 months ago (-10) ──────────────────────────────────
    tx(6000, 'College hostel rent',          'Bills',        -10,  1,  'Bank Transfer', 'Monthly'),
    tx(4500, 'New year party supplies',      'Shopping',     -10,  3,  'Credit Card',   ''),
    tx(800,  'Grocery run',                  'Food',         -10,  7,  'UPI',           ''),
    tx(1300, 'Train – outstation trip',      'Travel',       -10, 11,  'Debit Card',    ''),
    tx(350,  'Bus & auto commute',           'Transportation',-10,14,  'Cash',          ''),
    tx(599,  'Disney+ Hotstar annual',       'Entertainment',-10, 17,  'Credit Card',   ''),
    tx(2000, 'Microeconomics textbook set',  'Education',    -10, 20,  'Debit Card',    ''),
    tx(450,  'Clinic visit + medicine',      'Healthcare',   -10, 23,  'Cash',          ''),
    tx(250,  'Café study session',           'Food',         -10, 26,  'UPI',           ''),
    tx(180,  'Internet bill',               'Bills',         -10, 29,  'Bank Transfer', ''),

    // ── 11 months ago (-11) ──────────────────────────────────
    tx(6000, 'College hostel rent',          'Bills',        -11,  1,  'Bank Transfer', 'Monthly'),
    tx(1200, 'Christmas gifts',              'Shopping',     -11,  5,  'Debit Card',    ''),
    tx(900,  'Monthly groceries',            'Food',         -11,  9,  'Cash',          ''),
    tx(2500, 'Rajasthan trip – train+hotel', 'Travel',       -11, 13,  'Credit Card',   ''),
    tx(400,  'Metro passes',                 'Transportation',-11,16,  'UPI',           ''),
    tx(299,  'Spotify subscription',         'Entertainment',-11, 19,  'Debit Card',    ''),
    tx(1800, 'OS & Networks textbook',       'Education',    -11, 22,  'Debit Card',    ''),
    tx(600,  'Dental clean-up',              'Healthcare',   -11, 25,  'Cash',          ''),
    tx(300,  'Electricity bill',             'Bills',        -11, 27,  'Bank Transfer', ''),
    tx(550,  'End-of-year celebration dinner','Food',        -11, 30,  'Credit Card',   ''),
  ];
}
