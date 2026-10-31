import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ExternalLink, 
  Share2, 
  RefreshCw, 
  Building2, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { TaxNotificationItem, FirmProfile } from '../types';
import { openWhatsApp, createNotificationShareMessage } from '../utils/whatsapp';

interface TaxNotificationFeedProps {
  firmProfile: FirmProfile;
}

export const TaxNotificationFeed: React.FC<TaxNotificationFeedProps> = ({ firmProfile }) => {
  const [notifications, setNotifications] = useState<TaxNotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAuthority, setSelectedAuthority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('/api/tax-notifications', window.location.origin);
      if (selectedAuthority !== 'ALL') {
        url.searchParams.append('authority', selectedAuthority);
      }
      if (searchQuery.trim()) {
        url.searchParams.append('search', searchQuery.trim());
      }

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err: any) {
      console.warn('Notification fetch warning, using cache/fallback:', err);
      // Fallback is handled automatically or retains existing
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [selectedAuthority]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotifications();
  };

  const handleShareWhatsApp = (item: TaxNotificationItem) => {
    const text = createNotificationShareMessage(item, firmProfile);
    openWhatsApp('', text);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Real-Time Taxation Notifications & Circulars Feed</h1>
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live API
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official circulars, notifications, and advisories from CBDT (Income Tax), CBIC (GST & Customs), and MCA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {lastRefreshed && (
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Synced at {lastRefreshed}
            </span>
          )}
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Authority Filters & Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
          {[
            { id: 'ALL', label: 'All Regulatory Authorities' },
            { id: 'CBDT', label: 'CBDT (Income Tax)' },
            { id: 'CBIC', label: 'CBIC (GST & E-Way Bill)' },
            { id: 'MCA', label: 'MCA (Corporate & ROC)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedAuthority(item.id)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                selectedAuthority === item.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars by keyword, section, circular number (e.g. 43B(h), Rule 37A, late fee waiver)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-slate-400 mb-2" />
            <span>Fetching latest government circulars and tax notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
            No tax notifications found matching your search. Try resetting filters.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-lg border border-slate-200 space-y-3 hover:border-slate-300 transition-colors"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    item.authority === 'CBDT' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    item.authority === 'CBIC' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {item.authority}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-900">
                    {item.referenceNumber}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {item.date}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Share on WhatsApp */}
                  <button
                    onClick={() => handleShareWhatsApp(item)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded transition-colors border border-emerald-200"
                    title="Share circular summary on WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share WhatsApp</span>
                  </button>

                  {/* Official Government Source Link */}
                  <a
                    href={item.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors border border-slate-200"
                    title="Visit official portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Official Portal</span>
                  </a>
                </div>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Stream: {item.category} {item.effectiveDate && `· Effective from: ${item.effectiveDate}`}
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded border border-slate-100">
                {item.summary}
              </p>

              {/* Practical Business & Audit Impact */}
              <div className="p-3 bg-emerald-50/50 rounded border border-emerald-200/60 text-xs">
                <span className="font-semibold text-emerald-900 block mb-0.5">
                  💼 Direct Business & Practitioner Impact:
                </span>
                <span className="text-emerald-800 leading-relaxed">
                  {item.impact}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
