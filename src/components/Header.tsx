import React from 'react';
import { Bot } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center py-4 bg-white rounded-t-lg shadow-sm">
      <div className="flex items-center justify-center gap-2">
        <Bot className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">AI Chat Assistant</h1>
      </div>
    </header>
  );
};