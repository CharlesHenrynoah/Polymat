import React from 'react';
import { ModelCategory } from '../../types/models';
import { Bot } from 'lucide-react';

interface ModelListProps {
  category: ModelCategory;
  onSelectModel: (modelId: string) => void;
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

export const ModelList: React.FC<ModelListProps> = ({ category, onSelectModel }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-white mb-4">{category.name} Models</h2>
      {category.models.map((model) => (
        <button
          key={model.id}
          onClick={() => onSelectModel(model.id)}
          className="w-full text-left p-4 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-3 border border-zinc-800 hover:border-orange-500/50 group"
        >
          <div className="relative">
            <img
              src={getModelAvatar(model.id)}
              alt={model.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-white group-hover:text-orange-500 transition-colors">
              {model.name}
            </h3>
            <p className="text-sm text-zinc-400">{model.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};