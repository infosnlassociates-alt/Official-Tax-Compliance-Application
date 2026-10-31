import { Client, TaxFiling, CredentialVaultItem, ClientPaymentRecord, TaxAdviceArticle, FirmProfile, PortfolioClient } from '../types';

export const DEFAULT_FIRM_PROFILE: FirmProfile = {
  firmName: 'Shri Navya Lekha Associates',
  practitionerName: 'Mr. Naveen Shrotriya “Utkarsh”',
  designation: 'Hindi Poet | SNLA Founder | Accountant',
  membershipNo: 'TAX-CON/2018/8492',
  phone: '+91 84 4008-4006 | +91 84 4181-2152',
  email: 'info.snlassociates@gmail.com',
  upiId: '9549899145@upi',
  bankDetails: 'State Bank of India | A/c No: 38291048291 | IFSC: SBIN0001824 | Branch: Commercial Complex Branch',
  officeAddress: 'Shrotriya Mansion, Bhagwati Colony, Bayana Zip - 321401'
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Apex Precision Engineering Works',
    tradeName: 'Apex Precision',
    gstin: '27AABCA1234D1Z5',
    pan: 'AABCA1234D',
    tan: 'PNEA12345C',
    phone: '9822144550',
    email: 'accounts@apexprecision.in',
    clientType: 'Pvt Ltd',
    filingFrequency: 'MONTHLY',
    isComposition: false,
    auditApplicable: true,
    address: 'Plot 42, Bhosari MIDC, Pune - 411026',
    notes: 'Manufacturer of auto components. Tax audit mandatory under Section 44AB. High volume of E-Way Bills.',
    createdAt: '2026-01-10'
  },
  {
    id: 'cli-2',
    name: 'Balaji Hardware & Sanitary Mart',
    tradeName: 'Balaji Traders',
    gstin: '27BBRPM9876E1Z2',
    pan: 'BBRPM9876E',
    tan: '',
    phone: '9422033112',
    email: 'ramesh.balaji@gmail.com',
    clientType: 'Proprietorship',
    filingFrequency: 'MONTHLY',
    isComposition: false,
    auditApplicable: false,
    address: 'Shop 14, Main Market Yard, Pune - 411037',
    notes: 'Wholesale and retail distributor. Requires regular B2B E-Way Bill support and monthly GSTR-3B filing.',
    createdAt: '2026-02-14'
  },
  {
    id: 'cli-3',
    name: 'Sai Krupa Caterers & Sweets',
    tradeName: 'Sai Krupa Foods',
    gstin: '27AADCS5544K1ZR',
    pan: 'AADCS5544K',
    tan: '',
    phone: '9890211223',
    email: 'saikrupa.pune@yahoo.com',
    clientType: 'Partnership',
    filingFrequency: 'QRMP',
    isComposition: true,
    auditApplicable: false,
    address: 'Opposite City Station, Laxmi Road, Pune - 411030',
    notes: 'Composition scheme under Section 10 (1% tax on turnover). Files CMP-08 quarterly and GSTR-4 annually.',
    createdAt: '2026-03-01'
  },
  {
    id: 'cli-4',
    name: 'Dr. Vivek S. Kulkarni',
    tradeName: 'Kulkarni Multispeciality Eye Clinic',
    gstin: '',
    pan: 'AFKPK7788P',
    tan: 'PNEK09876B',
    phone: '9860155667',
    email: 'dr.vivek.eye@gmail.com',
    clientType: 'Individual',
    filingFrequency: 'QRMP',
    isComposition: false,
    auditApplicable: true,
    address: 'Clinic No. 3, Shivaji Nagar, Pune - 411005',
    notes: 'Professional medical services (Presumptive 44ADA or regular 44AB). Regular quarterly TDS 26Q & 24Q deductee.',
    createdAt: '2026-04-15'
  },
  {
    id: 'cli-5',
    name: 'Nexus Cloud Technologies LLP',
    tradeName: 'Nexus Cloud Tech',
    gstin: '27AALCN8822M1ZW',
    pan: 'AALCN8822M',
    tan: 'PNEN55443A',
    phone: '9765432100',
    email: 'finance@nexuscloud.io',
    clientType: 'LLP',
    filingFrequency: 'MONTHLY',
    isComposition: false,
    auditApplicable: true,
    address: 'Baner Tech Park, Phase 1, Pune - 411045',
    notes: 'SaaS export of services (LUT filing active). Export refund claims under GST Form RFD-01 and MCA Form 8/11 compliance.',
    createdAt: '2026-05-20'
  }
];

