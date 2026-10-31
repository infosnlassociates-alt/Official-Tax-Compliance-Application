import { TaxFiling, ClientPaymentRecord, TaxNotificationItem, FirmProfile } from '../types';

/**
 * Format phone number for WhatsApp API
 * Ensures country code (default 91 for India if 10 digits provided)
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Trigger WhatsApp Web or App with pre-filled message
 */
export function openWhatsApp(phone: string, text: string): void {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedText = encodeURIComponent(text);
  const url = formattedPhone
    ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Template: Tax Deadline Reminder (GST, ITR, TDS, Audit)
 */
export function createTaxDeadlineMessage(params: {
  clientName: string;
  returnForm: string;
  taxType: string;
  period: string;
  dueDate: string;
  extensionDate?: string;
  firm: FirmProfile;
  notes?: string;
}): string {
  const { clientName, returnForm, taxType, period, dueDate, extensionDate, firm, notes } = params;
  const effectiveDue = extensionDate || dueDate;

  let docsChecklist = '';
  if (taxType === 'GST') {
    docsChecklist = '• Outward Sales Register / Invoices (B2B & B2C)\n• Purchase Invoices & Credit Notes for GSTR-2B matching\n• Bank Statements / Challan receipts';
  } else if (taxType === 'INCOME_TAX' || taxType === 'AUDIT') {
    docsChecklist = '• Annual Financial Statements / Tally Backup\n• Form 26AS, AIS & TIS copies\n• Bank Statements (April to March)\n• Interest certificates & Investment proofs';
  } else if (taxType === 'TDS') {
    docsChecklist = '• Monthly Challan 281 receipts with BSR Codes\n• Deductee PAN list & payment vouchers\n• Salary structural sheets (for Form 24Q)';
  } else {
    docsChecklist = '• Signed compliance declarations & relevant supporting vouchers';
  }

  return `*TAX COMPLIANCE REMINDER* 🏛️
────────────────────────
Dear *${clientName}*,

Greetings from *${firm.firmName}*.

This is a gentle reminder regarding your upcoming statutory tax compliance:

📋 *Return / Compliance:* ${returnForm} (${taxType})
🗓️ *Period:* ${period}
⏰ *Statutory Due Date:* ${effectiveDue}${extensionDate ? ` _(Extended via Official Circular)_` : ''}

*Required Documents / Data:*
${docsChecklist}

${notes ? `📌 *Special Note:* ${notes}\n\n` : ''}⚠️ *To avoid statutory late fees under Section 47/234 and interest liability, please share your data at the earliest.*

For any assistance or queries, please feel free to reach out to us.

Warm regards,
*${firm.practitionerName}*
${firm.firmName}
📞 ${firm.phone} | ✉️ ${firm.email}`;
}

/**
 * Template: Outstanding Payment Reminder
 */
export function createPaymentReminderMessage(params: {
  clientName: string;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
  recentNarration?: string;
  firm: FirmProfile;
}): string {
  const { clientName, totalBilled, totalPaid, outstandingBalance, recentNarration, firm } = params;

  return `*PAYMENT REMINDER & STATEMENT* 💳
────────────────────────
Dear *${clientName}*,

Greetings from *${firm.firmName}*.

We hope you are having a productive week. We are sharing an updated summary of your professional account with our firm:

📊 *Total Professional Fees Billed:* ₹${totalBilled.toLocaleString('en-IN')}
✅ *Total Payments Received:* ₹${totalPaid.toLocaleString('en-IN')}
🚨 *Current Outstanding Balance:* *₹${outstandingBalance.toLocaleString('en-IN')}*

${recentNarration ? `📝 *Recent Service / Narration:* ${recentNarration}\n\n` : ''}*Bank & Digital Payment Details:*
• *UPI ID:* ${firm.upiId || 'Available on request'}
• *Bank Account:* ${firm.bankDetails || 'Available on request'}

Kindly arrange the payment at your earliest convenience to facilitate uninterrupted filing and portal filings. Please share a screenshot or UTR number once processed.

Thank you for your valued association!

Warm regards,
*${firm.practitionerName}*
${firm.firmName}
📞 ${firm.phone}`;
}

/**
 * Template: Payment Receipt / Credit Acknowledgment
 */
export function createPaymentReceiptMessage(params: {
  clientName: string;
  amount: number;
  date: string;
  referenceNumber?: string;
  narration: string;
  remainingBalance: number;
  firm: FirmProfile;
}): string {
  const { clientName, amount, date, referenceNumber, narration, remainingBalance, firm } = params;

  return `*PAYMENT RECEIPT ACKNOWLEDGMENT* 🧾
────────────────────────
Dear *${clientName}*,

We gratefully acknowledge receipt of your payment:

💰 *Amount Received:* ₹${amount.toLocaleString('en-IN')}
📅 *Date of Receipt:* ${date}
${referenceNumber ? `🔢 *Reference / UTR:* ${referenceNumber}\n` : ''}📝 *Particulars:* ${narration}
⚖️ *Remaining Balance:* ₹${remainingBalance.toLocaleString('en-IN')}

Thank you for your prompt settlement!

Best regards,
*${firm.firmName}*
📞 ${firm.phone}`;
}

/**
 * Template: Filing Completion Confirmation (ARN / Ack share)
 */
export function createFilingConfirmationMessage(params: {
  clientName: string;
  returnForm: string;
  period: string;
  filingDate: string;
  ackNumber: string;
  taxPaid?: number;
  firm: FirmProfile;
}): string {
  const { clientName, returnForm, period, filingDate, ackNumber, taxPaid, firm } = params;

  return `*TAX RETURN FILING CONFIRMATION* ✅
────────────────────────
Dear *${clientName}*,

We are pleased to inform you that your tax return has been successfully filed with the Government Portal:

📋 *Return Type:* ${returnForm}
🗓️ *Period / AY:* ${period}
📅 *Date of Filing:* ${filingDate}
🏷️ *Acknowledgment / ARN:* *${ackNumber}*
${taxPaid && taxPaid > 0 ? `💵 *Challan Tax Paid:* ₹${taxPaid.toLocaleString('en-IN')}\n` : ''}
The filed acknowledgment and computation sheet have been archived in our records and are available upon request.

Thank you for maintaining timely compliance with us!

Warm regards,
*${firm.firmName}*
📞 ${firm.phone}`;
}

/**
 * Template: Official Taxation Notification Summary
 */
export function createNotificationShareMessage(item: TaxNotificationItem, firm: FirmProfile): string {
  return `*TAXATION ALERT / CIRCULAR UPDATE* 📢
────────────────────────
*${item.authority} Update:* ${item.referenceNumber}
📅 *Date:* ${item.date}

📌 *Subject:* ${item.title}

*Key Highlights & Summary:*
${item.summary}

💼 *Direct Impact:*
${item.impact}

Shared for your information and proactive compliance by *${firm.firmName}*.
📞 ${firm.phone} | ✉️ ${firm.email}`;
}
