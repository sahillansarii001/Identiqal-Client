'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { buildLeadFormSchema } from '@/validators/leadForm.validator.js';
import { leadService } from '@/services/leadService.js';
import { Button } from '@/components/ui/Button.jsx';
import { Input } from '@/components/ui/Input.jsx';
import { CheckSquare } from 'lucide-react';

// Helper functions for layout engine
function getHeaderHeight(displayPreset) {
  if (displayPreset?.headerHeight) return displayPreset.headerHeight;
  return '200px';
}

function getAvatarShape(profilePhotoStyle) {
  const map = {
    'Circle': '50%',
    'Rounded Square': '20%',
    'Square': '0px',
    'Glass Border': '50%',
    'Gradient Border': '50%',
    'Shadow': '50%',
    'No Border': '50%',
  };
  return map[profilePhotoStyle] || '50%';
}

function getAvatarBorderStyle(profilePhotoStyle, colorTheme) {
  if (profilePhotoStyle === 'Gradient Border') {
    return { border: '3px solid transparent', backgroundClip: 'padding-box', outline: `3px solid ${colorTheme?.accent || colorTheme?.primary || '#000'}` };
  }
  if (profilePhotoStyle === 'Glass Border') {
    return { border: '3px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' };
  }
  if (profilePhotoStyle === 'Shadow') {
    return { border: '3px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' };
  }
  if (profilePhotoStyle === 'No Border') {
    return { border: 'none' };
  }
  return { border: `3px solid ${colorTheme?.background || '#fff'}` };
}

function getProfilePosition(position) {
  const map = {
    'Left': 'items-start text-left',
    'Center': 'items-center text-center',
    'Right': 'items-end text-right',
    'Floating': 'items-center text-center',
    'Overlapping Header': 'items-center text-center',
  };
  return map[position] || 'items-center text-center';
}

