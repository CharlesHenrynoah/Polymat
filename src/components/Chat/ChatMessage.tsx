import React from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/models';
import { VideoPlayer } from './MessageContent/VideoPlayer';
import { ImageViewer } from './MessageContent/ImageViewer';
import { AudioPlayer } from './MessageContent/AudioPlayer';
import { CodeBlock } from './MessageContent/CodeBlock';

interface ChatMessageProps {
  message: ChatMessageType;
  modelId?: string;
  userAvatar?: string;
}

const getModelAvatar = (modelId: string): string => {
  const avatars: Record<string, string> = {
    'text-to-video-1': 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=120&h=120&auto=format&fit=crop&q=80',
    'text-to-music-1': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=120&h=120&auto=format&fit=crop&q=80',
    'text-to-code-1': 'https://images.unsplash.com/photo-1676299082587-7e54cd6a9b0f?w=120&h=120&auto=format&fit=crop&q=80',
    'text-to-image-1': 'https://images.unsplash.com/photo-1675426513824-77813readf13?w=120&h=120&auto=format&fit=crop&q=80',
    'text-to-speech-1': 'https://images.unsplash.com/photo-1677442135426-5a23b266235c?w=120&h=120&auto=format&fit=crop&q=80',
    'multimodal-1': 'https://images.unsplash.com/photo-1675426513824-77813readf13?w=120&h=120&auto=format&fit=crop&q=80',
    'image-to-image-1': 'https://images.unsplash.com/photo-1677442135426-5a23b266235c?w=120&h=120&auto=format&fit=crop&q=80',
    'image-to-video-1': 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=120&h=120&auto=format&fit=crop&q=80',
  };

  return avatars[modelId] || 'https://images.unsplash.com/photo-1675426513824-77813readf13?w=120&h=120&auto=format&fit=crop&q=80';
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, modelId, userAvatar }) => {
  const isUser = message.role === 'user';
  
  const renderContent = () => {
    if (message.mediaType === 'video') {
      return <VideoPlayer url={message.mediaUrl!} />;
    } else if (message.mediaType === 'image') {
      return <ImageViewer url={message.mediaUrl!} />;
    } else if (message.mediaType === 'audio') {
      return <AudioPlayer url={message.mediaUrl!} />;
    } else if (message.mediaType === 'code') {
      return <CodeBlock code={message.content} />;
    }
    return message.content;
  };

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden ${
        isUser ? 'ring-2 ring-orange-500' : 'bg-zinc-800'
      }`}>
        {isUser ? (
          <img
            src={userAvatar}
            alt="User"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={getModelAvatar(modelId || '')}
            alt="AI Model"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block rounded-lg px-4 py-2 ${
          isUser ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-100'
        }`}>
          {renderContent()}
        </div>
        <div className="text-xs text-zinc-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};