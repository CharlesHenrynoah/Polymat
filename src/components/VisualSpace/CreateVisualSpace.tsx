import React, { useState, useEffect } from 'react';
import { visualSpaceService } from '../../services/visualSpaceService';
import { useDebounce } from '../../hooks/useDebounce';

interface CreateVisualSpaceProps {
  onSubmit: (title: string) => Promise<void>;
  onCancel: () => void;
  userId: string;
}

export const CreateVisualSpace: React.FC<CreateVisualSpaceProps> = ({
  onSubmit,
  onCancel,
  userId,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const debouncedTitle = useDebounce(title, 300);

  useEffect(() => {
    const checkTitle = async () => {
      if (!debouncedTitle.trim()) {
        setError(null);
        return;
      }

      setIsChecking(true);
      try {
        const exists = await visualSpaceService.checkTitleExists(userId, debouncedTitle);
        if (exists) {
          setError('A Visual Space with this name already exists');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Error checking title:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkTitle();
  }, [debouncedTitle, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || error || isChecking) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !title.trim() || !!error || isChecking || isSubmitting;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0A0A0A] rounded-lg w-full max-w-md border border-[#151515]">
        <div className="p-4 border-b border-[#151515] flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">New Visual Space</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[#151515] rounded-lg transition-colors text-zinc-400 hover:text-orange-500"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 bg-[#151515] border rounded-lg text-white focus:outline-none transition-colors ${
                error 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-zinc-800 focus:border-orange-500/50'
              }`}
              placeholder="Enter visual space title"
              disabled={isSubmitting}
            />
            {error && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                {error}
              </p>
            )}
            {isChecking && (
              <p className="mt-1 text-sm text-zinc-500 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-zinc-500 animate-pulse" />
                Checking availability...
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition-all ${
                isSubmitDisabled
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
              disabled={isSubmitDisabled}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
