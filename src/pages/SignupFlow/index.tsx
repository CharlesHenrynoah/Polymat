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
    console.log('SignupFlow: Starting handleLevel2Complete with data:', data);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('SignupFlow: Current user:', user);
      
      if (!user) {
        console.error('SignupFlow: No authenticated user found');
        return;
      }

      // Check if username exists for other users
      console.log('SignupFlow: Checking username availability:', data.username);
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', data.username)
        .neq('id', user.id)
        .single();

      if (existingUser) {
        console.error('SignupFlow: Username already exists');
        return;
      }

      // Prepare user data
      console.log('SignupFlow: Preparing user data');
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

      console.log('SignupFlow: Updating user profile');
      const { error: updateError } = await supabase
        .from('users')
        .update(userData)
        .eq('email', user.email);

      if (updateError) {
        console.error('SignupFlow: User update error:', updateError);
        throw updateError;
      }

      console.log('SignupFlow: User profile updated successfully');

      // Get the user's ID
      console.log('SignupFlow: Getting user ID');
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) {
        console.error('SignupFlow: Error getting user ID:', userError);
        throw userError;
      }

      if (!userProfile) {
        console.error('SignupFlow: User profile not found');
        throw new Error('User profile not found');
      }

      console.log('SignupFlow: User profile found:', userProfile);

      // Create default VisualSpace
      console.log('SignupFlow: Creating default visual space');
      const { data: visualSpace, error: spaceError } = await supabase
        .from('visual_spaces')
        .insert([{
          title: `${data.username}'s First Space`,
          description: 'My first personal visual space',
          user_id: userProfile.id,
          created_at: new Date().toISOString(),
          last_modified: new Date().toISOString(),
          last_accessed: new Date().toISOString()
        }])
        .select()
        .single();

      if (spaceError) {
        console.error('SignupFlow: Visual space creation error:', spaceError);
        throw spaceError;
      }

      if (!visualSpace) {
        console.error('SignupFlow: Failed to create visual space');
        throw new Error('Failed to create visual space');
      }

      console.log('SignupFlow: Visual space created successfully:', visualSpace);
      return visualSpace;

    } catch (error: any) {
      console.error('SignupFlow: Profile update error:', error.message);
      throw error;
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
