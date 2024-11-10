import React from 'react';
import { Download } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  return (
    <div className="relative rounded-lg overflow-hidden bg-black/95 shadow-lg">
      <video
        className="w-full aspect-video object-contain bg-black"
        controls
        src={url}
      >
        Your browser does not support the video tag.
      </video>

      <a
        href={url}
        download
        className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        title="Download video"
      >
        <Download className="w-4 h-4 text-white" />
      </a>
    </div>
  );
};