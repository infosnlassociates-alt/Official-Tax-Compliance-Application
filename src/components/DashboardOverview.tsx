import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Share2, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Calculator,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Client, TaxFiling, ClientPaymentRecord, FirmProfile } from '../types';
import { openWhatsApp, createTaxDeadlineMessage } from '../utils/whatsapp';

interface DashboardOverviewProps {
  clients: Client[];
  filings: TaxFiling[];
  payments: ClientPaymentRecord[];
  firmProfile: FirmProfile;
  onNavigate: (tab: string) => void;
  onRecordFiling: (filing: TaxFiling) => void;
  onQuickRemind: (filing: TaxFiling) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  clients,
  filings,
  payments,
  firmProfile,
  onNavigate,
  onRecordFiling,
  onQuickRemind
}) => {
  const [filterTaxType, setFilterTaxType] = useState<string>('ALL');

  // Metric 1: Active Clients
  const activeClientsCount = clients.length;

  // Metric 2: Pending Filings
  const pendingFilings = filings.filter(f => f.status !== 'FILED');
  const pendingCount = pendingFilings.length;

  // Metric 3: Overdue Filings
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueFilings = filings.filter(f => {
    if (f.status === 'FILED') return false;
    const targetDate = new Date(f.extensionDate || f.dueDate);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate < today;
  });
  const overdueCount = overdueFilings.length;

  // Metric 4: Total Outstanding Billed vs Received
  let totalBilled = 0;
  let totalReceived = 0;
  payments.forEach(p => {
    if (p.type === 'DEBIT') totalBilled += p.amount;
    if (p.type === 'CREDIT') totalReceived += p.amount;
  });
  const outstandingBalance = Math.max(0, totalBilled - totalReceived);

  // Sorted Impending Deadlines
  const upcomingDeadlines = [...filings]
    .filter(f => filterTaxType === 'ALL' || f.taxType === filterTaxType)
    .sort((a, b) => {
      // Prioritize overdue, then sort by target date
      const dateA = new Date(a.extensionDate || a.dueDate).getTime();
      const dateB = new Date(b.extensionDate || b.dueDate).getTime();
      return dateA - dateB;
    })
    .slice(0, 8);

  const getDaysRemaining = (dueDate: string, extensionDate?: string) => {
    const target = new Date(extensionDate || dueDate);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigate('compliance')}
          className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Clients</span>
            <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {activeClientsCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered business entities & individuals
          </p>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigate('compliance')}
          className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Returns In Pipeline</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {pendingCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {filings.filter(f => f.status === 'DOCUMENTS_AWAITED').length} awaiting client documents
          </p>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigate('compliance')}
          className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${overdueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${overdueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
            {overdueCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {overdueCount > 0 ? 'Accumulating Section 47/234 late fee' : 'All returns filed on time'}
          </p>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigate('ledger')}
          className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Receivables</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            ₹{outstandingBalance.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Professional fees & challan dues pending
          </p>
        </div>
      </div>

      {/* Main Grid: Left Timeline / Deadlines (8 cols) + Right Quick Tools (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Deadlines & Immediate Status Actions */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Statutory Tax Deadlines & Filing Pipeline</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track due dates, official extensions, and record actual filing dates</p>
            </div>

            {/* Interactive Filter Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              {['ALL', 'GST', 'INCOME_TAX', 'TDS', 'AUDIT'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTaxType(t)}
                  className={`px-2.5 py-1 font-medium rounded transition-colors whitespace-nowrap ${
                    filterTaxType === t ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t === 'ALL' ? 'All' : t === 'INCOME_TAX' ? 'Income Tax' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Deadlines Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Return Form</th>
                  <th className="py-2.5 px-3">Client / Entity</th>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Statutory Due</th>
                  <th className="py-2.5 px-3">Status / Filing</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcomingDeadlines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      No compliance filings found matching selected filter.
                    </td>
                  </tr>
                ) : (
                  upcomingDeadlines.map((filing) => {
                    const days = getDaysRemaining(filing.dueDate, filing.extensionDate);
                    const isOverdue = filing.status !== 'FILED' && days < 0;
                    const isDueSoon = filing.status !== 'FILED' && days >= 0 && days <= 3;
                    const isFiled = filing.status === 'FILED';

                    return (
                      <tr key={filing.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{filing.returnForm}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{filing.taxType}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]" title={filing.clientName}>
                            {filing.clientName}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {filing.period}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                            {filing.extensionDate || filing.dueDate}
                          </div>
                          {filing.extensionDate && (
                            <div className="text-[10px] text-amber-700 dark:text-amber-400">Govt Extension</div>
                          )}
                          {!isFiled && (
                            <div className={`text-[10px] font-medium ${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : isDueSoon ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                              {isOverdue ? `${Math.abs(days)}d Overdue` : days === 0 ? 'Due Today' : `${days}d left`}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isFiled ? (
                            <div>
                              <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Filed
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                {filing.filingDate ? `on ${filing.filingDate}` : ''}
                              </span>
                            </div>
                          ) : (
                            <span className={`text-[11px] font-medium ${
                              isOverdue ? 'text-rose-600 dark:text-rose-400 font-semibold' :
                              filing.status === 'DOCUMENTS_AWAITED' ? 'text-amber-600 dark:text-amber-400' :
                              filing.status === 'IN_PROGRESS' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              {filing.status.replace('_', ' ')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Reminder Button */}
                            <button
                              onClick={() => onQuickRemind(filing)}
                              title="Share WhatsApp Reminder with client"
                              className="p-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Mark Filed or Edit */}
                            {!isFiled ? (
                              <button
                                onClick={() => onRecordFiling(filing)}
                                className="px-2 py-1 text-[11px] font-medium text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded transition-colors"
                              >
                                Record Filing
                              </button>
                            ) : (
                              <button
                                onClick={() => onRecordFiling(filing)}
                                className="px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                              >
                                View ARN
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>Showing priority compliance items</span>
            <button 
              onClick={() => onNavigate('compliance')}
              className="text-slate-900 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
            >
              <span>View full calendar & all returns</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Portal Launchpad & Fast Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Official Government Portals Quick Access */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Official Tax Portals</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick access to central government compliance filing systems:
            </p>

            <div className="space-y-1.5">
              {[
                { name: 'GST Common Portal', desc: 'GSTR-1, 3B, 9, ITC-04', url: 'https://services.gst.gov.in' },
                { name: 'Income Tax e-Filing 2.0', desc: 'ITR-1 to 7, Form 3CD, AIS/TIS', url: 'https://eportal.incometax.gov.in' },
                { name: 'E-Way Bill System', desc: 'NIC Portal for E-Way Bills', url: 'https://ewaybillgst.gov.in' },
                { name: 'TRACES Portal', desc: 'TDS Returns, Form 16/16A, 26AS', url: 'https://tdscpc.gov.in' },
                { name: 'MCA21 V3 Portal', desc: 'Company / LLP filings, AOC-4, MGT-7', url: 'https://mca.gov.in' },
              ].map((portal) => (
                <a
                  key={portal.name}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-md border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs group"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {portal.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{portal.desc}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Late Fee Estimator Teaser */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Late Fee & Penalty Calculator</span>
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Instant Section 47 GST late fee, Section 50 interest @ 18%, Section 234F IT fee, and TDS 234E estimator for small businesses.
            </p>
            <button
              onClick={() => onNavigate('calculator')}
              className="w-full py-2 px-3 text-xs font-medium text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Late Fee Calculators</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Offline Security Vault Guarantee */}
          <div className="p-4 bg-slate-900 dark:bg-slate-950 border border-transparent dark:border-slate-800 text-slate-100 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold">100% Offline Credential Privacy</span>
            </div>
            <p className="text-[11px] text-slate-300 dark:text-slate-400 leading-relaxed">
              GST, Income Tax, and E-Way Bill usernames & passwords remain strictly inside your browser local storage. No client credentials are ever transmitted to any remote cloud.
            </p>
            <button
              onClick={() => onNavigate('vault')}
              className="mt-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium underline flex items-center gap-1"
            >
              <span>Manage Credential Vault & Master PIN</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
