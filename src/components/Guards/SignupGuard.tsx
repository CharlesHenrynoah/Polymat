import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface SignupGuardProps {
  children: React.ReactNode;
}

export const SignupGuard: React.FC<SignupGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    hasProfile: boolean;
    username?: string;
    isExistingGoogleUser: boolean;
  }>({
    isAuthenticated: false,
    hasProfile: false,
    isExistingGoogleUser: false
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setAuthState({
            isAuthenticated: false,
            hasProfile: false,
            isExistingGoogleUser: false
          });
          setLoading(false);
          return;
        }

        // Vérifier si l'utilisateur a un profil complet dans la table users
        const { data: userProfile } = await supabase
          .from('users')
          .select('username')
          .eq('email', user.email)
          .single();

        const isGoogleUser = user.app_metadata.provider === 'google';
        const hasProfile = !!userProfile;

        setAuthState({
          isAuthenticated: true,
          hasProfile,
          username: userProfile?.username,
          isExistingGoogleUser: isGoogleUser
        });

        // Si l'utilisateur n'a pas de profil et n'est pas déjà sur la page signup
        if (!hasProfile && !location.pathname.includes('/signup')) {
          navigate('/signup/level2', { replace: true });
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error in SignupGuard:', error);
        setAuthState({
          isAuthenticated: false,
          hasProfile: false,
          isExistingGoogleUser: false
        });
        setLoading(false);
      }
    };

    checkAuthAndProfile();
  }, [location.pathname, navigate]);

  if (loading) {
    return null;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!authState.hasProfile && !location.pathname.includes('/signup')) {
    return <Navigate to="/signup/level2" replace />;
  }

  return <>{children}</>;
};
