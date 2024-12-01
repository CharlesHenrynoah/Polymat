import React, { useState } from 'react';

interface BackgroundSettingsProps {
  currentImage: string;
  onSave: (imageUrl: string) => void;
  onClose: () => void;
}

export function BackgroundSettings({ currentImage, onSave, onClose }: BackgroundSettingsProps) {
  const [selectedImage, setSelectedImage] = useState(currentImage);

  const backgroundOptions = [
    'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80',
    // Ajoutez plus d'options ici
  ];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#0A0A0A] rounded-lg w-full max-w-2xl border border-[#151515]">
        <div className="p-4 border-b border-[#151515] flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Background Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#151515] rounded-lg transition-colors text-zinc-400 hover:text-orange-500"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {backgroundOptions.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(imageUrl)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === imageUrl
                    ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                    : 'border-transparent hover:border-orange-500/50'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={`Background option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(selectedImage);
                onClose();
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
