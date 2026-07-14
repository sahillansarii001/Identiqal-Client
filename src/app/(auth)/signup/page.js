'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '@/validators/auth.validator.js';
import { authService } from '@/services/authService.js';
import { useAuthStore } from '@/store/authStore.js';
import { Input } from '@/components/ui/Input.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { CreditCard, ArrowRight, ShieldAlert } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const response = await authService.signup(data.name, data.email, data.password);
      if (response.success) {
        setAuth(response.data.token, response.data.user);
        router.push('/dashboard');
      } else {
        setErrorMsg(response.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl" />
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            <CreditCard className="text-blue-600" />
            <span>Identiqal</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Create an Account</h2>
          <p className="text-xs text-slate-500 mt-1">Get started with your free digital business card</p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2 animate-shake">
            <ShieldAlert size={16} className="shrink-0 animate-pulse" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 6 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" className="w-full py-3" isLoading={isLoading}>
            Sign Up Free
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </form>

        {/* Footer link */}
        <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-150 pt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-750 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
