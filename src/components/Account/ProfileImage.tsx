import React from 'react';
import { Upload } from 'lucide-react';

interface ProfileImageProps {
  imageUrl: string;
  onImageChange: () => void;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, onImageChange }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-gray-100">
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onImageChange}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Upload className="w-4 h-4 mr-2" />
        Change Photo
      </button>
    </div>
  );
};