// Live data layer — talks to the Apps Script doGet Web App.
const API_URL = import.meta.env.VITE_API_URL || '';

const num = v => {
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
};

// Map a raw CENTRAL row (exact headers from Code.gs) into the shape the UI uses.
export function normalize(r) {
  const ur = num(r['Unbilled Retainer']);
  const uv = num(r['Unbilled VAS']);
  return {
    est:   r['Estimate Number'] || '',
    dept:  r['Primary Department'] || '',
    sbu:   r['SBU'] || '',
    brand: r['Brand'] || '',
    gsm:   r['Primary GSM'] || '',
    date:  r['Estimate Date'] || '',
    notes: r['Notes'] || '',
    ur, uv, total: ur + uv,
    pdate: r['Projected Billing Date'] || '',
    pamt:  num(r['Projection Amount']),
    comment: r['HOD VP Comment'] || '',
    status:  r['Status'] || '',
    by:    r['Last Updated By'] || r['__FinBP'] || '',
    key:   r['CompositeKey'] || (r['Estimate Number'] + '||' + r['Primary Department'])
  };
}

export function isConfigured() {
  return API_URL && API_URL.indexOf('XXedited') === -1 && API_URL.indexOf('script.google.com') > -1;
}

// Fetch scoped rows. Optional testEmail impersonates a user (dev only).
export async function fetchUnbilled(testEmail) {
  if (!API_URL) throw new Error('VITE_API_URL is not set');
  const sep = API_URL.indexOf('?') > -1 ? '&' : '?';
  const url = API_URL + sep + 'scope=auto' +
    (testEmail ? '&email=' + encodeURIComponent(testEmail) : '');
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  return {
    email: json.email || '',
    role: json.role || { type: 'NONE' },
    rows: (json.rows || []).map(normalize)
  };
}

export const CR = 10000000;
export const fmtCr = n => (n / CR).toFixed(2);
export const fmtFull = n => '₹' + Number(Math.round(n || 0)).toLocaleString('en-IN');
