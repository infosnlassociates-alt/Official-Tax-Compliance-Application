export interface GstLateFeeResult {
  delayDays: number;
  cgstLateFee: number;
  sgstLateFee: number;
  totalLateFee: number;
  maxCapApplied: boolean;
  maxCapAmount: number;
  dailyRate: number;
  interestAmount: number;
  totalPayable: number;
  breakdown: string[];
}

export function calculateGstLateFee(params: {
  dueDate: string;
  filingDate: string;
  isNilReturn: boolean;
  turnoverCategory: 'UP_TO_1_5_CR' | 'FROM_1_5_TO_5_CR' | 'ABOVE_5_CR';
  netCashTaxLiability: number;
}): GstLateFeeResult {
  const { dueDate, filingDate, isNilReturn, turnoverCategory, netCashTaxLiability } = params;

  const due = new Date(dueDate);
  const filed = new Date(filingDate);

  // Normalize time to midnight
  due.setHours(0, 0, 0, 0);
  filed.setHours(0, 0, 0, 0);

  const diffTime = filed.getTime() - due.getTime();
  const delayDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  if (delayDays === 0) {
    return {
      delayDays: 0,
      cgstLateFee: 0,
      sgstLateFee: 0,
      totalLateFee: 0,
      maxCapApplied: false,
      maxCapAmount: 0,
      dailyRate: 0,
      interestAmount: 0,
      totalPayable: 0,
      breakdown: ['Return filed on or before due date. No late fee or interest applicable.']
    };
  }

  let dailyRate = 50; // default ₹25 CGST + ₹25 SGST
  let maxCap = 10000; // default ₹5000 CGST + ₹5000 SGST

  if (isNilReturn) {
    dailyRate = 20; // ₹10 CGST + ₹10 SGST
    maxCap = 500; // ₹250 CGST + ₹250 SGST
  } else if (turnoverCategory === 'UP_TO_1_5_CR') {
    dailyRate = 50;
    maxCap = 2000;
  } else if (turnoverCategory === 'FROM_1_5_TO_5_CR') {
    dailyRate = 50;
    maxCap = 5000;
  } else {
    dailyRate = 50;
    maxCap = 10000;
  }

  const rawLateFee = delayDays * dailyRate;
  const totalLateFee = Math.min(rawLateFee, maxCap);
  const maxCapApplied = rawLateFee > maxCap;
  const cgstLateFee = Math.round(totalLateFee / 2);
  const sgstLateFee = totalLateFee - cgstLateFee;

  // Section 50 Interest @ 18% p.a. on net cash tax
  const annualInterestRate = 0.18;
  const interestAmount = netCashTaxLiability > 0
    ? Math.round((netCashTaxLiability * annualInterestRate * delayDays) / 365)
    : 0;

  const totalPayable = totalLateFee + interestAmount;

  const breakdown: string[] = [
    `Delay period: ${delayDays} day(s) from due date ${dueDate} to ${filingDate}`,
    `Daily Late Fee rate: ₹${dailyRate}/day (₹${dailyRate / 2} CGST + ₹${dailyRate / 2} SGST)`,
    maxCapApplied
      ? `Statutory maximum cap reached: Capped at ₹${maxCap.toLocaleString('en-IN')} (Raw calculation: ₹${rawLateFee.toLocaleString('en-IN')})`
      : `Total Late Fee: ₹${totalLateFee.toLocaleString('en-IN')}`,
    netCashTaxLiability > 0
      ? `Section 50 Interest: ₹${interestAmount.toLocaleString('en-IN')} @ 18% p.a. on cash liability of ₹${netCashTaxLiability.toLocaleString('en-IN')} for ${delayDays} days`
      : `Section 50 Interest: ₹0 (No net cash tax liability indicated)`
  ];

  return {
    delayDays,
    cgstLateFee,
    sgstLateFee,
    totalLateFee,
    maxCapApplied,
    maxCapAmount: maxCap,
    dailyRate,
    interestAmount,
    totalPayable,
    breakdown
  };
}

export interface IncomeTaxLateFeeResult {
  delayMonths: number;
  lateFee234F: number;
  interest234A: number;
  totalPayable: number;
  canFileBelated: boolean;
  breakdown: string[];
}

