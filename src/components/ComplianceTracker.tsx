import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  Share2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Edit3, 
  Trash2,
  FileCheck,
  Check,
  Building2
} from 'lucide-react';
import { Client, TaxFiling, TaxType, FilingStatus, FirmProfile } from '../types';
import { openWhatsApp, createTaxDeadlineMessage, createFilingConfirmationMessage } from '../utils/whatsapp';

interface ComplianceTrackerProps {
  filings: TaxFiling[];
  clients: Client[];
  firmProfile: FirmProfile;
  onUpdateFiling: (updated: TaxFiling) => void;
  onAddFiling: (newFiling: TaxFiling) => void;
  onDeleteFiling: (id: string) => void;
  selectedFilingForModal?: TaxFiling | null;
  onCloseModal?: () => void;
}

export const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({
  filings,
  clients,
  firmProfile,
  onUpdateFiling,
  onAddFiling,
  onDeleteFiling,
}) => {
  const [activeTaxType, setActiveTaxType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [clientFilter, setClientFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeFiling, setActiveFiling] = useState<TaxFiling | null>(null);

  // Record Filing Form State
  const [recordFilingDate, setRecordFilingDate] = useState<string>('');
  const [recordArn, setRecordArn] = useState<string>('');
  const [recordTaxPaid, setRecordTaxPaid] = useState<string>('');
  const [recordNotes, setRecordNotes] = useState<string>('');

  // Add/Edit Form State
  const [formClientId, setFormClientId] = useState<string>('');
  const [formTaxType, setFormTaxType] = useState<TaxType>('GST');
  const [formReturnForm, setFormReturnForm] = useState<string>('GSTR-3B');
  const [formFinancialYear, setFormFinancialYear] = useState<string>('2026-27');
  const [formPeriod, setFormPeriod] = useState<string>('October 2026');
  const [formDueDate, setFormDueDate] = useState<string>('2026-11-20');
  const [formExtensionDate, setFormExtensionDate] = useState<string>('');
  const [formStatus, setFormStatus] = useState<FilingStatus>('PENDING');
  const [formNotes, setFormNotes] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Open Record Filing Modal
  const handleOpenRecordModal = (filing: TaxFiling) => {
    setActiveFiling(filing);
    setRecordFilingDate(filing.filingDate || todayStr);
    setRecordArn(filing.ackNumber || '');
    setRecordTaxPaid(filing.taxPaid ? String(filing.taxPaid) : '');
    setRecordNotes(filing.notes || '');
    setIsRecordModalOpen(true);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFiling) return;

    const updated: TaxFiling = {
      ...activeFiling,
      filingDate: recordFilingDate,
      ackNumber: recordArn,
      taxPaid: recordTaxPaid ? parseFloat(recordTaxPaid) : undefined,
      notes: recordNotes,
      status: 'FILED',
      lastUpdated: todayStr,
    };

    onUpdateFiling(updated);
    setIsRecordModalOpen(false);
  };

  // Open Add Filing Modal
  const handleOpenAddModal = () => {
    setFormClientId(clients[0]?.id || '');
    setFormTaxType('GST');
    setFormReturnForm('GSTR-3B');
    setFormFinancialYear('2026-27');
    setFormPeriod('October 2026');
    setFormDueDate('2026-11-20');
    setFormExtensionDate('');
    setFormStatus('PENDING');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleSaveNewFiling = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formClientId);
    if (!client) return;

    const newFiling: TaxFiling = {
      id: `filing-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      taxType: formTaxType,
      returnForm: formReturnForm,
      financialYear: formFinancialYear,
      period: formPeriod,
      dueDate: formDueDate,
      extensionDate: formExtensionDate || undefined,
      status: formStatus,
      notes: formNotes,
      lastUpdated: todayStr,
    };

    onAddFiling(newFiling);
    setIsAddModalOpen(false);
  };

  // WhatsApp reminder handler
  const handleSendWhatsAppReminder = (filing: TaxFiling) => {
    const client = clients.find(c => c.id === filing.clientId);
    const phone = client?.phone || '';

    if (filing.status === 'FILED') {
      const msg = createFilingConfirmationMessage({
        clientName: filing.clientName,
        returnForm: filing.returnForm,
        period: filing.period,
        filingDate: filing.filingDate || filing.dueDate,
        ackNumber: filing.ackNumber || 'ARN-GENERATED',
        taxPaid: filing.taxPaid,
        firm: firmProfile
      });
      openWhatsApp(phone, msg);
    } else {
      const msg = createTaxDeadlineMessage({
        clientName: filing.clientName,
        returnForm: filing.returnForm,
        taxType: filing.taxType,
        period: filing.period,
        dueDate: filing.dueDate,
        extensionDate: filing.extensionDate,
        firm: firmProfile,
        notes: filing.notes
      });
      openWhatsApp(phone, msg);
    }
  };

  // Filter Filings
  const filteredFilings = filings.filter(f => {
    if (activeTaxType !== 'ALL' && f.taxType !== activeTaxType) return false;
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'FILED' && f.status !== 'FILED') return false;
      if (statusFilter === 'PENDING' && f.status === 'FILED') return false;
      if (statusFilter === 'OVERDUE') {
        const targetDate = new Date(f.extensionDate || f.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (f.status === 'FILED' || targetDate >= today) return false;
      }
    }
    if (clientFilter !== 'ALL' && f.clientId !== clientFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchClient = f.clientName.toLowerCase().includes(q);
      const matchForm = f.returnForm.toLowerCase().includes(q);
      const matchPeriod = f.period.toLowerCase().includes(q);
      const matchArn = f.ackNumber?.toLowerCase().includes(q);
      if (!matchClient && !matchForm && !matchPeriod && !matchArn) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Tax Compliance Calendar & Filing Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor statutory due dates, CBDT/CBIC extension circulars, and maintain permanent records of filing dates and ARNs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-md transition-colors shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Compliance Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
        {/* Tax Category Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          {[
            { id: 'ALL', label: 'All Compliances' },
            { id: 'GST', label: 'GST (GSTR-1 / 3B / 9)' },
            { id: 'INCOME_TAX', label: 'Income Tax Returns (ITR)' },
            { id: 'AUDIT', label: 'Tax Audit (3CA / 3CB)' },
            { id: 'TDS', label: 'TDS Returns (24Q / 26Q)' },
            { id: 'MCA', label: 'MCA / ROC (AOC-4 / MGT-7)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTaxType(item.id)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTaxType === item.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Client, Status, Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, form, ARN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-md focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending / In Progress</option>
              <option value="OVERDUE">Overdue Only</option>
              <option value="FILED">Filed Returns</option>
            </select>
          </div>

          {/* Client Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Client:</label>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 truncate"
            >
              <option value="ALL">All Entities ({clients.length})</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Filings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Entity / Client</th>
                <th className="py-3 px-4">Tax Type & Form</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Statutory Due</th>
                <th className="py-3 px-4">Filing Status & Date</th>
                <th className="py-3 px-4">ARN / Acknowledgment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFilings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No tax compliance records found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredFilings.map((filing) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const targetDate = new Date(filing.extensionDate || filing.dueDate);
                  targetDate.setHours(0, 0, 0, 0);
                  const daysLeft = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const isOverdue = filing.status !== 'FILED' && daysLeft < 0;
                  const isFiled = filing.status === 'FILED';

                  return (
                    <tr key={filing.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{filing.clientName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {clients.find(c => c.id === filing.clientId)?.gstin || 
                           clients.find(c => c.id === filing.clientId)?.pan || 'PAN on file'}
                        </div>
                      </td>

                      {/* Tax Type & Form */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-white">{filing.returnForm}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{filing.taxType}</div>
                      </td>

                      {/* Period */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        <div>{filing.period}</div>
                        <div className="text-[10px] text-slate-400 font-mono">FY {filing.financialYear}</div>
                      </td>

                      {/* Due Date & Extension */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                          {filing.extensionDate || filing.dueDate}
                        </div>
                        {filing.extensionDate && (
                          <div className="text-[10px] text-amber-700 dark:text-amber-400">
                            Ext from {filing.dueDate}
                          </div>
                        )}
                        {!isFiled && (
                          <div className={`text-[10px] font-medium ${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : daysLeft <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {isOverdue ? `Overdue by ${Math.abs(daysLeft)}d` : daysLeft === 0 ? 'Due Today' : `${daysLeft} days remaining`}
                          </div>
                        )}
                      </td>

                      {/* Filing Status & Actual Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isFiled ? (
                          <div>
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Filed
                            </span>
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                              Filed on: {filing.filingDate || 'Confirmed'}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className={`font-medium ${
                              isOverdue ? 'text-rose-600 dark:text-rose-400 font-semibold' :
                              filing.status === 'DOCUMENTS_AWAITED' ? 'text-amber-600 dark:text-amber-400' :
                              filing.status === 'IN_PROGRESS' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              {filing.status.replace('_', ' ')}
                            </span>
                            {filing.notes && (
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]" title={filing.notes}>
                                {filing.notes}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* ARN / Ack Token */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {filing.ackNumber ? (
                          <div>
                            <div className="font-mono tabular-nums text-slate-900 dark:text-white font-medium">
                              {filing.ackNumber}
                            </div>
                            {filing.taxPaid ? (
                              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                                Tax Paid: ₹{filing.taxPaid.toLocaleString('en-IN')}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Reminder or Confirmation */}
                          <button
                            onClick={() => handleSendWhatsAppReminder(filing)}
                            title={isFiled ? 'Share Filing Confirmation via WhatsApp' : 'Share Tax Reminder via WhatsApp'}
                            className="p-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Record Filing Date & ARN */}
                          <button
                            onClick={() => handleOpenRecordModal(filing)}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                              isFiled
                                ? 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                                : 'text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500'
                            }`}
                          >
                            {isFiled ? 'Edit Record' : 'Record Filing'}
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${filing.returnForm} for ${filing.clientName}?`)) {
                                onDeleteFiling(filing.id);
                              }
                            }}
                            title="Delete filing record"
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
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

      {/* MODAL: Record Filing Date, ARN & Tax Paid */}
      {isRecordModalOpen && activeFiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Tax Return Filing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeFiling.returnForm} · {activeFiling.clientName} ({activeFiling.period})
              </p>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Actual Date of Filing *
                </label>
                <input
                  type="date"
                  required
                  value={recordFilingDate}
                  onChange={(e) => setRecordFilingDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ARN / Token / ITR Acknowledgment Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AA2710260482914 or PRN-26Q-..."
                  value={recordArn}
                  onChange={(e) => setRecordArn(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tax / Challan Paid (₹) (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15420"
                  value={recordTaxPaid}
                  onChange={(e) => setRecordTaxPaid(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Filing Notes / Verification Status
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Filed via ICICI Netbanking, E-verified using Aadhaar OTP."
                  value={recordNotes}
                  onChange={(e) => setRecordNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-md shadow-sm transition-colors"
                >
                  Save & Mark Filed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add New Compliance Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Compliance Requirement</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a GST, Income Tax, Audit, or TDS filing task for a client.
              </p>
            </div>

            <form onSubmit={handleSaveNewFiling} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Client / Entity *</label>
                <select
                  required
                  value={formClientId}
                  onChange={(e) => setFormClientId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.clientType})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tax Stream *</label>
                  <select
                    value={formTaxType}
                    onChange={(e) => {
                      const val = e.target.value as TaxType;
                      setFormTaxType(val);
                      if (val === 'GST') setFormReturnForm('GSTR-3B');
                      else if (val === 'INCOME_TAX') setFormReturnForm('ITR-3');
                      else if (val === 'AUDIT') setFormReturnForm('FORM-3CB-CD');
                      else if (val === 'TDS') setFormReturnForm('26Q');
                      else setFormReturnForm('AOC-4');
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="GST">GST</option>
                    <option value="INCOME_TAX">Income Tax</option>
                    <option value="AUDIT">Tax Audit</option>
                    <option value="TDS">TDS / TCS</option>
                    <option value="MCA">MCA / ROC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Return Form *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GSTR-3B, ITR-6, 26Q"
                    value={formReturnForm}
                    onChange={(e) => setFormReturnForm(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Financial Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="2026-27"
                    value={formFinancialYear}
                    onChange={(e) => setFormFinancialYear(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Period Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October 2026, Q2"
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Statutory Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Extension Date (If any)
                  </label>
                  <input
                    type="date"
                    value={formExtensionDate}
                    onChange={(e) => setFormExtensionDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as FilingStatus)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="DOCUMENTS_AWAITED">Documents Awaited</option>
                  <option value="IN_PROGRESS">In Progress</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Awaiting purchase register; Section 43B(h) vendor validation needed."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-md shadow-sm transition-colors"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
