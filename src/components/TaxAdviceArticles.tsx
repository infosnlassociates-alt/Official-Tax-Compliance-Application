import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Share2, 
  Send, 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Bookmark,
  FileCheck
} from 'lucide-react';
import { TaxAdviceArticle, FirmProfile } from '../types';
import { TAX_ADVICE_ARTICLES } from '../data/mockData';
import { openWhatsApp } from '../utils/whatsapp';

interface TaxAdviceArticlesProps {
  firmProfile: FirmProfile;
}

export const TaxAdviceArticles: React.FC<TaxAdviceArticlesProps> = ({ firmProfile }) => {
  const [articles] = useState<TaxAdviceArticle[]>(TAX_ADVICE_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedArticleId, setExpandedArticleId] = useState<string>(articles[0]?.id || '');

  // AI Tax Advisor State
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<string>('');

  const handleAskTaxAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/tax-adviser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiQuery,
          context: `Query from tax practitioner at ${firmProfile.firmName}`
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiResponse(data.answer);
        setAiSource(data.source || 'TaxSahayak Advisory');
      } else {
        setAiResponse('Could not process query. Please verify connection.');
      }
    } catch (err) {
      console.error(err);
      setAiResponse('Unable to connect to tax advisory service. Please check network.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleShareArticle = (art: TaxAdviceArticle) => {
    const text = `*TAX ADVISORY GUIDE* 📖
*${art.title}*
Category: ${art.category}

${art.summary}

*Key Takeaways:*
${art.keyTakeaways.map(t => `• ${t}`).join('\n')}

Curated for compliance by *${firmProfile.firmName}*
📞 ${firmProfile.phone} | ✉️ ${firmProfile.email}`;

    openWhatsApp('', text);
  };

  const filteredArticles = articles.filter(art => {
    if (selectedCategory !== 'ALL' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSumm = art.summary.toLowerCase().includes(q);
      const matchContent = art.content.toLowerCase().includes(q);
      if (!matchTitle && !matchSumm && !matchContent) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <h1 className="text-lg font-bold text-slate-900">Tax Advisory Library & AI Compliance Guidance</h1>
        <p className="text-xs text-slate-500">
          In-depth technical guides on critical Indian direct & indirect tax compliance, MSME rules, ITC reconciliation, and interactive advisory consultation.
        </p>
      </div>

      {/* Interactive AI Tax Consultation Panel */}
      <div className="bg-slate-900 text-slate-100 p-5 rounded-lg space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">Ask TaxSahayak Statutory Advisor</h2>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            Section & Rule Grounded
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Ask complex questions regarding Section 43B(h), Rule 37A ITC reversals, Section 234F penalties, 44AD turnover limits, or GST registration thresholds:
        </p>

        <form onSubmit={handleAskTaxAdvisor} className="space-y-3">
          <div className="relative">
            <textarea
              rows={2}
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="e.g. Does Section 43B(h) apply to retail traders with Udyam? How to calculate 45 days?"
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Quick Prompts */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Try:</span>
              <button
                type="button"
                onClick={() => setAiQuery('Does Section 43B(h) apply to traders?')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
              >
                43B(h) Traders
              </button>
              <button
                type="button"
                onClick={() => setAiQuery('What are the slabs for Section 47 GST late fees?')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
              >
                Sec 47 Slabs
              </button>
              <button
                type="button"
                onClick={() => setAiQuery('Can belated ITR be filed after December 31?')}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
              >
                Belated ITR Deadline
              </button>
            </div>

            <button
              type="submit"
              disabled={aiLoading || !aiQuery.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors disabled:opacity-50 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{aiLoading ? 'Consulting Law...' : 'Get Tax Advice'}</span>
            </button>
          </div>
        </form>

        {/* AI Answer Box */}
        {aiResponse && (
          <div className="p-4 bg-slate-800/90 rounded-md border border-slate-700 space-y-2 mt-3 animate-fade-in">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-700 pb-2">
              <span className="font-semibold text-emerald-400">Advisor Response</span>
              <span className="font-mono">{aiSource}</span>
            </div>
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {aiResponse}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter and Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
          {[
            { id: 'ALL', label: 'All Articles' },
            { id: 'MSME', label: 'MSME 43B(h)' },
            { id: 'GST', label: 'GST & ITC' },
            { id: 'INCOME_TAX', label: 'Income Tax & Slabs' },
            { id: 'E_WAY_BILL', label: 'E-Way Bill' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides by section, concept, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Articles Accordion Grid */}
      <div className="space-y-4">
        {filteredArticles.map((art) => {
          const isExpanded = expandedArticleId === art.id;

          return (
            <div
              key={art.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
            >
              <div
                onClick={() => setExpandedArticleId(isExpanded ? '' : art.id)}
                className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold uppercase tracking-wider text-emerald-700">
                      {art.category}
                    </span>
                    <span>·</span>
                    <span>{art.readTime}</span>
                    <span>·</span>
                    <span>{art.publishedDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {art.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareArticle(art);
                    }}
                    title="Share Key Takeaways via WhatsApp"
                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                  {/* Key Takeaways Box */}
                  <div className="p-4 bg-emerald-50/60 rounded-md border border-emerald-200/80 space-y-2">
                    <span className="font-bold text-emerald-900 block text-xs">
                      Key Compliance Takeaways for Practitioners & SMEs:
                    </span>
                    <ul className="space-y-1.5 text-emerald-950">
                      {art.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Main Article Content */}
                  <div className="text-slate-800 leading-relaxed whitespace-pre-line font-sans space-y-2">
                    {art.content}
                  </div>

                  {/* Statutory Legal Citations */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">Statutory Citations:</span>
                    {art.legalReferences.map((ref, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] font-mono text-slate-700 bg-slate-100 rounded border border-slate-200"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
