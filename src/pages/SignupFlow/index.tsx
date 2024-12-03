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

  const handleLevel1Complete = async (data: {
    email: string;
    password: string;
    googleAuth?: boolean;
  }) => {
    if (data.googleAuth) {
      setLevel(2);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
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
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', data.username)
        .neq('id', user.id)
        .single();

      if (existingUser) {
        console.error('Username already exists');
        return;
      }

      // Prepare user data
      const userData = {
        email: user.email,
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
        description: data.description,
        profile_image: data.photo,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        role: 'user',
        preferences: JSON.stringify({
          terms_accepted: true
        })
      };

      // Update user profile instead of insert
      const { error: updateError } = await supabase
        .from('users')
        .update(userData)
        .eq('email', user.email);

      if (updateError) {
        console.error('User update error:', updateError);
        throw updateError;
      }

      // Get the user's numeric ID
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) {
        console.error('Error getting user ID:', userError);
        throw userError;
      }

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Create default VisualSpace with exact schema match
      const { error: spaceError } = await supabase
        .from('visual_spaces')
        .insert([{
          title: `${data.username}'s First Space`,
          description: 'My first personal visual space',
          user_id: parseInt(userProfile.id),
          created_at: new Date().toISOString(),
          last_modified: new Date().toISOString(),
          last_accessed: new Date().toISOString()
        }]);

      if (spaceError) {
        console.error('Visual space creation error:', spaceError);
        throw spaceError;
      }

      // Attendre que toutes les opérations soient terminées avant de naviguer
      await new Promise(resolve => setTimeout(resolve, 500));

      // Rediriger vers le visual space
      navigate(`/space/${data.visualSpaceId}`, { replace: true });
    } catch (error: any) {
      console.error('Profile update error:', error.message);
    }
  };

  const handleBack = () => {
    setLevel(1);
    navigate('/', { replace: true });
  };

  return level === 1 ? (
    <SignupLevel1 onNext={handleLevel1Complete} onBack={() => navigate('/')} />
  ) : (
    <SignupLevel2 onComplete={handleLevel2Complete} onBack={handleBack} />
  );
};