export const INITIAL_FILINGS: TaxFiling[] = [
  // GST Upcoming & Overdue Reminders
  {
    id: 'filing-1',
    clientId: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    taxType: 'GST',
    returnForm: 'GSTR-3B',
    financialYear: '2026-27',
    period: 'October 2026',
    dueDate: '2026-11-20',
    status: 'DOCUMENTS_AWAITED',
    notes: 'Sales invoice tally pending. Needs bank statement for RCM check.',
    lastUpdated: '2026-10-30'
  },
  {
    id: 'filing-2',
    clientId: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    taxType: 'GST',
    returnForm: 'GSTR-1',
    financialYear: '2026-27',
    period: 'October 2026',
    dueDate: '2026-11-11',
    status: 'IN_PROGRESS',
    notes: 'B2B e-invoices reconciled with Tally export.',
    lastUpdated: '2026-10-31'
  },
  {
    id: 'filing-3',
    clientId: 'cli-2',
    clientName: 'Balaji Hardware & Sanitary Mart',
    taxType: 'GST',
    returnForm: 'GSTR-3B',
    financialYear: '2026-27',
    period: 'September 2026',
    dueDate: '2026-10-20',
    filingDate: '2026-10-19',
    status: 'FILED',
    ackNumber: 'AA2710260482914',
    taxPaid: 48520,
    notes: 'Filed in time. Net cash paid via ICICI Bank Netbanking.',
    lastUpdated: '2026-10-19'
  },
  {
    id: 'filing-4',
    clientId: 'cli-2',
    clientName: 'Balaji Hardware & Sanitary Mart',
    taxType: 'GST',
    returnForm: 'GSTR-1',
    financialYear: '2026-27',
    period: 'October 2026',
    dueDate: '2026-11-11',
    status: 'PENDING',
    notes: 'Purchase GSTR-2B downloaded. Awaiting client sales summary.',
    lastUpdated: '2026-10-28'
  },
  {
    id: 'filing-5',
    clientId: 'cli-3',
    clientName: 'Sai Krupa Caterers & Sweets',
    taxType: 'GST',
    returnForm: 'CMP-08',
    financialYear: '2026-27',
    period: 'Q2 (Jul - Sep 2026)',
    dueDate: '2026-10-18',
    filingDate: '2026-10-17',
    status: 'FILED',
    ackNumber: 'AA2710260192837',
    taxPaid: 14200,
    notes: 'Composition tax 1% paid via cash ledger.',
    lastUpdated: '2026-10-17'
  },

  // Income Tax & Tax Audit Reminders
  {
    id: 'filing-6',
    clientId: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    taxType: 'AUDIT',
    returnForm: 'FORM-3CA-CD',
    financialYear: '2025-26',
    assessmentYear: '2026-27',
    period: 'FY 2025-26',
    dueDate: '2026-09-30',
    extensionDate: '2026-10-07',
    filingDate: '2026-10-05',
    status: 'FILED',
    ackNumber: 'ACK-3CA-26-891024',
    notes: 'Tax audit uploaded and e-verified with partner digital signature.',
    lastUpdated: '2026-10-05'
  },
  {
    id: 'filing-7',
    clientId: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    taxType: 'INCOME_TAX',
    returnForm: 'ITR-6',
    financialYear: '2025-26',
    assessmentYear: '2026-27',
    period: 'FY 2025-26 (Corporate)',
    dueDate: '2026-10-31',
    status: 'IN_PROGRESS',
    notes: 'Computation completed. Balance sheet MAT computation under 115JB finalized.',
    lastUpdated: '2026-10-30'
  },
  {
    id: 'filing-8',
    clientId: 'cli-4',
    clientName: 'Dr. Vivek S. Kulkarni',
    taxType: 'AUDIT',
    returnForm: 'FORM-3CB-CD',
    financialYear: '2025-26',
    assessmentYear: '2026-27',
    period: 'FY 2025-26',
    dueDate: '2026-09-30',
    extensionDate: '2026-10-07',
    filingDate: '2026-10-06',
    status: 'FILED',
    ackNumber: 'ACK-3CB-26-118833',
    notes: 'Form 3CB-3CD filed under Sec 44AB professional gross receipts limit.',
    lastUpdated: '2026-10-06'
  },
  {
    id: 'filing-9',
    clientId: 'cli-4',
    clientName: 'Dr. Vivek S. Kulkarni',
    taxType: 'INCOME_TAX',
    returnForm: 'ITR-3',
    financialYear: '2025-26',
    assessmentYear: '2026-27',
    period: 'FY 2025-26 (Audit Case)',
    dueDate: '2026-10-31',
    status: 'PENDING',
    notes: 'Awaiting client confirmation on 80D medical expenditure receipts.',
    lastUpdated: '2026-10-29'
  },
  {
    id: 'filing-10',
    clientId: 'cli-5',
    clientName: 'Nexus Cloud Technologies LLP',
    taxType: 'INCOME_TAX',
    returnForm: 'ITR-5',
    financialYear: '2025-26',
    assessmentYear: '2026-27',
    period: 'FY 2025-26 (LLP)',
    dueDate: '2026-10-31',
    status: 'DOCUMENTS_AWAITED',
    notes: 'Foreign inward remittance certificates (FIRC) pending from banker.',
    lastUpdated: '2026-10-25'
  },

  // TDS Return Reminders
  {
    id: 'filing-11',
    clientId: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    taxType: 'TDS',
    returnForm: '26Q',
    financialYear: '2026-27',
    period: 'Q2 (Jul - Sep 2026)',
    dueDate: '2026-10-31',
    filingDate: '2026-10-30',
    status: 'FILED',
    ackNumber: 'PRN-26Q-9812401',
    taxPaid: 84300,
    notes: 'Form 26Q filed at Protean TIN-FC center. Challans matched 100%.',
    lastUpdated: '2026-10-30'
  },
  {
    id: 'filing-12',
    clientId: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    taxType: 'TDS',
    returnForm: '24Q',
    financialYear: '2026-27',
    period: 'Q2 (Jul - Sep 2026)',
    dueDate: '2026-10-31',
    status: 'IN_PROGRESS',
    notes: 'Salary annexures prepared. Challan 281 BSR codes validated.',
    lastUpdated: '2026-10-31'
  },
  {
    id: 'filing-13',
    clientId: 'cli-5',
    clientName: 'Nexus Cloud Technologies LLP',
    taxType: 'TDS',
    returnForm: '26Q',
    financialYear: '2026-27',
    period: 'Q2 (Jul - Sep 2026)',
    dueDate: '2026-10-31',
    status: 'OVERDUE',
    notes: 'Challan verification pending from client finance manager. Late fee running under Section 234E @ ₹200/day.',
    lastUpdated: '2026-10-31'
  }
];

