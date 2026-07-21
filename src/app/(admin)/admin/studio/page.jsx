'use client';

import React from 'react';
import { motion } from 'framer-motion';
import HeaderPicker from '@/components/studio/HeaderPicker';
import ThemePicker from '@/components/studio/ThemePicker';
import ImageUploadPanel from '@/components/studio/ImageUploadPanel';
import ImageStylingPanel from '@/components/studio/ImageStylingPanel';
import FooterPicker from '@/components/studio/FooterPicker';
import TemplateSummary from '@/components/studio/TemplateSummary';
import PhonePreview from '@/components/builder/PhonePreview';

const steps = [
  { id: 'header', label: 'Header Layout' },
  { id: 'theme', label: 'Color Theme' },
  { id: 'image', label: 'Upload Image' },
  { id: 'styling', label: 'Image Styling' },
  { id: 'footer', label: 'Footer Preset' },
  { id: 'summary', label: 'Save Design' },
];

export default function DesignStudio() {
  const [activeStep, setActiveStep] = React.useState(0);

  const renderStep = () => {
    switch (steps[activeStep].id) {
      case 'header':
        return <HeaderPicker />;
      case 'theme':
        return <ThemePicker />;
      case 'image':
        return <ImageUploadPanel />;
      case 'styling':
        return <ImageStylingPanel />;
      case 'footer':
        return <FooterPicker />;
      case 'summary':
        return <TemplateSummary />;
      default:
        return null;
    }
  };

  const next = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };
  const back = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="w-full space-y-6 text-gray-900 dark:text-white transition-colors duration-200">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-gray-900 dark:text-white">Card Design Studio</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Step-by-step layout composer with immediate visual feedback</p>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl overflow-x-auto select-none">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;
          return (
            <button
              key={step.id}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : isCompleted
                  ? 'bg-blue-100/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200/50 dark:hover:bg-zinc-800'
                  : 'text-gray-500 dark:text-zinc-500 hover:text-gray-800 dark:hover:text-zinc-300'
              }`}
              onClick={() => setActiveStep(idx)}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive
                  ? 'bg-white text-blue-600'
                  : isCompleted
                  ? 'bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-650'
              }`}>
                {idx + 1}
              </div>
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Step Content Configuration Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden min-h-[500px]">
          
          <motion.div
            key={steps[activeStep].id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {renderStep()}
          </motion.div>

          {/* Stepper Actions footer */}
          <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200 dark:border-white/10">
            <button 
              onClick={back} 
              disabled={activeStep === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeStep === 0 
                  ? 'bg-gray-100 dark:bg-zinc-800/20 text-gray-400 dark:text-zinc-600 border-gray-200 dark:border-transparent cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 border-gray-200 dark:border-transparent'
              }`}
            >
              Back
            </button>
            <button 
              onClick={next} 
              disabled={activeStep === steps.length - 1}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStep === steps.length - 1
                  ? 'bg-gray-100 dark:bg-zinc-800/20 text-gray-400 dark:text-zinc-600 cursor-not-allowed font-medium'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10'
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Side: Beautiful Phone Mock Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-55 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-3xl p-6 relative overflow-hidden min-h-[500px]">
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[10px] uppercase tracking-wider text-gray-550 dark:text-zinc-500 font-bold bg-white dark:bg-zinc-900 border border-gray-250 dark:border-white/10 px-2.5 py-1 rounded-md">Live Preview</span>
          </div>

          <div className="w-full max-w-[360px] h-[650px] relative pointer-events-auto scale-95 origin-center">
            <PhonePreview />
          </div>
        </div>

      </div>

    </div>
  );
}
