import React, { useState } from 'react';
import { Download, Maximize2, X } from 'lucide-react';

interface ImageViewerProps {
  url: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ url }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div className="relative group">
        <img
          src={url}
          alt="AI Generated"
          className="max-w-full rounded-lg cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
          <a
            href={url}
            download
            className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors ml-2"
          >
            <Download className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={url}
            alt="AI Generated"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  );
};