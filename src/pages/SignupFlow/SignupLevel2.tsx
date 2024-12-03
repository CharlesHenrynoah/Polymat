import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ErrorBoundary from '../../components/ErrorBoundary';
import './scrollbar.css';

interface SignupLevel2Props {
  onBack: () => void;
  onComplete: (data: {
    photo?: File;
    username: string;
    firstName: string;
    lastName: string;
    description: string;
    visualSpaceId: string;
  }) => void;
}

interface FormData {
  photo?: File;
  photoPreview: string;
  username: string;
  firstName: string;
  lastName: string;
  description: string;
  acceptTerms: boolean;
}

export const SignupLevel2: React.FC<SignupLevel2Props> = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState<FormData>({
    photo: undefined,
    photoPreview: '',
    username: '',
    firstName: '',
    lastName: '',
    description: '',
    acceptTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormComplete = () => {
    return (
      formData.username !== '' &&
      formData.firstName !== '' &&
      formData.lastName !== '' &&
      formData.description !== '' &&
      formData.acceptTerms
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!isFormComplete()) {
        setError('Please complete all required fields');
        return;
      }

      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No authenticated user found');
        return;
      }

      // Convert photo to base64 if exists
      let photoBase64 = null;
      if (formData.photo) {
        try {
          photoBase64 = await convertToBase64(formData.photo);
        } catch (error) {
          console.error('Error converting photo to base64:', error);
          throw new Error('Failed to process profile photo');
        }
      }

      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', formData.username.trim())
        .single();

      if (existingUser) {
        setError('Username already taken');
        return;
      }

      // Prepare user profile data
      const profileData = {
        email: user.email,
        username: formData.username.trim(),
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        description: formData.description.trim(),
        profile_image: photoBase64,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        role: 'user',
        preferences: JSON.stringify({
          terms_accepted: formData.acceptTerms
        })
      };

      // Insert user profile
      const { data: insertedProfile, error: profileError } = await supabase
        .from('users')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!insertedProfile) {
        throw new Error('Failed to create user profile');
      }

      // Create default VisualSpace
      const { data: visualSpace, error: spaceError } = await supabase
        .from('visual_spaces')
        .insert({
          title: `${formData.username}'s First Space`,
          description: 'My first personal visual space',
          user_id: insertedProfile.id,
          created_at: new Date().toISOString(),
          last_modified: new Date().toISOString(),
          last_accessed: new Date().toISOString()
        })
        .select()
        .single();

      if (spaceError) {
        throw spaceError;
      }

      if (!visualSpace) {
        throw new Error('Failed to create visual space');
      }

      // Call onComplete with form data and visual space
      onComplete({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        description: formData.description,
        photo: formData.photo,
        visualSpaceId: visualSpace.id
      });

    } catch (error: any) {
      console.error('Error during profile creation:', error);
      setError(error.message || 'An error occurred during submission');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: file,
          photoPreview: reader.result as string,
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
                  {formData.photoPreview ? (
                    <img
                      src={formData.photoPreview}
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
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200 bg-orange-500 ${
                    isFormComplete() && !isLoading
                      ? 'hover:bg-orange-600'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span>Complete Profile</span>
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
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