export const INITIAL_CREDENTIALS: CredentialVaultItem[] = [
  {
    id: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    gstin: '27AABCA1234D1Z5',
    pan: 'AABCA1234D',
    gstUsername: 'apex_pune_gst',
    gstPassword: 'Apex#Tax@2026!',
    incomeTaxId: 'AABCA1234D',
    incomeTaxPassword: 'Itax#Apex982!',
    ewayBillUsername: 'apex_ewb_411',
    ewayBillPassword: 'Ewb@Apex#2026',
    tracesUsername: 'APEX_TRACES',
    tracesPassword: 'Traces#Apex99',
    notes: 'Primary digital signature certificate (DSC) expires on Dec 2027. Director DIN: 02819241.',
    updatedAt: '2026-10-20'
  },
  {
    id: 'cli-2',
    clientName: 'Balaji Hardware & Sanitary Mart',
    gstin: '27BBRPM9876E1Z2',
    pan: 'BBRPM9876E',
    gstUsername: 'balaji_hdwr',
    gstPassword: 'Balaji#Gst$789',
    incomeTaxId: 'BBRPM9876E',
    incomeTaxPassword: 'Ramesh@Tax#123',
    ewayBillUsername: 'balaji_ewb_pune',
    ewayBillPassword: 'Ewb#Balaji441',
    tracesUsername: '',
    tracesPassword: '',
    notes: 'OTP sent to Ramesh Bhai personal mobile (ending 112).',
    updatedAt: '2026-09-15'
  },
  {
    id: 'cli-3',
    clientName: 'Sai Krupa Caterers & Sweets',
    gstin: '27AADCS5544K1ZR',
    pan: 'AADCS5544K',
    gstUsername: 'saikrupa_food',
    gstPassword: 'Krupa#Sweet!99',
    incomeTaxId: 'AADCS5544K',
    incomeTaxPassword: 'Sai@Krupa#ITR26',
    ewayBillUsername: '',
    ewayBillPassword: '',
    tracesUsername: '',
    tracesPassword: '',
    notes: 'Composition scheme. No E-Way bill login required.',
    updatedAt: '2026-08-10'
  },
  {
    id: 'cli-5',
    clientName: 'Nexus Cloud Technologies LLP',
    gstin: '27AALCN8822M1ZW',
    pan: 'AALCN8822M',
    gstUsername: 'nexus_cloud_gst',
    gstPassword: 'Nexus#Gst@404!',
    incomeTaxId: 'AALCN8822M',
    incomeTaxPassword: 'Nexus@ITR#2026',
    ewayBillUsername: 'nexus_ewb_ops',
    ewayBillPassword: 'Ewb#Nexus@2026',
    tracesUsername: 'NEXUS_TDS_TAN',
    tracesPassword: 'Traces#Nexus909',
    notes: 'DSC registered with Designated Partner. ICEGATE portal registration linked.',
    updatedAt: '2026-10-01'
  }
];

