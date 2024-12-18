import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ErrorBoundary from '../../components/ErrorBoundary';
import './scrollbar.css';

interface SignupLevel2Props {
  onBack?: () => void;
  onComplete: (data: {
    username: string;
    firstName: string;
    lastName: string;
    description: string;
    photo?: string;
    visualSpaceId?: string;
  }) => void;
  isLoading?: boolean;
}

interface FormData {
  acceptTerms: boolean | undefined;
  username: string;
  firstName: string;
  lastName: string;
  description: string;
  photo?: string;
}

export const SignupLevel2: React.FC<SignupLevel2Props> = ({ onBack, onComplete, isLoading: parentIsLoading = false }) => {
  const [formData, setFormData] = useState<FormData>({
    acceptTerms: undefined,
    username: '',
    firstName: '',
    lastName: '',
    description: '',
    photo: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const isLoading = parentIsLoading || localIsLoading;

  const isFormComplete = () => {
    return (
      formData.username !== '' &&
      formData.firstName !== '' &&
      formData.lastName !== '' &&
      formData.description !== '' &&
      formData.photo !== ''
    );
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const checkUsernameAvailability = async (username: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username.trim())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking username:', error);
        throw new Error('Error checking username availability');
      }

      return !data; // Return true if username is available (no data found)
    } catch (err) {
      console.error('Error in checkUsernameAvailability:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLocalIsLoading(true);
      setError(null);

      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      console.log('SignupLevel2: Current user:', user);

      if (!user) {
        setError('No authenticated user found');
        return;
      }

      // Check if username already exists in users table
      const isUsernameAvailable = await checkUsernameAvailability(formData.username);
      if (!isUsernameAvailable) {
        setError('This username is already taken. Please choose another one.');
        return;
      }

      // Call onComplete with form data
      await onComplete({
        username: formData.username.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        description: formData.description.trim(),
        photo: formData.photo,
        visualSpaceId: ''
      });

    } catch (error: any) {
      console.error('Error in form submission:', error);
      setError(error.message || 'An error occurred during signup. Please try again.');
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ErrorBoundary>
      <div
        className="min-h-screen flex items-center justify-center bg-black relative overflow-y-auto scrollbar-hide"
        style={{
          backgroundImage: 'url(/src/bg/eso1509a-1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <div className="absolute inset-0 bg-black/90 z-0" />

        <div className="relative z-10 w-full max-w-md p-8">
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-md mb-4 text-center">
              {error}
            </div>
          )}

          {/* Form Container */}
          <div className="space-y-4 bg-zinc-900/30 backdrop-blur-xl rounded-lg p-6 border border-zinc-800/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload */}
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors"
                >
                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-zinc-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Upload Profile Photo</p>
                  <p className="text-xs text-zinc-500">PNG or JPEG (max 5MB)</p>
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm text-zinc-400 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Choose a unique username"
                />
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm text-zinc-400 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm text-zinc-400 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-900 bg-zinc-800/50"
                />
                <label htmlFor="terms" className="text-sm text-zinc-400">
                  I accept the terms and conditions
                </label>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isFormComplete() || isLoading}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200 bg-orange-500 ${isFormComplete() && !isLoading
                    ? 'hover:bg-orange-600'
                    : 'opacity-50 cursor-not-allowed'
                    }`}
                >
                  <span>Complete Profile</span>
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};