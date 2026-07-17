'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore.js';
import axiosInstance from '@/services/axiosInstance.js';
import { Button } from '@/components/ui/Button.jsx';
import { Check, ArrowRight, SkipForward, Twitter, Instagram, Linkedin, Youtube, Globe } from 'lucide-react';
import { Input } from '@/components/ui/Input.jsx';

export default function OnboardingFlow() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // State for different steps
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [links, setLinks] = useState({});
  const [profile, setProfile] = useState({ name: user?.name || '', bio: '' });

  const handleNext = async (stepName, payload) => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/onboarding/update', { step: stepName, data: payload });
      setStep(step + 1);
    } catch (error) {
      console.error('Failed to update onboarding step', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setStep(step + 1);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/onboarding/complete');
      if (user) {
        setAuth(useAuthStore.getState().token, { ...user, onboardingCompleted: true });
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTopBar = () => {
    // Only show skip on certain steps
    const showSkip = step >= 2 && step <= 6;
    return (
      <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm z-50">
        <div className="flex items-center space-x-2 font-black tracking-tight text-[#1F1F1F]">
          <span className="w-8 h-8 rounded-lg bg-linear-to-tr from-[#5A3342] to-[#C89B5B] flex items-center justify-center text-white font-bold text-base shadow-sm">
            I
          </span>
          <span className="font-sans">Identiqal</span>
        </div>
        {showSkip && (
          <button 
            onClick={handleSkip}
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Skip <SkipForward size={16} className="ml-1" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6] relative overflow-hidden flex flex-col items-center justify-center py-20 px-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#5A3342]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#C89B5B]/5 blur-[100px]" />
      </div>

      {renderTopBar()}

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-[#5A3342]/5 border border-[#E9E2DC]">
        {/* Step 1: Subscription */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-[#1F1F1F] text-center mb-2">Choose your plan</h2>
            <p className="text-gray-500 text-center mb-8">You can always upgrade later.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setSelectedPlan('free')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${selectedPlan === 'free' ? 'border-[#5A3342] bg-[#5A3342]/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <h3 className="text-xl font-bold mb-2">Free Plan</h3>
                <p className="text-3xl font-black mb-4">$0 <span className="text-sm text-gray-500 font-normal">/mo</span></p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center"><Check size={16} className="mr-2 text-green-500" /> Basic digital card</li>
                  <li className="flex items-center"><Check size={16} className="mr-2 text-green-500" /> Standard themes</li>
                  <li className="flex items-center"><Check size={16} className="mr-2 text-green-500" /> 5 platform links</li>
                </ul>
              </button>
              <button 
                onClick={() => setSelectedPlan('pro')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${selectedPlan === 'pro' ? 'border-[#5A3342] bg-[#5A3342]/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#5A3342] to-[#C89B5B]">Pro Plan</h3>
                <p className="text-3xl font-black mb-4">$5 <span className="text-sm text-gray-500 font-normal">/mo</span></p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center"><Check size={16} className="mr-2 text-green-500" /> Advanced analytics</li>
                  <li className="flex items-center"><Check size={16} className="mr-2 text-green-500" /> Premium themes</li>
                  <li className="flex items-center"><Check size={16} className="mr-2 text-green-500" /> Unlimited links</li>
                </ul>
              </button>
            </div>
            <div className="mt-8 flex justify-end">
              <Button 
                disabled={!selectedPlan || isLoading}
                onClick={() => handleNext('subscription', { plan: selectedPlan })}
                className="w-full sm:w-auto px-8"
                isLoading={isLoading}
              >
                Continue <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-[#1F1F1F] text-center mb-2">What's your goal?</h2>
            <p className="text-gray-500 text-center mb-8">How are you planning to use Identiqal?</p>
            <div className="space-y-4">
              {['Personal', 'Creator', 'Business'].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal.toLowerCase())}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedGoal === goal.toLowerCase() ? 'border-[#5A3342] bg-[#5A3342]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-bold text-lg">{goal}</h4>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button 
                disabled={!selectedGoal || isLoading}
                onClick={() => handleNext('goal', { goal: selectedGoal })}
                className="w-full sm:w-auto px-8"
                isLoading={isLoading}
              >
                Continue <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Theme */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-[#1F1F1F] text-center mb-2">Pick a starting theme</h2>
            <p className="text-gray-500 text-center mb-8">Don't worry, you can change this anytime.</p>
            <div className="grid grid-cols-2 gap-4">
              {['Minimal', 'Dark Mode', 'Colorful', 'Professional'].map((themeName, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTheme(`theme_${idx}`)}
                  className={`relative overflow-hidden rounded-2xl aspect-[9/16] border-4 transition-all ${
                    selectedTheme === `theme_${idx}` ? 'border-[#5A3342]' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4">
                     <div className={`w-16 h-16 rounded-full mb-4 ${idx === 1 ? 'bg-gray-800' : 'bg-white shadow'}`}></div>
                     <div className={`w-3/4 h-4 rounded-full mb-2 ${idx === 1 ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                     <div className={`w-1/2 h-4 rounded-full ${idx === 1 ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  </div>
                  {/* Theme label */}
                  <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur p-2 text-center text-sm font-bold">
                    {themeName}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button 
                disabled={!selectedTheme || isLoading}
                onClick={() => handleNext('theme', { themeId: selectedTheme })}
                className="w-full sm:w-auto px-8"
                isLoading={isLoading}
              >
                Continue <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Platform Selection */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-[#1F1F1F] text-center mb-2">Where are you available?</h2>
            <p className="text-gray-500 text-center mb-8">Select the platforms you want to link.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
                { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
                { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
                { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
                { name: 'Website', icon: Globe, color: 'text-gray-600' }
              ].map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.name);
                return (
                  <button
                    key={platform.name}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.name));
                      } else {
                        setSelectedPlatforms([...selectedPlatforms, platform.name]);
                      }
                    }}
                    className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-[#5A3342] bg-[#5A3342]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <platform.icon size={24} className={`mr-3 ${platform.color}`} />
                    <span className="font-bold">{platform.name}</span>
                  </button>
                )
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <Button 
                disabled={selectedPlatforms.length === 0 || isLoading}
                onClick={() => handleNext('platforms', { platforms: selectedPlatforms })}
                className="w-full sm:w-auto px-8"
                isLoading={isLoading}
              >
                Continue <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Links */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-[#1F1F1F] text-center mb-2">Add your links</h2>
            <p className="text-gray-500 text-center mb-8">Enter the URLs for the platforms you selected.</p>
            <div className="space-y-4">
              {selectedPlatforms.map((platform) => (
                <div key={platform}>
                  <Input
                    label={platform}
                    placeholder={`https://${platform.toLowerCase()}.com/username`}
                    value={links[platform] || ''}
                    onChange={(e) => setLinks({...links, [platform]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={() => {
                  const linksData = selectedPlatforms.map(p => ({ platform: p, url: links[p] || '' }));
                  handleNext('links', { links: linksData });
                }}
                className="w-full sm:w-auto px-8"
                isLoading={isLoading}
              >
                Continue <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Profile */}
        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-[#1F1F1F] text-center mb-2">Complete your profile</h2>
            <p className="text-gray-500 text-center mb-8">Tell your visitors a little about yourself.</p>
            <div className="space-y-4 text-left">
              <Input
                label="Display Name"
                placeholder="Jane Doe"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#1F1F1F]">Short Bio</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-[#E9E2DC] text-sm focus:ring-2 focus:ring-[#5A3342]/20 focus:border-[#5A3342] transition-colors resize-none"
                  rows={4}
                  placeholder="I am a creator building awesome things!"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={() => handleNext('profile', profile)}
                className="w-full sm:w-auto px-8"
                isLoading={isLoading}
              >
                Continue <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 7: Completed */}
        {step === 7 && (
          <div className="animate-in zoom-in-95 duration-500 text-center py-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
              <Check size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#1F1F1F] mb-4">You're all set!</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Your Identiqal page is ready. You can now access your dashboard to view analytics, add more content, and customize your page further.
            </p>
            <Button 
              onClick={handleComplete}
              className="px-12 py-4 text-lg font-bold rounded-full"
              isLoading={isLoading}
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
