import React, { useState, useRef } from 'react';
import { ArrowRight, Upload, ChevronDown } from 'lucide-react';
import { sectors } from '../../data/sectors';
import { birthPlaces } from '../../data/birthPlaces';
import { countryCodes } from '../../data/countries';

interface SignupLevel2Props {
  onComplete: (data: {
    photo?: File;
    username: string;
    firstName: string;
    lastName: string;
    description: string;
    sector: string;
    gender: string;
    birthDate: string;
    birthPlace: string;
    phoneNumber: string;
    countryCode: string;
  }) => void;
  onBack: () => void;
}

export const SignupLevel2: React.FC<SignupLevel2Props> = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    photo: undefined as File | undefined,
    photoPreview: '',
    username: '',
    firstName: '',
    lastName: '',
    description: '',
    sector: sectors[0],
    gender: '',
    birthDate: '',
    birthPlace: Object.values(birthPlaces)[0][0],
    phoneNumber: '',
    countryCode: countryCodes[0].code,
    verificationCode: '',
    isVerificationSent: false,
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'not-specified', label: 'Prefer not to say' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (field: string, value: string | boolean | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));

    if (field === 'username' && value) {
      checkUsername(value as string);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange('photo', file);
      handleChange('photoPreview', URL.createObjectURL(file));
    }
  };

  const checkUsername = async (username: string) => {
    if (username.length < 3) return;
    
    setIsCheckingUsername(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, randomly determine if username is taken
      const isTaken = Math.random() > 0.7;
      if (isTaken) {
        setErrors(prev => ({
          ...prev,
          username: 'This username is already taken'
        }));
      }
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const sendVerificationCode = async () => {
    if (!formData.phoneNumber) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: 'Please enter a phone number'
      }));
      return;
    }

    try {
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleChange('isVerificationSent', true);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: 'Failed to send verification code'
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (formData.isVerificationSent && !formData.verificationCode) {
      newErrors.verificationCode = 'Please enter the verification code';
    }
    if (!formData.acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onComplete({
        photo: formData.photo,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        description: formData.description,
        sector: formData.sector,
        gender: formData.gender,
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        phoneNumber: formData.phoneNumber,
        countryCode: formData.countryCode,
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to complete registration'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/90" />
      
      <div className="relative w-full max-w-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white font-['Orbitron']">Polymat</h1>
          <p className="mt-2 text-zinc-400">Complete your profile</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</div>
            <div className="w-12 h-0.5 bg-orange-500" />
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm">2</div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 bg-zinc-900/50 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/50 shadow-xl">
            {/* Photo Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700/50 transition-colors group"
                >
                  {formData.photoPreview ? (
                    <img
                      src={formData.photoPreview}
                      alt="Profile preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    className={`w-full px-4 py-2.5 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.username ? 'border-red-500' : 'border-zinc-700/50'
                    }`}
                    placeholder="Choose a username"
                  />
                  {isCheckingUsername && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-500' : 'border-zinc-700/50'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500' : 'border-zinc-700/50'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.gender ? 'border-red-500' : 'border-zinc-700/50'
                  }`}
                >
                  <option value="">Select gender</option>
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Short Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-4 py-2.5 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-zinc-700/50'
                }`}
                rows={3}
                placeholder="Tell us about yourself"
                maxLength={500}
              />
              <div className="mt-1 flex justify-between text-xs text-zinc-500">
                <span>{500 - formData.description.length} characters remaining</span>
                {errors.description && (
                  <span className="text-red-500">{errors.description}</span>
                )}
              </div>
            </div>

            {/* Industry & Birth Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Industry *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Birth Date *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-zinc-800/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.birthDate ? 'border-red-500' : 'border-zinc-700/50'
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Birth Place *
                </label>
                <select
                  value={formData.birthPlace}
                  onChange={(e) => handleChange('birthPlace', e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {Object.entries(birthPlaces).map(([continent, places]) => (
                    <optgroup key={continent} label={continent.toUpperCase()}>
                      {places.map(place => (
                        <option key={place} value={place}>
                          {place}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <div className="w-32">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => handleChange('countryCode', e.target.value)}
                      className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                    >
                      {countryCodes.map(({ code, country }) => (
                        <option key={code} value={code}>
                          {code} ({country})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      className={`w-full px-4 py-2.5 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.phoneNumber ? 'border-red-500' : 'border-zinc-700/50'
                      }`}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            {/* Phone Verification */}
            {formData.isVerificationSent ? (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Verification Code *
                </label>
                <input
                  type="text"
                  value={formData.verificationCode}
                  onChange={(e) => handleChange('verificationCode', e.target.value)}
                  className={`w-full px-4 py-2.5 bg-zinc -800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.verificationCode ? 'border-red-500' : 'border-zinc-700/50'
                  }`}
                  placeholder="Enter verification code"
                  maxLength={6}
                />
                {errors.verificationCode && (
                  <p className="mt-1 text-sm text-red-500">{errors.verificationCode}</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={sendVerificationCode}
                className="w-full px-4 py-2.5 bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors"
              >
                Send Verification Code
              </button>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-start">
                  <div className="bg-zinc-800/50 border border-zinc-700/50 w-6 h-6 rounded transition-colors group-hover:border-orange-500">
                    <input
                      type="checkbox"
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                    />
                    {formData.acceptTerms && (
                      <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-zinc-300">
                  I accept the{' '}
                  <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p className="text-sm text-red-500">{errors.terms}</p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 text-zinc-300 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Complete Registration</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};