import React, { useRef } from 'react';
import { Image, X } from 'lucide-react';

interface BackgroundSettingsProps {
  onSelectBackground: (background: string) => void;
  onClose: () => void;
}

export const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  onSelectBackground,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onSelectBackground(imageUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md border border-zinc-800">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-orange-500" />
            Change Background
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-orange-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-6 py-12 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-lg hover:bg-zinc-800/80 hover:border-orange-500/50 transition-all group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-full text-orange-500 group-hover:scale-110 transition-transform">
                  <Image className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-zinc-300 font-medium">Click to upload image</p>
                  <p className="text-sm text-zinc-500 mt-1">Select an image from your computer</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};