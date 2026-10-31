import React, { useState } from 'react';
import { 
  Calculator, 
  Share2, 
  Copy, 
  Check, 
  HelpCircle, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  calculateGstLateFee, 
  calculateIncomeTaxLateFee, 
  calculateTdsLateFee,
  GstLateFeeResult,
  IncomeTaxLateFeeResult,
  TdsLateFeeResult
} from '../utils/taxCalculators';
import { openWhatsApp } from '../utils/whatsapp';
import { FirmProfile } from '../types';

interface LateFeeCalculatorProps {
  firmProfile: FirmProfile;
}

export const LateFeeCalculator: React.FC<LateFeeCalculatorProps> = ({ firmProfile }) => {
  const [activeTab, setActiveTab] = useState<'GST' | 'INCOME_TAX' | 'TDS'>('GST');
  const [copied, setCopied] = useState<boolean>(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // GST State
  const [gstDueDate, setGstDueDate] = useState<string>('2026-10-20');
  const [gstFilingDate, setGstFilingDate] = useState<string>(todayStr);
  const [gstIsNil, setGstIsNil] = useState<boolean>(false);
  const [gstTurnoverCategory, setGstTurnoverCategory] = useState<'UP_TO_1_5_CR' | 'FROM_1_5_TO_5_CR' | 'ABOVE_5_CR'>('UP_TO_1_5_CR');
  const [gstCashLiability, setGstCashLiability] = useState<number>(35000);
  const [gstClientName, setGstClientName] = useState<string>('Apex Precision');

  // Income Tax State
  const [itDueDate, setItDueDate] = useState<string>('2026-07-31');
  const [itFilingDate, setItFilingDate] = useState<string>(todayStr);
  const [itTotalIncome, setItTotalIncome] = useState<number>(750000);
  const [itUnpaidTax, setItUnpaidTax] = useState<number>(18000);
  const [itClientName, setItClientName] = useState<string>('Balaji Traders');

  // TDS State
  const [tdsDueDate, setTdsDueDate] = useState<string>('2026-10-31');
  const [tdsFilingDate, setTdsFilingDate] = useState<string>(todayStr);
  const [tdsTotalAmount, setTdsTotalAmount] = useState<number>(45000);
  const [tdsDelayedMonths, setTdsDelayedMonths] = useState<number>(1);
  const [tdsClientName, setTdsClientName] = useState<string>('Nexus Cloud Tech');

  // Computations
  const gstResult: GstLateFeeResult = calculateGstLateFee({
    dueDate: gstDueDate,
    filingDate: gstFilingDate,
    isNilReturn: gstIsNil,
    turnoverCategory: gstTurnoverCategory,
    netCashTaxLiability: gstCashLiability,
  });

  const itResult: IncomeTaxLateFeeResult = calculateIncomeTaxLateFee({
    dueDate: itDueDate,
    filingDate: itFilingDate,
    totalTaxableIncome: itTotalIncome,
    unpaidTaxLiability: itUnpaidTax,
  });

  const tdsResult: TdsLateFeeResult = calculateTdsLateFee({
    dueDate: tdsDueDate,
    filingDate: tdsFilingDate,
    totalTdsAmount: tdsTotalAmount,
    monthsDelayedPayment: tdsDelayedMonths,
  });

  // Prepare text summary for Copy or WhatsApp
  const generateShareSummary = (): string => {
    if (activeTab === 'GST') {
      return `*GST LATE FEE & INTEREST CALCULATION* 📊
Client: ${gstClientName}
Due Date: ${gstDueDate} | Filing Date: ${gstFilingDate}
Delay: ${gstResult.delayDays} day(s)

• Daily Rate: ₹${gstResult.dailyRate}/day (CGST ₹${gstResult.dailyRate/2} + SGST ₹${gstResult.dailyRate/2})
• Total Section 47 Late Fee: ₹${gstResult.totalLateFee.toLocaleString('en-IN')}${gstResult.maxCapApplied ? ` (Statutory Cap Applied)` : ''}
• Section 50 Interest @ 18% p.a.: ₹${gstResult.interestAmount.toLocaleString('en-IN')} (on net cash ₹${gstCashLiability.toLocaleString('en-IN')})
👉 *Total Amount Payable: ₹${gstResult.totalPayable.toLocaleString('en-IN')}*

Calculated via TaxSahayak · ${firmProfile.firmName}`;
    } else if (activeTab === 'INCOME_TAX') {
      return `*INCOME TAX LATE FEE (SEC 234F) & INTEREST (SEC 234A)* 📊
Client: ${itClientName}
Due Date: ${itDueDate} | Filing Date: ${itFilingDate}
Delay: ${itResult.delayMonths} month(s)

• Section 234F Late Filing Fee: ₹${itResult.lateFee234F.toLocaleString('en-IN')}
• Section 234A Interest @ 1%/mo: ₹${itResult.interest234A.toLocaleString('en-IN')}
👉 *Total Amount Payable: ₹${itResult.totalPayable.toLocaleString('en-IN')}*
Status: ${itResult.canFileBelated ? 'Eligible for Belated Return under Section 139(4)' : 'Post Dec 31: Requires Condonation or ITR-U'}

Calculated via TaxSahayak · ${firmProfile.firmName}`;
    } else {
      return `*TDS STATEMENT LATE FEE (SEC 234E) & INTEREST (SEC 201)* 📊
Client: ${tdsClientName}
Due Date: ${tdsDueDate} | Filing Date: ${tdsFilingDate}
Delay: ${tdsResult.delayDays} day(s)

• Section 234E Late Fee (₹200/day): ₹${tdsResult.totalLateFee234E.toLocaleString('en-IN')}${tdsResult.cappedAtTotalTds ? ` (Capped at TDS sum)` : ''}
• Section 201(1A) Delayed Deposit Interest @ 1.5%/mo: ₹${tdsResult.interest201_1A.toLocaleString('en-IN')}
👉 *Total Amount Payable: ₹${tdsResult.totalPayable.toLocaleString('en-IN')}*

Calculated via TaxSahayak · ${firmProfile.firmName}`;
    }
  };

  const handleCopy = () => {
    const text = generateShareSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = generateShareSummary();
    openWhatsApp('', text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Late Fee & Statutory Penalty Calculators</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Compute accurate Section 47 & 50 GST late fees, Section 234F & 234A Income Tax penalties, and Section 234E TDS late filing liabilities for small business owners.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('GST')}
          className={`px-4 py-2 font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'GST' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          GST Late Fee & Interest (Sec 47 & 50)
        </button>
        <button
          onClick={() => setActiveTab('INCOME_TAX')}
          className={`px-4 py-2 font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'INCOME_TAX' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Income Tax Late Fee & Interest (Sec 234F & 234A)
        </button>
        <button
          onClick={() => setActiveTab('TDS')}
          className={`px-4 py-2 font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'TDS' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          TDS Statement Late Fee (Sec 234E & 201)
        </button>
      </div>

      {/* Calculator Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Input Parameters</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Live computation engine</span>
          </h2>

          {/* TAB 1: GST */}
          {activeTab === 'GST' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Client / Business Name</label>
                <input
                  type="text"
                  value={gstClientName}
                  onChange={(e) => setGstClientName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Statutory Due Date</label>
                  <input
                    type="date"
                    value={gstDueDate}
                    onChange={(e) => setGstDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Actual / Intended Filing Date</label>
                  <input
                    type="date"
                    value={gstFilingDate}
                    onChange={(e) => setGstFilingDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Nil Return Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="nilGst"
                  checked={gstIsNil}
                  onChange={(e) => setGstIsNil(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <label htmlFor="nilGst" className="text-slate-800 dark:text-slate-200 font-medium cursor-pointer">
                  Nil Return (No outward/inward supplies, zero tax liability)
                </label>
              </div>

              {!gstIsNil && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Annual Aggregate Turnover Slab
                    </label>
                    <select
                      value={gstTurnoverCategory}
                      onChange={(e) => setGstTurnoverCategory(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="UP_TO_1_5_CR">Up to ₹1.5 Crore (Max Cap ₹2,000)</option>
                      <option value="FROM_1_5_TO_5_CR">₹1.5 Crore to ₹5 Crore (Max Cap ₹5,000)</option>
                      <option value="ABOVE_5_CR">Above ₹5 Crore (Max Cap ₹10,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Net Tax Paid in Cash (via Electronic Cash Ledger) (₹)
                    </label>
                    <input
                      type="number"
                      value={gstCashLiability}
                      onChange={(e) => setGstCashLiability(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                      placeholder="e.g. 25000"
                    />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Section 50(1) interest applies only on cash liability, NOT on tax set-off via ITC.
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: Income Tax */}
          {activeTab === 'INCOME_TAX' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assessee / Client Name</label>
                <input
                  type="text"
                  value={itClientName}
                  onChange={(e) => setItClientName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Statutory Due Date</label>
                  <input
                    type="date"
                    value={itDueDate}
                    onChange={(e) => setItDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">July 31 (Non-audit), Oct 31 (Audit)</div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Actual / Intended Filing Date</label>
                  <input
                    type="date"
                    value={itFilingDate}
                    onChange={(e) => setItFilingDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Taxable Income (₹)
                </label>
                <input
                  type="number"
                  value={itTotalIncome}
                  onChange={(e) => setItTotalIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. 650000"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Income ≤ ₹5,00,000 limits Section 234F fee to ₹1,000; Income &gt; ₹5,00,000 incurs ₹5,000.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Remaining Unpaid Tax Liability (₹)
                </label>
                <input
                  type="number"
                  value={itUnpaidTax}
                  onChange={(e) => setItUnpaidTax(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. 15000"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Section 234A interest is 1% per month on unpaid self-assessment tax.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: TDS */}
          {activeTab === 'TDS' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Deductor / Entity Name</label>
                <input
                  type="text"
                  value={tdsClientName}
                  onChange={(e) => setTdsClientName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Quarterly Statement Due Date</label>
                  <input
                    type="date"
                    value={tdsDueDate}
                    onChange={(e) => setTdsDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">July 31, Oct 31, Jan 31, May 31</div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Actual Filing Date</label>
                  <input
                    type="date"
                    value={tdsFilingDate}
                    onChange={(e) => setTdsFilingDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total TDS / TCS Amount for the Quarter (₹)
                </label>
                <input
                  type="number"
                  value={tdsTotalAmount}
                  onChange={(e) => setTdsTotalAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. 50000"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Under Section 234E, late fee cannot exceed the total amount of TDS deductible.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Months Delayed in Depositing TDS to Govt (Challan 281)
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={tdsDelayedMonths}
                  onChange={(e) => setTdsDelayedMonths(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                  Section 201(1A)(ii) attracts 1.5% interest per month for delay in tax deposit.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Computation Summary (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 p-5 rounded-lg space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Statutory Assessment</div>
              <div className="text-sm font-bold text-white">Computation Breakdown</div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-400 font-mono">Real-time</span>
            </div>
          </div>

          {/* Primary Amount Hero */}
          <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-400">Total Statutory Liability Payable</div>
            <div className="text-3xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
              ₹{(activeTab === 'GST' ? gstResult.totalPayable : activeTab === 'INCOME_TAX' ? itResult.totalPayable : tdsResult.totalPayable).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Includes statutory late fees + mandatory interest
            </div>
          </div>

          {/* Detailed Itemized Rows */}
          <div className="space-y-2 text-xs">
            {activeTab === 'GST' && (
              <>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Days Delayed:</span>
                  <span className="font-mono tabular-nums text-white">{gstResult.delayDays} day(s)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">CGST Late Fee (Sec 47):</span>
                  <span className="font-mono tabular-nums text-white">₹{gstResult.cgstLateFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">SGST Late Fee (Sec 47):</span>
                  <span className="font-mono tabular-nums text-white">₹{gstResult.sgstLateFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Interest @ 18% p.a. (Sec 50):</span>
                  <span className="font-mono tabular-nums text-amber-400">₹{gstResult.interestAmount.toLocaleString('en-IN')}</span>
                </div>
                {gstResult.maxCapApplied && (
                  <div className="p-2 bg-amber-950/40 text-amber-300 rounded border border-amber-800/50 text-[11px]">
                    Statutory maximum cap applied: ₹{gstResult.maxCapAmount.toLocaleString('en-IN')}.
                  </div>
                )}
              </>
            )}

            {activeTab === 'INCOME_TAX' && (
              <>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Delay Period:</span>
                  <span className="font-mono tabular-nums text-white">{itResult.delayMonths} month(s)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Section 234F Fee:</span>
                  <span className="font-mono tabular-nums text-white">₹{itResult.lateFee234F.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Section 234A Interest @ 1%/mo:</span>
                  <span className="font-mono tabular-nums text-amber-400">₹{itResult.interest234A.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2 bg-slate-800 rounded border border-slate-700 text-[11px] text-slate-300">
                  {itResult.canFileBelated ? (
                    <span className="text-emerald-400">Belated Return under Section 139(4) valid up to Dec 31.</span>
                  ) : (
                    <span className="text-rose-400">Filing date after Dec 31 requires Sec 119(2)(b) condonation or ITR-U.</span>
                  )}
                </div>
              </>
            )}

            {activeTab === 'TDS' && (
              <>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Days Delayed:</span>
                  <span className="font-mono tabular-nums text-white">{tdsResult.delayDays} day(s)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Section 234E Fee (@ ₹200/day):</span>
                  <span className="font-mono tabular-nums text-white">₹{tdsResult.totalLateFee234E.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Sec 201(1A) Deposit Interest (1.5%/mo):</span>
                  <span className="font-mono tabular-nums text-amber-400">₹{tdsResult.interest201_1A.toLocaleString('en-IN')}</span>
                </div>
                {tdsResult.cappedAtTotalTds && (
                  <div className="p-2 bg-amber-950/40 text-amber-300 rounded border border-amber-800/50 text-[11px]">
                    Statutory Cap Applied: Late fee cannot exceed total TDS amount (₹{tdsTotalAmount.toLocaleString('en-IN')}).
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons: Copy & WhatsApp Share */}
          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
