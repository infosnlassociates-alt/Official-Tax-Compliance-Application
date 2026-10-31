import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Compass, 
  Copy, 
  Check, 
  ExternalLink,
  Award,
  BookOpen,
  Feather,
  Scale,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  MessageCircle,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Plus,
  Trash2,
  Briefcase,
  Calendar,
  X
} from 'lucide-react';
import { ShreeNavyaLekhaLogo } from './ShreeNavyaLekhaLogo';
import { 
  WhatsAppLogo, 
  TelegramLogo, 
  FacebookLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  XTwitterLogo, 
  LinkedInLogo 
} from './SocialLogos';
import { INITIAL_PORTFOLIO_CLIENTS } from '../data/mockData';
import { PortfolioClient } from '../types';

interface AboutSectionProps {
  onNavigateToFounder?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigateToFounder }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<string>('General Tax Support & Consultation');

  // Official Contacts provided by user
  const contactPhone1 = '+91 84 4008-4006';
  const contactPhone1Raw = '8440084006';
  const contactPhone2 = '+91 84 4181-2152';
  const contactPhone2Raw = '8441812152';
  const whatsappHelpline = '9549899145';
  const whatsappHelplineDisplay = '+91 95498 99145';
  const supportEmail = 'info.snlassociates@gmail.com';
  const officeAddress = 'Shrotriya Mansion, Bhagwati Colony, Bayana Zip - 321401';
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Shrotriya+Mansion+Bhagwati+Colony+Bayana+321401';

  // 1. Logo Customization State (Stored in localStorage)
  const [logoStyle, setLogoStyle] = useState<'fabric' | 'wood'>('fabric');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Client Portfolio State (Stored in localStorage)
  const [portfolioClients, setPortfolioClients] = useState<PortfolioClient[]>(INITIAL_PORTFOLIO_CLIENTS);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState<boolean>(false);

  // New Client Form State
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientSince, setNewClientSince] = useState<number>(2024);
  const [newClientCategory, setNewClientCategory] = useState<string>('Fertilizers & Agro Chemicals');
  const [newClientLocation, setNewClientLocation] = useState<string>('Bayana, Rajasthan');
  const [newClientServices, setNewClientServices] = useState<string>('GST Returns · Bookkeeping · Tax Audit');
  const [newClientLogoUrl, setNewClientLogoUrl] = useState<string>('');
  const [newClientColor, setNewClientColor] = useState<string>('emerald');
  const clientLogoInputRef = useRef<HTMLInputElement>(null);

  // Initialize and load saved state from localStorage
  useEffect(() => {
    try {
      const savedLogoStyle = localStorage.getItem('snla_logo_style') as 'fabric' | 'wood' | null;
      if (savedLogoStyle) setLogoStyle(savedLogoStyle);

      const savedCustomLogo = localStorage.getItem('snla_custom_firm_logo');
      if (savedCustomLogo) setCustomLogoUrl(savedCustomLogo);

      const savedClients = localStorage.getItem('snla_portfolio_clients');
      if (savedClients) {
        setPortfolioClients(JSON.parse(savedClients));
      }
    } catch (e) {
      console.error('Error loading saved AboutSection preferences:', e);
    }
  }, []);

  // Save clients to localStorage
  const savePortfolioClients = (clients: PortfolioClient[]) => {
    setPortfolioClients(clients);
    try {
      localStorage.setItem('snla_portfolio_clients', JSON.stringify(clients));
    } catch (e) {
      console.error('Error persisting portfolio clients:', e);
    }
  };

  // Handle Logo Upload
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCustomLogoUrl(base64);
        localStorage.setItem('snla_custom_firm_logo', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectLogoStyle = (style: 'fabric' | 'wood') => {
    setLogoStyle(style);
    setCustomLogoUrl(null);
    localStorage.removeItem('snla_custom_firm_logo');
    localStorage.setItem('snla_logo_style', style);
  };

  const handleResetLogo = () => {
    setLogoStyle('fabric');
    setCustomLogoUrl(null);
    localStorage.removeItem('snla_custom_firm_logo');
    localStorage.setItem('snla_logo_style', 'fabric');
  };

  // Handle Client Logo Upload
  const handleClientLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewClientLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add New Client
  const handleAddNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const newClient: PortfolioClient = {
      id: `pc-${Date.now()}`,
      name: newClientName.trim(),
      since: Number(newClientSince) || 2026,
      category: newClientCategory.trim(),
      location: newClientLocation.trim() || 'Bayana, Rajasthan',
      services: newClientServices.trim() || 'GST Returns · Bookkeeping · Tax Audit',
      logoUrl: newClientLogoUrl || undefined,
      badgeColor: newClientColor
    };

    const updated = [newClient, ...portfolioClients];
    savePortfolioClients(updated);

    // Reset Form
    setNewClientName('');
    setNewClientSince(2024);
    setNewClientCategory('Fertilizers & Agro Chemicals');
    setNewClientLocation('Bayana, Rajasthan');
    setNewClientServices('GST Returns · Bookkeeping · Tax Audit');
    setNewClientLogoUrl('');
    setIsAddClientModalOpen(false);
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from client showcase list?`)) {
      const updated = portfolioClients.filter(c => c.id !== id);
      savePortfolioClients(updated);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  /**
   * Device-friendly WhatsApp trigger:
   * Works smoothly on mobile (opens WhatsApp app) and desktop (opens WhatsApp Web)
   */
  const handleOpenWhatsApp = (customMsg?: string, phoneNum: string = whatsappHelpline) => {
    const message = customMsg || `Hello Shri Navya Lekha Associates, I need support regarding ${selectedInquiry}. Please assist.`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/91${phoneNum}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const services = [
    { 
      title: 'Tax & Statutory Audit', 
      desc: 'Form 3CA-3CD, 3CB-3CD, Company Audits under Companies Act 2013, Tax Audit compliance under Section 44AB.',
      badge: 'Audits'
    },
    { 
      title: 'Income Tax Return (ITR)', 
      desc: 'ITR-1 to ITR-7, AIS/TIS data reconciliation, Capital Gains computation, Advance Tax, and strategic Tax Planning.',
      badge: 'Direct Tax'
    },
    { 
      title: 'Goods & Service Tax (GST)', 
      desc: 'Monthly GSTR-1, GSTR-3B, GSTR-9/9C Annual Returns, Rule 37A ITC reconciliation, refund applications.',
      badge: 'Indirect Tax'
    },
    { 
      title: 'Udyam Aadhar (MSME)', 
      desc: 'MSME registration, Priority Sector Lending benefits, and Section 43B(h) 45-day payment statutory verification.',
      badge: 'MSME'
    },
    { 
      title: 'Business Registration', 
      desc: 'Proprietorship, Partnership Deed, Private Limited Company, LLP incorporation, Section 8 NGO, and Trust registration.',
      badge: 'Corporate'
    },
    { 
      title: 'Accounting & Bookkeeping 📚', 
      desc: 'Complete day-to-day accounts in Tally Prime / Busy, Ledger maintenance, Bank reconciliation, and Periodic MIS.',
      badge: 'Accounts'
    },
    { 
      title: 'TDS & TCS Compliance', 
      desc: 'Quarterly Form 24Q, 26Q, 27Q filings, TRACES Form 16 / 16A generation, Challan ITNS 281 reconciliation.',
      badge: 'TDS/TCS'
    },
    { 
      title: 'E-Way Bill & Other Services', 
      desc: 'NIC portal integration, 2FA setup, vehicle transshipment extensions, CMA data, and loan project reports.',
      badge: 'Advisory'
    },
  ];

  const socialLinks = [
    {
      name: 'WhatsApp Support',
      handle: whatsappHelplineDisplay,
      desc: 'Instant consultation & compliance document sharing',
      icon: WhatsAppLogo,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100',
      action: () => handleOpenWhatsApp()
    },
    {
      name: 'Telegram Channel',
      handle: '@SNLA_Updates',
      desc: 'Daily taxation circulars, CBDT/CBIC notifications & GST alerts',
      icon: TelegramLogo,
      color: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100',
      action: () => window.open(`https://t.me/+91${whatsappHelpline}`, '_blank', 'noopener,noreferrer')
    },
    {
      name: 'Facebook Page',
      handle: '/snlassociates',
      desc: 'Official firm announcements, articles & financial advice',
      icon: FacebookLogo,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100',
      action: () => window.open('https://www.facebook.com/snlassociates', '_blank', 'noopener,noreferrer')
    },
    {
      name: 'Instagram Profile',
      handle: '@snla_official',
      desc: 'Tax tips, compliance guides, poetry & quotes',
      icon: InstagramLogo,
      color: 'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800 hover:bg-pink-100',
      action: () => window.open('https://www.instagram.com/snlassociates', '_blank', 'noopener,noreferrer')
    },
    {
      name: 'YouTube Channel',
      handle: '@SNLA_Tax',
      desc: 'ITR e-filing tutorials & legal explainers',
      icon: YouTubeLogo,
      color: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100',
      action: () => window.open('https://www.youtube.com/@snlassociates', '_blank', 'noopener,noreferrer')
    },
    {
      name: 'X (Twitter)',
      handle: '@snla_tax',
      desc: 'Real-time MCA, CBDT, and GST extension updates',
      icon: XTwitterLogo,
      color: 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:bg-slate-100',
      action: () => window.open('https://twitter.com/snlassociates', '_blank', 'noopener,noreferrer')
    },
    {
      name: 'LinkedIn Network',
      handle: 'Shri Navya Lekha Associates',
      desc: 'Corporate accounting & audit network',
      icon: LinkedInLogo,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100',
      action: () => window.open('https://www.linkedin.com/company/snlassociates', '_blank', 'noopener,noreferrer')
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. HERO BANNER: POLISHED WOODGRAIN WALL BANNER WITH CUSTOMIZABLE ATTACHED EMBLEM */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-600/50 shadow-2xl bg-gradient-to-r from-[#170a04] via-[#2a150b] to-[#140803] text-amber-50 p-6 sm:p-10 lg:p-12">
        {/* Realistic Polished Woodgrain Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px), repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)`
          }}
        />

        {/* Golden Radial Glow behind the Medallion */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Services Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>श्री नव्य लेखा एसोसिएट्स</span>
                <span>·</span>
                <span>Established Excellence</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-md leading-tight">
                SHRI NAVYA LEKHA ASSOCIATES
              </h1>

              <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-amber-200 mt-2">
                <span>Your Trusted Financial Partner</span>
                <span className="text-amber-400">✦</span>
              </div>

              <p className="text-xs sm:text-sm text-amber-300/90 font-mono italic mt-1">
                "विश्वास की नींव, प्रगति का आधार" (The Foundation of Trust, The Base of Progress)
              </p>
            </div>

            {/* Services Matrix with Clean Editorial Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-amber-100/90 pt-3 border-t border-amber-500/25">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                  <span className="font-bold text-white text-sm">Audit</span>
                  <span className="text-xs text-amber-300/70">(Tax & Statutory)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                  <span className="font-bold text-white text-sm">Income Tax</span>
                  <span className="text-xs text-amber-300/70">(ITR 1 to 7)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                  <span className="font-bold text-white text-sm">Goods & Service Tax (GST)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                  <span className="font-bold text-white text-sm">Udyam Aadhar</span>
                  <span className="text-xs text-amber-300/70">(MSME Registration)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                  <span className="font-bold text-white text-sm">Business Registration</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                  <span className="font-bold text-white text-sm">Accounting & Bookkeeping 📚</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                  <span className="font-bold text-white text-sm">TDS, E-Way Bill & ROC Filings</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30"></span>
                  <span className="font-bold text-white text-sm">And Other Financial Services</span>
                </div>
              </div>
            </div>

            {/* Banner Quick Contact Strip */}
            <div className="p-4 bg-black/70 backdrop-blur-md rounded-xl border border-amber-500/40 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                {/* Email */}
                <a
                  href={`mailto:${supportEmail}`}
                  className="flex items-center gap-2 text-amber-200 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500/25 text-amber-300 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-xs">{supportEmail}</span>
                </a>

                {/* WhatsApp */}
                <button
                  onClick={() => handleOpenWhatsApp()}
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-mono font-bold text-xs"
                >
                  <WhatsAppLogo size={18} />
                  <span>{whatsappHelplineDisplay}</span>
                </button>

                {/* Primary Contacts */}
                <div className="hidden sm:flex items-center gap-2 text-amber-300/90 font-mono text-xs">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{contactPhone1}</span>
                  <span>·</span>
                  <span>{contactPhone2}</span>
                </div>
              </div>

              {/* Social Channels Preview */}
              <div className="flex items-center gap-2.5">
                <button onClick={() => handleOpenWhatsApp()} title="WhatsApp Helpline" className="hover:scale-115 transition-transform">
                  <WhatsAppLogo size={22} />
                </button>
                <button onClick={() => window.open(`https://t.me/+91${whatsappHelpline}`, '_blank')} title="Telegram" className="hover:scale-115 transition-transform">
                  <TelegramLogo size={22} />
                </button>
                <button onClick={() => window.open('https://www.facebook.com/snlassociates', '_blank')} title="Facebook" className="hover:scale-115 transition-transform">
                  <FacebookLogo size={22} />
                </button>
                <button onClick={() => window.open('https://www.instagram.com/snlassociates', '_blank')} title="Instagram" className="hover:scale-115 transition-transform">
                  <InstagramLogo size={22} />
                </button>
                <button onClick={() => window.open('https://www.youtube.com/@snlassociates', '_blank')} title="YouTube" className="hover:scale-115 transition-transform">
                  <YouTubeLogo size={22} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Medallion Emblem Badge with Replace Option */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-2">
            <div className="relative group p-3 rounded-full bg-gradient-to-b from-amber-600/30 via-amber-900/30 to-black/70 border-2 border-amber-500/50 shadow-2xl backdrop-blur-xs hover:scale-105 transition-transform duration-300">
              <ShreeNavyaLekhaLogo 
                size={220} 
                variant={logoStyle} 
                customImageUrl={customLogoUrl}
              />
            </div>

            <div className="mt-4 text-center space-y-2">
              <div className="font-extrabold text-amber-200 text-base tracking-wide">
                श्री नव्य लेखा एसोसिएट्स
              </div>
              <div className="text-xs text-amber-400 font-mono uppercase tracking-widest">
                Certified Tax & Audit Advisors
              </div>

              {/* Action Button: Replace / Change Logo */}
              <div className="pt-2">
                <button
                  onClick={() => setIsLogoModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-amber-200 hover:text-white transition-all shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace / Customize Logo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OUR PRESTIGIOUS CLIENT LIST & SHOWCASE (GUJRAT KHAD BHANDAR, SOOPA HONDA, RAHUL ENTERPRISES, ETC.) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Valued Clients & Business Entities</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Our Long-Standing Clients & Corporates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Trusted by leading commercial enterprises, agricultural traders, and dealerships since 2017 with flawless compliance records:
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline-block text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              Total {portfolioClients.length} Partners
            </span>
            <button
              onClick={() => setIsAddClientModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Client</span>
            </button>
          </div>
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioClients.map((client) => {
            const currentYear = 2026;
            const yearsOfTrust = Math.max(1, currentYear - client.since);

            // Initials avatar if no custom logo image
            const initials = client.name
              .split(' ')
              .map(word => word[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={client.id}
                className="group relative p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-amber-400/80 dark:hover:border-amber-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Row: Client Logo & Tenure Badge */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Logo (Custom Image or Styled Monogram Badge) */}
                    <div className="w-14 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {client.logoUrl ? (
                        <img 
                          src={client.logoUrl} 
                          alt={client.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="font-black text-slate-800 dark:text-amber-300 text-lg tracking-wider font-mono">
                          {initials}
                        </span>
                      )}
                    </div>

                    {/* Tenure "Since : YYYY" Pill Badge */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-black font-mono shadow-2xs">
                        <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>Since : {client.since}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        {yearsOfTrust}+ Years of Association
                      </div>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-snug">
                      {client.name}
                    </h3>
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.category}</span>
                    </div>
                    {client.location && (
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{client.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Services & Delete Action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-medium truncate max-w-[200px]" title={client.services}>
                    {client.services || 'GST · ITR · Accounts'}
                  </span>

                  <button
                    onClick={() => handleDeleteClient(client.id, client.name)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title={`Delete ${client.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. FOUNDER & LEADERSHIP SPOTLIGHT (Mr. Naveen Shrotriya “Utkarsh”) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
              <Feather className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Founder & Visionary Leadership</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Mr. Naveen Shrotriya “Utkarsh”
            </h2>

            {/* Subtitle Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
              <span className="px-3 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs">
                ✍️ Hindi Poet & Author
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs">
                🏛️ SNLA Founder
              </span>
              <span className="px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs">
                💼 Accountant & Tax Advisor
              </span>
            </div>
          </div>

          {/* Direct Connect Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {onNavigateToFounder && (
              <button
                onClick={onNavigateToFounder}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-700 rounded-lg transition-colors shadow-xs"
                title="View Dedicated Founder Profile & Literary Biography"
              >
                <Feather className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Full Founder Profile (संस्थापक परिचय) →</span>
              </button>
            )}

            <button
              onClick={() => handleOpenWhatsApp("Hello Mr. Naveen Shrotriya Ji, Greetings! I am reaching out through the SNLA Portal.", contactPhone1Raw)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
              title={`Chat on WhatsApp (${contactPhone1})`}
            >
              <WhatsAppLogo size={18} />
              <span>WhatsApp Direct</span>
            </button>

            <button
              onClick={() => window.open(`https://t.me/+91${whatsappHelpline}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-sm"
              title="Connect on Telegram"
            >
              <TelegramLogo size={18} />
              <span>Telegram</span>
            </button>

            <button
              onClick={() => window.open('https://www.facebook.com/snlassociates', '_blank')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#1877F2] hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              title="Connect on Facebook"
            >
              <FacebookLogo size={18} />
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Founder Bio, Couplet Quote & Office Location Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Poetic Couplet & Bio (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Elegant Hindi Poetic Quote Card */}
            <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-950/30 rounded-xl border border-amber-200/90 dark:border-amber-800/60 shadow-xs">
              <div className="text-3xl text-amber-500/40 dark:text-amber-400/30 font-serif leading-none absolute top-3 left-4">“</div>
              <p className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-200 font-serif italic text-center px-4 leading-relaxed">
                साहित्य में संवेदना और लेखाकर्म में शुचिता — दोनों ही जीवन और समाज की उन्नति के आधार हैं।
              </p>
              <div className="text-xs font-bold text-amber-800 dark:text-amber-400 text-right mt-2 font-mono">
                — नवीन श्रोत्रिय 'उत्कर्ष'
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-sans">
              <p>
                <strong>Mr. Naveen Shrotriya “Utkarsh”</strong> is an accomplished Hindi poet, creative author, experienced accountant, and the visionary founder of <strong>Shri Navya Lekha Associates (SNLA)</strong>. His philosophy blends literary integrity and cultural consciousness with absolute statutory rigor in direct and indirect taxation, corporate compliance, and commercial bookkeeping.
              </p>
              <p>
                Under his leadership, SNLA has grown into a trusted financial partner for businesses across Rajasthan and all-India, delivering meticulous GST filings, Tax Audits, and corporate advisory with transparency, zero penalty risks, and friendly client dedication.
              </p>
            </div>
          </div>

          {/* Right Column: Official Bayana Address & Direct Contacts Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/80 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Headquarters & Registered Address</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                Shrotriya Mansion
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Bhagwati Colony
              </div>
              <div className="text-sm font-mono font-bold text-slate-800 dark:text-emerald-400 mt-1">
                Bayana Zip - 321401 (Rajasthan)
              </div>
            </div>

            {/* Direct Calling Contact Numbers Strip */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Official Contacts:</span>
                <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${contactPhone1Raw}`}
                  className="p-2 rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono font-bold text-slate-900 dark:text-white flex items-center justify-between border border-slate-200 dark:border-slate-700"
                >
                  <span>{contactPhone1}</span>
                  <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </a>
                <a
                  href={`tel:${contactPhone2Raw}`}
                  className="p-2 rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-mono font-bold text-slate-900 dark:text-white flex items-center justify-between border border-slate-200 dark:border-slate-700"
                >
                  <span>{contactPhone2}</span>
                  <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </a>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <button
                onClick={() => copyToClipboard(officeAddress, 'address')}
                className="w-full py-2 px-4 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedType === 'address' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'address' ? 'Address Copied!' : 'Copy Office Address'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. POPULAR SOCIAL MEDIA CHANNELS ECOSYSTEM */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Connect on Popular Social Media
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Stay updated with daily taxation circulars, legal notifications, and tax advisory across our official platforms:
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 font-semibold self-start sm:self-auto">
            7 Active Channels
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {socialLinks.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                onClick={item.action}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-slate-800/70 group flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent size={32} />
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>

                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 truncate mt-0.5">
                    {item.handle}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-1 leading-snug">
                    {item.desc}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  <span>Open Channel</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. DIRECT CONTACT & HELPLINE CARDS (WHATSAPP, PHONE, EMAIL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: WhatsApp Support */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-7 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800/70 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <WhatsAppLogo size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                WhatsApp Support
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Direct device-friendly chat. Tapping this button instantly launches WhatsApp on mobile or WhatsApp Web on desktop.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/60">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Helpline Number:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{whatsappHelplineDisplay}</span>
            </div>

            <button
              onClick={() => handleOpenWhatsApp()}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <WhatsAppLogo size={18} />
              <span>Chat on WhatsApp Now</span>
            </button>
          </div>
        </div>

        {/* Card 2: Phone Helpline */}
        <div className="bg-gradient-to-br from-blue-500/10 via-white to-white dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-7 rounded-2xl border-2 border-blue-200 dark:border-blue-800/70 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Voice Helpline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Direct calling support for critical portal errors, audit scheduling, and urgent return filings.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-blue-100 dark:border-blue-900/60">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Contact 1:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{contactPhone1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Contact 2:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{contactPhone2}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${contactPhone1Raw}`}
                className="flex-1 py-3 px-4 text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call Primary</span>
              </a>
              <button
                onClick={() => copyToClipboard(`${contactPhone1} | ${contactPhone2}`, 'phone')}
                className="py-3 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                title="Copy phone numbers"
              >
                {copiedType === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Support Email */}
        <div className="bg-gradient-to-br from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-7 rounded-2xl border-2 border-amber-200 dark:border-amber-800/70 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Mail className="w-6 h-6 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Official Email Desk
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Transmit financial statements, Tally audit backups, bank records, and official assessment queries.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-amber-100 dark:border-amber-900/60">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Email Desk:</span>
              <span className="font-mono text-slate-900 dark:text-white font-bold text-xs truncate max-w-[150px]">{supportEmail}</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`mailto:${supportEmail}`}
                className="flex-1 py-3 px-4 text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Send Email</span>
              </a>
              <button
                onClick={() => copyToClipboard(supportEmail, 'email')}
                className="py-3 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                title="Copy email address"
              >
                {copiedType === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. SERVICES PORTFOLIO MATRIX */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Complete Professional Services Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            End-to-end statutory taxation, corporate law, accounting, and advisory solutions for SMEs, professionals, and corporate entities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((srv, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                    {srv.badge}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {srv.title}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <button
                onClick={() => handleOpenWhatsApp(`Hello Shri Navya Lekha Associates, I am interested in your ${srv.title} services. Please share required documents and terms.`)}
                className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 self-start"
              >
                <span>Consult on this</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 7. INSTANT WHATSAPP CONSULTATION DISPATCHER */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-6 sm:p-8 rounded-2xl space-y-5 shadow-lg border border-transparent dark:border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
            <WhatsAppLogo size={24} />
            <span>Instant WhatsApp Consultation Dispatcher</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 mt-1">
            Select a compliance service topic below to launch a customized, pre-composed message directly to Mr. Naveen Shrotriya “Utkarsh” & the SNLA advisory desk on <span className="font-mono text-emerald-400 font-bold">{whatsappHelplineDisplay}</span>:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {[
            'GST Return & ITC Reconciliation',
            'Income Tax Return (ITR) Filing',
            'Tax Audit (Form 3CD) Compliance',
            'MSME Section 43B(h) Advisory',
            'TDS Quarterly Return & Challans',
            'New Business / Company Registration',
            'Monthly Accounting & Bookkeeping'
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setSelectedInquiry(topic);
                handleOpenWhatsApp(`Hello Mr. Naveen Shrotriya Ji (Shri Navya Lekha Associates), I would like to consult with your firm regarding ${topic}. Please guide me on documentation and due dates.`);
              }}
              className="px-3.5 py-2 bg-slate-800 dark:bg-slate-800/80 hover:bg-emerald-700 text-slate-200 hover:text-white rounded-lg transition-colors text-xs font-semibold border border-slate-700 hover:border-emerald-500 shadow-xs"
            >
              {topic} →
            </button>
          ))}
        </div>
      </div>

      {/* MODAL 1: REPLACE / CUSTOMIZE LOGO MODAL */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-5 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg font-bold">Replace / Customize Firm Logo</h3>
              </div>
              <button
                onClick={() => setIsLogoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Preview */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <ShreeNavyaLekhaLogo size={140} variant={logoStyle} customImageUrl={customLogoUrl} />
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {customLogoUrl ? 'Active: Custom Uploaded Logo' : logoStyle === 'fabric' ? 'Active: Embroidered Blue Denim & Gold Patch' : 'Active: Carved Teak Wood Medallion'}
              </div>
            </div>

            {/* Logo Presets Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Choose Official Brand Preset
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Preset 1: Embroidered Fabric */}
                <button
                  type="button"
                  onClick={() => handleSelectLogoStyle('fabric')}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-2 ${
                    !customLogoUrl && logoStyle === 'fabric'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Embroidered Patch</span>
                    {!customLogoUrl && logoStyle === 'fabric' && (
                      <Check className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Navy denim fabric with gold braided stitch
                  </span>
                </button>

                {/* Preset 2: Carved Wood Medallion */}
                <button
                  type="button"
                  onClick={() => handleSelectLogoStyle('wood')}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-2 ${
                    !customLogoUrl && logoStyle === 'wood'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Carved Wood Plaque</span>
                    {!customLogoUrl && logoStyle === 'wood' && (
                      <Check className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Polished walnut wood with beveled brass rim
                  </span>
                </button>
              </div>
            </div>

            {/* Upload Custom File Section */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Or Upload Custom Firm Logo (PNG / JPG / SVG)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFileUpload}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Choose Image File...</span>
                </button>

                {customLogoUrl && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Remove custom logo and reset to default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
              >
                Done / Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW CLIENT WITH LOGO MODAL */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold">Add Client to Portfolio Showcase</h3>
              </div>
              <button
                onClick={() => setIsAddClientModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Client / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GUJRAT KHAD BHANDAR or Soopa Honda"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Associated Since (Year) *
                  </label>
                  <input
                    type="number"
                    required
                    min={2000}
                    max={2030}
                    placeholder="e.g. 2017"
                    value={newClientSince}
                    onChange={(e) => setNewClientSince(parseInt(e.target.value) || 2026)}
                    className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="Bayana, Rajasthan"
                    value={newClientLocation}
                    onChange={(e) => setNewClientLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Business Industry / Category *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fertilizers & Agro Chemicals, Automobile Dealership, Commercial Trading"
                  value={newClientCategory}
                  onChange={(e) => setNewClientCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Compliance Services Rendered
                </label>
                <input
                  type="text"
                  placeholder="e.g. GST Returns · Tax Audit · Monthly Books · Section 43B(h)"
                  value={newClientServices}
                  onChange={(e) => setNewClientServices(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Client Logo Upload or Preview */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Client Logo Image (Optional)
                </label>

                <input
                  ref={clientLogoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleClientLogoUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  {/* Preview */}
                  <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    {newClientLogoUrl ? (
                      <img src={newClientLogoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-sm text-slate-500 font-mono">
                        {newClientName ? newClientName.slice(0, 2).toUpperCase() : 'LOGO'}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => clientLogoInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Client Logo...</span>
                  </button>

                  {newClientLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setNewClientLogoUrl('')}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                      title="Clear logo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  Leave empty to automatically generate a clean corporate typography badge with entity initials.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
                >
                  Add Client to Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
