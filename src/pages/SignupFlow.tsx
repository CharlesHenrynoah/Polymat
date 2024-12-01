import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function SignupFlow() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      console.log('Session:', session);

      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Vérifier si un utilisateur existe déjà
          const { data: existingUser } = await supabase
            .from('users')
            .select('username')
            .eq('id', session.user.id)
            .single();

          if (!existingUser) {
            // Créer un nouvel utilisateur avec un username généré
            const tempUsername = `user${Math.random().toString(36).slice(2, 7)}`;
            const { error: userError } = await supabase
              .from('users')
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  username: tempUsername,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  is_active: true,
                  role: 'user'
                }
              ]);

            if (userError) throw userError;
            navigate(`/${tempUsername}`);
          } else {
            navigate(`/${existingUser.username}`);
          }
        } catch (err) {
          console.error('Error handling auth change:', err);
          setError(err instanceof Error ? err.message : 'An error occurred while setting up your profile');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
            hd: '*'
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      console.log('OAuth response:', data);
      
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during Google sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Créer le compte utilisateur
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('No user returned from signup');

      // 2. Créer l'utilisateur dans la table users
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: email,
            username: username,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            role: 'user'
          }
        ]);

      if (userError) throw userError;

      // 3. Rediriger vers la page de l'utilisateur
      navigate(`/${username}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Join Polymat to create and manage your visual spaces
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? 'Connecting...' : 'Continue with Google'}
          </button>
        </div>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#0A0A0A] text-zinc-400">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-400">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#151515] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#151515] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#151515] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                placeholder="Create a password"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white transition-all ${
                isLoading
                  ? 'bg-orange-500/50 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
