import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SignupLevel1 } from './SignupLevel1';
import { SignupLevel2 } from './SignupLevel2';
import { supabase } from '../../lib/supabase';

interface SignupFlowProps {
  startAtLevel2?: boolean;
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ startAtLevel2 = false }) => {
  const [level, setLevel] = useState(startAtLevel2 ? 2 : 1);
  const [level1Data, setLevel1Data] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLevel = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user already exists in our users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('username')
          .eq('email', user.email)
          .single();

        if (existingUser?.username) {
          // User exists, redirect to workspace
          navigate(`/${existingUser.username}`, { replace: true });
          return;
        }

        // If user is authenticated but doesn't have a profile, create one
        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_active: false,
              role: 'user'
            });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
          }
        }

        // If at level 1, move to level 2
        if (level === 1) {
          navigate('/signup/level2', { replace: true });
          return;
        }
      }

      if (!user && level === 2) {
        navigate('/signup', { replace: true });
      }
    };

    checkAuthAndLevel();
  }, [level, navigate]);

  const handleLevel1Complete = async (data: any) => {
    if (data.googleAuth) {
      // For Google auth, just set the level and let the OAuth flow handle the rest
      setLevel(2);
      return;
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) throw signUpError;

      // Create initial user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: false,
            role: 'user'
          });

        if (profileError) throw profileError;
      }

      setLevel(2);
      navigate('/signup/level2', { replace: true });
    } catch (error: any) {
      console.error('Error in level 1 completion:', error);
      if (error.message === 'User already registered') {
        alert('Un compte existe déjà avec cet email. Veuillez vous connecter.');
        navigate('/login');
      }
    }
  };

  const handleLevel2Complete = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      console.log('Current user:', user);
      console.log('Form data:', data);

      // Upload profile photo if provided
      let photoUrl = null;
      if (data.photo) {
        try {
          const fileExt = data.photo.name.split('.').pop();
          const filePath = `${user.id}/profile.${fileExt}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('avatars')
            .upload(filePath, data.photo, {
              upsert: true
            });

          if (uploadError) {
            console.error('Photo upload error:', uploadError);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);

            photoUrl = publicUrl;
          }
        } catch (photoError) {
          console.error('Error handling photo upload:', photoError);
        }
      }

      const userUpdateData = {
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
        description: data.description || '',
        sector: data.sector || '',
        gender: data.gender || '',
        birth_date: data.birthDate ? new Date(data.birthDate).toISOString() : null,
        birth_place: data.birthPlace || '',
        phone_number: data.phoneNumber || '',
        country_code: data.countryCode || '',
        profile_image: photoUrl,
        is_active: true,
        role: 'user',
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      console.log('Updating user with data:', userUpdateData);

      // First check if user exists in the users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Existing user check:', { existingUser, checkError });

      let updateResult;
      if (!existingUser) {
        console.log('Creating new user record');
        updateResult = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            ...userUpdateData
          });
      } else {
        console.log('Updating existing user record');
        updateResult = await supabase
          .from('users')
          .update(userUpdateData)
          .eq('id', user.id);
      }

      if (updateResult.error) {
        console.error('Database operation error:', updateResult.error);
        throw updateResult.error;
      }

      console.log('Successfully updated user profile');
      navigate(`/${data.username}`, { replace: true });
    } catch (error: any) {
      console.error('Error completing signup:', error);
      if (error.message) {
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.error('Unknown error type:', error);
      }
      // Show error to user
      alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleBack = () => {
    if (level === 2) {
      setLevel(1);
      navigate('/signup', { replace: true });
    } else {
      navigate('/login');
    }
  };

  if (level === 1) {
    return <SignupLevel1 onNext={handleLevel1Complete} onBack={handleBack} />;
  }

  return <SignupLevel2 onComplete={handleLevel2Complete} onBack={handleBack} />;
};
