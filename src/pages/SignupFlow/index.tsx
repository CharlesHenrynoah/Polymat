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
      if (!user) return;

      const { error: updateError } = await supabase
        .from('users')
        .update({
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
          completed_signup: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Redirection vers l'espace visuel
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
