import React, { useState, useRef } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Plus, 
  ExternalLink, 
  Search, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  AlertCircle,
  Phone,
  MapPin,
  Building2,
  Award,
  BadgePercent,
  FileText,
  RotateCcw,
  X,
  FileCheck2,
  Briefcase
} from 'lucide-react';
import { CredentialVaultItem, Client } from '../types';
import { 
  getVaultPin, 
  setVaultPin, 
  removeVaultPin, 
  exportEntireDatabaseJSON, 
  importEntireDatabaseJSON 
} from '../utils/storage';
import { WhatsAppLogo } from './SocialLogos';

interface CredentialVaultProps {
  credentials: CredentialVaultItem[];
  clients: Client[];
  onSaveCredentials: (updatedList: CredentialVaultItem[]) => void;
  onSaveClients?: (updatedClients: Client[]) => void;
  onRefreshAllData: () => void;
}

export const CredentialVault: React.FC<CredentialVaultProps> = ({
  credentials,
  clients,
  onSaveCredentials,
  onSaveClients,
  onRefreshAllData,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Master PIN Security State
  const existingPin = getVaultPin();
  const [isVaultLocked, setIsVaultLocked] = useState<boolean>(!!existingPin);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [newPinValue, setNewPinValue] = useState<string>('');

  // Add / Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CredentialVaultItem | null>(null);
  const [isNewClientMode, setIsNewClientMode] = useState<boolean>(false);

  // Form Fields State
  const [formClientId, setFormClientId] = useState<string>('');
  const [formClientName, setFormClientName] = useState<string>('');
  const [formTradeName, setFormTradeName] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formWhatsappNumber, setFormWhatsappNumber] = useState<string>('');
  const [formAddress, setFormAddress] = useState<string>('');
  const [formClientType, setFormClientType] = useState<'Proprietorship' | 'Partnership' | 'Pvt Ltd' | 'Individual' | 'LLP' | 'HUF'>('Proprietorship');
  const [formLogoUrl, setFormLogoUrl] = useState<string>('');
  
  // GST Details
  const [formGstin, setFormGstin] = useState<string>('');
  const [formGstUser, setFormGstUser] = useState<string>('');
  const [formGstPass, setFormGstPass] = useState<string>('');
  const [formFilingFrequency, setFormFilingFrequency] = useState<'MONTHLY' | 'QRMP'>('MONTHLY');
  const [formIsComposition, setFormIsComposition] = useState<boolean>(false);

  // Udyam MSME Registration
  const [formUdyamNumber, setFormUdyamNumber] = useState<string>('');
  const [formMsmeCategory, setFormMsmeCategory] = useState<'Micro' | 'Small' | 'Medium' | 'Not Registered'>('Micro');
  const [formIsMsme43Bh, setFormIsMsme43Bh] = useState<boolean>(true);

  // Income Tax & PAN
  const [formPan, setFormPan] = useState<string>('');
  const [formItUser, setFormItUser] = useState<string>('');
  const [formItPass, setFormItPass] = useState<string>('');
  const [formAnnualIncomeSlab, setFormAnnualIncomeSlab] = useState<string>('₹5L - ₹10L');
  const [formAuditApplicable, setFormAuditApplicable] = useState<boolean>(false);

  // E-Way Bill Login
  const [formEwbUser, setFormEwbUser] = useState<string>('');
  const [formEwbPass, setFormEwbPass] = useState<string>('');

  // TRACES Login
  const [formTracesUser, setFormTracesUser] = useState<string>('');
  const [formTracesPass, setFormTracesPass] = useState<string>('');

  // Notes
  const [formNotes, setFormNotes] = useState<string>('');

  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Unlock Vault
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === existingPin) {
      setIsVaultLocked(false);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect Master PIN. Please try again.');
    }
  };

  // Set / Remove Master PIN
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinValue.trim().length >= 4) {
      setVaultPin(newPinValue.trim());
      setIsPinModalOpen(false);
      setNewPinValue('');
      setIsVaultLocked(false);
    } else {
      alert('Master PIN must be at least 4 digits/characters.');
    }
  };

  const handleDisablePin = () => {
    if (confirm('Remove Master Vault PIN? Credentials will be visible on page load.')) {
      removeVaultPin();
      setIsVaultLocked(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string | undefined, keyId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Toggle reveal
  const toggleReveal = (id: string) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Edit/Add Modal
  const handleOpenEdit = (item?: CredentialVaultItem) => {
    if (item) {
      setEditingItem(item);
      setIsNewClientMode(false);
      setFormClientId(item.id);
      
      const client = clients.find(c => c.id === item.id);
      setFormClientName(item.clientName || client?.name || '');
      setFormTradeName(client?.tradeName || '');
      setFormPhone(item.phone || client?.phone || '');
      setFormWhatsappNumber(item.whatsappNumber || client?.whatsappNumber || client?.phone || '');
      setFormAddress(item.address || client?.address || '');
      setFormClientType(client?.clientType || 'Proprietorship');
      setFormLogoUrl(item.logoUrl || client?.logoUrl || '');
      
      setFormGstin(item.gstin || client?.gstin || '');
      setFormGstUser(item.gstUsername || client?.gstUsername || '');
      setFormGstPass(item.gstPassword || client?.gstPassword || '');
      setFormFilingFrequency(client?.filingFrequency || 'MONTHLY');
      setFormIsComposition(client?.isComposition || false);

      setFormUdyamNumber(item.udyamNumber || client?.udyamNumber || '');
      setFormMsmeCategory(client?.msmeCategory || 'Micro');
      setFormIsMsme43Bh(client?.isMsme43BhApplicable ?? true);

      setFormPan(item.pan || client?.pan || '');
      setFormItUser(item.incomeTaxId || client?.incomeTaxId || client?.pan || '');
      setFormItPass(item.incomeTaxPassword || client?.incomeTaxPassword || '');
      setFormAnnualIncomeSlab(item.annualIncomeSlab || client?.annualIncomeSlab || '₹5L - ₹10L');
      setFormAuditApplicable(client?.auditApplicable || false);

      setFormEwbUser(item.ewayBillUsername || client?.ewayBillUsername || '');
      setFormEwbPass(item.ewayBillPassword || client?.ewayBillPassword || '');
      setFormTracesUser(item.tracesUsername || client?.tracesUsername || '');
      setFormTracesPass(item.tracesPassword || client?.tracesPassword || '');
      setFormNotes(item.notes || client?.notes || '');
    } else {
      setEditingItem(null);
      setIsNewClientMode(true);
      const generatedId = `cli-${Date.now()}`;
      setFormClientId(generatedId);
      setFormClientName('');
      setFormTradeName('');
      setFormPhone('');
      setFormWhatsappNumber('');
      setFormAddress('Bayana, Rajasthan');
      setFormClientType('Proprietorship');
      setFormLogoUrl('');
      
      setFormGstin('');
      setFormGstUser('');
      setFormGstPass('');
      setFormFilingFrequency('MONTHLY');
      setFormIsComposition(false);

      setFormUdyamNumber('');
      setFormMsmeCategory('Micro');
      setFormIsMsme43Bh(true);

      setFormPan('');
      setFormItUser('');
      setFormItPass('');
      setFormAnnualIncomeSlab('₹5L - ₹10L');
      setFormAuditApplicable(false);

      setFormEwbUser('');
      setFormEwbPass('');
      setFormTracesUser('');
      setFormTracesPass('');
      setFormNotes('');
    }
    setIsEditModalOpen(true);
  };

  // Save All Credentials and Sync with Clients
  const handleSaveCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName.trim()) {
      alert('Please enter Client / Firm Name');
      return;
    }

    const clientId = formClientId || `cli-${Date.now()}`;
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Prepare Credential Vault Item
    const newCredItem: CredentialVaultItem = {
      id: clientId,
      clientName: formClientName.trim(),
      phone: formPhone.trim(),
      whatsappNumber: formWhatsappNumber.trim() || formPhone.trim(),
      address: formAddress.trim(),
      logoUrl: formLogoUrl || undefined,
      gstin: formGstin.trim().toUpperCase(),
      pan: formPan.trim().toUpperCase(),
      udyamNumber: formUdyamNumber.trim().toUpperCase(),
      annualIncomeSlab: formAnnualIncomeSlab,
      gstUsername: formGstUser.trim(),
      gstPassword: formGstPass.trim(),
      incomeTaxId: formItUser.trim().toUpperCase() || formPan.trim().toUpperCase(),
      incomeTaxPassword: formItPass.trim(),
      ewayBillUsername: formEwbUser.trim(),
      ewayBillPassword: formEwbPass.trim(),
      tracesUsername: formTracesUser.trim().toUpperCase(),
      tracesPassword: formTracesPass.trim(),
      notes: formNotes.trim(),
      updatedAt: todayStr
    };

    // Update credentials state & persistence
    const existingCredIdx = credentials.findIndex(c => c.id === clientId);
    let updatedCreds = [...credentials];
    if (existingCredIdx >= 0) {
      updatedCreds[existingCredIdx] = newCredItem;
    } else {
      updatedCreds.unshift(newCredItem);
    }
    onSaveCredentials(updatedCreds);

    // 2. Prepare Client Item & Sync with Clients state
    const newClient: Client = {
      id: clientId,
      name: formClientName.trim(),
      tradeName: formTradeName.trim() || undefined,
      phone: formPhone.trim(),
      whatsappNumber: formWhatsappNumber.trim() || formPhone.trim(),
      address: formAddress.trim(),
      clientType: formClientType,
      logoUrl: formLogoUrl || undefined,
      gstin: formGstin.trim().toUpperCase(),
      filingFrequency: formFilingFrequency,
      isComposition: formIsComposition,
      gstUsername: formGstUser.trim(),
      gstPassword: formGstPass.trim(),
      udyamNumber: formUdyamNumber.trim().toUpperCase(),
      msmeCategory: formMsmeCategory,
      isMsme43BhApplicable: formIsMsme43Bh,
      pan: formPan.trim().toUpperCase(),
      incomeTaxId: formItUser.trim().toUpperCase() || formPan.trim().toUpperCase(),
      incomeTaxPassword: formItPass.trim(),
      annualIncomeSlab: formAnnualIncomeSlab,
      auditApplicable: formAuditApplicable,
      ewayBillUsername: formEwbUser.trim(),
      ewayBillPassword: formEwbPass.trim(),
      tracesUsername: formTracesUser.trim().toUpperCase(),
      tracesPassword: formTracesPass.trim(),
      notes: formNotes.trim(),
      createdAt: todayStr
    };

    if (onSaveClients) {
      const existingClientIdx = clients.findIndex(c => c.id === clientId);
      let updatedClients = [...clients];
      if (existingClientIdx >= 0) {
        updatedClients[existingClientIdx] = newClient;
      } else {
        updatedClients.unshift(newClient);
      }
      onSaveClients(updatedClients);
    }

    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete credentials for "${name}" from local storage?`)) {
      const filtered = credentials.filter(c => c.id !== id);
      onSaveCredentials(filtered);
    }
  };

  // Export & Import
  const handleExportBackup = () => {
    const jsonStr = exportEntireDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TaxSahayak_Offline_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importEntireDatabaseJSON(content);
        if (success) {
          alert('Database restored successfully from backup!');
          onRefreshAllData();
        } else {
          alert('Invalid backup file. Restoration failed.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Filter
  const filteredCredentials = credentials.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.clientName.toLowerCase().includes(q) ||
      c.gstin?.toLowerCase().includes(q) ||
      c.pan?.toLowerCase().includes(q) ||
      c.udyamNumber?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.gstUsername?.toLowerCase().includes(q) ||
      c.ewayBillUsername?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Credential Vault & Client Directory</h1>
            <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              100% Offline Browser Storage
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store Client Phone, WhatsApp, Address, Firm Logo, GSTIN, Udyam MSME, PAN, Income Tax e-Filing ID/Pass & E-Way Bill ID/Pass.
          </p>
        </div>

        {/* Master PIN, Backup & Add Client Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {existingPin ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsVaultLocked(!isVaultLocked)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isVaultLocked
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isVaultLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isVaultLocked ? 'Vault Locked' : 'Lock Vault'}</span>
              </button>
              <button
                onClick={handleDisablePin}
                title="Disable Master PIN"
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
              >
                Disable PIN
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Set Master PIN</span>
            </button>
          )}

          {/* Backup Export */}
          <button
            onClick={handleExportBackup}
            title="Export complete offline database backup as encrypted JSON"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Backup</span>
          </button>

          {/* Backup Import */}
          <label className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          {/* Add New Client & Credentials Button */}
          <button
            onClick={() => handleOpenEdit()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-md transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Locked State Screen */}
      {isVaultLocked && existingPin ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-lg border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto space-y-4 my-8 transition-colors">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Credential Vault is Locked</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your Master Vault PIN to reveal GST, Income Tax, Udyam, and E-Way Bill login credentials.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              autoFocus
              placeholder="Enter Master PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full px-3 py-2 text-center text-sm font-mono tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
            />
            {pinError && <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">{pinError}</div>}
            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-md transition-colors"
            >
              Unlock Vault
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Search Box */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client name, GSTIN, PAN, Udyam, phone, username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-md focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Credentials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCredentials.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                No client credentials found matching your search.
              </div>
            ) : (
              filteredCredentials.map((item) => {
                const isRevealed = revealedPasswords[item.id] || false;
                const matchedClient = clients.find(c => c.id === item.id);
                const phone = item.phone || matchedClient?.phone || '';
                const whatsapp = item.whatsappNumber || matchedClient?.whatsappNumber || phone;
                const address = item.address || matchedClient?.address || '';
                const logo = item.logoUrl || matchedClient?.logoUrl;
                const udyam = item.udyamNumber || matchedClient?.udyamNumber;
                const incomeSlab = item.annualIncomeSlab || matchedClient?.annualIncomeSlab;

                // Initials avatar
                const initials = item.clientName
                  .split(' ')
                  .map(w => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
                  >
                    {/* Header: Client Logo, Name, Phone & Quick Actions */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-start gap-3">
                        {/* Client Firm Logo */}
                        <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                          {logo ? (
                            <img src={logo} alt={item.clientName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-slate-700 dark:text-amber-400 text-sm font-mono">
                              {initials}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {item.clientName}
                          </h3>
                          {matchedClient?.tradeName && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {matchedClient.tradeName}
                            </div>
                          )}

                          {/* Quick Contact Buttons (Call & WhatsApp) */}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {phone && (
                              <a
                                href={`tel:${phone}`}
                                className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                                title="Call Client"
                              >
                                <Phone className="w-3 h-3 text-blue-600" />
                                <span>{phone}</span>
                              </a>
                            )}
                            {whatsapp && (
                              <a
                                href={`https://wa.me/91${whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800"
                                title="Open WhatsApp Chat"
                              >
                                <WhatsAppLogo size={13} />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reveal & Edit Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleReveal(item.id)}
                          title={isRevealed ? 'Mask passwords' : 'Show passwords'}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit client & credentials"
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.clientName)}
                          title="Delete from local vault"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Address & MSME / Income Strip */}
                    <div className="space-y-1.5 text-xs">
                      {address && (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{address}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* Udyam Registration Tag */}
                        {udyam ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[10px] font-mono font-bold text-amber-900 dark:text-amber-300">
                            <Award className="w-3 h-3 text-amber-600" />
                            <span>Udyam: {udyam}</span>
                          </div>
                        ) : null}

                        {/* Income Tax Slab / PAN */}
                        {item.pan ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[10px] font-mono font-bold text-blue-900 dark:text-blue-300">
                            <span>PAN: {item.pan}</span>
                            {incomeSlab && <span className="font-sans font-normal text-slate-500">({incomeSlab})</span>}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Portal Credentials Blocks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* 1. GST Portal Box */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <span>GST Portal</span>
                            {item.gstin && <span className="font-mono text-[9px] text-emerald-600 font-bold">✓ Active</span>}
                          </span>
                          <a
                            href="https://services.gst.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Open GST Portal"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        {item.gstin && (
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                            GSTIN: {item.gstin}
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">User:</span>
                          <div className="flex items-center justify-between font-mono text-slate-900 dark:text-white">
                            <span className="truncate">{item.gstUsername || '—'}</span>
                            {item.gstUsername && (
                              <button
                                onClick={() => handleCopy(item.gstUsername, `${item.id}-gst-u`)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                              >
                                {copiedKey === `${item.id}-gst-u` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Pass:</span>
                          <div className="flex items-center justify-between font-mono text-slate-900 dark:text-white">
                            <span>{isRevealed ? item.gstPassword || '—' : (item.gstPassword ? '••••••••' : '—')}</span>
                            {item.gstPassword && (
                              <button
                                onClick={() => handleCopy(item.gstPassword, `${item.id}-gst-p`)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                              >
                                {copiedKey === `${item.id}-gst-p` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. Income Tax Portal Box */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <span>Income Tax e-Filing</span>
                          <a
                            href="https://eportal.incometax.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Open Income Tax Portal"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">User ID / PAN:</span>
                          <div className="flex items-center justify-between font-mono text-slate-900 dark:text-white">
                            <span className="truncate">{item.incomeTaxId || item.pan || '—'}</span>
                            {(item.incomeTaxId || item.pan) && (
                              <button
                                onClick={() => handleCopy(item.incomeTaxId || item.pan, `${item.id}-it-u`)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                              >
                                {copiedKey === `${item.id}-it-u` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Password:</span>
                          <div className="flex items-center justify-between font-mono text-slate-900 dark:text-white">
                            <span>{isRevealed ? item.incomeTaxPassword || '—' : (item.incomeTaxPassword ? '••••••••' : '—')}</span>
                            {item.incomeTaxPassword && (
                              <button
                                onClick={() => handleCopy(item.incomeTaxPassword, `${item.id}-it-p`)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                              >
                                {copiedKey === `${item.id}-it-p` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 3. E-Way Bill Box */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <span>E-Way Bill (NIC)</span>
                          <a
                            href="https://ewaybillgst.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Open E-Way Bill Portal"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Username:</span>
                          <div className="flex items-center justify-between font-mono text-slate-900 dark:text-white">
                            <span className="truncate">{item.ewayBillUsername || '—'}</span>
                            {item.ewayBillUsername && (
                              <button
                                onClick={() => handleCopy(item.ewayBillUsername, `${item.id}-ewb-u`)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                              >
                                {copiedKey === `${item.id}-ewb-u` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Password:</span>
                          <div className="flex items-center justify-between font-mono text-slate-900 dark:text-white">
                            <span>{isRevealed ? item.ewayBillPassword || '—' : (item.ewayBillPassword ? '••••••••' : '—')}</span>
                            {item.ewayBillPassword && (
                              <button
                                onClick={() => handleCopy(item.ewayBillPassword, `${item.id}-ewb-p`)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                              >
                                {copiedKey === `${item.id}-ewb-p` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 4. TRACES (TDS) Box */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <span>TRACES (TDS TAN)</span>
                          <a
                            href="https://tdscpc.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Open TRACES Portal"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">User ID / TAN:</span>
                          <div className="flex items-center justify-between font-mono text-slate-900 dark:text-white">
                            <span className="truncate">{item.tracesUsername || '—'}</span>
                            {item.tracesUsername && (
                              <button
                                onClick={() => handleCopy(item.tracesUsername, `${item.id}-traces-u`)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                              >
                                {copiedKey === `${item.id}-traces-u` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Password:</span>
                          <div className="flex items-center justify-between font-mono text-slate-900 dark:text-white">
                            <span>{isRevealed ? item.tracesPassword || '—' : (item.tracesPassword ? '••••••••' : '—')}</span>
                            {item.tracesPassword && (
                              <button
                                onClick={() => handleCopy(item.tracesPassword, `${item.id}-traces-p`)}
                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-1"
                              >
                                {copiedKey === `${item.id}-traces-p` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Note: </span>
                        {item.notes}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* MODAL: Master PIN Setup */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-sm w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-slate-900 dark:text-white">
            <h3 className="text-base font-bold">Set Master Vault PIN</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a 4 to 8 digit PIN to protect sensitive credentials from screen peeking in your office.
            </p>
            <form onSubmit={handleSavePin} className="space-y-3">
              <input
                type="password"
                required
                maxLength={8}
                placeholder="Enter 4-8 digit PIN"
                value={newPinValue}
                onChange={(e) => setNewPinValue(e.target.value)}
                className="w-full px-3 py-2 text-center text-sm font-mono tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-md"
                >
                  Save PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE MODAL: Add / Edit Client with Firm Logo, Phone, WhatsApp, Address, GST, Udyam, Income Tax & E-Way Bill */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 p-6 space-y-5 text-slate-900 dark:text-white max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold">
                    {editingItem ? `Edit Client: ${editingItem.clientName}` : 'Add New Client & Tax ID Passwords'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Store phone, whatsapp, address, firm logo, GST, Udyam MSME, Income Tax and E-Way Bill credentials.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCredential} className="space-y-4 text-xs">
              {/* SECTION 1: CLIENT FIRM LOGO & BASIC INFORMATION */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block">
                  1. Client Identity & Firm Logo
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Logo Preview & File Upload */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      {formLogoUrl ? (
                        <img src={formLogoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold font-mono text-slate-400">
                          {formClientName ? formClientName.slice(0, 2).toUpperCase() : 'LOGO'}
                        </span>
                      )}
                    </div>

                    <input
                      ref={logoFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload Firm Logo</span>
                      </button>
                      {formLogoUrl && (
                        <button
                          type="button"
                          onClick={() => setFormLogoUrl('')}
                          className="text-[10px] text-rose-500 hover:underline block"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Client Name & Trade Name */}
                  <div className="flex-1 w-full space-y-2">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                        Client / Legal Entity Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. GUJRAT KHAD BHANDAR or Rahul Enterprises"
                        value={formClientName}
                        onChange={(e) => setFormClientName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                        Trade / Brand Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. GKB Agro & Seeds"
                        value={formTradeName}
                        onChange={(e) => setFormTradeName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Entity Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Entity Constitution</label>
                    <select
                      value={formClientType}
                      onChange={(e) => setFormClientType(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    >
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership Firm</option>
                      <option value="Pvt Ltd">Private Limited Company</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="Individual">Individual</option>
                      <option value="HUF">Hindu Undivided Family (HUF)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Annual Income Bracket</label>
                    <select
                      value={formAnnualIncomeSlab}
                      onChange={(e) => setFormAnnualIncomeSlab(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    >
                      <option value="Below ₹5 Lakh">Below ₹5 Lakh (Rebate u/s 87A)</option>
                      <option value="₹5L - ₹10L">₹5 Lakh - ₹10 Lakh</option>
                      <option value="₹10L - ₹50L">₹10 Lakh - ₹50 Lakh</option>
                      <option value="Above ₹50L">Above ₹50 Lakh (High Net Worth)</option>
                      <option value="Presumptive 44AD/ADA">Presumptive Scheme (Section 44AD / 44ADA)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PHONE, WHATSAPP & ADDRESS */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block">
                  2. Communication & Physical Address
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      Phone Number (Calling) *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 9549899145 or 8440084006"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        WhatsApp Number *
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormWhatsappNumber(formPhone)}
                        className="text-[10px] text-emerald-600 font-bold hover:underline"
                      >
                        Same as Phone
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <WhatsAppLogo size={14} />
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. 9549899145"
                        value={formWhatsappNumber}
                        onChange={(e) => setFormWhatsappNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                    Physical Business Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <textarea
                      rows={2}
                      placeholder="e.g. Shop No. 12, Main Mandi, Bayana Zip - 321401 (Rajasthan)"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: GST REGISTRATION DETAILS & LOGIN */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block">
                    3. GST Registration Details & Portal Login
                  </span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                      <input
                        type="checkbox"
                        checked={formIsComposition}
                        onChange={(e) => setFormIsComposition(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                      />
                      <span>Composition Scheme</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      GSTIN (15 Digits)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="08AABCA1234D1Z5"
                      value={formGstin}
                      onChange={(e) => setFormGstin(e.target.value)}
                      className="w-full px-2.5 py-1.5 font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      GST Portal Username
                    </label>
                    <input
                      type="text"
                      placeholder="gst_user"
                      value={formGstUser}
                      onChange={(e) => setFormGstUser(e.target.value)}
                      className="w-full px-2.5 py-1.5 font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      GST Portal Password
                    </label>
                    <input
                      type="text"
                      placeholder="gst_pass"
                      value={formGstPass}
                      onChange={(e) => setFormGstPass(e.target.value)}
                      className="w-full px-2.5 py-1.5 font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] pt-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Filing Frequency:</span>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="freq"
                      value="MONTHLY"
                      checked={formFilingFrequency === 'MONTHLY'}
                      onChange={() => setFormFilingFrequency('MONTHLY')}
                    />
                    <span>Monthly (GSTR-1 & 3B)</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="freq"
                      value="QRMP"
                      checked={formFilingFrequency === 'QRMP'}
                      onChange={() => setFormFilingFrequency('QRMP')}
                    />
                    <span>QRMP Scheme (Quarterly)</span>
                  </label>
                </div>
              </div>

              {/* SECTION 4: UDYAM REGISTRATION & MSME */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block">
                  4. Udyam MSME Registration & Section 43B(h)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      Udyam Registration Number (URN)
                    </label>
                    <input
                      type="text"
                      placeholder="UDYAM-RJ-08-0012345"
                      value={formUdyamNumber}
                      onChange={(e) => setFormUdyamNumber(e.target.value)}
                      className="w-full px-3 py-1.5 font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      MSME Enterprise Category
                    </label>
                    <select
                      value={formMsmeCategory}
                      onChange={(e) => setFormMsmeCategory(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    >
                      <option value="Micro">Micro Enterprise (Investment &lt; ₹1 Cr, TO &lt; ₹5 Cr)</option>
                      <option value="Small">Small Enterprise (Investment &lt; ₹10 Cr, TO &lt; ₹50 Cr)</option>
                      <option value="Medium">Medium Enterprise (Investment &lt; ₹50 Cr, TO &lt; ₹250 Cr)</option>
                      <option value="Not Registered">Not Registered Under MSME</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <input
                    type="checkbox"
                    id="sec43bh"
                    checked={formIsMsme43Bh}
                    onChange={(e) => setFormIsMsme43Bh(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <label htmlFor="sec43bh" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                    Section 43B(h) Applicable (Mandatory 45-day payment clause for buyers)
                  </label>
                </div>
              </div>

              {/* SECTION 5: INCOME TAX & PAN WITH PORTAL ID PASSWORD */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block">
                  5. Income Tax & e-Filing Login Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      Permanent Account Number (PAN) *
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="AABCA1234D"
                      value={formPan}
                      onChange={(e) => {
                        setFormPan(e.target.value);
                        if (!formItUser) setFormItUser(e.target.value);
                      }}
                      className="w-full px-2.5 py-1.5 font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      Income Tax User ID (Usually PAN)
                    </label>
                    <input
                      type="text"
                      placeholder="PAN / User ID"
                      value={formItUser}
                      onChange={(e) => setFormItUser(e.target.value)}
                      className="w-full px-2.5 py-1.5 font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      Income Tax Password
                    </label>
                    <input
                      type="text"
                      placeholder="ITR Password"
                      value={formItPass}
                      onChange={(e) => setFormItPass(e.target.value)}
                      className="w-full px-2.5 py-1.5 font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <input
                    type="checkbox"
                    id="auditCheck"
                    checked={formAuditApplicable}
                    onChange={(e) => setFormAuditApplicable(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <label htmlFor="auditCheck" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                    Tax Audit Mandatory under Section 44AB (Form 3CA / 3CB-3CD)
                  </label>
                </div>
              </div>

              {/* SECTION 6: E-WAY BILL & TRACES CREDENTIALS */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block">
                  6. E-Way Bill (NIC) & TRACES Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">E-Way Bill (NIC) Login</span>
                    <input
                      type="text"
                      placeholder="EWB Username"
                      value={formEwbUser}
                      onChange={(e) => setFormEwbUser(e.target.value)}
                      className="w-full px-2.5 py-1 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="EWB Password"
                      value={formEwbPass}
                      onChange={(e) => setFormEwbPass(e.target.value)}
                      className="w-full px-2.5 py-1 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded text-xs focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">TRACES (TDS Login)</span>
                    <input
                      type="text"
                      placeholder="TRACES User ID"
                      value={formTracesUser}
                      onChange={(e) => setFormTracesUser(e.target.value)}
                      className="w-full px-2.5 py-1 font-mono uppercase bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="TRACES Password"
                      value={formTracesPass}
                      onChange={(e) => setFormTracesPass(e.target.value)}
                      className="w-full px-2.5 py-1 font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 7: COMPLIANCE NOTES */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Compliance Notes / DSC Validity / Special Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Director DSC valid till Nov 2027; OTP received on registered mobile 9549899145."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:outline-none text-xs"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
                >
                  Save Client & Vault Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
