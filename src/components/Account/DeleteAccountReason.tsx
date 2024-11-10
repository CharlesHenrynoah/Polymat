import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface DeleteAccountReasonProps {
  onBack: () => void;
  onConfirm: (reason: string) => void;
}

const reasons = [
  "I don't use the service anymore",
  "I found a better alternative",
  "The service doesn't meet my needs",
  "I'm concerned about my privacy",
  "I'm having technical issues",
  "The service is too expensive",
  "I want to start fresh with a new account",
  "Other"
];

export const DeleteAccountReason: React.FC<DeleteAccountReasonProps> = ({ onBack, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Other' ? customReason : selectedReason;
    onConfirm(finalReason);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-800">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <button
              onClick={onBack}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-white">Why are you leaving?</h1>
            <div className="w-9 h-9"></div>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-zinc-300">
              We're sorry to see you go. Please help us improve by sharing your reason for leaving:
            </p>

            <div className="space-y-3">
              {reasons.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center p-4 rounded-lg border border-zinc-800 hover:border-orange-500/50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-900"
                  />
                  <span className="ml-3 text-zinc-200">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === 'Other' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please tell us more..."
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={4}
              />
            )}

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={onBack}
                className="px-6 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedReason || (selectedReason === 'Other' && !customReason.trim())}
                className="px-6 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm deletion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};