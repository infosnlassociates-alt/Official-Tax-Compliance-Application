import React, { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Share2, 
  Search, 
  Filter, 
  Trash2, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { ClientPaymentRecord, Client, FirmProfile, PaymentType, PaymentMode } from '../types';
import { openWhatsApp, createPaymentReminderMessage, createPaymentReceiptMessage } from '../utils/whatsapp';

interface PaymentLedgerProps {
  payments: ClientPaymentRecord[];
  clients: Client[];
  firmProfile: FirmProfile;
  onAddPayment: (record: ClientPaymentRecord) => void;
  onDeletePayment: (id: string) => void;
}

export const PaymentLedger: React.FC<PaymentLedgerProps> = ({
  payments,
  clients,
  firmProfile,
  onAddPayment,
  onDeletePayment
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchNarration, setSearchNarration] = useState<string>('');

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [formClientId, setFormClientId] = useState<string>(clients[0]?.id || '');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState<PaymentType>('DEBIT');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formNarration, setFormNarration] = useState<string>('');
  const [formMode, setFormMode] = useState<PaymentMode>('UPI');
  const [formRefNo, setFormRefNo] = useState<string>('');

  // WhatsApp Reminder Preview Modal
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [reminderTargetClient, setReminderTargetClient] = useState<Client | null>(null);
  const [customReminderMsg, setCustomReminderMsg] = useState<string>('');

  // Calculations for Client Ledger
  const getClientBalances = (cId: string) => {
    let billed = 0;
    let received = 0;
    payments.forEach(p => {
      if (p.clientId === cId) {
        if (p.type === 'DEBIT') billed += p.amount;
        if (p.type === 'CREDIT') received += p.amount;
      }
    });
    return { billed, received, balance: billed - received };
  };

  // Overall totals
  let grandTotalBilled = 0;
  let grandTotalReceived = 0;
  payments.forEach(p => {
    if (p.type === 'DEBIT') grandTotalBilled += p.amount;
    if (p.type === 'CREDIT') grandTotalReceived += p.amount;
  });
  const grandOutstanding = grandTotalBilled - grandTotalReceived;

  // Filtered Payments
  const filteredPayments = payments.filter(p => {
    if (selectedClientId !== 'ALL' && p.clientId !== selectedClientId) return false;
    if (selectedType !== 'ALL' && p.type !== selectedType) return false;
    if (searchNarration.trim()) {
      const q = searchNarration.toLowerCase();
      const matchClient = p.clientName.toLowerCase().includes(q);
      const matchNarr = p.narration.toLowerCase().includes(q);
      const matchRef = p.referenceNumber?.toLowerCase().includes(q);
      if (!matchClient && !matchNarr && !matchRef) return false;
    }
    return true;
  });

  // Handle Add Transaction Submit
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formClientId);
    if (!client || !formAmount) return;

    const newRecord: ClientPaymentRecord = {
      id: `pay-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      date: formDate,
      type: formType,
      amount: parseFloat(formAmount),
      narration: formNarration,
      paymentMode: formMode,
      referenceNumber: formRefNo || undefined,
      status: 'CLEARED',
      createdAt: new Date().toISOString()
    };

    onAddPayment(newRecord);
    setIsAddModalOpen(false);
    setFormAmount('');
    setFormNarration('');
    setFormRefNo('');
  };

  // Open WhatsApp Reminder Modal
  const handleOpenReminderModal = (client: Client) => {
    setReminderTargetClient(client);
    const { billed, received, balance } = getClientBalances(client.id);

    const recentDebit = payments
      .filter(p => p.clientId === client.id && p.type === 'DEBIT')
      .slice(-1)[0];

    const generatedText = createPaymentReminderMessage({
      clientName: client.name,
      totalBilled: billed,
      totalPaid: received,
      outstandingBalance: Math.max(0, balance),
      recentNarration: recentDebit?.narration,
      firm: firmProfile
    });

    setCustomReminderMsg(generatedText);
    setIsReminderModalOpen(true);
  };

  const handleSendReminderWhatsApp = () => {
    if (!reminderTargetClient) return;
    openWhatsApp(reminderTargetClient.phone, customReminderMsg);
    setIsReminderModalOpen(false);
  };

  // Send WhatsApp Receipt for a Credit
  const handleSendReceipt = (p: ClientPaymentRecord) => {
    const client = clients.find(c => c.id === p.clientId);
    const phone = client?.phone || '';
    const { balance } = getClientBalances(p.clientId);

    const msg = createPaymentReceiptMessage({
      clientName: p.clientName,
      amount: p.amount,
      date: p.date,
      referenceNumber: p.referenceNumber,
      narration: p.narration,
      remainingBalance: Math.max(0, balance),
      firm: firmProfile
    });

    openWhatsApp(phone, msg);
  };

  // CSV Export Functionality
  const exportToCsv = (recordsToExport: ClientPaymentRecord[], customFilename?: string) => {
    if (recordsToExport.length === 0) {
      alert('No payment ledger records available to export.');
      return;
    }

    const headers = [
      'Transaction Date',
      'Client / Entity Name',
      'Type',
      'Debit Amount (INR)',
      'Credit Amount (INR)',
      'Payment Mode',
      'Reference / UTR Number',
      'Narration / Particulars',
      'Status'
    ];

    let totalDebit = 0;
    let totalCredit = 0;

    const escapeCsv = (str: string | undefined | null) => {
      if (!str) return '""';
      const escaped = String(str).replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const rows = recordsToExport.map(record => {
      const isDebit = record.type === 'DEBIT';
      const debit = isDebit ? record.amount : 0;
      const credit = !isDebit ? record.amount : 0;
      totalDebit += debit;
      totalCredit += credit;

      return [
        escapeCsv(record.date),
        escapeCsv(record.clientName),
        escapeCsv(isDebit ? 'Debit (Billed Fee)' : 'Credit (Receipt)'),
        debit > 0 ? debit.toFixed(2) : '0.00',
        credit > 0 ? credit.toFixed(2) : '0.00',
        escapeCsv(record.paymentMode),
        escapeCsv(record.referenceNumber || 'N/A'),
        escapeCsv(record.narration),
        escapeCsv(record.status)
      ].join(',');
    });

    // Summary Row
    const summaryRow = [
      '"TOTAL"',
      '""',
      '""',
      totalDebit.toFixed(2),
      totalCredit.toFixed(2),
      '""',
      '""',
      escapeCsv(`Net Outstanding Balance: INR ${(totalDebit - totalCredit).toFixed(2)}`),
      '""'
    ].join(',');

    const csvContent = '\uFEFF' + [headers.join(','), ...rows, summaryRow].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = customFilename || (
      selectedClientId !== 'ALL'
        ? `${(clients.find(c => c.id === selectedClientId)?.name || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}_Ledger_${dateStr}.csv`
        : `ShreeNavyaLekha_Payment_Ledger_${dateStr}.csv`
    );

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Client Payment Ledger & Billing Records</h1>
          <p className="text-xs text-slate-500">
            Track Professional Fees (Debit), Client Collections (Credit), Narrations, and dispatch automated WhatsApp Payment Reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* CSV Export Button */}
          <button
            onClick={() => exportToCsv(filteredPayments)}
            title="Download client ledger transactions as a CSV spreadsheet"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors shrink-0 border border-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Debit / Credit</span>
          </button>
        </div>
      </div>

      {/* Ledger Totals Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Fees Billed (Debit)</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            ₹{grandTotalBilled.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all clients & services</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Collected (Credit)</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
            ₹{grandTotalReceived.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Settled via UPI, NEFT, Cheques</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Outstanding Balance</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700">
            ₹{grandOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Pending recovery</div>
        </div>
      </div>

      {/* Client Accounts Quick Overview Bar (Click to filter or send WhatsApp) */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Client Accounts & Payment Reminders
          </h2>
          <span className="text-xs text-slate-500">Click reminder icon to send pre-filled WhatsApp</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {clients.map((c) => {
            const { billed, received, balance } = getClientBalances(c.id);
            const isSelected = selectedClientId === c.id;

            return (
              <div
                key={c.id}
                className={`p-3 rounded-md border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span 
                      onClick={() => setSelectedClientId(isSelected ? 'ALL' : c.id)}
                      className="font-bold text-slate-900 cursor-pointer hover:underline truncate"
                    >
                      {c.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          const clientRecords = payments.filter(p => p.clientId === c.id);
                          exportToCsv(clientRecords, `${c.name.replace(/[^a-zA-Z0-9]/g, '_')}_Statement.csv`);
                        }}
                        title={`Export CSV Ledger for ${c.name}`}
                        className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenReminderModal(c)}
                        title={`Send WhatsApp Payment Reminder to ${c.name}`}
                        className="p-1 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Phone: {c.phone}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Billed: <strong className="font-mono text-slate-800">₹{billed.toLocaleString('en-IN')}</strong>
                  </span>
                  <span className="text-slate-500">
                    Due: <strong className={`font-mono ${balance > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700'}`}>
                      ₹{balance.toLocaleString('en-IN')}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Transaction Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, narration, ref..."
              value={searchNarration}
              onChange={(e) => setSearchNarration(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">Entity:</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 truncate"
            >
              <option value="ALL">All Clients ({clients.length})</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="ALL">All Entries (Debit & Credit)</option>
              <option value="DEBIT">Debit (Fees Billed / Invoices)</option>
              <option value="CREDIT">Credit (Payments Received)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Ledger Transactions</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono">Showing {filteredPayments.length} of {payments.length} records</span>
          </div>
          <button
            onClick={() => exportToCsv(filteredPayments)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-200 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download CSV Spreadsheet</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client / Entity</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Narration / Particulars</th>
                <th className="py-3 px-4">Mode & Reference</th>
                <th className="py-3 px-4 text-right">Debit (₹)</th>
                <th className="py-3 px-4 text-right">Credit (₹)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No payment records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isDebit = p.type === 'DEBIT';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-700">
                        {p.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{p.clientName}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          isDebit ? 'text-slate-800' : 'text-emerald-700'
                        }`}>
                          {isDebit ? <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" /> : <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />}
                          {isDebit ? 'Debit' : 'Credit'}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-[280px]">
                        <div className="text-slate-800 leading-snug">{p.narration}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-700">{p.paymentMode}</div>
                        {p.referenceNumber && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            Ref: {p.referenceNumber}
                          </div>
                        )}
                      </td>
                      {/* Debit Column */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums font-semibold text-slate-900">
                        {isDebit ? `₹${p.amount.toLocaleString('en-IN')}` : '—'}
                      </td>
                      {/* Credit Column */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums font-semibold text-emerald-700">
                        {!isDebit ? `₹${p.amount.toLocaleString('en-IN')}` : '—'}
                      </td>
                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isDebit && (
                            <button
                              onClick={() => handleSendReceipt(p)}
                              title="Send WhatsApp Payment Receipt"
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm('Delete this ledger record?')) {
                                onDeletePayment(p.id);
                              }
                            }}
                            title="Delete transaction"
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Record Debit / Credit Transaction */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Ledger Entry</h3>
              <p className="text-xs text-slate-500">Bill professional fees or record client payments received.</p>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Client *</label>
                <select
                  required
                  value={formClientId}
                  onChange={(e) => setFormClientId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Type *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as PaymentType)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none font-semibold"
                  >
                    <option value="DEBIT">Debit (Fee Billed / Charge)</option>
                    <option value="CREDIT">Credit (Payment Received)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 5000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3 py-1.5 font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={formMode}
                    onChange={(e) => setFormMode(e.target.value as PaymentMode)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                    <option value="NEFT_RTGS">Bank NEFT / RTGS / IMPS</option>
                    <option value="CHEQUE">Bank Cheque</option>
                    <option value="CASH">Cash</option>
                    <option value="OTHER">Other / Adjustments</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Narration / Particulars *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. GSTR-1 & 3B Monthly Retainership for Oct 2026 or Received via UPI Ref 42910..."
                  value={formNarration}
                  onChange={(e) => setFormNarration(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice / Reference No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. INV-2026-104 or UTR HDFCN48291..."
                  value={formRefNo}
                  onChange={(e) => setFormRefNo(e.target.value)}
                  className="w-full px-3 py-1.5 font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Automated WhatsApp Payment Reminder Preview */}
      {isReminderModalOpen && reminderTargetClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">WhatsApp Payment Reminder</h3>
                <p className="text-xs text-slate-500">
                  Sending to {reminderTargetClient.name} ({reminderTargetClient.phone})
                </p>
              </div>
              <Share2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Review & Edit Message Content:
              </label>
              <textarea
                rows={10}
                value={customReminderMsg}
                onChange={(e) => setCustomReminderMsg(e.target.value)}
                className="w-full p-3 text-xs font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none leading-relaxed bg-slate-50"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                Will open WhatsApp Web or Mobile app with text pre-filled
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendReminderWhatsApp}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Open WhatsApp & Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
