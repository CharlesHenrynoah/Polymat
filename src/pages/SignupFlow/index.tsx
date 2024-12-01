import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupLevel1 } from './SignupLevel1';
import { SignupLevel2 } from './SignupLevel2';
import { supabase } from '../../lib/supabase';

interface SignupFlowProps {
  startAtLevel2?: boolean;
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ startAtLevel2 = false }) => {
  const [level, setLevel] = useState(startAtLevel2 ? 2 : 1);
  const navigate = useNavigate();

  const handleLevel1Complete = async (data: any) => {
    if (data.googleAuth) {
      setLevel(2);
      return;
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) throw signUpError;

      setLevel(2);
      navigate('/signup/level2', { replace: true });
    } catch (error: any) {
      console.error('Signup error:', error.message);
    }
  };

  const handleLevel2Complete = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        return;
      }

      // Check if username exists for other users
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', data.username)
        .neq('id', user.id)
        .maybeSingle();

      if (existingUser) {
        console.error('Username already exists');
        return;
      }

      // Convert photo to base64 if provided
      let base64Image = null;
      if (data.photo) {
        const reader = new FileReader();
        base64Image = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result);
          reader.readAsDataURL(data.photo);
        });
      }

      // Prepare user data
      const userData = {
        id: user.id,
        email: user.email,
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
        description: data.description,
        sector: data.sector,
        gender: data.gender,
        birth_date: data.birthDate,
        birth_place: data.birthPlace,
        phone_number: data.phoneNumber,
        country_code: data.countryCode,
        profile_image: base64Image,
        updated_at: new Date().toISOString(),
        is_active: true,
        role: 'user'
      };

      // Update or create user profile using upsert
      const { error: upsertError } = await supabase
        .from('users')
        .upsert(userData, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (upsertError) {
        console.error('User update error:', upsertError);
        throw upsertError;
      }

      // Redirect to the user's space
      navigate(`/${data.username}`, { replace: true });
    } catch (error: any) {
      console.error('Profile update error:', error.message);
    }
  };

  const handleBack = () => {
    setLevel(1);
    navigate('/', { replace: true });
  };

  return level === 1 ? (
    <SignupLevel1 onComplete={handleLevel1Complete} />
  ) : (
    <SignupLevel2 onComplete={handleLevel2Complete} onBack={handleBack} />
  );
};
