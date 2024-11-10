import React from 'react';
import { ChevronDown } from 'lucide-react';
import { countryCodes } from '../../data/countries';

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onChange: (field: string, value: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  countryCode,
  phoneNumber,
  onChange,
  error,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-200 mb-1">Phone Number *</label>
      <div className="flex gap-2">
        <div className="relative w-32">
          <select
            value={countryCode}
            onChange={(e) => onChange('countryCode', e.target.value)}
            className="w-full appearance-none px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-8"
          >
            {countryCodes.map(({ code, country, iso }) => (
              <option key={code} value={code}>
                {code} {iso}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        </div>
        <div className="flex-1">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-zinc-700'
            }`}
            placeholder="Phone number"
            data-error={error ? 'true' : 'false'}
          />
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};