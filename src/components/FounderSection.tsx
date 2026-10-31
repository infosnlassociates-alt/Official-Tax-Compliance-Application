import React, { useState } from 'react';
import { 
  Feather, 
  BookOpen, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  GraduationCap, 
  Compass, 
  Scale, 
  Newspaper, 
  Globe, 
  Heart, 
  ArrowRight,
  ScrollText,
  UserCheck
} from 'lucide-react';
import { 
  WhatsAppLogo, 
  TelegramLogo, 
  FacebookLogo, 
  InstagramLogo, 
  YouTubeLogo, 
  XTwitterLogo, 
  LinkedInLogo 
} from './SocialLogos';
import { ShreeNavyaLekhaLogo } from './ShreeNavyaLekhaLogo';

interface FounderSectionProps {
  onNavigateToFirm?: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({ onNavigateToFirm }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Author & Founder Details extracted directly from official introduction:
  // https://utkarshkavitawali.blogspot.com/p/author-introduction.html?m=1
  const founder = {
    fullName: "Naveen Shrotriya",
    fullNameHindi: "नवीन श्रोत्रिय",
    penName: "Utkarsh",
    penNameHindi: "उत्कर्ष",
    titleHindi: "हिंदी कवि, लेखक, संस्थापक एवं लेखाकार",
    titleEnglish: "Hindi Poet, Author, SNLA Founder & Accountant",
    birthTraditional: "ज्येष्ठ शुक्ल द्वितीया, शुक्रवार (11 जून 1990)",
    birthOfficial: "10 मई 1991 (10 May 1991)",
    nativeVillage: "गोठरा (Gothra)",
    childhoodVillage: "नरहरपुर (Narharpur)",
    tehsil: "वैर (Weir)",
    district: "भरतपुर (Bharatpur)",
    state: "राजस्थान (Rajasthan)",
    currentResidence: "श्रोत्रिय निवास (Shrotriya Mansion), भगवती कॉलोनी, बयाना - 321401 (भरतपुर)",
    education: "स्नातकोत्तर (Post Graduation / M.Com, 2016)",
    profession: "वरिष्ठ लेखाकार (Senior Accountant) व कर सलाहकार (Tax Advisor)",
    firm: "श्री नव्य लेखा एसोसिएट्स (Shri Navya Lekha Associates)",
    blogTitle: "उत्कर्ष कवितावली (Utkarsh Kavitawali)",
    blogUrl: "https://utkarshkavitawali.blogspot.com/p/author-introduction.html?m=1",
    blogDomain: "utkarshkavitawali.blogspot.com",
    contacts: {
      phone1: "+91 84 4008-4006",
      phone1Raw: "8440084006",
      phone2: "+91 84 4181-2152",
      phone2Raw: "8441812152",
      whatsapp: "+91 95498 99145",
      whatsappRaw: "9549899145",
      email: "info.snlassociates@gmail.com"
    }
  };

  // Publications list as cited in official introduction
  const publications = [
    { name: "हमारा मैट्रो", englishName: "Hamara Metro", location: "नोएडा (Noida)", type: "राष्ट्रीय समाचार पत्र" },
    { name: "वैदिक राष्ट्र", englishName: "Vedic Rashtra", location: "मध्य प्रदेश (Madhya Pradesh)", type: "साप्ताहिक / दैनिक" },
    { name: "वर्तमान अंकुर", englishName: "Vartman Ankur", location: "दिल्ली (Delhi)", type: "साहित्यिक पत्रिका" },
    { name: "भारत मंथन", englishName: "Bharat Manthan", location: "राष्ट्रीय (National)", type: "विचार प्रधान पत्रिका" },
    { name: "जयविजय", englishName: "Jayvijay", location: "मुंबई (Mumbai)", type: "प्रतिष्ठित साहित्यिक मंच" },
    { name: "पुष्पवाटिका", englishName: "Pushpavatika", location: "उत्तर प्रदेश (Uttar Pradesh)", type: "काव्य संकलन पत्रिका" },
    { name: "ट्रू टाइम्स", englishName: "True Times", location: "उत्तर प्रदेश (Uttar Pradesh)", type: "समाचार पत्र" },
    { name: "पूर्वांचल प्रहरी", englishName: "Purvanchal Prahari", location: "असम (Assam)", type: "दैनिक समाचार पत्र" },
    { name: "दैनिक पूर्वोदय", englishName: "Dainik Purvodaya", location: "असम (Assam)", type: "दैनिक समाचार पत्र" },
  ];

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleOpenWhatsApp = (customMsg?: string, targetPhone = founder.contacts.whatsappRaw) => {
    const text = encodeURIComponent(
      customMsg || `आदरणीय नवीन श्रोत्रिय 'उत्कर्ष' जी, सादर प्रणाम! मैं श्री नव्य लेखा एसोसिएट्स पोर्टल के माध्यम से आपसे संपर्क कर रहा हूँ।`
    );
    window.open(`https://wa.me/91${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* 1. HERO PROFILE BANNER: DEDICATED FOUNDER SPOTLIGHT */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-600/40 bg-gradient-to-br from-[#1c0f07] via-[#2d180d] to-[#120703] text-amber-50 shadow-2xl p-6 sm:p-10 lg:p-12">
        {/* Subtle decorative wood grain and ambient radial glow */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 10px), repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)`
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Headline & Identity (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-widest uppercase">
                <Feather className="w-4 h-4 text-amber-400" />
                <span>संस्थापक एवं साहित्यकार परिचय · Author Introduction</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 tracking-tight leading-tight">
                श्री नवीन श्रोत्रिय “उत्कर्ष”
              </h1>

              <div className="text-lg sm:text-xl font-bold text-amber-200 flex flex-wrap items-center gap-2">
                <span>Mr. Naveen Shrotriya “Utkarsh”</span>
                <span className="text-amber-400">✦</span>
                <span className="text-xs sm:text-sm font-mono text-amber-300/80">Bayana, Bharatpur (Raj.)</span>
              </div>

              <p className="text-sm text-amber-300/90 font-serif italic max-w-2xl leading-relaxed">
                "साहित्य में संवेदना और लेखाकर्म में शुचिता — दोनों ही जीवन और समाज की उन्नति के आधार हैं।"
              </p>
            </div>

            {/* Badges / Triple Identity */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-bold shadow-xs">
                ✍️ प्रख्यात हिंदी कवि व साहित्यकार
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold shadow-xs">
                🏛️ संस्थापक — श्री नव्य लेखा एसोसिएट्स
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs sm:text-sm font-bold shadow-xs">
                💼 वरिष्ठ लेखाकार व कर सलाहकार
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-600/40 text-purple-300 text-xs sm:text-sm font-bold shadow-xs">
                🌐 संस्थापक — उत्कर्ष कवितावली
              </span>
            </div>

            {/* Direct Connect Buttons & Verified Blog Link */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleOpenWhatsApp()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppLogo size={18} />
                <span>WhatsApp Direct (+91 95498 99145)</span>
              </button>

              <a
                href={founder.blogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 hover:text-white font-bold text-xs transition-colors shadow-sm"
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Visit Utkarsh Kavitawali Blog</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onNavigateToFirm && (
                <button
                  onClick={onNavigateToFirm}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                >
                  <span>View Firm Profile & Clients</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Teak Wood Seal & Signature Crest (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="p-3 rounded-full bg-gradient-to-b from-amber-600/30 via-amber-900/30 to-black/80 border-2 border-amber-500/50 shadow-2xl backdrop-blur-xs">
              <ShreeNavyaLekhaLogo size={200} variant="wood" />
            </div>

            <div className="mt-4 space-y-1">
              <div className="font-extrabold text-amber-200 text-base tracking-wide">
                नवीन श्रोत्रिय “उत्कर्ष”
              </div>
              <div className="text-xs text-amber-400/90 font-mono">
                Shrotriya Mansion, Bayana (321401)
              </div>
              <div className="text-[11px] text-amber-300/70 italic">
                "विश्वास की नींव, प्रगति का आधार"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ESSENTIAL PERSONAL & ACADEMIC DOSSIER (जो जरूरी हो वही विवरण) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-8 shadow-sm transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
            <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>व्यक्तिगत एवं प्रामाणिक विवरण · Verified Profile Dossier</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            मूल परिचय एवं प्रामाणिक पृष्ठभूमि
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            आधिकारिक ब्लॉग एवं अभिलेखों के अनुसार श्री नवीन श्रोत्रिय जी का जन्म, मूल निवास, शिक्षा व साहित्यिक परिचय:
          </p>
        </div>

        {/* 2-Column Dossier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: जन्म एवं मूल निवास (Roots & Heritage) */}
          <div className="p-6 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/60 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  जन्म एवं मूल निवास विवरण
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Birth, Ancestral Roots & Native Residence
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">शुभ जन्म (तिथि अनुसार):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                  {founder.birthTraditional}
                </span>
              </div>

              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">शैक्षणिक/दस्तावेजी जन्म:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-right">
                  {founder.birthOfficial}
                </span>
              </div>

              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">मूल निवास (Ancestral Place):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                  गाँव <strong>गोठरा</strong>, तहसील वैर, जिला भरतपुर (राज.)
                </span>
              </div>

              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">बाल्यकाल (Childhood Village):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                  गाँव <strong>नरहरपुर</strong>, तहसील वैर, जिला भरतपुर
                </span>
              </div>

              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">वर्तमान निवास व कार्यालय:</span>
                <span className="font-bold text-amber-900 dark:text-amber-300 text-right">
                  श्रोत्रिय निवास, भगवती कॉलोनी, बयाना - 321401
                </span>
              </div>
            </div>
          </div>

          {/* Card B: शिक्षा, पेशा एवं उपनाम (Education, Profession & Pen Name) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50/70 via-white to-slate-50/30 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/60 space-y-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  शिक्षा, आजीविका व उपनाम
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Academic Credentials & Professional Career
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">उच्च शिक्षा (Higher Studies):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                  वर्ष 2016 में <strong>स्नातकोत्तर (Post Graduation)</strong> पूर्ण
                </span>
              </div>

              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">वर्तमान व्यवसाय व आजीविका:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                  लेखाकार (Accounts / Accountant) व कर सलाहकार
                </span>
              </div>

              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">फर्म एवं संस्थापन:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400 text-right">
                  श्री नव्य लेखा एसोसिएट्स (SNLA)
                </span>
              </div>

              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">साहित्यिक उपनाम:</span>
                <span className="font-bold text-amber-700 dark:text-amber-400 text-right">
                  “उत्कर्ष” (साहित्य सृजन में निरंतर सक्रियता हेतु प्रदत्त)
                </span>
              </div>

              <div className="flex items-start justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">साहित्यिक डिजिटल मंच:</span>
                <a
                  href={founder.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-right"
                >
                  <span>उत्कर्ष कवितावली</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LITERARY JOURNEY & 'UTKARSH KAVITAWALI' DIGITAL PLATFORM */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-6 shadow-sm transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
            <ScrollText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>साहित्यिक यात्रा एवं 'उत्कर्ष कवितावली' · Literary Genesis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            साहित्यिक संघर्ष, मार्गदर्शन एवं डिजिटल मिशन
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            हिंदी भाषा के प्रति अगाध प्रेम और नवोदित कवियों व रचनाकारों के लिए प्रामाणिक मंच की स्थापना:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Detailed Narrative (8 cols) */}
          <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border-l-4 border-amber-500 text-slate-800 dark:text-slate-200 font-medium">
              "आपको बाल्यावस्था से ही हिंदी भाषा के प्रति गहरा अनुराग और विशेष लगाव रहा है। वर्ष 2016 में स्नातकोत्तर शिक्षा पूर्ण करने के पश्चात् आप साहित्य जगत से विधिवत जुड़े।"
            </div>

            <p>
              साहित्य सृजन की इस यात्रा में शुरुआती दिनों में उचित मार्गदर्शन के अभाव और कई संघर्षों का सामना करना पड़ा। नए कवियों व रचनाकारों को छंद-विधान, मात्रा-गणना और व्याकरणिक नियमों को समझने में आने वाली कठिनाइयों को अनुभव करते हुए, आपने एक ऐसे मंच की आवश्यकता महसूस की जो हर जिज्ञासु पाठक और नवोदित साहित्यकार को निःशुल्क प्रामाणिक ज्ञान प्रदान कर सके।
            </p>

            <p>
              इसी पवित्र उद्देश्य से आपने <strong>'उत्कर्ष कवितावली' (Utkarsh Kavitawali)</strong> नामक डिजिटल मंच व ब्लॉग की शुरुआत की। इस मंच के माध्यम से:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="text-xs">
                  <strong>हिंदी भाषा एवं व्यवहार:</strong> शुद्ध हिंदी भाषा का व्यापक प्रचार-प्रसार और आम जनमानस में उसका सम्मान बढ़ाना।
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="text-xs">
                  <strong>विशुद्ध साहित्यिक रचनाएँ:</strong> रसिक पाठकों तक मौलिक, प्रामाणिक व संस्कारित कविताओं का नियमित वितरण।
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="text-xs">
                  <strong>छंदों की विस्तृत जानकारी:</strong> दोहा, चौपाई, रोला, कुंडलिया व घनाक्षरी छंदों के सटीक नियम व उदाहरण।
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="text-xs">
                  <strong>'उत्कर्ष' उपनाम की सार्थकता:</strong> साहित्य सृजन में निरंतर प्रगतिशीलता के कारण आपको विद्वानों द्वारा 'उत्कर्ष' उपनाम से सम्मानित किया गया।
                </span>
              </div>
            </div>
          </div>

          {/* Quick Blog Spotlight Card (4 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-amber-950/40 p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>उत्कर्ष कवितावली डिजिटल ब्लॉग</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              नवीन श्रोत्रिय 'उत्कर्ष' जी द्वारा संचालित यह साहित्यिक मंच सैकड़ों ज्ञानवर्धक रचनाओं और छंद-विधान का भंडार है।
            </p>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs space-y-1.5">
              <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">आधिकारिक यूआरएल</div>
              <div className="font-mono text-xs text-amber-800 dark:text-amber-300 break-all font-bold">
                {founder.blogDomain}
              </div>
            </div>

            <a
              href={founder.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>ओपन करें — 'उत्कर्ष कवितावली'</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. NATIONAL PUBLICATIONS & MEDIA RECOGNITION (समाचार पत्रों एवं पत्रिकाओं में प्रकाशन) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-6 shadow-sm transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
            <Newspaper className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>प्रतिष्ठित राष्ट्रीय प्रकाशन · Published In Prominent Media</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            समाचार पत्रों एवं पत्रिकाओं में प्रकाशित रचनाएँ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            आपकी कई मौलिक एवं उत्कृष्ट काव्य रचनाएँ देश के विभिन्न प्रतिष्ठित पत्र-पत्रिकाओं में नियमित रूप से प्रकाशित हुई हैं:
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publications.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-amber-400/70 dark:hover:border-amber-500/50 hover:shadow-sm transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  <span>#{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[10px]">
                    {item.type}
                  </span>
                </div>

                <div className="font-extrabold text-base text-slate-900 dark:text-white">
                  {item.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {item.englishName}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PROFESSIONAL ROLE AS ACCOUNTANT & SNLA FOUNDER (लेखाकर्म एवं व्यावसायिक भूमिका) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
          <Scale className="w-4 h-4" />
          <span>व्यावसायिक कार्यक्षेत्र · Professional Practice & Accounting</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-200">
              लेखांकन में शुचिता, कर अनुपालन में पारदर्शिता
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              साहित्यिक संवेदना के साथ-साथ श्री नवीन श्रोत्रिय जी एक कुशल और अनुभवी <strong>वरिष्ठ लेखाकार (Senior Accountant)</strong> हैं। वे बयाना व सम्पूर्ण राजस्थान में व्यापारिक प्रतिष्ठानों, फर्मों व कंपनियों के लिए जीएसटी पंजीकरण, मासिक व वार्षिक जीएसटी रिटर्न्स (GSTR-1, 3B, 9/9C), आयकर विवरणी (ITR 1 से 7), टैक्स ऑडिट, एमएसएमई उद्यम पंजीकरण व ई-वे बिल का पूर्ण अनुपालन सुनिश्चित करते हैं।
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              उनकी स्थापित संस्था <strong>श्री नव्य लेखा एसोसिएट्स (SNLA)</strong> व्यापारियों को समय पर देय तिथियों की सूचना, ब्याज व लेट फीस से मुक्ति, और पारदर्शी बहीखाता सेवा प्रदान करती है।
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>GSTIN & Income Tax Advisory</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Section 44AB Tax Audit</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>MSME 43B(h) Compliance</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-800/90 p-6 rounded-2xl border border-slate-700 text-center space-y-4">
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">
              संस्थापक से सीधा संपर्क
            </div>
            <div className="text-lg font-bold text-white">
              श्री नव्य लेखा एसोसिएट्स
            </div>

            <div className="space-y-2 text-xs font-mono">
              <a
                href={`tel:${founder.contacts.phone1Raw}`}
                className="block p-2 rounded-lg bg-slate-900 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 transition-colors"
              >
                📞 {founder.contacts.phone1}
              </a>
              <a
                href={`tel:${founder.contacts.phone2Raw}`}
                className="block p-2 rounded-lg bg-slate-900 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 transition-colors"
              >
                📞 {founder.contacts.phone2}
              </a>
            </div>

            <button
              onClick={() => handleOpenWhatsApp()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <WhatsAppLogo size={18} />
              <span>WhatsApp पर संवाद करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. COMPLETE CONTACT, SOCIALS & MAP CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 space-y-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
              <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>संपर्क सूत्र एवं सोशल मीडिया चैनल · Official Channels</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              नवीन श्रोत्रिय 'उत्कर्ष' जी से जुड़ें
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(founder.contacts.email, 'email')}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'email' ? 'ईमेल कॉपी हो गया' : 'Copy Email'}</span>
            </button>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono uppercase">कार्यालय पता (Office)</div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">श्रोत्रिय निवास (Shrotriya Mansion)</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">भगवती कॉलोनी, बयाना - 321401 (भरतपुर)</div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Shrotriya+Mansion+Bhagwati+Colony+Bayana+321401"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline mt-1"
            >
              <MapPin className="w-3 h-3" />
              <span>गूगल मैप्स पर देखें</span>
            </a>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono uppercase">फोन व व्हाट्सएप (Phone & WhatsApp)</div>
            <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              {founder.contacts.phone1}
            </div>
            <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              {founder.contacts.phone2}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">
              हेल्पलाइन: {founder.contacts.whatsapp}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono uppercase">ईमेल एवं ब्लॉग (Digital Presence)</div>
            <div className="font-mono text-xs text-slate-800 dark:text-slate-200 truncate">
              {founder.contacts.email}
            </div>
            <a
              href={founder.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline mt-1"
            >
              <Globe className="w-3 h-3" />
              <span>utkarshkavitawali.blogspot.com</span>
            </a>
          </div>
        </div>

        {/* Social Media Buttons Strip */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            लोकप्रिय सोशल मीडिया एवं डिजिटल चैनल:
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenWhatsApp()}
              title="WhatsApp पर जुड़ें (+91 95498 99145)"
              className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition-all shadow-xs"
            >
              <WhatsAppLogo size={22} />
            </button>

            <a
              href={`https://t.me/+91${founder.contacts.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram पर जुड़ें"
              className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-300 transition-all shadow-xs"
            >
              <TelegramLogo size={22} />
            </a>

            <a
              href="https://www.facebook.com/snlassociates"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook पर फॉलो करें"
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 transition-all shadow-xs"
            >
              <FacebookLogo size={22} />
            </a>

            <a
              href="https://www.instagram.com/snlassociates"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram पर फॉलो करें"
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 transition-all shadow-xs"
            >
              <InstagramLogo size={22} />
            </a>

            <a
              href="https://www.youtube.com/@snlassociates"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube चैनल सब्सक्राइब करें"
              className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 transition-all shadow-xs"
            >
              <YouTubeLogo size={22} />
            </a>

            <a
              href="https://twitter.com/snlassociates"
              target="_blank"
              rel="noopener noreferrer"
              title="X (Twitter) पर फॉलो करें"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all shadow-xs"
            >
              <XTwitterLogo size={22} />
            </a>

            <a
              href="https://www.linkedin.com/company/snlassociates"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn पर जुड़ें"
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 transition-all shadow-xs"
            >
              <LinkedInLogo size={22} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
