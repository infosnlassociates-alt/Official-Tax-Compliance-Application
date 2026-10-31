import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Taxation Notifications Database with realistic CBDT, CBIC (GST), and MCA circulars
const TAX_NOTIFICATIONS = [
  {
    id: 'cbdt-cir-2026-08',
    authority: 'CBDT',
    category: 'Income Tax',
    docType: 'Circular',
    referenceNumber: 'Circular No. 08/2026',
    date: '2026-10-24',
    title: 'Clarification regarding deduction under Section 43B(h) for payments to Micro & Small Enterprises',
    summary: 'CBDT clarifies that disallowance under Section 43B(h) shall not apply to wholesale and retail traders registered under Udyam for priority sector lending benefits. Only manufacturing and service enterprises are covered.',
    effectiveDate: '2026-10-20',
    impact: 'Crucial for small business owners and audit reporting in Form 3CD clause 22. Traders exempt from mandatory 45-day disallowance.',
    officialLink: 'https://incometaxindia.gov.in'
  },
  {
    id: 'cbic-notif-gst-54-2026',
    authority: 'CBIC',
    category: 'GST',
    docType: 'Notification',
    referenceNumber: 'Notification No. 54/2026-Central Tax',
    date: '2026-10-18',
    title: 'Waiver of late fee for delayed filing of GSTR-3B for specified flood-affected districts',
    summary: 'Central Government waives the late fee payable under Section 47 for registered persons whose principal place of business is located in notified flood-affected districts, provided returns are filed on or before specified extended date.',
    effectiveDate: '2026-10-15',
    impact: 'Taxpayers in specified taluks/districts can file GSTR-3B without Sec 47 late fee up to extended date.',
    officialLink: 'https://cbic-gst.gov.in'
  },
  {
    id: 'cbic-cir-gst-238-2026',
    authority: 'CBIC',
    category: 'GST',
    docType: 'Circular',
    referenceNumber: 'Circular No. 238/32/2026-GST',
    date: '2026-10-05',
    title: 'Advisory on Rule 37A ITC reversal and re-claim mechanics for FY 2025-26',
    summary: 'Detailed instructions on reversal of Input Tax Credit availed where supplier has not filed GSTR-3B by 30th November following the end of financial year. Re-claim permitted under Sec 16 when supplier subsequently files return.',
    effectiveDate: '2026-10-01',
    impact: 'All regular registered taxpayers must verify GSTR-2B vs suppliers filing status prior to Nov 30 deadline to prevent interest liability under Sec 50.',
    officialLink: 'https://cbic-gst.gov.in'
  },
  {
    id: 'mca-gen-cir-09-2026',
    authority: 'MCA',
    category: 'Companies & LLP',
    docType: 'Circular',
    referenceNumber: 'General Circular No. 09/2026',
    date: '2026-09-29',
    title: 'Relaxation on additional fees for filing Form AOC-4 and MGT-7 / MGT-7A for FY 2025-26',
    summary: 'Ministry of Corporate Affairs extends the due date for filing annual financial statements (AOC-4) and Annual Return (MGT-7/7A) without additional fees up to November 30 for all eligible companies.',
    effectiveDate: '2026-09-29',
    impact: 'Private Limited & Public Companies gain 30 days additional compliance runway without standard ₹100/day MCA additional fees.',
    officialLink: 'https://mca.gov.in'
  },
  {
    id: 'cbdt-notif-77-2026',
    authority: 'CBDT',
    category: 'Income Tax',
    docType: 'Notification',
    referenceNumber: 'Notification No. 77/2026/F. No. 370142/22/2026-TPL',
    date: '2026-09-22',
    title: 'Extension of Tax Audit Report filing due date for FY 2025-26 (AY 2026-27)',
    summary: 'CBDT extends the due date for furnishing Report of Audit under any provision of the Act (Form 3CA-3CD / Form 3CB-3CD) from 30th September to 7th October.',
    effectiveDate: '2026-09-22',
    impact: 'Relief for Chartered Accountants and corporate/business tax assessees undergoing mandatory tax audit.',
    officialLink: 'https://incometaxindia.gov.in'
  },
  {
    id: 'cbic-adv-eway-2026',
    authority: 'CBIC',
    category: 'E-Way Bill',
    docType: 'Advisory',
    referenceNumber: 'NIC / GSTN Advisory No. 128',
    date: '2026-09-15',
    title: 'Mandatory 2-Factor Authentication (2FA) enforcement for E-Way Bill & E-Invoice generation',
    summary: 'All taxpayers with Aggregate Annual Turnover exceeding ₹5 Crores must mandate OTP-based 2-Factor Authentication (2FA) via SMS or Sandes app for generating E-Way Bills.',
    effectiveDate: '2026-10-01',
    impact: 'Logistics teams and accountants must link registered mobile numbers to ensure continuous vehicle movement and e-way bill generation.',
    officialLink: 'https://ewaybillgst.gov.in'
  },
  {
    id: 'cbdt-cir-tds-14-2026',
    authority: 'CBDT',
    category: 'TDS / TCS',
    docType: 'Circular',
    referenceNumber: 'Circular No. 14/2026',
    date: '2026-08-30',
    title: 'Guidelines on TDS deduction under Section 194-O & Section 194-Q for multi-e-commerce transactions',
    summary: 'Step-by-step guidance clarifying the hierarchy between Section 194-O (e-commerce operator), Section 194-Q (buyer TDS), and Section 206C(1H) (seller TCS) to prevent duplicate deductions.',
    effectiveDate: '2026-09-01',
    impact: 'Online sellers, aggregators, and enterprise buyers avoid dual deduction on same transaction value.',
    officialLink: 'https://incometaxindia.gov.in'
  }
];

