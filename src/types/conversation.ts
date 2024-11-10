export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    attachments?: File[];
    mediaUrl?: string;
    mediaType?: 'video' | 'image' | 'audio' | 'code';
  }[];
}