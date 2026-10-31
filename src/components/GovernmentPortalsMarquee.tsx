import React, { useState } from 'react';
import { 
  ExternalLink, 
  Pause, 
  Play, 
  Layers, 
  X, 
  ShieldCheck, 
  FileCheck2, 
  Building2, 
  CreditCard, 
  Users2, 
  KeyRound, 
  Compass, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export interface PortalLinkItem {
  id: string;
  name: string;
  actionText: string;
  category: string;
  portalUrl: string;
  authority: string;
  stateOrCentral: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  logo: React.ReactNode;
}

export const GOVERNMENT_PORTALS: PortalLinkItem[] = [
  {
    id: 'pan',
    name: 'Permanent Account Number',
    actionText: 'Apply For New PAN',
    category: 'Direct Taxation',
    portalUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    authority: 'Income Tax Dept / NSDL Protean',
    stateOrCentral: 'Govt of India',
    badgeBg: 'from-blue-600 to-indigo-700',
    borderColor: 'border-blue-400/40',
    textColor: 'text-blue-700 dark:text-blue-300',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#1E40AF" />
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#FDE047" strokeWidth="1.5" fill="#1E3A8A" />
        <circle cx="8" cy="11" r="2.5" fill="#FDE047" />
        <path d="M5.5 16C6 14.2 7 13.5 8 13.5C9 13.5 10 14.2 10.5 16" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="12" y1="9" x2="19" y2="9" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="12" x2="17" y2="12" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="12" y1="15" x2="18" y2="15" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'gst',
    name: 'Goods & Services Tax',
    actionText: 'Apply For GST Registration',
    category: 'Indirect Taxation',
    portalUrl: 'https://reg.gst.gov.in/registration/',
    authority: 'GST Common Portal (CBIC)',
    stateOrCentral: 'Govt of India',
    badgeBg: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-400/40',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#047857" />
        <path d="M12 3V21M3 12H21" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="7" stroke="#FBBF24" strokeWidth="1.5" fill="#065F46" />
        <path d="M9 10C9 9 10 8 12 8C14 8 15 9 15 10C15 11.5 13.5 12 12 12V13.5M12 16H12.01" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'brn',
    name: 'Business Registration Number',
    actionText: 'Apply For BRN',
    category: 'Commercial Registration',
    portalUrl: 'https://bsp.rajasthan.gov.in/',
    authority: 'Directorate of Economics & Statistics',
    stateOrCentral: 'Govt of Rajasthan',
    badgeBg: 'from-amber-600 to-orange-700',
    borderColor: 'border-amber-400/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#C2410C" />
        <path d="M12 3L4 7V17L12 21L20 17V7L12 3Z" stroke="#FDE68A" strokeWidth="1.5" fill="#9A3412" />
        <text x="12" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">BRN</text>
      </svg>
    )
  },
  {
    id: 'udyam',
    name: 'MSME Udyam Registration',
    actionText: 'Apply For Udyam Aadhar',
    category: 'MSME Enterprise',
    portalUrl: 'https://udyamregistration.gov.in/',
    authority: 'Ministry of MSME',
    stateOrCentral: 'Govt of India',
    badgeBg: 'from-sky-700 to-blue-900',
    borderColor: 'border-sky-400/40',
    textColor: 'text-sky-700 dark:text-sky-300',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#0369A1" />
        <circle cx="12" cy="12" r="7.5" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 1" />
        <circle cx="12" cy="12" r="3.5" fill="#FDE047" />
        <path d="M12 5V7M12 17V19M5 12H7M17 12H19" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'mca',
    name: 'Company / LLP SPICe+ Registration',
    actionText: 'Apply For Company Registration',
    category: 'Corporate Affairs',
    portalUrl: 'https://www.mca.gov.in/content/mca/global/en/home.html',
    authority: 'Ministry of Corporate Affairs (MCA)',
    stateOrCentral: 'Govt of India',
    badgeBg: 'from-indigo-800 to-slate-900',
    borderColor: 'border-indigo-400/40',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#312E81" />
        <path d="M4 19V10L12 5L20 10V19H4Z" stroke="#FDE047" strokeWidth="1.5" fill="#1E1B4B" />
        <rect x="7" y="12" width="2.5" height="4" fill="#FFFFFF" />
        <rect x="10.75" y="12" width="2.5" height="7" fill="#FDE047" />
        <rect x="14.5" y="12" width="2.5" height="4" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    id: 'eshram',
    name: 'e-Shram National Worker Card',
    actionText: 'Apply For E-Shramik Card',
    category: 'Labour & Welfare',
    portalUrl: 'https://eshram.gov.in/',
    authority: 'Ministry of Labour & Employment',
    stateOrCentral: 'Govt of India',
    badgeBg: 'from-purple-700 to-pink-800',
    borderColor: 'border-purple-400/40',
    textColor: 'text-purple-700 dark:text-purple-300',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#7E22CE" />
        <path d="M12 6C9.5 6 7.5 8 7.5 10.5C7.5 13 9.5 15 12 15C14.5 15 16.5 13 16.5 10.5C16.5 8 14.5 6 12 6Z" stroke="#FDE047" strokeWidth="1.5" fill="#581C87" />
        <path d="M5 20C5 17 8 15 12 15C16 15 19 17 19 20" stroke="#F3E8FF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'eway',
    name: 'E-Way Bill & e-Invoice',
    actionText: 'E-Way Bill Portal',
    category: 'Goods Transit',
    portalUrl: 'https://ewaybillgst.gov.in/',
    authority: 'National Informatics Centre (NIC)',
    stateOrCentral: 'Govt of India',
    badgeBg: 'from-teal-700 to-emerald-900',
    borderColor: 'border-teal-400/40',
    textColor: 'text-teal-700 dark:text-teal-300',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#0F766E" />
        <path d="M4 8H14V16H4V8Z" stroke="#FDE047" strokeWidth="1.5" fill="#134E4A" />
        <path d="M14 11H18L20 13.5V16H14V11Z" stroke="#FDE047" strokeWidth="1.5" fill="#115E59" />
        <circle cx="7" cy="17" r="2" fill="#FDE047" />
        <circle cx="17" cy="17" r="2" fill="#FDE047" />
      </svg>
    )
  },
  {
    id: 'itr',
    name: 'Income Tax e-Filing 2.0',
    actionText: 'Income Tax e-Filing Portal',
    category: 'Annual Tax Returns',
    portalUrl: 'https://www.incometax.gov.in/',
    authority: 'CBDT Income Tax Department',
    stateOrCentral: 'Govt of India',
    badgeBg: 'from-blue-700 to-slate-900',
    borderColor: 'border-blue-400/40',
    textColor: 'text-blue-700 dark:text-blue-300',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#1D4ED8" />
        <path d="M7 17L12 7L17 17" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 14H15" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'dsc',
    name: 'Digital Signature Certificate',
    actionText: 'Apply For DSC (Class-3)',
    category: 'Signatures & Tokens',
    portalUrl: 'https://www.e-mudhra.com/',
    authority: 'Certifying Authority (CCA)',
    stateOrCentral: 'Govt of India',
    badgeBg: 'from-amber-700 to-yellow-800',
    borderColor: 'border-amber-400/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#B45309" />
        <rect x="7" y="11" width="10" height="8" rx="2" stroke="#FDE047" strokeWidth="1.5" fill="#78350F" />
        <path d="M9 11V8C9 6.5 10.5 5 12 5C13.5 5 15 6.5 15 8V11" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1" fill="#FFFFFF" />
      </svg>
    )
  }
];

