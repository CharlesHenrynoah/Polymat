import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import './SignupFlow/scrollbar.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Récupérer le message de redirection
  useEffect(() => {
    const state = location.state as { message?: string };
    if (state?.message) {
      setError(state.message);
    }
  }, [location]);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          },
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;

      // La redirection vers Google va se produire automatiquement
      // Le reste de la logique sera géré par un useEffect qui écoutera l'événement de connexion

    } catch (error: any) {
      console.error('Error with Google login:', error);
      setError('Une erreur est survenue lors de la connexion avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { user } = session;

          // Récupérer le VisualSpace par défaut
          const { data: visualSpace, error: visualSpaceError } = await supabase
            .from('visual_spaces')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

          if (visualSpaceError && visualSpaceError.code !== 'PGRST116') {
            throw visualSpaceError;
          }

          // Si aucun VisualSpace n'existe, en créer un par défaut
          if (!visualSpace) {
            const { data: newSpace, error: createError } = await supabase
              .from('visual_spaces')
              .insert({
                title: 'My First Space',
                description: 'My default visual space',
                user_id: user.id,
                created_at: new Date().toISOString(),
                last_modified: new Date().toISOString(),
                last_accessed: new Date().toISOString()
              })
              .select()
              .single();

            if (createError) throw createError;
            
            // Rediriger vers le nouveau VisualSpace
            navigate(`/space/${newSpace.id}`);
          } else {
            // Rediriger vers le VisualSpace existant
            navigate(`/space/${visualSpace.id}`);
          }
        } catch (error) {
          console.error('Error after Google login:', error);
          setError('Une erreur est survenue lors de la finalisation de la connexion');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!user) throw new Error('No user returned from login');

      // Récupérer le VisualSpace par défaut de l'utilisateur
      const { data: visualSpace, error: visualSpaceError } = await supabase
        .from('visual_spaces')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (visualSpaceError && visualSpaceError.code !== 'PGRST116') {
        throw visualSpaceError;
      }

      // Si aucun VisualSpace n'existe, en créer un par défaut
      if (!visualSpace) {
        const { data: newSpace, error: createError } = await supabase
          .from('visual_spaces')
          .insert({
            title: 'My First Space',
            description: 'My default visual space',
            user_id: user.id,
            created_at: new Date().toISOString(),
            last_modified: new Date().toISOString(),
            last_accessed: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        
        // Rediriger vers le nouveau VisualSpace
        navigate(`/space/${newSpace.id}`);
      } else {
        // Rediriger vers le VisualSpace existant
        navigate(`/space/${visualSpace.id}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
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
      }}
    >
      <div className="absolute inset-0 bg-black/90" />

      <div className="relative w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white font-['Orbitron']">Polymat</h1>
          <p className="mt-2 text-zinc-400">Sign in to your account</p>
        </div>

        {/* Google Login Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-zinc-100 text-black rounded-lg font-medium transition-colors"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Separator */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-zinc-400">Or continue with</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 bg-zinc-900/50 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/50 shadow-xl">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2.5 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${error ? 'border-red-500' : 'border-zinc-700/50'
                  }`}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-zinc-800/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10 ${error ? 'border-red-500' : 'border-zinc-700/50'
                    }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-zinc-300 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className={`bg-zinc-800/50 border border-zinc-700/50 w-5 h-5 rounded transition-colors group-hover:border-orange-500`}>
                    {rememberMe && (
                      <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24">
                        <path d="M9 11l3 3L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-2">Remember me</span>
              </label>
              <button
                type="button"
                className="text-orange-500 hover:text-orange-400 transition-colors"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-zinc-500">Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-orange-500 hover:text-orange-400 transition-colors font-medium"
              >
                Sign up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};