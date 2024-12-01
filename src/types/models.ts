export type ModelCategory = {
  id: string;
  name: string;
  description: string;
  models: Model[];
  icon: string;
  requiresAttachment: boolean;
};

export type Model = {
  id: string;
  name: string;
  description: string;
  category: string;
};

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  attachments?: File[];
  mediaUrl?: string;
  mediaType?: 'video' | 'image' | 'audio' | 'code';
  modelId?: string;
}