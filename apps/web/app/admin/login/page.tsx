'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        if (data.data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          setError('This portal is for administrators only');
          localStorage.removeItem('accessToken');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#0a1628]" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-gold/3 rounded-full blur-3xl" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-2xl mb-6 border border-gold/20">
            <Shield className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2 text-sm">Authorized personnel only</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
            <div className="flex-1">
              <span className="font-display text-lg font-bold text-gold">MotorWa</span>
              <span className="font-display text-lg font-light text-gray-400 ml-1">Admin</span>
            </div>
            <div className="px-2.5 py-1 bg-gold/10 rounded-md border border-gold/20">
              <span className="text-xs font-medium text-gold">SECURE</span>
            </div>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-navy font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Panel'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/login" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Back to main site
          </a>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Unauthorized access is prohibited and monitored
        </p>
      </div>
    </div>
  );
}
