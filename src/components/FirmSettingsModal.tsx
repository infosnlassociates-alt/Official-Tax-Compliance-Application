import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, QrCode, MapPin, Check } from 'lucide-react';
import { FirmProfile } from '../types';

interface FirmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  firmProfile: FirmProfile;
  onSaveFirmProfile: (profile: FirmProfile) => void;
}

export const FirmSettingsModal: React.FC<FirmSettingsModalProps> = ({
  isOpen,
  onClose,
  firmProfile,
  onSaveFirmProfile,
}) => {
  const [profile, setProfile] = useState<FirmProfile>(firmProfile);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveFirmProfile(profile);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tax Practice & Firm Profile</h2>
            <p className="text-xs text-slate-500">
              Details populated in automated WhatsApp reminders, client statements, and receipts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Firm / Office Name *</label>
            <input
              type="text"
              required
              value={profile.firmName}
              onChange={(e) => setProfile({ ...profile, firmName: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Practitioner Name *</label>
              <input
                type="text"
                required
                value={profile.practitionerName}
                onChange={(e) => setProfile({ ...profile, practitionerName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={profile.designation}
                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                placeholder="Tax & Corporate Consultant"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office Mobile (WhatsApp) *</label>
              <input
                type="text"
                required
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-1.5 font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office Email *</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-1.5 font-mono border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Details for Automated Reminders */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2.5">
            <span className="font-semibold text-slate-800 block text-xs">
              Client Payment Details (Appended in WhatsApp Reminders)
            </span>

            <div>
              <label className="block text-[11px] text-slate-600 mb-1">UPI ID (VPA)</label>
              <input
                type="text"
                value={profile.upiId || ''}
                onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-200 rounded-md bg-white focus:outline-none"
                placeholder="snlassociates@oksbi"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Bank Account & IFSC</label>
              <textarea
                rows={2}
                value={profile.bankDetails || ''}
                onChange={(e) => setProfile({ ...profile, bankDetails: e.target.value })}
                className="w-full px-2.5 py-1.5 font-mono border border-slate-200 rounded-md bg-white focus:outline-none"
                placeholder="Bank Name | A/c No: ... | IFSC: ... | Branch: ..."
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Office Address</label>
            <textarea
              rows={2}
              value={profile.officeAddress || ''}
              onChange={(e) => setProfile({ ...profile, officeAddress: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            {savedToast && (
              <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium mr-auto">
                <Check className="w-3.5 h-3.5" /> Profile updated successfully!
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