export const INITIAL_PAYMENTS: ClientPaymentRecord[] = [
  {
    id: 'pay-1',
    clientId: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    date: '2026-10-05',
    type: 'DEBIT',
    amount: 25000,
    narration: 'Professional Retainership & Tax Audit Report Form 3CA-3CD Certification fees for FY 2025-26',
    paymentMode: 'NEFT_RTGS',
    referenceNumber: 'INV-2026-084',
    status: 'CLEARED',
    createdAt: '2026-10-05'
  },
  {
    id: 'pay-2',
    clientId: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    date: '2026-10-12',
    type: 'CREDIT',
    amount: 25000,
    narration: 'Payment received via HDFC Bank NEFT UTR HDFCN26285918239 towards Inv 084',
    paymentMode: 'NEFT_RTGS',
    referenceNumber: 'HDFCN26285918239',
    status: 'CLEARED',
    createdAt: '2026-10-12'
  },
  {
    id: 'pay-3',
    clientId: 'cli-1',
    clientName: 'Apex Precision Engineering Works',
    date: '2026-10-25',
    type: 'DEBIT',
    amount: 12000,
    narration: 'Quarterly TDS Return Filing charges (Form 24Q & 26Q) and monthly GST compliance for Q2',
    paymentMode: 'OTHER',
    referenceNumber: 'INV-2026-102',
    status: 'PENDING',
    createdAt: '2026-10-25'
  },
  {
    id: 'pay-4',
    clientId: 'cli-2',
    clientName: 'Balaji Hardware & Sanitary Mart',
    date: '2026-09-20',
    type: 'DEBIT',
    amount: 4500,
    narration: 'Monthly GST Retainer (GSTR-1, GSTR-3B & E-Way Bill Reconciliation) for Aug 2026',
    paymentMode: 'UPI',
    referenceNumber: 'INV-2026-071',
    status: 'CLEARED',
    createdAt: '2026-09-20'
  },
  {
    id: 'pay-5',
    clientId: 'cli-2',
    clientName: 'Balaji Hardware & Sanitary Mart',
    date: '2026-09-28',
    type: 'CREDIT',
    amount: 4500,
    narration: 'Received via Google Pay UPI Ref 427192840192',
    paymentMode: 'UPI',
    referenceNumber: 'UPI/427192840192',
    status: 'CLEARED',
    createdAt: '2026-09-28'
  },
  {
    id: 'pay-6',
    clientId: 'cli-2',
    clientName: 'Balaji Hardware & Sanitary Mart',
    date: '2026-10-20',
    type: 'DEBIT',
    amount: 4500,
    narration: 'Monthly GST Retainer for September 2026 filing & IT Return assistance',
    paymentMode: 'UPI',
    referenceNumber: 'INV-2026-095',
    status: 'PENDING',
    createdAt: '2026-10-20'
  },
  {
    id: 'pay-7',
    clientId: 'cli-5',
    clientName: 'Nexus Cloud Technologies LLP',
    date: '2026-09-15',
    type: 'DEBIT',
    amount: 35000,
    narration: 'LLP Statutory Compliance, Form 11, Form 8 filing & GST Export LUT renewal services',
    paymentMode: 'NEFT_RTGS',
    referenceNumber: 'INV-2026-069',
    status: 'PENDING',
    createdAt: '2026-09-15'
  },
  {
    id: 'pay-8',
    clientId: 'cli-5',
    clientName: 'Nexus Cloud Technologies LLP',
    date: '2026-10-02',
    type: 'CREDIT',
    amount: 20000,
    narration: 'Part payment received via ICICI Bank RTGS UTR ICICR520261002008',
    paymentMode: 'NEFT_RTGS',
    referenceNumber: 'ICICR520261002008',
    status: 'CLEARED',
    createdAt: '2026-10-02'
  }
];

