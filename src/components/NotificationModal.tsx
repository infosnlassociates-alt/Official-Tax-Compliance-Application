import React from 'react';
import { X, Bell, AlertTriangle, Clock, Volume2, Share2, Check } from 'lucide-react';
import { DeadlineAlert, TaxFiling, FirmProfile } from '../types';
import { playNotificationSound, sendDeadlinePushNotification } from '../utils/notifications';
import { openWhatsApp, createTaxDeadlineMessage } from '../utils/whatsapp';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: DeadlineAlert[];
  permission: NotificationPermission | 'unsupported';
  onRequestPermission: () => void;
  firmProfile: FirmProfile;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  alerts,
  permission,
  onRequestPermission,
  firmProfile,
}) => {
  if (!isOpen) return null;

  const handleTestChimeAndNotification = () => {
    playNotificationSound();
    sendDeadlinePushNotification(
      'TaxSahayak Deadline Alert',
      'This is a sample tax deadline compliance chime notification.'
    );
  };

  const handleSendAlertWhatsApp = (filing: TaxFiling) => {
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
    openWhatsApp('', text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tax Deadline Reminders & Alerts</h2>
              <p className="text-xs text-slate-500">
                {alerts.length} compliance filing(s) requiring attention
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permission Status & Test Banner */}
        <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-800 block">Browser Push Status:</span>
            <span className={`font-medium ${permission === 'granted' ? 'text-emerald-700' : 'text-amber-700'}`}>
              {permission === 'granted' ? 'Active & Enabled' : 'Disabled / Pending Approval'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {permission !== 'granted' && (
              <button
                onClick={onRequestPermission}
                className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
              >
                Enable Push
              </button>
            )}
            <button
              onClick={handleTestChimeAndNotification}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Test Audio Chime</span>
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {alerts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No imminent deadlines! All tax returns are either filed or have generous runway.
            </div>
          ) : (
            alerts.map((alert, idx) => {
              const isOverdue = alert.urgency === 'OVERDUE';
              const isToday = alert.urgency === 'DUE_TODAY';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-md border text-xs space-y-1.5 transition-colors ${
                    isOverdue
                      ? 'border-rose-200 bg-rose-50/50'
                      : isToday
                      ? 'border-amber-200 bg-amber-50/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {alert.filing.clientName}
                      </span>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {alert.filing.returnForm} · {alert.filing.period}
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                        isOverdue
                          ? 'bg-rose-100 text-rose-800'
                          : isToday
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {isOverdue ? `${Math.abs(alert.daysRemaining)}d Overdue` : isToday ? 'Due Today' : `${alert.daysRemaining}d Left`}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-snug">
                    {alert.message}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Statutory Due: {alert.filing.extensionDate || alert.filing.dueDate}
                    </span>

                    <button
                      onClick={() => handleSendAlertWhatsApp(alert.filing)}
                      className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Send WhatsApp Reminder</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
