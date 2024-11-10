import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordSectionProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const PasswordSection: React.FC<PasswordSectionProps> = ({
  oldPassword,
  newPassword,
  confirmPassword,
  onChange,
  errors,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-white">Change Password</h3>
      <div className="space-y-4">
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => onChange('oldPassword', e.target.value)}
            className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10 ${
              errors.oldPassword ? 'border-red-500' : 'border-zinc-700'
            }`}
            data-error={errors.oldPassword ? 'true' : 'false'}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-orange-500 transition-colors"
          >
            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {errors.oldPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.oldPassword}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => onChange('newPassword', e.target.value)}
            className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.newPassword ? 'border-red-500' : 'border-zinc-700'
            }`}
            data-error={errors.newPassword ? 'true' : 'false'}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.confirmPassword ? 'border-red-500' : 'border-zinc-700'
            }`}
            data-error={errors.confirmPassword ? 'true' : 'false'}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
};