export const TAX_ADVICE_ARTICLES: TaxAdviceArticle[] = [
  {
    id: 'art-msme-43bh',
    title: 'Mastering Section 43B(h): MSME 45-Day Payment Rule & Form 3CD Compliance',
    category: 'MSME',
    readTime: '6 min read',
    publishedDate: '2026-10-20',
    summary: 'Everything businesses and auditors need to know about statutory payment timelines to micro & small enterprises, buyer disallowance, and how to verify supplier Udyam certificates.',
    keyTakeaways: [
      'Applies strictly to Micro (< ₹1 Cr investment & < ₹5 Cr turnover) and Small (< ₹10 Cr investment & < ₹50 Cr turnover) manufacturing and service suppliers.',
      'Wholesale and retail traders registered under Udyam are completely exempt as per Office Memorandum No. 5/2(2)/2021-E/P & CBDT Circular.',
      'Payment timeline is 15 days if no written contract exists; maximum 45 days if written agreement is in place.',
      'Disallowance in income tax computation if unpaid by March 31. Deduction allowed strictly in the year of actual payment under Section 43B(h).'
    ],
    content: `Section 43B(h) was introduced in the Finance Act 2023 to protect the working capital lifecycle of Micro and Small Enterprises (MSEs). Any sum payable by an assessee to a micro or small enterprise beyond the time limit specified in Section 15 of the MSMED Act, 2006 shall be disallowed as an expense in that financial year.

### Key Operational Rules:
1. **Classification Test:** Only 'Micro' and 'Small' enterprises are covered. Medium enterprises (turnover > ₹50 Cr or investment > ₹10 Cr) are outside the ambit of 43B(h).
2. **Trader Exemption:** In July 2021, the Ministry of MSME allowed retail and wholesale traders to register under Udyam strictly for Priority Sector Lending (PSL). Subsequent clarifications and judicial pronouncements establish that Chapter V of the MSMED Act does not extend to traders for delayed payment interest or 43B(h) disallowance.
3. **Audit Reporting in Form 3CD:** Clause 22 of Form 3CD mandates reporting the amount of interest inadmissible under Section 23 of the MSMED Act and any unpaid dues to MSEs at year-end.
4. **Action for Accountants:** Collect Udyam Registration Certificates from all vendors during onboarding. Segregate vendors into: (a) Micro/Small Manufacturer, (b) Micro/Small Service Provider, (c) Medium/Large, and (d) Traders.`,
    legalReferences: ['Section 43B(h) Income Tax Act, 1961', 'Section 15, 16 & 23 of MSMED Act, 2006', 'CBDT Circular No. 08/2026']
  },
  {
    id: 'art-itc-rule-37a',
    title: 'Rule 37A ITC Reversal & Re-Claim: Step-by-Step Practical Blueprint',
    category: 'GST',
    readTime: '5 min read',
    publishedDate: '2026-10-15',
    summary: 'How to handle Input Tax Credit availed on supplier invoices where the supplier has defaulted in filing GSTR-3B by November 30.',
    keyTakeaways: [
      'Mandatory reversal of ITC by November 30 following the end of the financial year in which ITC was availed.',
      'Reversal is reported in Table 4(B)(2) of GSTR-3B without interest if reversed within the stipulated timeline.',
      'If not reversed by November 30, interest at 18% per annum under Section 50 applies from December 1 until actual payment.',
      'Taxpayer can immediately re-claim the reversed ITC under Table 4(A)(5) whenever the supplier subsequently files their GSTR-3B return.'
    ],
    content: `Rule 37A was inserted in the CGST Rules, 2017 to provide a statutory mechanism for reversing ITC where a supplier has furnished the details of outward supplies in GSTR-1/IFF, but failed to furnish GSTR-3B on or before 30th November following the end of financial year.

### The Problem:
Taxpayers take credit in good faith based on GSTR-2B reflecting the invoice. However, if the vendor fails to pay government taxes via GSTR-3B, the recipient cannot permanently hold the credit.

### Practical Steps for Practitioners:
1. Run a GSTR-2B vs Vendor Filing Status report in October every year.
2. Filter suppliers whose GSTR-3B for that financial year remains 'NOT FILED'.
3. Send an automated notice or WhatsApp reminder to defaulting suppliers demanding immediate return filing.
4. If unpaid by November 30, reverse the ITC in the October/November GSTR-3B under Table 4(B)(2).
5. Maintain a dedicated 'Rule 37A Reversal Ledger'. As soon as the supplier files the return, claim the credit back in Table 4(A)(5) and Table 4(D)(1).`,
    legalReferences: ['Rule 37A of CGST Rules, 2017', 'Section 16(2)(c) CGST Act, 2017', 'Section 50(1) Interest Provision']
  },
  {
    id: 'art-new-vs-old-regime',
    title: 'New Tax Regime (Sec 115BAC) vs Old Regime: Breakeven Thresholds',
    category: 'INCOME_TAX',
    readTime: '7 min read',
    publishedDate: '2026-10-02',
    summary: 'A mathematical comparison of the default New Tax Regime vs Old Tax Regime, detailing slab rates, standard deduction, rebate under 87A, and deduction breakeven points.',
    keyTakeaways: [
      'New Regime is the default regime under Section 115BAC(1A). Form 10-IEA required to opt out for business income.',
      'Standard deduction for salaried individuals is ₹75,000 under the New Regime.',
      'Full tax rebate under Section 87A applies up to taxable income of ₹7,00,000 in the New Regime (effective tax zero).',
      'For salaried employees, if total eligible deductions (80C + 80D + HRA + Home Loan Interest) exceed ₹3.75 Lakhs to ₹4.25 Lakhs, Old Regime may yield lower tax.'
    ],
    content: `The New Tax Regime provides reduced slab rates in exchange for forgoing most itemized deductions such as Section 80C (PPF/ELSS), 80D (Health Insurance), Section 24(b) (Loss from house property on self-occupied), and HRA.

### 2026-27 Slabs under 115BAC:
- Up to ₹3,00,000: Nil
- ₹3,00,001 to ₹7,00,000: 5%
- ₹7,00,001 to ₹10,00,000: 10%
- ₹10,00,001 to ₹12,00,000: 15%
- ₹12,00,001 to ₹15,00,000: 20%
- Above ₹15,00,000: 30%

### Critical Rule for Business Owners & Professionals:
Individual professionals and proprietors having business income (ITR-3, ITR-4) can only opt out of the New Regime ONCE in their lifetime by filing Form 10-IEA on or before the due date under Section 139(1). Once opted back into the New Regime, they cannot switch to the Old Regime again.`,
    legalReferences: ['Section 115BAC of Income Tax Act, 1961', 'Section 87A Tax Rebate', 'Form 10-IEA Rules']
  },
  {
    id: 'art-presumptive-taxation',
    title: 'Presumptive Taxation under Section 44AD, 44ADA & 44AE: Limits & Relief',
    category: 'INCOME_TAX',
    readTime: '6 min read',
    publishedDate: '2026-09-18',
    summary: 'Simplified taxation schemes for small businesses, freelancers, doctors, and transport operators without maintaining regular books of accounts.',
    keyTakeaways: [
      'Section 44AD turnover limit increased to ₹3 Crores if aggregate cash receipts do not exceed 5% of total turnover.',
      'Section 44ADA gross receipts limit increased to ₹75 Lakhs for specified professionals (doctors, engineers, CAs, IT consultants) with <= 5% cash receipts.',
      'Declared income must be at least 8% (6% for digital transactions) of turnover under 44AD, and at least 50% of gross receipts under 44ADA.',
      'No requirement to maintain books of accounts under Section 44AA or get accounts audited under Section 44AB.'
    ],
    content: `Presumptive taxation allows small business owners and professionals to pay tax on an estimated profit percentage without undergoing costly accounting and audit procedures.

### Key Considerations:
1. **Advance Tax:** Eligible assessees are required to pay the entire amount of advance tax in a single installment on or before 15th March of the financial year.
2. **5-Year Lock-in Rule for 44AD:** If an assessee declares profit under Section 44AD and in any of the subsequent 5 assessment years declares profit lower than the presumptive rate, they cannot opt for 44AD for the next 5 consecutive years and must undergo tax audit under 44AB if income exceeds the basic exemption limit. Note that this 5-year lock-in DOES NOT apply to professionals under Section 44ADA!`,
    legalReferences: ['Section 44AD, 44ADA, 44AE Income Tax Act, 1961', 'Section 44AA & 44AB Audit Thresholds']
  },
  {
    id: 'art-eway-bill-rules',
    title: 'E-Way Bill Compliance: Distance Calculation, Expiry & Detention Remedies',
    category: 'E_WAY_BILL',
    readTime: '5 min read',
    publishedDate: '2026-09-05',
    summary: 'A practitioner handbook on e-way bill generation rules, mandatory validity periods (200 km per day), and legal defenses during transit interception under Section 129.',
    keyTakeaways: [
      'Mandatory for consignment value exceeding ₹50,000 (inter-state, and intra-state as per state-specific limits e.g. ₹1 Lakh in Maharashtra).',
      'Validity is 1 day for up to 200 km (earlier 100 km) for normal cargo, and 1 day for every 20 km for Over Dimensional Cargo (ODC).',
      'Extension can be initiated within 8 hours before or after expiry of the validity period.',
      'Minor typographical errors in invoices or vehicle numbers can be rectified with a nominal ₹500/₹1,000 penalty under Circular 64/38/2018-GST instead of Section 129 200% penalty.'
    ],
    content: `E-Way Bill is an electronic document generated on the portal for tracking movement of goods. Failure to carry an active e-way bill or invalid Part-B vehicle details can lead to immediate vehicle interception, detention under Section 129, and confiscation under Section 130 of the CGST Act.

### Golden Rules for Small Businesses:
1. Always update Part-B (vehicle number) before dispatch. Merely filling Part-A does not create a valid transit document.
2. Ensure delivery pin-code to pin-code distance is calculated via automated portal route mapping.
3. If vehicle breaks down or faces transshipment, driver must notify the accounts office to extend validity within 8 hours.`,
    legalReferences: ['Rule 138, 138A, 138B of CGST Rules, 2017', 'Section 129 & 130 of CGST Act, 2017', 'CBIC Circular No. 64/38/2018-GST']
  }
];

