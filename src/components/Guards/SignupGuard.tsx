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

        const isGoogleUser = user.app_metadata.provider === 'google';

        // Vérifier si l'email existe déjà dans la base de données
        const { data: existingUser } = await supabase
          .from('users')
          .select('email')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          // L'email existe déjà -> redirection vers signup level 2
          navigate('/signup/level2', { 
            replace: true,
            state: { message: 'Un compte existe déjà avec cet email. Veuillez compléter votre profil.' }
          });
          return;
        }

        // Email n'existe pas -> créer un nouveau profil
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            role: 'user'
          });

        if (createError) {
          console.error('Error creating user:', createError);
          return;
        }

        // Rediriger vers SignupLevel2 pour compléter le profil
        if (location.pathname !== '/signup/level2') {
          navigate('/signup/level2', { replace: true });
        }

        setAuthState({
          isAuthenticated: true,
          hasProfile: false,
          isExistingGoogleUser: isGoogleUser
        });
        setLoading(false);

      } catch (error) {
        console.error('Error checking auth status:', error);
        setLoading(false);
      }
    };

    checkAuthAndProfile();
  }, [navigate, location.pathname]);

  if (loading) {
    return null;
  }

  // Non authentifié -> page principale
  if (!authState.isAuthenticated && location.pathname !== '/' && location.pathname !== '/login') {
    return <Navigate to="/" replace />;
  }

  // Authentifié mais sans profil -> level2
  if (authState.isAuthenticated && !authState.hasProfile && location.pathname !== '/signup/level2') {
    return <Navigate to="/signup/level2" replace />;
  }

  // Authentifié avec profil -> espace visuel
  if (authState.isAuthenticated && authState.hasProfile && authState.username && 
      location.pathname !== `/${authState.username}`) {
    return <Navigate to={`/${authState.username}`} replace />;
  }

  return <>{children}</>;
};
