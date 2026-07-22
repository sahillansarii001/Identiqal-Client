"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/validators/auth.validator.js";
import { authService } from "@/services/authService.js";
import { useAuthStore } from "@/store/authStore.js";
import { Input } from "@/components/ui/Input.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { ArrowRight, ShieldAlert, Check, Eye, EyeOff } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMsg, setErrorMsg] = useState("");
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
    setErrorMsg("");
    setIsLoading(true);
    try {
      const response = await authService.login(data.email, data.password);
      if (response.success) {
        setAuth(response.data.token, response.data.user);
        if (
          response.data.user.role === "admin" ||
          response.data.user.role === "owner"
        ) {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        if (response.requiresVerification) {
          router.push(
            `/verify-otp?email=${encodeURIComponent(data.email)}&type=signup`,
          );
        } else {
          setErrorMsg(response.message || "Login failed");
        }
      }
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        router.push(
          `/verify-otp?email=${encodeURIComponent(data.email)}&type=signup`,
        );
      } else {
        setErrorMsg(err.message || "Invalid email or password");
      }
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
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-2xl font-black tracking-tight text-brand-text mb-6"
            >
              <span className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-base shadow-sm">
                I
              </span>
              <span className="font-sans">Identiqal</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-brand-text font-sans tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-brand-secondary mt-2 font-medium">
              Log in to your Identiqal account.
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
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 text-left"
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center space-x-2 text-brand-secondary hover:text-brand-text"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    rememberMe
                      ? "bg-primary border-primary"
                      : "border-[#E2E8F0]"
                  }`}
                >
                  {rememberMe && (
                    <Check size={10} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <span>Remember Me</span>
              </button>
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-4 mt-2 text-base font-bold rounded-full"
              isLoading={isLoading}
            >
              <span>Log in</span>
            </Button>
          </form>

          {/* Footer link */}
          <div className="mt-8 text-center text-sm text-brand-secondary pt-6 font-semibold">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-extrabold hover:underline"
            >
              Sign up
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
                  I
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Identiqal</h3>
          <p className="text-sm text-slate-500 mt-1 font-medium px-6 text-center">
            Digital Business Card
          </p>

          {/* QR Code section */}
          <div className="w-full px-8 mt-8 flex flex-col items-center">
            <div className="w-full aspect-square bg-white rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-center border border-slate-100 p-6 relative group overflow-hidden">
               <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <QRCodeSVG value="https://identiqal.vercel.app/" size={140} fgColor="#1e293b" className="z-10" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md z-20 border border-slate-50">
                  <span className="text-blue-600 font-black text-xl">I</span>
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