export const INITIAL_PORTFOLIO_CLIENTS: PortfolioClient[] = [
  {
    id: 'pc-1',
    name: 'GUJRAT KHAD BHANDAR',
    since: 2017,
    category: 'Fertilizers & Agro Chemicals',
    location: 'Bayana, Rajasthan',
    services: 'GST Returns · Annual Audit · Section 43B(h) Verification',
    badgeColor: 'emerald'
  },
  {
    id: 'pc-2',
    name: 'Rahul Enterprises',
    since: 2017,
    category: 'Commercial Trading & Supplies',
    location: 'Bayana, Rajasthan',
    services: 'GSTR-1 & 3B · E-Way Bills · Income Tax Return',
    badgeColor: 'blue'
  },
  {
    id: 'pc-3',
    name: 'Soopa Honda',
    since: 2017,
    category: 'Automobile Dealership & Spares',
    location: 'Bayana, Rajasthan',
    services: 'Statutory Audit · TDS Filings · Monthly Ledger MIS',
    badgeColor: 'rose'
  },
  {
    id: 'pc-4',
    name: 'Vinay Khad Beej Bhandar',
    since: 2018,
    category: 'Agri Seeds, Pesticides & Nutrients',
    location: 'Bayana, Rajasthan',
    services: 'GST Compliance · MSME Udyam · Bank Credit Audits',
    badgeColor: 'amber'
  },
  {
    id: 'pc-5',
    name: 'Bhardwaj Khad Beej Bhandar',
    since: 2025,
    category: 'Agricultural Retail & Wholesale Mart',
    location: 'Bayana, Rajasthan',
    services: 'New GST Registration · QRMP Advisory · Books of Accounts',
    badgeColor: 'indigo'
  }
];
