import React from 'react';
import { XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <XCircle className="w-5 h-5 text-red-500" />
        <span className="text-red-700">{message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-500 hover:text-red-700 focus:outline-none"
      >
        Dismiss
      </button>
    </div>
  );
};