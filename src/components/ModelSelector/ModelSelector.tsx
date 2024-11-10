import React, { useState } from 'react';
import { Search, ChevronLeft, X } from 'lucide-react';
import { ModelCategory } from '../../types/models';
import { modelCategories } from '../../data/modelCategories';
import { CategoryList } from './CategoryList';
import { ModelList } from './ModelList';

interface ModelSelectorProps {
  onSelectModel: (modelId: string) => void;
  onClose: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelectModel, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | null>(null);

  const filteredCategories = modelCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/90 flex items-start justify-center z-[100] p-4 overflow-y-auto">
      <div className="my-8 bg-[#0A0A0A] rounded-lg w-full max-w-2xl border border-[#151515] flex flex-col">
        <div className="flex-shrink-0 p-4 border-b border-[#151515]">
          <div className="flex items-center gap-4">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-2 hover:bg-[#151515] rounded-full transition-colors text-zinc-400 hover:text-orange-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#151515] border border-[#202020] rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#151515] rounded-full transition-colors text-zinc-400 hover:text-orange-500"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 min-h-[400px]">
          {selectedCategory ? (
            <ModelList
              category={selectedCategory}
              onSelectModel={onSelectModel}
            />
          ) : (
            <CategoryList
              categories={filteredCategories}
              onSelectCategory={setSelectedCategory}
            />
          )}
        </div>
      </div>
    </div>
  );
};