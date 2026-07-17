'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/validators/auth.validator.js';
import { authService } from '@/services/authService.js';
import { useAuthStore } from '@/store/authStore.js';
import { Input } from '@/components/ui/Input.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { ArrowRight, ShieldAlert, Check, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const response = await authService.login(data.email, data.password);
      if (response.success) {
        setAuth(response.data.token, response.data.user);
        router.push('/dashboard');
      } else {
        if (response.requiresVerification) {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=signup`);
        } else {
          setErrorMsg(response.message || 'Login failed');
        }
      }
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=signup`);
      } else {
        setErrorMsg(err.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 lg:w-1/2 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          
          {/* Header */}
          <div className="text-left mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-black tracking-tight text-[#1F1F1F] mb-6">
              <span className="w-8 h-8 rounded-lg bg-linear-to-tr from-[#5A3342] to-[#C89B5B] flex items-center justify-center text-white font-bold text-base shadow-sm">
                I
              </span>
              <span className="font-sans">Identiqal</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-[#1F1F1F] font-sans tracking-tight">Welcome Back</h2>
            <p className="text-sm text-brand-secondary mt-2 font-medium">Log in to your Identiqal account.</p>
          </div>

          {/* Global Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2 animate-shake">
              <ShieldAlert size={16} className="shrink-0 animate-pulse" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              }
            />

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center space-x-2 text-brand-secondary hover:text-[#1F1F1F]"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  rememberMe ? 'bg-[#5A3342] border-[#5A3342]' : 'border-[#E9E2DC]'
                }`}>
                  {rememberMe && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                <span>Remember Me</span>
              </button>
              <Link href="/forgot-password" className="text-[#5A3342] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full py-4 mt-2 text-base font-bold rounded-full" isLoading={isLoading}>
              <span>Log in</span>
            </Button>
          </form>

          {/* Footer link */}
          <div className="mt-8 text-center text-sm text-brand-secondary pt-6 font-semibold">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#5A3342] font-extrabold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Imagery */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-[#D1A054] items-center justify-center overflow-hidden">
         {/* Decorative abstract elements */}
         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#5A3342]/20 blur-[100px]"></div>
         <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/20 blur-[80px]"></div>
         
         {/* Mock Phone UI */}
         <div className="relative w-[320px] h-[650px] bg-white rounded-[40px] shadow-2xl p-2 border-8 border-[#5A3342]/10 flex flex-col items-center">
            <div className="w-1/3 h-5 bg-[#5A3342]/10 rounded-b-xl absolute top-0"></div>
            <div className="mt-16 w-24 h-24 rounded-full bg-linear-to-tr from-[#5A3342] to-[#C89B5B]"></div>
            <h3 className="mt-4 text-xl font-bold text-gray-800">Your Brand</h3>
            <p className="text-sm text-gray-500">Everything you are. In one simple link.</p>
            
            <div className="w-full px-4 mt-8 space-y-4">
              <div className="w-full h-14 bg-gray-100 rounded-full"></div>
              <div className="w-full h-14 bg-gray-100 rounded-full"></div>
              <div className="w-full h-14 bg-gray-100 rounded-full"></div>
            </div>
         </div>
      </div>
    </div>
  );
}
