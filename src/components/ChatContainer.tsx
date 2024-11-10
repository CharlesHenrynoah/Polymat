import React, { useRef, useEffect } from 'react';
import { Message } from '../types/chat';
import { ChatMessage } from './ChatMessage';
import { LoadingIndicator } from './LoadingIndicator';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Start a conversation by sending a message!
        </div>
      )}
      
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isLoading && <LoadingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};