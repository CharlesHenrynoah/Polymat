import React from 'react';
import { Trash2 } from 'lucide-react';
import { VisualSpace } from '../../types/visualSpace';

export interface VisualSpaceListProps {
  spaces: VisualSpace[];
  onSelect: (space: VisualSpace) => Promise<void>;
  onClose: () => void;
  onDelete: (space: VisualSpace) => Promise<void>;
  onCreate: () => void;
}

export function VisualSpaceList({
  spaces,
  onSelect,
  onClose,
  onDelete,
  onCreate
}: VisualSpaceListProps) {
  const handleDelete = async (e: React.MouseEvent, space: VisualSpace) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this Visual Space?')) {
      await onDelete(space);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0A0A0A] rounded-lg w-full max-w-md border border-[#151515]">
        <div className="p-4 border-b border-[#151515] flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Visual Spaces</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#151515] rounded-lg transition-colors text-zinc-400 hover:text-orange-500"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-2">
          {spaces.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">
              No visual spaces yet. Create your first one!
            </p>
          ) : (
            spaces.map((space) => (
              <button
                key={space.id}
                onClick={() => onSelect(space)}
                className="w-full text-left p-3 rounded-lg hover:bg-zinc-800 transition-colors group border border-zinc-800 hover:border-orange-500/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white group-hover:text-orange-500 transition-colors">
                      {space.title}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {new Date(space.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {spaces.length > 1 && (
                    <button
                      onClick={(e) => handleDelete(e, space)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all text-zinc-400 hover:text-red-500"
                      title="Delete visual space"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </button>
            ))
          )}

          <button
            onClick={onCreate}
            className="w-full p-3 rounded-lg border border-dashed border-zinc-800 hover:border-orange-500/50 text-zinc-400 hover:text-orange-500 transition-all"
          >
            + New Visual Space
          </button>
        </div>
      </div>
    </div>
  );
}
