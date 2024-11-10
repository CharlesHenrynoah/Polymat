import React from 'react';
import { ModelCategory } from '../../types/models';
import { ChevronRight } from 'lucide-react';

interface CategoryListProps {
  categories: ModelCategory[];
  onSelectCategory: (category: ModelCategory) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category)}
          className="w-full text-left p-4 rounded-lg hover:bg-zinc-800 transition-colors group border border-zinc-800 hover:border-orange-500/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xl">{category.icon}</span>
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-orange-500 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-zinc-400">{category.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
          </div>
        </button>
      ))}
    </div>
  );
};