export function calculateIncomeTaxLateFee(params: {
  dueDate: string;
  filingDate: string;
  totalTaxableIncome: number;
  unpaidTaxLiability: number;
}): IncomeTaxLateFeeResult {
  const { dueDate, filingDate, totalTaxableIncome, unpaidTaxLiability } = params;

  const due = new Date(dueDate);
  const filed = new Date(filingDate);
  due.setHours(0, 0, 0, 0);
  filed.setHours(0, 0, 0, 0);

  if (filed <= due) {
    return {
      delayMonths: 0,
      lateFee234F: 0,
      interest234A: 0,
      totalPayable: 0,
      canFileBelated: true,
      breakdown: ['Return furnished on or before due date under Section 139(1). No 234F fee or 234A interest.']
    };
  }

  // Calculate delay in months (or part of month) for Section 234A
  const yearDiff = filed.getFullYear() - due.getFullYear();
  const monthDiff = filed.getMonth() - due.getMonth();
  let delayMonths = yearDiff * 12 + monthDiff;
  if (filed.getDate() > due.getDate() || delayMonths === 0) {
    delayMonths += 1;
  }

  // Section 234F fee
  let lateFee234F = 5000;
  if (totalTaxableIncome <= 500000) {
    lateFee234F = 1000;
  }

  // Belated return window check: FY year-end December 31
  const assessmentYearEnd = new Date(due.getFullYear(), 11, 31);
  const canFileBelated = filed <= assessmentYearEnd;

  // Section 234A Interest @ 1% per month or part of month on unpaid tax
  const interest234A = unpaidTaxLiability > 0
    ? Math.round(unpaidTaxLiability * 0.01 * delayMonths)
    : 0;

  const totalPayable = lateFee234F + interest234A;

  const breakdown: string[] = [
    `Section 234F Late Filing Fee: ₹${lateFee234F.toLocaleString('en-IN')} (${totalTaxableIncome <= 500000 ? 'Total income ≤ ₹5 Lakh' : 'Total income > ₹5 Lakh'})`,
    `Section 234A Interest: ₹${interest234A.toLocaleString('en-IN')} (1% per month for ${delayMonths} month(s) on unpaid tax ₹${unpaidTaxLiability.toLocaleString('en-IN')})`,
    canFileBelated
      ? `Belated Return under Section 139(4): Permitted until December 31 of Assessment Year.`
      : `⚠️ Warning: Filing is after December 31 deadline. Requires condonation petition under Section 119(2)(b) or updated return (ITR-U) under Section 139(8A).`
  ];

  return {
    delayMonths,
    lateFee234F,
    interest234A,
    totalPayable,
    canFileBelated,
    breakdown
  };
}

export interface TdsLateFeeResult {
  delayDays: number;
  feePerDay: number;
  totalLateFee234E: number;
  cappedAtTotalTds: boolean;
  interest201_1A: number;
  totalPayable: number;
  breakdown: string[];
}

export function calculateTdsLateFee(params: {
  dueDate: string;
  filingDate: string;
  totalTdsAmount: number;
  monthsDelayedPayment: number;
}): TdsLateFeeResult {
  const { dueDate, filingDate, totalTdsAmount, monthsDelayedPayment } = params;

  const due = new Date(dueDate);
  const filed = new Date(filingDate);
  due.setHours(0, 0, 0, 0);
  filed.setHours(0, 0, 0, 0);

  const diffTime = filed.getTime() - due.getTime();
  const delayDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  if (delayDays === 0) {
    return {
      delayDays: 0,
      feePerDay: 200,
      totalLateFee234E: 0,
      cappedAtTotalTds: false,
      interest201_1A: 0,
      totalPayable: 0,
      breakdown: ['TDS Statement furnished within statutory due date. No Section 234E late fee.']
    };
  }

  const rawFee = delayDays * 200;
  const totalLateFee234E = Math.min(rawFee, totalTdsAmount);
  const cappedAtTotalTds = rawFee > totalTdsAmount;

  // Sec 201(1A)(ii) interest on late deposit @ 1.5% per month
  const interest201_1A = monthsDelayedPayment > 0
    ? Math.round(totalTdsAmount * 0.015 * monthsDelayedPayment)
    : 0;

  const totalPayable = totalLateFee234E + interest201_1A;

  const breakdown: string[] = [
    `Section 234E Fee: ₹200/day for ${delayDays} day(s) = ₹${rawFee.toLocaleString('en-IN')}`,
    cappedAtTotalTds
      ? `Statutory Cap Applied: Late fee under Sec 234E cannot exceed total TDS amount (₹${totalTdsAmount.toLocaleString('en-IN')})`
      : `Fee within permissible TDS threshold`,
    interest201_1A > 0
      ? `Section 201(1A) Interest for delayed deposit: ₹${interest201_1A.toLocaleString('en-IN')} (1.5% per month for ${monthsDelayedPayment} month(s))`
      : `Deposit interest: None calculated.`
  ];

  return {
    delayDays,
    feePerDay: 200,
    totalLateFee234E,
    cappedAtTotalTds,
    interest201_1A,
    totalPayable,
    breakdown
  };
}