export const SectionRenderer = ({ section, theme = {}, displayPreset = {}, colorTheme = {}, previewMode = false }) => {
  const { type, data = {}, isVisible } = section;
  
  // Guard against null props explicitly passed down
  const preset = displayPreset || {};
  const cTheme = colorTheme || {};

  const baseColors = theme.colors || {};
  const colors = { ...baseColors };
  const font = theme.font || {};

  // Apply layout theme overrides
  if (preset?.name === 'Luxury') {
    colors.background = '#121212';
    colors.text = '#F3F4F6';
    colors.primary = '#D4A45B'; // Gold accent
    colors.accent = '#D4A45B';
  } else if (preset?.name === 'Neon') {
    colors.background = '#08070A';
    colors.text = '#E2E8F0';
    colors.primary = '#D946EF'; // Neon Magenta
    colors.accent = '#06B6D4';  // Neon Cyan
  }
  
  // Use displayPreset for layout config, fallback to defaults
  const buttonStyle = preset.buttonStyle || 'Rounded';
  const dividerStyle = preset.dividerStyle || 'Subtle';
  const typography = preset.typography || 'Modern Sans';
  const sectionSpacing = preset.sectionSpacing || 'Normal';

  if (!isVisible && !previewMode) return null;

  // Apply button styling
  const buttonRadiusClass = {
    'Rounded': 'rounded-xl',
    'Rectangular': 'rounded-none',
    'Pill': 'rounded-full px-6',
    'Outline': 'rounded-xl border border-current bg-transparent hover:bg-slate-100/10',
    'Ghost': 'rounded-xl bg-transparent hover:bg-slate-100/10 shadow-none',
  }[buttonStyle] || 'rounded-xl';
  
  // Apply Typography
  const headingFont = {
    'Modern Sans': 'Inter, sans-serif',
    'Elegant Serif': '"Playfair Display", serif',
    'Monospace': 'monospace',
    'Display': '"Outfit", sans-serif',
  }[typography] || 'inherit';

  switch (type) {
    case 'about':
      const hasHeader = !!data.headerUrl;
      const zoom = data.headerZoom ? data.headerZoom / 100 : 1;
      const panX = data.headerPanX || 0;
      const panY = data.headerPanY || 0;
      const blur = data.headerBlur || 0;
      const brightness = data.headerBrightness ? data.headerBrightness / 100 : 1;
      const overlay = data.headerOverlay ? data.headerOverlay / 100 : 0;
      
      const headerHeight = preset?.name === 'Minimal' ? '80px' : getHeaderHeight(preset);
      const avatarRadius = getAvatarShape(preset?.profilePhotoStyle);
      const avatarStyle = getAvatarBorderStyle(preset?.profilePhotoStyle, cTheme);
      const profilePos = getProfilePosition(preset?.profilePhotoPosition);
      const isOverlapping = preset?.profilePhotoPosition === 'Overlapping Header';
      const headerStyle = preset?.headerStyle || 'Solid Color';

      let bgColor = colors.primary || '#5A3045';
      let bgImage = 'none';

      if (preset?.name === 'Blend') {
        bgColor = 'transparent';
        bgImage = `linear-gradient(to bottom, ${colors.primary || '#5A3045'}, ${colors.background || '#ffffff'})`;
      } else if (preset?.name === 'Luxury') {
        bgColor = 'transparent';
        bgImage = 'linear-gradient(135deg, #1A1A1A, #2D251E, #1A1A1A)';
      } else if (preset?.name === 'Neon') {
        bgColor = 'transparent';
        bgImage = 'linear-gradient(135deg, #0D0B14, #1D1530)';
      } else if (headerStyle === 'Gradient') {
        bgColor = 'transparent';
        bgImage = `linear-gradient(135deg, ${colors.primary || '#5A3045'}, ${colors.accent || '#D4A45B'})`;
      }

      const showHeaderImg = hasHeader && preset?.name !== 'Minimal';
      const isSleek = preset?.name === 'Sleek';

      return (
        <div className="pb-10" style={{ color: colors.text || '#212529' }}>
          {/* Header area */}
          <div 
            className={`${isSleek ? 'mx-4 mt-4 rounded-2xl shadow-lg border border-white/10 overflow-hidden' : 'w-full'} relative overflow-visible z-0`} 
            style={{ 
              height: headerHeight, 
              backgroundColor: bgColor,
              backgroundImage: bgImage,
              backdropFilter: isSleek ? 'blur(8px)' : 'none'
            }}
          >
            {showHeaderImg && (
              <img
                src={data.headerUrl}
                alt="Header"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: `scale(${zoom}) translate(${panX}%, ${panY}%)`,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
              />
            )}
            {/* Overlay */}
            <div
              className="absolute inset-0 transition-opacity"
              style={{ backgroundColor: colors.background, opacity: overlay }}
            />
            
            {/* SVG Overlays based on headerStyle */}
            {headerStyle === 'Curved Wave' && (
              <svg className="absolute bottom-0 w-full text-white" style={{ fill: colors.background || '#ffffff' }} viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
              </svg>
            )}
            {headerStyle === 'Diagonal Split' && (
              <svg className="absolute bottom-0 w-full text-white" style={{ fill: colors.background || '#ffffff' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon points="0,100 100,0 100,100"></polygon>
              </svg>
            )}
            {headerStyle === 'Organic Blob' && (
              <svg className="absolute bottom-0 w-full text-white" style={{ fill: colors.background || '#ffffff', transform: 'translateY(1px)' }} viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,22,150,75,321.39,56.44Z"></path>
              </svg>
            )}

            {/* Overlapping avatar */}
            {isOverlapping && data.avatarUrl && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-10 shadow-lg">
                <img
                  src={data.avatarUrl}
                  alt={data.headline}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                  style={{ borderRadius: avatarRadius, ...avatarStyle }}
                />
              </div>
            )}
          </div>

          {/* Profile content */}
          <div className={`px-6 sm:px-10 space-y-4 flex flex-col ${profilePos} ${isOverlapping ? 'pt-14 sm:pt-16' : 'pt-8'} relative z-10`}>
            {!isOverlapping && data.avatarUrl && (
              <img
                src={data.avatarUrl}
                alt={data.headline}
                className={`w-20 h-20 sm:w-24 sm:h-24 object-cover ${preset?.profilePhotoPosition === 'Floating' ? 'shadow-2xl -mt-16 sm:-mt-20 relative z-20' : ''}`}
                style={{ borderRadius: avatarRadius, ...avatarStyle }}
              />
            )}
            <div className="space-y-2">
              <h3
                className="text-lg sm:text-2xl font-black tracking-tight"
                style={{ fontFamily: headingFont, color: colors.primary || '#000000' }}
              >
                {data.headline || 'Profile Headline'}
              </h3>
              <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto" style={{ fontFamily: font.body || 'inherit' }}>
                {data.bio || 'Provide a short biography detailing your role and networking background.'}
              </p>
            </div>
          </div>
        </div>
      );

    case 'links':
      const links = data.links || [];
      const linkSpacingClass = {
        'Compact': 'py-4',
        'Normal': 'py-8',
        'Spacious': 'py-12'
      }[sectionSpacing] || 'py-8';

      return (
        <div className={`space-y-3 w-full px-6 sm:px-10 ${linkSpacingClass}`}>
          {links.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No links added yet.</p>
          ) : (
            links.map((link, idx) => (
              <a
                key={idx}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between p-4 sm:p-5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-all duration-300 ${buttonRadiusClass}`}
                style={{ color: colors.primary || '#000000', fontFamily: font.body || 'inherit' }}
              >
                <div className="w-10 h-10 rounded-full bg-[#ffffff] dark:bg-black/20 shadow-sm flex items-center justify-center flex-shrink-0" style={{ color: colors.accent || colors.primary }}>
                  <span className="text-lg">🔗</span>
                </div>
                <span className="flex-1 px-4 font-bold text-sm sm:text-base tracking-wide">{link.label}</span>
                <span className="text-xs opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
              </a>
            ))
          )}
        </div>
      );

    case 'testimonials':
      const testimonialSpacing = { 'Compact': 'py-6', 'Normal': 'py-8', 'Spacious': 'py-12' }[sectionSpacing] || 'py-8';
      const borderClass = dividerStyle === 'None' ? 'border-transparent' : dividerStyle === 'Dashed' ? 'border-dashed border-t' : 'border-t';
      
      return (
        <div 
          className={`px-6 sm:px-10 space-y-5 ${testimonialSpacing}`}
          style={{ color: colors.text || '#212529', fontFamily: font.body || 'inherit' }}
        >
          <div className="text-2xl" style={{ color: colors.accent || '#0d6efd' }}>“</div>
          <p className="text-xs italic leading-relaxed -mt-2">
            {data.quote || 'No testimonial text provided yet.'}
          </p>
          <div className={`flex items-center space-x-3 pt-3 ${borderClass}`} style={{ borderColor: `${colors.secondary}40` }}>
            {data.authorAvatarUrl && (
              <img 
                src={data.authorAvatarUrl} 
                alt={data.authorName} 
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <h5 className="text-xs font-bold" style={{ color: colors.primary || '#000000' }}>
                {data.authorName || 'Author Name'}
              </h5>
              <p className="text-[10px] opacity-60">{data.authorTitle || 'Title / Organization'}</p>
            </div>
          </div>
        </div>
      );

    case 'form':
      return (
        <FormSectionRenderer 
          section={section} 
          theme={theme} 
          buttonRadiusClass={buttonRadiusClass} 
          previewMode={previewMode}
        />
      );

    case 'gallery':
      const images = data.images || [];
      return (
        <div 
          className="px-6 py-8 sm:px-10 space-y-6 w-full"
          style={{ color: colors.text || '#212529' }}
        >
          {data.title && (
            <h4 
              className="text-xs font-bold uppercase tracking-wider text-center"
              style={{ color: colors.primary || '#000000' }}
            >
              {data.title}
            </h4>
          )}
          {images.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No images added yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="space-y-1.5">
                  {img.url ? (
                    <img 
                      src={img.url} 
                      alt={img.caption || 'Gallery Image'} 
                      className="w-full aspect-square object-cover rounded-xl border"
                      style={{ borderColor: colors.secondary || '#6c757d' }}
                    />
                  ) : (
                    <div 
                      className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl border flex items-center justify-center text-gray-300"
                      style={{ borderColor: colors.secondary || '#6c757d' }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </div>
                  )}
                  {img.caption && (
                    <p className="text-[10px] text-center opacity-80" style={{ color: colors.text }}>
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

const FormSectionRenderer = ({ section, theme, buttonRadiusClass, previewMode }) => {
  const { data = {}, sectionId } = section;
  const { colors = {}, font = {} } = theme;
  const fields = data.fields || [];
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dynamic Yup schema
  const schema = React.useMemo(() => buildLeadFormSchema(fields), [fields]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData) => {
    if (previewMode) {
      alert('Form submission simulated successfully!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      // Find card ID
      const response = await leadService.submitLead(section.cardId || sectionId, {
        name: formData.name || formData.FullName || 'Lead Contact',
        email: formData.email || formData.EmailAddress || 'email@example.com',
        phone: formData.phone || formData.PhoneNumber || '',
        message: Object.entries(formData)
          .filter(([key]) => !['name', 'email', 'phone', 'consentGiven'].includes(key))
          .map(([key, val]) => `${key}: ${val}`)
          .join('\n'),
        consentGiven: formData.consentGiven,
        source: 'form',
      });

      if (response.success) {
        setSuccess(true);
        reset();
      } else {
        setErrorMsg(response.message || 'Failed to submit form');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="px-6 py-8 sm:px-10 space-y-6"
      style={{ color: colors.text || '#212529' }}
    >
      <h4 
        className="text-sm font-bold"
        style={{ fontFamily: font.heading || 'inherit', color: colors.primary || '#000000' }}
      >
        {data.title || 'Contact Me'}
      </h4>

      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-xs flex items-center space-x-1.5">
          <CheckSquare size={14} />
          <span>Inquiry submitted successfully!</span>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-red-500">{errorMsg}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {fields.map((field) => (
          <div key={field.fieldId} className="flex flex-col space-y-1">
            <label className="text-[11px] font-bold uppercase opacity-60 tracking-wider mb-1" style={{ color: colors.text }}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] rounded-[18px] text-sm focus:outline-none focus:ring-2 focus:bg-transparent transition-all"
                rows={3}
                style={{ 
                  color: colors.primary || '#000000',
                  fontFamily: font.body || 'inherit'
                }}
                {...register(field.fieldId)}
              />
            ) : (
              <input
                type={field.type}
                className="w-full px-4 py-3 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] rounded-[18px] text-sm focus:outline-none focus:ring-2 focus:bg-transparent transition-all"
                style={{ 
                  color: colors.primary || '#000000',
                  fontFamily: font.body || 'inherit'
                }}
                {...register(field.fieldId)}
              />
            )}
            {errors[field.fieldId] && (
              <span className="text-[10px] text-red-500">{errors[field.fieldId]?.message}</span>
            )}
          </div>
        ))}

        {/* Consent Checkbox */}
        <div className="flex items-start space-x-2 pt-2">
          <input
            type="checkbox"
            id={`consent-${sectionId}`}
            className="mt-1"
            {...register('consentGiven')}
          />
          <label htmlFor={`consent-${sectionId}`} className="text-[9px] opacity-80 leading-snug">
            I consent to sharing my submitted details for follow-up communications.
          </label>
        </div>
        {errors.consentGiven && (
          <p className="text-[10px] text-red-500">{errors.consentGiven?.message}</p>
        )}

        <Button 
          type="submit" 
          className={`w-full py-2.5 text-xs font-semibold ${buttonRadiusClass}`}
          isLoading={isSubmitting}
          style={{ 
            background: `linear-gradient(to right, ${colors.accent || '#0d6efd'}, ${colors.primary || '#000000'})`,
            color: '#ffffff'
          }}
        >
          {data.submitButtonText || 'Send Message'}
        </Button>
      </form>
    </div>
  );
};
