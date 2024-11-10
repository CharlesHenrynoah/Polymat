import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, Sparkles } from 'lucide-react';
import { PromptHelper } from './PromptHelper';
import { TranscribeModal } from './TranscribeModal';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  allowAttachments?: boolean;
  isLoading?: boolean;
}

const MAX_ATTACHMENTS = 7;
const MAX_CHARACTERS = 17000;

type ModalType = 'prompt' | 'transcribe' | null;

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  allowAttachments = false,
  isLoading = false,
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0) && !isOverCharacterLimit) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + attachments.length > MAX_ATTACHMENTS) {
      alert(`Maximum ${MAX_ATTACHMENTS} files allowed`);
      return;
    }
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const isOverCharacterLimit = message.length > MAX_CHARACTERS;
  const characterPercentage = (message.length / MAX_CHARACTERS) * 100;

  return (
    <div className="space-y-2 relative">
      {activeModal === 'prompt' && (
        <PromptHelper
          onSelect={(prompt) => {
            if (prompt.length <= MAX_CHARACTERS) {
              setMessage(prompt);
              setActiveModal(null);
            }
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'transcribe' && (
        <TranscribeModal
          onTranscribe={(text) => {
            if (text.length <= MAX_CHARACTERS) {
              setMessage(text);
              setActiveModal(null);
            }
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-zinc-800/50 rounded-lg">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-zinc-700 px-2 py-1 rounded-full text-sm text-zinc-200"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ×
              </button>
            </div>
          ))}
          <div className="text-sm text-zinc-400">
            {MAX_ATTACHMENTS - attachments.length} attachments remaining
          </div>
        </div>
      )}

      <div className="flex items-start gap-2">
        <div className="flex-1 relative">
          <div className="relative flex items-center">
            <div className="absolute left-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveModal(activeModal === 'prompt' ? null : 'prompt')}
                className="p-1.5 text-zinc-400 hover:text-orange-500 hover:bg-zinc-700 rounded-lg transition-colors"
                title="Prompt Helper"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(activeModal === 'transcribe' ? null : 'transcribe')}
                className="p-1.5 text-zinc-400 hover:text-orange-500 hover:bg-zinc-700 rounded-lg transition-colors"
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
              {allowAttachments && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx,.csv,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-zinc-400 hover:text-orange-500 hover:bg-zinc-700 rounded-lg transition-colors"
                    disabled={isLoading || attachments.length >= MAX_ATTACHMENTS}
                    title="Attach Files"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={`w-full pl-24 pr-12 py-2 bg-zinc-800 border rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                isOverCharacterLimit 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-zinc-700 focus:ring-orange-500'
              }`}
              rows={2}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || (!message.trim() && attachments.length === 0) || isOverCharacterLimit}
              className="absolute right-2 p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {message.length > 0 && (
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-32 h-1 bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      characterPercentage > 90 ? 'bg-red-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(characterPercentage, 100)}%` }}
                  />
                </div>
                <span className={characterPercentage > 90 ? 'text-red-500' : 'text-zinc-400'}>
                  {message.length}/{MAX_CHARACTERS}
                </span>
              </div>
              {isOverCharacterLimit && (
                <span className="text-red-500">Message too long</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};