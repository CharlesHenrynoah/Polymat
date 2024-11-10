import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { DeleteAccountModal } from '../components/Account/DeleteAccountModal';
import { DeleteAccountReason } from '../components/Account/DeleteAccountReason';
import { birthPlaces } from '../data/birthPlaces';
import { sectors } from '../data/sectors';
import { countryCodes } from '../data/countries';
import { PhoneInput } from '../components/Account/PhoneInput';
import { PersonalInfo } from '../components/Account/PersonalInfo';
import { PasswordSection } from '../components/Account/PasswordSection';

interface MyAccountProps {
  username: string;
  profileImage: string;
  onBack: () => void;
  onSave: (username: string, profileImage: string) => void;
}

export const MyAccount: React.FC<MyAccountProps> = ({
  username: initialUsername,
  profileImage: initialProfileImage,
  onBack,
  onSave,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteReason, setShowDeleteReason] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: initialUsername,
    profileImage: initialProfileImage,
    firstName: 'John',
    lastName: 'Doe',
    description: 'Passionate Developer',
    sector: sectors[0],
    birthDate: '1990-01-01',
    birthPlace: birthPlaces.africa[0],
    countryCode: countryCodes[0].code,
    phoneNumber: '6 12 34 56 78',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = {
      username: 'Username',
      firstName: 'First Name',
      lastName: 'Last Name',
      description: 'Description',
      sector: 'Industry',
      birthDate: 'Date of Birth',
      birthPlace: 'Place of Birth',
      phoneNumber: 'Phone Number',
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field as keyof typeof formData]?.trim()) {
        newErrors[field] = `${label} is required`;
      }
    });

    // Password validation
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.oldPassword) {
        newErrors.oldPassword = 'Current password is required to change password';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters long';
      }
    }

    // Phone number validation
    if (!/^\d[\d\s-]*$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save changes
      onSave(formData.username, formData.profileImage);
      // Show success message
      alert('Changes saved successfully!');
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setShowDeleteReason(true);
  };

  const handleReasonSubmit = (reason: string) => {
    console.log('Account deleted with reason:', reason);
    onBack();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  if (showDeleteReason) {
    return <DeleteAccountReason onBack={() => setShowDeleteReason(false)} onConfirm={handleReasonSubmit} />;
  }

  const isFormValid = Object.keys(errors).length === 0 && Object.values(formData).every(value => value !== '');

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-orange-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-white">My Account</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Delete Account
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isFormValid
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-[300px,1fr] gap-8">
              {/* Left Column - Profile Image */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-zinc-800"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      className="absolute bottom-2 right-2 p-2 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors"
                      onClick={triggerImageUpload}
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <PasswordSection
                    oldPassword={formData.oldPassword}
                    newPassword={formData.newPassword}
                    confirmPassword={formData.confirmPassword}
                    onChange={handleChange}
                    errors={errors}
                  />
                </div>
              </div>

              {/* Right Column - Personal Information */}
              <div className="space-y-8">
                {/* Personal Info */}
                <div className="bg-zinc-800/50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-white mb-6">Personal Information</h2>
                  <PersonalInfo
                    formData={formData}
                    onChange={handleChange}
                    errors={errors}
                  />
                </div>

                {/* Contact Info */}
                <div className="bg-zinc-800/50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-white mb-6">Contact Information</h2>
                  <PhoneInput
                    countryCode={formData.countryCode}
                    phoneNumber={formData.phoneNumber}
                    onChange={handleChange}
                    error={errors.phoneNumber}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};