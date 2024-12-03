import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupLevel1 } from './SignupLevel1';
import { SignupLevel2 } from './SignupLevel2';
import { supabase } from '../../lib/supabase';
import ErrorBoundary from '../../components/ErrorBoundary';

interface SignupFlowProps {
  startAtLevel2?: boolean;
}

export function SignupFlow({ startAtLevel2 = false }: SignupFlowProps) {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(startAtLevel2 ? 2 : 1);
  const [signupData, setSignupData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLevel1Complete = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('No user data returned after signup');
      }

      setSignupData({ ...signupData, ...data });
      setCurrentLevel(2);
      navigate('/signup/level2', { replace: true });
    } catch (err: any) {
      console.error('Error in handleLevel1Complete:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLevel2Complete = async (data: any) => {
    try {
      console.log('Starting handleLevel2Complete with data:', data);
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Create user profile in users table
      console.log('Creating user profile...');
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert({
          email: user.email,
          username: data.username.trim(),
          first_name: data.firstName?.trim(),
          last_name: data.lastName?.trim(),
          description: data.description?.trim(),
          profile_image: data.photo,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          is_active: true,
          role: 'user',
          preferences: {}
        })
        .select('id, username')
        .single();

      if (profileError) {
        console.error('Error creating user profile:', profileError.message, profileError.details, profileError.hint);
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }

      if (!userProfile) {
        throw new Error('Failed to create user profile: No profile returned');
      }
      console.log('User profile created successfully:', userProfile);

      // Create visual space using the numeric ID from the users table
      console.log('Creating visual space...');
      const { data: visualSpace, error: spaceError } = await supabase
        .from('visual_spaces')
        .insert([
          {
            title: `${data.username.trim()}'s Space`,
            description: 'My Visual Space',
            user_id: userProfile.id,
            created_at: new Date().toISOString(),
            last_modified: new Date().toISOString(),
            last_accessed: new Date().toISOString()
          },
        ])
        .select()
        .single();

      if (spaceError) {
        console.error('Error creating visual space:', spaceError.message, spaceError.details);
        throw spaceError;
      }

      if (!visualSpace) {
        throw new Error('Failed to create visual space');
      }
      console.log('Visual space created successfully:', visualSpace);

      console.log('Navigating to:', `/space/${visualSpace.id}`);
      // Navigate to the new visual space
      navigate(`/space/${visualSpace.id}`, { replace: true });
    } catch (err: any) {
      console.error('Error in handleLevel2Complete:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {currentLevel === 1 && (
        <SignupLevel1
          onComplete={handleLevel1Complete}
          isLoading={loading}
        />
      )}

      {currentLevel === 2 && (
        <SignupLevel2
          onComplete={handleLevel2Complete}
          isLoading={loading}
        />
      )}
    </ErrorBoundary>
  );
}
