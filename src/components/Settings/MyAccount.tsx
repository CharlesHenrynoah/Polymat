import React, { useState } from 'react';

interface MyAccountProps {
  username: string;
  profileImage: string;
  onBack: () => void;
  onSave: (username: string, profileImage: string) => void;
}

export function MyAccount({ username, profileImage, onBack, onSave }: MyAccountProps) {
  const [newUsername, setNewUsername] = useState(username);
  const [newProfileImage, setNewProfileImage] = useState(profileImage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newUsername, newProfileImage);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="bg-[#151515] rounded-lg p-6 border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6">My Account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={newProfileImage}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <input
                  type="text"
                  value={newProfileImage}
                  onChange={(e) => setNewProfileImage(e.target.value)}
                  placeholder="Profile image URL"
                  className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-400 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
