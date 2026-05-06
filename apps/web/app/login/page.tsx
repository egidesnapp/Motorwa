'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, ArrowRight, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return `+250${cleaned.slice(1)}`;
    }
    if (cleaned.startsWith('250') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    return value;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatPhone(phone) }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatPhone(phone), code: otp }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.user.fullName) {
          localStorage.setItem('accessToken', data.data.accessToken);
          router.push('/dashboard');
        } else {
          setStep('name');
        }
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatPhone(phone), code: otp, fullName }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="font-display text-3xl font-bold text-navy">MotorWa</span>
            <span className="font-display text-3xl font-light text-navy">.rw</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {step === 'phone' && 'Enter your phone number'}
            {step === 'otp' && 'Enter verification code'}
            {step === 'name' && 'What is your name?'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'phone' && 'We will send you a 6-digit code'}
            {step === 'otp' && `Code sent to ${phone}`}
            {step === 'name' && 'Complete your profile to get started'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {error && (
            <div className="bg-error-pale text-error px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+250 7XX XXX XXX"
                    className="input w-full pl-10"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : 'Send Code'}
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="input text-center text-3xl font-mono tracking-widest w-48"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : 'Verify'}
                <Shield size={18} />
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="btn-ghost w-full text-sm"
              >
                Change phone number
              </button>
            </form>
          )}

          {step === 'name' && (
            <form onSubmit={handleSetName} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="input w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-gold hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
