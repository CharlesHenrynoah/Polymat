import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './scrollbar.css';

interface SignupLevel1Props {
  onNext: (data: {
    email: string;
    password: string;
    googleAuth?: boolean;
  }) => void;
  onBack: () => void;
}

export const SignupLevel1: React.FC<SignupLevel1Props> = ({ onNext, onBack }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        try {
          // Vérifier si l'email existe déjà
          const { data: existingUser } = await supabase
            .from('users')
            .select('email')
            .eq('email', session.user.email)
            .single();

          if (existingUser) {
            // Email existe -> déconnexion et redirection vers login
            await supabase.auth.signOut();
            navigate('/login', {
              replace: true,
              state: { message: 'Un compte existe déjà avec cet email. Veuillez vous connecter.' }
            });
          } else {
            // Nouvel email -> redirection vers signup level 2
            navigate('/signup/level2', { replace: true });
          }
        } catch (error) {
          console.error('Error checking email:', error);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const validatePassword = (pass: string) => {
    const requirements = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };

    return Object.values(requirements).every(Boolean);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    let hasErrors = false;
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    } else if (!validatePassword(password)) {
      newErrors.password =
        'Password must be at least 8 characters and contain uppercase, lowercase, number and special character';
      hasErrors = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    onNext({ email, password });
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setErrors(null);
      
      // Lancer l'authentification Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/signup/level2`
        }
      });

      if (error) throw error;
      
      // Récupérer l'utilisateur authentifié
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Aucun utilisateur trouvé après l\'authentification Google');
      }

      // Vérifier si l'utilisateur existe dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, is_profile_complete')
        .eq('id', user.id)
        .single();

      // Préparer les données utilisateur pour la redirection
      const userSignupData = {
        email: user.email || '',
        id: user.id,
        username: user.user_metadata.name 
          || user.email?.split('@')[0] 
          || `user_${Math.random().toString(36).substr(2, 9)}`
      };

      // Cas 1 : L'utilisateur n'existe pas encore
      if (userError && userError.code === 'PGRST116') {
        // Créer un nouvel enregistrement utilisateur
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            is_profile_complete: false,
            username: userSignupData.username,
            preferences: {
              theme: 'dark',
              language: 'en',
              notifications: true
            }
          });

        if (insertError) throw insertError;

        // Rediriger vers signup level 2
        navigate('/signup/level2', { state: userSignupData });
      } 
      // Cas 2 : L'utilisateur existe déjà
      else if (userData) {
        // Toujours rediriger vers signup level 2, même si le profil est incomplet
        navigate('/signup/level2', { 
          state: {
            ...userSignupData,
            existingUser: true
          } 
        });
      } 
      else {
        // Scénario inattendu
        throw new Error('Erreur inattendue lors de l\'inscription Google');
      }
    } catch (error) {
      console.error('Erreur Google Auth:', error);
      setErrors(error instanceof Error ? error.message : 'Erreur lors de la connexion avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};