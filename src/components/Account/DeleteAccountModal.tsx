import React from 'react';
import { X } from 'lucide-react';

interface DeleteAccountModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Delete Account</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-orange-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-zinc-300 mb-8">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            Yes, delete my account
          </button>
        </div>
      </div>
    </div>
  );
};