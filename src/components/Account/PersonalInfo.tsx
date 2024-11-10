import React from 'react';
import { industries } from '../../data/industries';
import { birthPlaces } from '../../data/birthPlaces';

interface PersonalInfoProps {
  formData: {
    username: string;
    firstName: string;
    lastName: string;
    description: string;
    sector: string;
    birthDate: string;
    birthPlace: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ formData, onChange, errors }) => {
  const uniqueBirthPlaces = Object.entries(birthPlaces).flatMap(([continent, places]) =>
    places.map(place => ({
      id: `${continent}-${place}`,
      place,
      continent
    }))
  ).sort((a, b) => a.place.localeCompare(b.place));

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">Username *</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => onChange('username', e.target.value)}
          className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.username ? 'border-red-500' : 'border-zinc-700'
          }`}
          data-error={errors.username ? 'true' : 'false'}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-500">{errors.username}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-200 mb-1">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-zinc-700'
            }`}
            data-error={errors.firstName ? 'true' : 'false'}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-200 mb-1">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-zinc-700'
            }`}
            data-error={errors.lastName ? 'true' : 'false'}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">Short Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
            errors.description ? 'border-red-500' : 'border-zinc-700'
          }`}
          rows={3}
          data-error={errors.description ? 'true' : 'false'}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">Industry *</label>
        <select
          value={formData.sector}
          onChange={(e) => onChange('sector', e.target.value)}
          className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.sector ? 'border-red-500' : 'border-zinc-700'
          }`}
          data-error={errors.sector ? 'true' : 'false'}
        >
          {industries.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
        {errors.sector && (
          <p className="mt-1 text-sm text-red-500">{errors.sector}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">Date of Birth *</label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => onChange('birthDate', e.target.value)}
          className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.birthDate ? 'border-red-500' : 'border-zinc-700'
          }`}
          data-error={errors.birthDate ? 'true' : 'false'}
        />
        {errors.birthDate && (
          <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">Place of Birth *</label>
        <select
          value={formData.birthPlace}
          onChange={(e) => onChange('birthPlace', e.target.value)}
          className={`w-full px-4 py-2 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
            errors.birthPlace ? 'border-red-500' : 'border-zinc-700'
          }`}
          data-error={errors.birthPlace ? 'true' : 'false'}
        >
          {uniqueBirthPlaces.map(({ id, place, continent }) => (
            <option key={id} value={place}>
              {place} ({continent})
            </option>
          ))}
        </select>
        {errors.birthPlace && (
          <p className="mt-1 text-sm text-red-500">{errors.birthPlace}</p>
        )}
      </div>
    </div>
  );
};