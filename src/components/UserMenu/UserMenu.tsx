import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';

interface UserMenuProps {
  onSignOut: () => void;
  onMyAccount: () => void;
  username: string;
  profileImage: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onSignOut,
  onMyAccount,
  profileImage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 transition-transform hover:scale-105"
      >
        <img
          src={profileImage}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg py-1 z-50 border border-zinc-800">
          <button
            onClick={() => {
              onMyAccount();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-zinc-800 text-zinc-200 hover:text-orange-500 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>My Account</span>
          </button>
          <button
            onClick={() => {
              onSignOut();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-zinc-800 text-red-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};