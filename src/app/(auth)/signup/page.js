"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/validators/auth.validator.js";
import { authService } from "@/services/authService.js";
import { useAuthStore } from "@/store/authStore.js";
import { Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import {
  ArrowRight,
  ShieldAlert,
  Check,
  ChevronLeft,
  EyeOff,
  Eye,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: "onChange",
  });

  const handleNextStep = async () => {
    // Validate only email for step 1
    const isEmailValid = await trigger("email");
    if (isEmailValid) {
      setStep(2);
      setErrorMsg("");
    }
  };

  const onSubmit = async (data) => {
    if (!agreedTerms) {
      setErrorMsg("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    try {
      // Need to update authService to accept username!
      // But we can just pass it as part of an object, let's assume authService is updated
      // Actually authService currently takes (name, email, password)
      // We will need to update authService.js later
      const response = await authService.signup(
        data.name,
        data.email,
        data.password,
        data.username,
      );
      if (response.success) {
        setStep(3);
      } else {
        setErrorMsg(response.message || "Registration failed");
      }
    } catch (err) {
      setErrorMsg(err.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMsg("Please enter a valid 6-digit code");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    try {
      const email = getValues("email");
      const response = await authService.verifyOtp(email, otp);
      if (response.success) {
        setAuth(response.data.token, response.data.user);
        router.push("/onboarding");
      } else {
        setErrorMsg(response.message || "Verification failed");
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 lg:w-1/2 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-100">
          {/* Header */}
          <div className="text-left mb-8">
            <div className="flex items-center space-x-2 mb-6">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={20} className="text-brand-text" />
                </button>
              )}
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-2xl font-black tracking-tight text-brand-text"
              >
                <span className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-base shadow-sm">
                  I
                </span>
                <span className="font-sans">Identiqal</span>
              </Link>
            </div>

            <h2 className="text-3xl font-extrabold text-brand-text font-sans tracking-tight">
              {step === 1
                ? "Create an Account"
                : step === 2
                  ? "Complete your profile"
                  : "Verify Your Email"}
            </h2>
            <p className="text-sm text-brand-secondary mt-2 font-medium">
              {step === 1
                ? "Get started with your free digital business card"
                : step === 2
                  ? "Choose a unique username and secure password"
                  : `We sent a 6-digit code to ${getValues("email")}`}
            </p>
          </div>

          {/* Global Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2 animate-shake">
              <ShieldAlert size={16} className="shrink-0 animate-pulse" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={
              step === 3
                ? onVerifyOtp
                : step === 2
                  ? handleSubmit(onSubmit)
                  : (e) => {
                      e.preventDefault();
                      handleNextStep();
                    }
            }
            className="space-y-4 text-left"
          >
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Button
                  type="submit"
                  className="w-full py-4 mt-2 text-base font-bold rounded-full"
                >
                  <span>Continue</span>
                </Button>

                {/* Dividers */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E2E8F0]" />
                  </div>
                  <span className="relative bg-white px-3 text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider">
                    Or continue with
                  </span>
                </div>

                {/* Social signups */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-white border border-[#E2E8F0] hover:border-primary/30 rounded-xl text-xs font-bold text-brand-text hover:bg-brand-bg transition-all"
                  >
                    {/* Google SVG */}
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-white border border-[#E2E8F0] hover:border-primary/30 rounded-xl text-xs font-bold text-brand-text hover:bg-brand-bg transition-all"
                  >
                    {/* Github SVG */}
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                      />
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Jane Doe"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-brand-text">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        identiqal.com/
                      </span>
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-28 pr-3 py-3 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        errors.username ? "border-red-500" : "border-[#E2E8F0]"
                      }`}
                      placeholder="username"
                      autoComplete="off"
                      {...register("username")}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register("password")}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                {/* Terms & Conditions Box */}
                <div className="flex items-start space-x-2 text-xs font-semibold pt-1">
                  <button
                    type="button"
                    onClick={() => setAgreedTerms(!agreedTerms)}
                    className="flex items-center justify-center w-4 h-4 rounded border transition-all mt-0.5 shrink-0"
                    style={{
                      borderColor: agreedTerms ? "#2563EB" : "#E2E8F0",
                      backgroundColor: agreedTerms ? "#2563EB" : "transparent",
                    }}
                  >
                    {agreedTerms && (
                      <Check size={10} className="text-white" strokeWidth={3} />
                    )}
                  </button>
                  <span className="text-brand-secondary">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    &{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 mt-2 text-base font-bold rounded-full"
                  isLoading={isLoading}
                >
                  <span>Create Account</span>
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                <Input
                  label="Verification Code"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <Button
                  type="submit"
                  className="w-full py-4 mt-2 text-base font-bold rounded-full"
                  isLoading={isLoading}
                >
                  <span>Verify & Continue</span>
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            )}
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-sm text-brand-secondary border-t border-[#E2E8F0] pt-6 font-semibold">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-extrabold hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Imagery */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-slate-900 items-center justify-center overflow-hidden">
        {/* Decorative abstract elements */}
        <div className="absolute top-[-10%] right-[-10%] w-200 h-200 rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-150 h-150 rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen"></div>

        {/* Mock Phone UI */}
        <div className="relative w-85 h-170 bg-slate-50 rounded-[50px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] p-2 border-12 border-slate-800 flex flex-col items-center scale-80 2xl:scale-100 transform origin-center">
          {/* Dynamic Island Notch */}
          <div className="w-30 h-7 bg-slate-800 rounded-full absolute top-2 mt-1 z-10 flex items-center justify-between px-3 shadow-inner">
             <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-slate-900"></div>
          </div>
          
          {/* Profile Header */}
          <div className="w-full h-32 bg-linear-to-r from-blue-600 to-violet-600 rounded-t-[34px] relative mb-12">
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  YB
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Your Brand</h3>
          <p className="text-sm text-slate-500 mt-1 font-medium px-6 text-center">
            Digital Business Card
          </p>

          {/* QR Code section */}
          <div className="w-full px-8 mt-8 flex flex-col items-center">
            <div className="w-full aspect-square bg-white rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-center border border-slate-100 p-6 relative group overflow-hidden">
               <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <QRCodeSVG value="https://identiqal.vercel.app/" size={140} fgColor="#1e293b" className="z-10" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md z-20 border border-slate-50">
                  <span className="text-blue-600 font-black text-xl">YB</span>
               </div>
            </div>
            <p className="text-xs text-slate-400 mt-6 font-bold uppercase tracking-widest">
               Scan to connect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


