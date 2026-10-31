import React from 'react';
import { 
  Bell, 
  Calendar, 
  Calculator, 
  KeyRound, 
  CreditCard, 
  FileText, 
  BookOpen, 
  LayoutDashboard,
  Settings,
  ShieldCheck,
  MessageCircle,
  Info,
  Sun,
  Moon,
  Feather
} from 'lucide-react';
import { FirmProfile } from '../types';
import { ShreeNavyaLekhaLogo } from './ShreeNavyaLekhaLogo';
import { WhatsAppLogo } from './SocialLogos';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  firmProfile: FirmProfile;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  pendingAlertsCount: number;
  notificationPermission: NotificationPermission | 'unsupported';
  onRequestPermission: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  firmProfile,
  onOpenSettings,
  onOpenNotifications,
  pendingAlertsCount,
  notificationPermission,
  onRequestPermission,
  isDarkMode,
  onToggleDarkMode
}) => {
  const supportPhone = '9549899145';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'compliance', label: 'Compliance Tracker', icon: Calendar },
    { id: 'calculator', label: 'Late Fee Calculator', icon: Calculator },
    { id: 'vault', label: 'ID Password Vault', icon: KeyRound },
    { id: 'ledger', label: 'Client Ledger', icon: CreditCard },
    { id: 'notifications', label: 'Tax Circulars', icon: FileText },
    { id: 'advisory', label: 'Tax Guides & AI', icon: BookOpen },
    { id: 'founder', label: 'About Founder', icon: Feather },
    { id: 'about', label: 'About Firm & Clients', icon: Info },
  ];

  /**
   * Device-friendly WhatsApp trigger:
   * Works smoothly across Android, iPhone, iPad, and Desktop
   */
  const handleOpenWhatsAppSupport = () => {
    const text = encodeURIComponent('Hello Shree Navya Lekha Associates, I need assistance regarding tax compliance.');
    const url = `https://wa.me/91${supportPhone}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Primary Top Bar Contract: Brand - Nav - Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Transparent Embroidered Seal Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left flex items-center gap-2.5 focus:outline-none group"
            >
              {/* Transparent Brand Medallion Logo */}
              <ShreeNavyaLekhaLogo size={42} />

              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors whitespace-nowrap leading-tight">
                  Shri Navya Lekha
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase">
                  Associates · Tax & Compliance
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Direct Device-Friendly WhatsApp Support */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Global Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode (Night Mode)'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              aria-label="Toggle dark mode theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Device-Friendly WhatsApp Support Button */}
            <button
              onClick={handleOpenWhatsAppSupport}
              title="Chat with Shree Navya Lekha Associates on WhatsApp (+91 95498 99145)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-xs shrink-0"
            >
              <WhatsAppLogo size={16} />
              <span className="hidden sm:inline">WhatsApp Support</span>
              <span className="sm:hidden font-mono">Chat</span>
            </button>

            {/* Notification Permission & Alert Bell */}
            <button
              onClick={notificationPermission === 'granted' ? onOpenNotifications : onRequestPermission}
              title={
                notificationPermission === 'granted'
                  ? `${pendingAlertsCount} pending tax deadline alerts`
                  : 'Enable Browser Push Notifications for Deadlines'
              }
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4" />
              {pendingAlertsCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full font-mono">
                  {pendingAlertsCount}
                </span>
              )}
            </button>

            {/* Offline Vault Security Indicator */}
            <div 
              onClick={() => setActiveTab('vault')}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 rounded cursor-pointer border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
              title="Credentials stored 100% offline in browser local storage"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Offline Vault</span>
            </div>

            {/* Practice Profile Settings */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
              title="Practice Settings"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span className="hidden lg:inline text-[11px] truncate max-w-[100px]">Profile</span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Sub-Navigation Bar */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-slate-900 dark:bg-slate-800 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