// API: Get latest taxation updates
app.get('/api/tax-notifications', (req, res) => {
  const { authority, category, search } = req.query;
  let results = [...TAX_NOTIFICATIONS];

  if (authority && authority !== 'ALL') {
    results = results.filter(item => item.authority.toLowerCase() === String(authority).toLowerCase());
  }
  if (category && category !== 'ALL') {
    results = results.filter(item => item.category.toLowerCase().includes(String(category).toLowerCase()));
  }
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.referenceNumber.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.impact.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: results.length,
    updatedAt: new Date().toISOString(),
    notifications: results
  });
});

// API: Tax Advisory & Compliance Advice Assistant
app.post('/api/tax-adviser', async (req, res) => {
  const { query, context } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are TaxSahayak, an expert Indian Chartered Accountant and Tax Compliance Specialist.
The user is asking a question related to Indian Income Tax, GST, TDS, E-Way Bill, Tax Audit, or MCA corporate compliance.

Context provided by the user: ${context || 'General query from small business owner or tax practitioner'}
User Query: ${query}

Provide a concise, practical, highly accurate response tailored to Indian tax laws:
1. Legal Provisions / Relevant Sections / Rules (e.g. Sec 43B(h), Sec 47, Sec 234F, Rule 37A).
2. Actionable advice and deadlines.
3. Common pitfalls or late fees / interest penalties to avoid.
Keep the explanation clear, professional, structured with bullet points. Avoid legal disclaimers longer than one brief sentence.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        answer: response.text,
        source: 'AI-Generated Professional Advice'
      });
    } catch (err: any) {
      console.error('Gemini advisory error:', err);
      // Fallback gracefully below
    }
  }

  // Curated knowledge fallback if no API key or API call issue
  const qLower = query.toLowerCase();
  let fallbackAnswer = '';

  if (qLower.includes('43b') || qLower.includes('msme') || qLower.includes('45 day')) {
    fallbackAnswer = `### Section 43B(h) MSME Payment Compliance
- **Applicability:** Applies to payments for goods/services purchased from micro and small enterprises registered under Udyam.
- **Time Limit:** Payment must be made within the written agreement period (maximum 45 days) or within 15 days if no written agreement exists.
- **Disallowance:** If unpaid within the statutory timeline by the end of the financial year, the expense is disallowed in the current year and allowed only in the year of actual payment.
- **Exceptions:** Does not apply to wholesale or retail traders, only manufacturing and service enterprises.`;
  } else if (qLower.includes('late fee') || qLower.includes('gstr-3b') || qLower.includes('section 47')) {
    fallbackAnswer = `### GST Late Fee & Interest Rules
- **Late Fee (Sec 47):**
  - Nil Return: ₹20/day (₹10 CGST + ₹10 SGST), maximum cap ₹500.
  - Taxpayers with Turnover up to ₹1.5 Cr: ₹50/day, capped at ₹2,000.
  - Turnover ₹1.5 Cr to ₹5 Cr: ₹50/day, capped at ₹5,000.
  - Turnover above ₹5 Cr: ₹50/day, capped at ₹10,000.
- **Interest (Sec 50):** 18% per annum calculated strictly on net tax liability paid through Electronic Cash Ledger from the day following the due date until the date of payment.`;
  } else if (qLower.includes('234f') || qLower.includes('itr') || qLower.includes('belated')) {
    fallbackAnswer = `### Income Tax Late Filing Fee (Section 234F) & Belated Return
- **Section 234F Fee:**
  - Total income up to ₹5,00,000: ₹1,000.
  - Total income above ₹5,00,000: ₹5,000.
- **Belated Return Deadline:** Under Section 139(4), can be filed up to 31st December of the Assessment Year with late fee.
- **Loss Carry Forward:** Filing after the due date forfeits the right to carry forward business losses and capital losses (except house property loss).`;
  } else {
    fallbackAnswer = `### General Tax Compliance Guidance
- **Timely Filing:** Filing returns prior to the statutory due date prevents Section 47 GST late fees, Section 234A/B/C interest, and Section 234F penalties.
- **Reconciliation:** Reconcile GSTR-2B with Purchase Register every month before approving GSTR-3B to maximize ITC and avoid Rule 37A reversals.
- **TDS Deposits:** Deposit deducted TDS by the 7th of the following month (30th April for March) using Challan ITNS 281 to avoid 1.5% monthly interest.`;
  }

  res.json({
    success: true,
    answer: fallbackAnswer,
    source: 'TaxSahayak Standard Statutory Reference'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Production static serving vs Dev Vite Middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`TaxSahayak Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
