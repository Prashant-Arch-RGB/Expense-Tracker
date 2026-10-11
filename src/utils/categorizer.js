// ============================================================
// categorizer.js — Smart keyword-based expense categorizer
// FUTURE: Replace suggest() with an async API call to
//         OpenAI / Gemini / HuggingFace transformers.js
// ============================================================

const RULES = [
  {
    category: 'Food',
    keywords: ['lunch','dinner','breakfast','food','restaurant','cafe','coffee','pizza','burger',
      'domino','mcdonald','kfc','zomato','swiggy','eat','meal','snack','biryani','dosa',
      'chai','tea','juice','bakery','hotel','mess','canteen','tiffin','grocery','milk',
      'bread','egg','vegetable','fruit','rice'],
  },
  {
    category: 'Transportation',
    keywords: ['uber','ola','bus','auto','metro','train','cab','rickshaw','petrol','fuel',
      'diesel','toll','parking','rapido','bike','ticket','commute','lyft','taxi'],
  },
  {
    category: 'Shopping',
    keywords: ['amazon','flipkart','myntra','cloth','shirt','pant','shoe','dress','bag',
      'watch','phone','mobile','laptop','headphone','earphone','buy','purchase','shop',
      'apparel','fashion','accessori','gadget','electronic','meesho','ajio'],
  },
  {
    category: 'Education',
    keywords: ['book','course','class','tuition','fee','college','university','school','study',
      'udemy','coursera','nptel','exam','certificate','coaching','notes','stationary',
      'pen','pencil','library','python','java','data'],
  },
  {
    category: 'Entertainment',
    keywords: ['netflix','amazon prime','hotstar','movie','cinema','theatre','game','concert',
      'show','subscription','youtube','spotify','music','pvr','inox','fun','bowling'],
  },
  {
    category: 'Bills',
    keywords: ['electricity','water','gas','internet','wifi','broadband','recharge','mobile bill',
      'phone bill','rent','maintenance','society','dth','cable','insurance','emi','loan'],
  },
  {
    category: 'Healthcare',
    keywords: ['doctor','medicine','pharmacy','hospital','clinic','health','medical','tablet',
      'capsule','injection','test','lab','apollo','lenskart','spectacle','dental','gym',
      'fitness','yoga'],
  },
  {
    category: 'Travel',
    keywords: ['hotel','resort','airbnb','oyo','tour','trip','holiday','vacation','flight',
      'irctc','booking','passport','visa','suitcase','itinerary','goa','mumbai','delhi',
      'manali','leh'],
  },
];

/**
 * Suggest a category for the given description.
 * Returns { category: string|null, confidence: 'high'|'low' }
 *
 * To integrate a real AI API:
 *   export async function suggestAsync(description) {
 *     const res = await fetch('/api/categorize', { method:'POST', body: JSON.stringify({ description }) });
 *     return res.json(); // { category, confidence }
 *   }
 */
export function suggest(description) {
  if (!description || description.trim().length < 3) {
    return { category: null, confidence: 'low' };
  }
  const lower = description.toLowerCase();
  for (const rule of RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        return { category: rule.category, confidence: 'high' };
      }
    }
  }
  return { category: null, confidence: 'low' };
}
