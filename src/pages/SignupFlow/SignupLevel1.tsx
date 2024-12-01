import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';
import './scrollbar.css';
import { PasswordRequirements } from '../../types/userProfile';

interface SignupLevel1Props {
  onNext: (data: {
    email: string;
    password: string;
    googleAuth?: boolean;
  }) => void;
  onBack: () => void;
}

export const SignupLevel1: React.FC<SignupLevel1Props> = ({ }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fonction pour gérer les erreurs de manière uniforme
  const handleError = (error: any, customMessage?: string) => {
    console.error('Error:', error);
    setErrors({
      auth: customMessage || error?.message || "Une erreur s'est produite"
    });
    setIsLoading(false);
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/signup/level2`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.url) {
        throw new Error("Impossible d'initialiser la connexion Google");
      }

      // Redirection vers Google
      window.location.href = data.url;

    } catch (error: any) {
      handleError(error, "Erreur lors de la connexion avec Google");
    }
  };

  // Écouteur pour les changements d'état d'authentification
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { user } = session;

          if (!user?.email) {
            throw new Error("L'email est requis pour l'inscription");
          }

          // Vérifier si l'utilisateur existe déjà
          const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            throw userError;
          }

          if (!existingUser) {
            // Créer un nouvel utilisateur
            const { error: createError } = await supabase
              .from('users')
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  username: user.user_metadata?.name || user.email.split('@')[0],
                  created_at: new Date().toISOString(),
                  auth_provider: 'google'
                }
              ]);

            if (createError) {
              throw createError;
            }
          }

          // Rediriger vers signup/level2
          navigate('/signup/level2', {
            state: {
              email: user.email,
              isGoogleSignup: true
            }
          });
        } catch (error: any) {
          handleError(error);
          // En cas d'erreur, déconnecter l'utilisateur
          await supabase.auth.signOut();
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const validatePassword = (pass: string) => {
    const requirements: PasswordRequirements = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };

    return requirements;
  };



  return (
    <ErrorBoundary>
      <div
        className="min-h-screen flex items-center justify-center bg-black relative overflow-y-auto scrollbar-hide"
        style={{
          backgroundImage: 'url(/src/bg/eso1509a-1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <div className="absolute inset-0 bg-black/90 z-0" />

        <div className="relative z-10 w-full max-w-md p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white font-['Orbitron']">Polymat</h1>
            <p className="mt-2 text-zinc-400">Create your account</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm">1</div>
              <div className="w-12 h-0.5 bg-zinc-700" />
              <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-sm">2</div>
            </div>
          </div>

          {/* Form Container */}
          <div className="space-y-6 bg-zinc-900/30 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800/50">
            {/* Form Fields */}
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm text-zinc-400 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: '' });
                  }}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: '' });
                    }}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs flex gap-4">
                      <div className={validatePassword(password).length ? 'text-green-500' : 'text-gray-400'}>
                        8+ characters
                      </div>
                      <div className={validatePassword(password).uppercase ? 'text-green-500' : 'text-gray-400'}>
                        Uppercase
                      </div>
                      <div className={validatePassword(password).lowercase ? 'text-green-500' : 'text-gray-400'}>
                        Lowercase
                      </div>
                      <div className={validatePassword(password).number ? 'text-green-500' : 'text-gray-400'}>
                        Number
                      </div>
                      <div className={validatePassword(password).special ? 'text-green-500' : 'text-gray-400'}>
                        Special
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-zinc-400 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-zinc-500 bg-zinc-900/30">Or continue with</span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-zinc-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <span className="text-zinc-500">Already have an account? </span>
              <Link to="/login" className="text-orange-500 hover:text-orange-400 transition-colors font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
