import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-black"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80)',
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
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-zinc-300 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                    rememberMe ? 'bg-orange-500' : 'bg-zinc-700'
                  }`} />
                </div>
                <span className="ml-2 select-none">Remember me</span>
              </label>
              <button
                type="button"
                className="text-orange-500 hover:text-orange-400 transition-colors"
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
              <span>Sign in</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Sign Up Link */}
            <div className="pt-4 text-center text-sm text-zinc-400 border-t border-zinc-800/50">
              Don't have an account?{' '}
              <button type="button" className="text-orange-500 hover:text-orange-400 transition-colors font-medium">
                Create one now
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};