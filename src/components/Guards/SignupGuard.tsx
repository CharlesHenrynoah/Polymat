import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface SignupGuardProps {
  children: React.ReactNode;
}

export const SignupGuard: React.FC<SignupGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('users')
          .select('username, completed_signup')
          .eq('id', user.id)
          .single();

        if (profile) {
          setIsProfileComplete(!!profile.completed_signup);
          if (profile.completed_signup) {
            // Directly connect users with existing Google accounts
            navigate(`/${profile.username}`);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking profile completion:', error);
        setLoading(false);
      }
    };

    checkProfileCompletion();
  }, [navigate]);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!isProfileComplete && location.pathname !== '/signup/level2') {
    // Store the intended destination
    return <Navigate to="/signup/level2" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
