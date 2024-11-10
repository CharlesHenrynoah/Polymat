import React, { useState } from 'react';
import { X, ArrowDown, Copy } from 'lucide-react';

interface PromptHelperProps {
  onSelect: (prompt: string) => void;
  onClose: () => void;
}

export const PromptHelper: React.FC<PromptHelperProps> = ({ onSelect, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');

  const enhancePrompt = (text: string) => {
    const enhancements = {
      "explain": "Provide a comprehensive explanation of [topic] that breaks down complex concepts into simple, understandable parts. Include relevant examples and analogies where appropriate.",
      "how to": "Present a detailed, step-by-step guide for [task], including best practices, common pitfalls to avoid, and expert tips for optimal results.",
      "compare": "Analyze and compare [items] across key dimensions, highlighting their similarities, differences, strengths, weaknesses, and ideal use cases.",
      "list": "Compile a comprehensive, well-organized list of [items], including key details, explanations, and practical applications for each entry.",
      "analyze": "Conduct a thorough analysis of [topic], examining its components, implications, advantages, disadvantages, and real-world impact.",
    };

    let enhanced = text;
    for (const [key, value] of Object.entries(enhancements)) {
      if (text.toLowerCase().includes(key)) {
        enhanced = value.replace(/\[.*?\]/g, (match) => {
          const placeholder = match.slice(1, -1);
          const words = text.split(' ');
          const keyIndex = words.findIndex(w => w.toLowerCase().includes(key));
          return words.slice(keyIndex + 1).join(' ') || match;
        });
        break;
      }
    }

    return enhanced || `Provide a detailed and well-structured response about "${text}", including key concepts, practical applications, and relevant examples.`;
  };

  const handleEnhance = () => {
    if (inputText.trim()) {
      setEnhancedPrompt(enhancePrompt(inputText.trim()));
    }
  };

  const handleUsePrompt = () => {
    onSelect(enhancedPrompt || inputText);
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-4 mx-4 z-[100]">
      <div className="bg-zinc-900 rounded-lg w-full border border-zinc-800 flex flex-col shadow-2xl">
        <div className="flex-shrink-0 p-2 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-medium text-white flex items-center gap-1.5">
            <span className="text-orange-500">✧</span>
            Prompt Enhancer
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-orange-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="p-3">
          <div className="space-y-3">
            {/* Input Section */}
            <div>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your prompt here..."
                  className="w-full h-16 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-xs"
                />
                <div className="absolute bottom-1.5 right-1.5">
                  <button
                    onClick={() => setInputText('')}
                    className="text-[10px] text-zinc-400 hover:text-orange-500 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Enhance Button */}
            <div className="flex justify-center">
              <button
                onClick={handleEnhance}
                disabled={!inputText.trim()}
                className="flex items-center gap-1.5 px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
              >
                <span className="text-white">✧</span>
                Enhance
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>

            {/* Output Section */}
            <div>
              <div className="relative">
                <textarea
                  value={enhancedPrompt}
                  onChange={(e) => setEnhancedPrompt(e.target.value)}
                  placeholder="Enhanced prompt will appear here..."
                  className="w-full h-16 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-xs"
                />
                <div className="absolute bottom-1.5 right-1.5">
                  <button
                    onClick={() => navigator.clipboard.writeText(enhancedPrompt)}
                    className="p-1 text-zinc-400 hover:text-orange-500 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-2 border-t border-zinc-800 flex justify-end">
          <button
            onClick={handleUsePrompt}
            disabled={!inputText.trim() && !enhancedPrompt.trim()}
            className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
          >
            Use Prompt
          </button>
        </div>
      </div>
    </div>
  );
};