export const GovernmentPortalsMarquee: React.FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Repeat twice for seamless infinite scrolling loop
  const loopList = [...GOVERNMENT_PORTALS, ...GOVERNMENT_PORTALS];

  return (
    <>
      {/* Marquee Strip Container */}
      <aside 
        aria-label="Government Registration Portals Ticker"
        className="w-full bg-slate-900 border-y border-amber-500/30 text-white relative z-20 shadow-inner overflow-hidden select-none"
      >
        <div className="flex items-center">
          {/* Static Left Label Contract */}
          <div className="shrink-0 z-30 flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#180d07] via-slate-900 to-slate-900/90 border-r border-amber-500/40 shadow-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 whitespace-nowrap hidden sm:inline">
              Govt Registration Portals
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 whitespace-nowrap sm:hidden">
              Govt Portals
            </span>

            {/* Quick Pause / Play Button */}
            <button
              onClick={() => setIsPaused(prev => !prev)}
              title={isPaused ? "Play scrolling marquee" : "Pause scrolling marquee"}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            </button>
          </div>

          {/* Continuous Scrolling Track */}
          <div className="overflow-hidden relative flex-1 py-1.5 flex items-center">
            {/* Fade Gradients at Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

            <div 
              className={`animate-marquee flex items-center gap-3 sm:gap-4 ${isPaused ? 'animate-marquee-paused' : ''}`}
            >
              {loopList.map((portal, index) => (
                <a
                  key={`${portal.id}-${index}`}
                  href={portal.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/80 text-white text-xs font-semibold whitespace-nowrap transition-all shadow-xs hover:shadow-md hover:scale-[1.02]"
                  title={`${portal.name} - Official Portal (${portal.authority})`}
                >
                  {/* Government / Authority Logo */}
                  <div className="shrink-0 flex items-center justify-center drop-shadow-xs">
                    {portal.logo}
                  </div>

                  {/* Action Link Text */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-200 group-hover:text-white font-bold tracking-tight">
                      {portal.actionText}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-300 font-normal hidden md:inline">
                      ({portal.stateOrCentral})
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Static "View All" Button */}
          <div className="shrink-0 z-30 px-2 sm:px-3 py-2 bg-slate-900 border-l border-slate-800 hidden sm:flex items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/30 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
            >
              <Layers className="w-3 h-3 text-amber-400" />
              <span>All Portals</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Complete Government Portals Directory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex items-center justify-between border-b border-amber-500/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Official Government Service Registrations</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-100">
                  Government Registration & Compliance Portals
                </h3>
                <p className="text-xs text-slate-300">
                  Direct official links for PAN, GST, Rajasthan BRN, MSME Udyam, MCA, and E-Shramik Card
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Grid of Portals */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GOVERNMENT_PORTALS.map((portal) => (
                  <div
                    key={portal.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:border-amber-400/80 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
                        {portal.logo}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold">
                            {portal.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {portal.stateOrCentral}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                          {portal.actionText}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {portal.name} · {portal.authority}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                        {portal.portalUrl.replace('https://', '')}
                      </span>

                      <a
                        href={portal.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-transform hover:-translate-y-0.5"
                      >
                        <span>Open Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Consultation Assistance Strip */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Need help with registration filing or documents? <strong>Shree Navya Lekha Associates</strong> provides end-to-end filing support.
                  </span>
                </div>

                <a
                  href="https://wa.me/919549899145?text=Hello%20SNLA,%20I%20need%20help%20with%20Govt%20Registration%20(PAN/GST/BRN/Udyam/Company)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-xs shadow-sm shrink-0 whitespace-nowrap"
                >
                  WhatsApp: +91 95498 99145
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
