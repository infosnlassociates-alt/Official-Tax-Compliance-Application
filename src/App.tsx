import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { ComplianceTracker } from './components/ComplianceTracker';
import { LateFeeCalculator } from './components/LateFeeCalculator';
import { CredentialVault } from './components/CredentialVault';
import { PaymentLedger } from './components/PaymentLedger';
import { TaxNotificationFeed } from './components/TaxNotificationFeed';
import { TaxAdviceArticles } from './components/TaxAdviceArticles';
import { AboutSection } from './components/AboutSection';
import { FounderSection } from './components/FounderSection';
import { GovernmentPortalsMarquee } from './components/GovernmentPortalsMarquee';
import { FirmSettingsModal } from './components/FirmSettingsModal';
import { NotificationModal } from './components/NotificationModal';
import { WhatsAppLogo, TelegramLogo, FacebookLogo } from './components/SocialLogos';

import { 
  getStoredClients, 
  saveStoredClients,
  getStoredFilings, 
  saveStoredFilings,
  getStoredCredentials, 
  saveStoredCredentials,
  getStoredPayments, 
  saveStoredPayments,
  getStoredFirmProfile, 
  saveStoredFirmProfile 
} from './utils/storage';
import { 
  scanUpcomingDeadlines, 
  getNotificationPermissionStatus, 
  requestNotificationPermission,
  playNotificationSound,
  sendDeadlinePushNotification
} from './utils/notifications';
import { openWhatsApp, createTaxDeadlineMessage } from './utils/whatsapp';
import { Client, TaxFiling, CredentialVaultItem, ClientPaymentRecord, FirmProfile, DeadlineAlert } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Application Data States
  const [clients, setClients] = useState<Client[]>([]);
  const [filings, setFilings] = useState<TaxFiling[]>([]);
  const [credentials, setCredentials] = useState<CredentialVaultItem[]>([]);
  const [payments, setPayments] = useState<ClientPaymentRecord[]>([]);
  const [firmProfile, setFirmProfile] = useState<FirmProfile>(getStoredFirmProfile());

  // Notification States
  const [alerts, setAlerts] = useState<DeadlineAlert[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default');

  // Global Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('taxsahayak_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taxsahayak_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taxsahayak_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Modals
  const [isFirmSettingsOpen, setIsFirmSettingsOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  const supportPhone = '9549899145';

  // Load Initial Data from LocalStorage
  const refreshAllData = () => {
    const c = getStoredClients();
    const f = getStoredFilings();
    const cred = getStoredCredentials();
    const p = getStoredPayments();
    const fp = getStoredFirmProfile();

    setClients(c);
    setFilings(f);
    setCredentials(cred);
    setPayments(p);
    setFirmProfile(fp);

    const scannedAlerts = scanUpcomingDeadlines(f);
    setAlerts(scannedAlerts);
  };

  useEffect(() => {
    refreshAllData();
    const perm = getNotificationPermissionStatus();
    setNotificationPermission(perm);
  }, []);

  // Update Filings
  const handleUpdateFiling = (updated: TaxFiling) => {
    const newList = filings.map(f => (f.id === updated.id ? updated : f));
    setFilings(newList);
    saveStoredFilings(newList);
    setAlerts(scanUpcomingDeadlines(newList));
  };

  const handleAddFiling = (newFiling: TaxFiling) => {
    const newList = [newFiling, ...filings];
    setFilings(newList);
    saveStoredFilings(newList);
    setAlerts(scanUpcomingDeadlines(newList));
  };

  const handleDeleteFiling = (id: string) => {
    const newList = filings.filter(f => f.id !== id);
    setFilings(newList);
    saveStoredFilings(newList);
    setAlerts(scanUpcomingDeadlines(newList));
  };

  // Update Credentials
  const handleSaveCredentials = (updatedList: CredentialVaultItem[]) => {
    setCredentials(updatedList);
    saveStoredCredentials(updatedList);
  };

  // Update Clients
  const handleSaveClients = (updatedList: Client[]) => {
    setClients(updatedList);
    saveStoredClients(updatedList);
  };

  // Update Payments
  const handleAddPayment = (record: ClientPaymentRecord) => {
    const newList = [record, ...payments];
    setPayments(newList);
    saveStoredPayments(newList);
  };

  const handleDeletePayment = (id: string) => {
    const newList = payments.filter(p => p.id !== id);
    setPayments(newList);
    saveStoredPayments(newList);
  };

  // Update Firm Profile
  const handleSaveFirmProfile = (profile: FirmProfile) => {
    setFirmProfile(profile);
    saveStoredFirmProfile(profile);
  };

  // Request Notification Permission
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
    if (granted) {
      playNotificationSound();
      sendDeadlinePushNotification(
        'TaxSahayak Notifications Activated',
        'You will receive audio chimes and deadline alerts for GST and Income Tax due dates.'
      );
    }
  };

  // Quick Action Handlers from Dashboard
  const handleQuickRemindFromDashboard = (filing: TaxFiling) => {
    const client = clients.find(c => c.id === filing.clientId);
    const phone = client?.phone || '';
    const text = createTaxDeadlineMessage({
      clientName: filing.clientName,
      returnForm: filing.returnForm,
      taxType: filing.taxType,
      period: filing.period,
      dueDate: filing.dueDate,
      extensionDate: filing.extensionDate,
      firm: firmProfile,
      notes: filing.notes,
    });
    openWhatsApp(phone, text);
  };

  const handleRecordFilingFromDashboard = (filing: TaxFiling) => {
    setActiveTab('compliance');
  };

  // Device-friendly direct WhatsApp support
  const handleFloatingWhatsApp = () => {
    const text = encodeURIComponent('Hello Shree Navya Lekha Associates, I need support with tax compliance / returns.');
    const url = `https://wa.me/91${supportPhone}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-white relative transition-colors duration-200">
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        firmProfile={firmProfile}
        onOpenSettings={() => setIsFirmSettingsOpen(true)}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        pendingAlertsCount={alerts.length}
        notificationPermission={notificationPermission}
        onRequestPermission={handleRequestPermission}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Government Registration Portals Marquee Strip (Marcee) */}
      <GovernmentPortalsMarquee />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            clients={clients}
            filings={filings}
            payments={payments}
            firmProfile={firmProfile}
            onNavigate={(tab) => setActiveTab(tab)}
            onRecordFiling={handleRecordFilingFromDashboard}
            onQuickRemind={handleQuickRemindFromDashboard}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceTracker
            filings={filings}
            clients={clients}
            firmProfile={firmProfile}
            onUpdateFiling={handleUpdateFiling}
            onAddFiling={handleAddFiling}
            onDeleteFiling={handleDeleteFiling}
          />
        )}

        {activeTab === 'calculator' && (
          <LateFeeCalculator firmProfile={firmProfile} />
        )}

        {activeTab === 'vault' && (
          <CredentialVault
            credentials={credentials}
            clients={clients}
            onSaveCredentials={handleSaveCredentials}
            onSaveClients={handleSaveClients}
            onRefreshAllData={refreshAllData}
          />
        )}

        {activeTab === 'ledger' && (
          <PaymentLedger
            payments={payments}
            clients={clients}
            firmProfile={firmProfile}
            onAddPayment={handleAddPayment}
            onDeletePayment={handleDeletePayment}
          />
        )}

        {activeTab === 'notifications' && (
          <TaxNotificationFeed firmProfile={firmProfile} />
        )}

        {activeTab === 'advisory' && (
          <TaxAdviceArticles firmProfile={firmProfile} />
        )}

        {activeTab === 'founder' && (
          <FounderSection onNavigateToFirm={() => setActiveTab('about')} />
        )}

        {activeTab === 'about' && (
          <AboutSection onNavigateToFounder={() => setActiveTab('founder')} />
        )}
      </main>

      {/* Device-Friendly Floating WhatsApp Support Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={handleFloatingWhatsApp}
          title="WhatsApp Support (+91 95498 99145)"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <WhatsAppLogo size={20} />
          <span className="text-xs font-semibold tracking-wide hidden sm:inline">
            WhatsApp Support
          </span>
          <span className="text-[11px] font-mono bg-emerald-700 px-1.5 py-0.5 rounded-full hidden md:inline">
            95498 99145
          </span>
        </button>
      </div>

      {/* Clean Editorial Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                Shree Navya Lekha Associates
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Founder: <span className="font-semibold text-slate-800 dark:text-slate-200">Naveen Shrotriya 'Utkarsh'</span> (Hindi Poet & Author | SNLA Founder | Accountant)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                📍 Shrotriya Mansion, Bhagwati Colony, Bayana - 321401
              </div>
            </div>

            {/* Social Connect Icons in Footer */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleFloatingWhatsApp}
                title="Connect on WhatsApp (+91 95498 99145)"
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <WhatsAppLogo size={20} />
              </button>
              <a
                href={`https://t.me/+91${supportPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Connect on Telegram"
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <TelegramLogo size={20} />
              </a>
              <a
                href="https://www.facebook.com/snlassociates"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow on Facebook"
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <FacebookLogo size={20} />
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <div>
              Support Email: <a href="mailto:info.snlassociates@gmail.com" className="text-slate-600 dark:text-slate-300 hover:underline font-mono">info.snlassociates@gmail.com</a> · Helpline: <span className="font-mono text-slate-600 dark:text-slate-300">+91 95498 99145</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('founder')}
                className="text-amber-800 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors font-medium"
              >
                About Founder (नवीन श्रोत्रिय 'उत्कर्ष')
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab('about')}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
              >
                About Firm & Clients
              </button>
              <span>·</span>
              <button
                onClick={() => setIsFirmSettingsOpen(true)}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Firm Profile Settings Modal */}
      <FirmSettingsModal
        isOpen={isFirmSettingsOpen}
        onClose={() => setIsFirmSettingsOpen(false)}
        firmProfile={firmProfile}
        onSaveFirmProfile={handleSaveFirmProfile}
      />

      {/* Deadline Notifications & Audio Chime Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        alerts={alerts}
        permission={notificationPermission}
        onRequestPermission={handleRequestPermission}
        firmProfile={firmProfile}
      />
    </div>
  );
}
