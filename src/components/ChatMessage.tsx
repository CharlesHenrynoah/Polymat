import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-500' : 'bg-gray-600'
      }`}>
        {isUser ? (
          <MessageCircle className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block rounded-lg px-4 py-2 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
        }`}>
          {message.content}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}