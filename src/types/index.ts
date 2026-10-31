export type TaxType = 'GST' | 'INCOME_TAX' | 'TDS' | 'AUDIT' | 'MCA';

export type FilingStatus = 'PENDING' | 'DOCUMENTS_AWAITED' | 'IN_PROGRESS' | 'FILED' | 'OVERDUE';

export interface Client {
  id: string;
  name: string;
  tradeName?: string;
  phone: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  clientType: 'Proprietorship' | 'Partnership' | 'Pvt Ltd' | 'Individual' | 'LLP' | 'HUF';
  logoUrl?: string; // Client Firm Logo
  
  // GST Registration Details
  gstin?: string;
  filingFrequency: 'MONTHLY' | 'QRMP';
  isComposition: boolean;
  gstUsername?: string;
  gstPassword?: string;

  // Udyam MSME Registration
  udyamNumber?: string; // e.g. UDYAM-RJ-08-0012345
  msmeCategory?: 'Micro' | 'Small' | 'Medium' | 'Not Registered';
  isMsme43BhApplicable?: boolean; // Section 43B(h) applicability

  // Income Tax Details & Portal ID Password
  pan?: string;
  tan?: string;
  incomeTaxId?: string;
  incomeTaxPassword?: string;
  annualIncomeSlab?: string; // e.g. "Below ₹5 Lakh", "₹5L - ₹10L", "₹10L - ₹50L", "Above ₹50L", "Presumptive 44AD/ADA"
  auditApplicable: boolean;

  // E-Way Bill Portal Login
  ewayBillUsername?: string;
  ewayBillPassword?: string;

  // TRACES / TDS Login
  tracesUsername?: string;
  tracesPassword?: string;

  notes?: string;
  createdAt: string;
}

export interface TaxFiling {
  id: string;
  clientId: string;
  clientName: string;
  taxType: TaxType;
  returnForm: string; // 'GSTR-1' | 'GSTR-3B' | 'CMP-08' | 'GSTR-9' | 'GSTR-9C' | 'IFF' | 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4' | 'ITR-5' | 'ITR-6' | 'FORM-3CA-CD' | 'FORM-3CB-CD' | '24Q' | '26Q' | '27Q' | '27EQ' | 'AOC-4' | 'MGT-7';
  financialYear: string;
  assessmentYear?: string;
  period: string; // e.g. "October 2026", "Q2 (Jul - Sep 2026)", "FY 2025-26"
  dueDate: string; // YYYY-MM-DD
  extensionDate?: string; // YYYY-MM-DD
  filingDate?: string; // Actual date of filing YYYY-MM-DD
  status: FilingStatus;
  ackNumber?: string; // ARN / Token Number / ITR V Ack
  taxPaid?: number; // Challan amount paid
  notes?: string;
  lastUpdated: string;
}

export interface CredentialVaultItem {
  id: string; // clientId
  clientName: string;
  phone?: string;
  whatsappNumber?: string;
  address?: string;
  logoUrl?: string; // Client Firm Logo
  gstin?: string;
  pan?: string;
  udyamNumber?: string;
  annualIncomeSlab?: string;
  gstUsername?: string;
  gstPassword?: string;
  incomeTaxId?: string; // Usually PAN or User ID
  incomeTaxPassword?: string;
  ewayBillUsername?: string;
  ewayBillPassword?: string;
  tracesUsername?: string;
  tracesPassword?: string;
  notes?: string;
  updatedAt: string;
}

export type PaymentType = 'DEBIT' | 'CREDIT'; // DEBIT = Bill/Fee charged, CREDIT = Payment received
export type PaymentMode = 'UPI' | 'NEFT_RTGS' | 'CASH' | 'CHEQUE' | 'OTHER';

export interface ClientPaymentRecord {
  id: string;
  clientId: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  type: PaymentType;
  amount: number;
  narration: string;
  paymentMode: PaymentMode;
  referenceNumber?: string; // Transaction ID, UTR, Cheque No.
  status: 'CLEARED' | 'PENDING';
  createdAt: string;
}

export interface TaxAdviceArticle {
  id: string;
  title: string;
  category: 'GST' | 'INCOME_TAX' | 'TDS' | 'AUDIT' | 'MSME' | 'E_WAY_BILL';
  readTime: string;
  publishedDate: string;
  summary: string;
  keyTakeaways: string[];
  content: string;
  legalReferences: string[];
}

export interface TaxNotificationItem {
  id: string;
  authority: 'CBDT' | 'CBIC' | 'MCA';
  category: string;
  docType: 'Circular' | 'Notification' | 'Advisory' | 'Order';
  referenceNumber: string;
  date: string;
  title: string;
  summary: string;
  effectiveDate?: string;
  impact: string;
  officialLink: string;
}

export interface FirmProfile {
  firmName: string;
  practitionerName: string;
  designation: string; // Tax Consultant / Advocate / Chartered Accountant
  membershipNo?: string;
  phone: string;
  email: string;
  upiId?: string;
  bankDetails?: string;
  officeAddress?: string;
}

export interface DeadlineAlert {
  filing: TaxFiling;
  daysRemaining: number;
  urgency: 'OVERDUE' | 'DUE_TODAY' | 'DUE_3_DAYS' | 'DUE_7_DAYS';
  message: string;
}

export interface PortfolioClient {
  id: string;
  name: string;
  since: number;
  category: string;
  location?: string;
  logoUrl?: string;
  services?: string;
  badgeColor?: string;
}
