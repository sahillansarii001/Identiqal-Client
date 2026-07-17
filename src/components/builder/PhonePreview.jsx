import React, { useState, useEffect } from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionRenderer } from './SectionRenderer';

const PreviewSection = ({ section, activeSectionId, setActiveSection }) => {
  const isActive = activeSectionId === section.sectionId;

  if (!section.isVisible) return null;

  return (
    <div
      onClick={() => setActiveSection(section.sectionId)}
      className={`relative rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
        isActive 
          ? 'ring-[3px] ring-primary ring-offset-2 scale-[1.01] shadow-xl z-10' 
          : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 opacity-95 hover:opacity-100 z-0'
      }`}
    >
      <div className="w-full relative pointer-events-none [&_*]:pointer-events-auto">
        <SectionRenderer section={section} previewMode={true} />
      </div>
      
      {/* Active overlay glow */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-primary/20 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]"></div>
      )}
    </div>
  );
};

export default function PhonePreview() {
  const { sections, activeSectionId, setActiveSection, setBlockPickerOpen, previewDevice, themeConfig } = useCardBuilderStore();
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      
      hours = hours % 12;
      hours = hours ? hours : 12; 
      
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timeString = `${hours}:${paddedMinutes}`;
      
      setCurrentTime((prev) => prev !== timeString ? timeString : prev);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isPhone = previewDevice === 'smartphone';
  const isTablet = previewDevice === 'tablet';
  const isDesktop = previewDevice === 'desktop';

  return (
    <div className={`flex-1 min-w-0 bg-gray-50/50 dark:!bg-transparent flex overflow-hidden relative h-[calc(100vh-4rem)] ${isPhone ? 'py-2 px-4' : 'p-4 sm:p-8 lg:p-12'}`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Responsive Preview Wrapper */}
      <motion.div 
        animate={{ 
          y: isPhone ? [0, -6, 0] : 0,
          width: isPhone ? 'auto' : '100%',
          height: '100%',
        }}
        transition={{ 
          ...(isPhone ? { y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } } : {}),
          width: { type: "spring", stiffness: 300, damping: 30 },
          height: { type: "spring", stiffness: 300, damping: 30 }
        }}
        className={`relative m-auto shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_30px_60px_-12px_rgba(0,0,0,0.15),0_18px_36px_-18px_rgba(0,0,0,0.1)] overflow-hidden transform flex-shrink-0 z-10 transition-all ${
          isPhone ? 'rounded-[3.2rem] border-[12px] border-gray-900 bg-gray-900' : 'rounded-2xl border border-gray-200 bg-white'
        }`}
        style={{
          maxWidth: isDesktop ? '100%' : isTablet ? 'min(768px, 75%)' : 'none',
          maxHeight: isPhone ? '900px' : '100%',
          aspectRatio: isPhone ? '1 / 2.11' : 'auto',
        }}
      >

        {/* Dynamic Island / Notch (Only for phone) */}
        {isPhone && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-900 rounded-3xl z-50 flex items-center justify-center shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-800 mr-4 shadow-inner"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40"></div>
          </div>
        )}

        {/* Status Bar Dummy (Only for phone) */}
        {isPhone && (
          <>
            <div className="absolute top-4 left-7 text-[11px] font-semibold z-50 text-gray-900">{currentTime}</div>
            <div className="absolute top-4 right-7 flex gap-1.5 z-50 items-center">
              <div className="w-4 h-2.5 border border-gray-900 rounded-[3px] p-[1px]"><div className="w-[80%] h-full bg-gray-900 rounded-[1px]"></div></div>
            </div>
          </>
        )}
        
        {/* Card Content Area */}
        <div 
          className={`w-full h-full overflow-y-auto no-scrollbar scroll-smooth relative ${isPhone ? 'pt-16 pb-12 rounded-[2.5rem]' : 'pt-8 pb-8'}`}
          style={{ 
            backgroundColor: themeConfig?.backgroundColor || '#f8f5f2',
            color: themeConfig?.darkMode ? '#ffffff' : '#212529',
            fontFamily: themeConfig?.fontFamily || 'Inter, sans-serif'
          }}
        >
          
          <AnimatePresence mode="popLayout">
            {sections.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center h-full text-center px-8 pb-10"
              >
                <div className="w-24 h-24 bg-white/50 backdrop-blur-sm rounded-full mb-6 shadow-sm flex items-center justify-center border border-white">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Blank Canvas</h3>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">Your digital business card is empty. Add blocks from the right panel to get started.</p>
                <button 
                  onClick={() => setBlockPickerOpen(true)}
                  className="w-full py-3.5 text-white rounded-2xl font-medium shadow-md transition-all active:scale-95"
                  style={{ backgroundColor: themeConfig?.primaryColor || '#000000' }}
                >
                  Add First Block
                </button>
              </motion.div>
            ) : (
              <div className="p-4 space-y-4">
                {sections.map((section) => (
                  <motion.div
                    key={section.sectionId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <PreviewSection 
                      section={section} 
                      activeSectionId={activeSectionId}
                      setActiveSection={setActiveSection}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
