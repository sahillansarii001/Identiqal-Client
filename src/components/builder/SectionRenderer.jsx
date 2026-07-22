'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { buildLeadFormSchema } from '@/validators/leadForm.validator.js';
import { leadService } from '@/services/leadService.js';
import { Button } from '@/components/ui/Button.jsx';
import { Input } from '@/components/ui/Input.jsx';
import { CheckSquare } from 'lucide-react';
import { useCardBuilderStore } from '@/store/cardBuilderStore';

// Helper functions for layout engine
function getHeaderHeight(displayPreset) {
  if (displayPreset?.headerHeight) return displayPreset.headerHeight;
  return '200px';
}

function getAvatarShapeStyle(shape) {
  const map = {
    'circle':  { borderRadius: '50%' },
    'rounded': { borderRadius: '20%' },
    'square':  { borderRadius: '0' },
    'capsule': { borderRadius: '9999px' },
    'hexagon': { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
    'diamond': { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
    'blob':    { clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' },
    'star':    { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
    'shield':  { clipPath: 'polygon(50% 0%, 100% 25%, 100% 70%, 50% 100%, 0% 70%, 0% 25%)' },
    'organic': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
    // Legacy preset names
    'Circle':          { borderRadius: '50%' },
    'Rounded Square':  { borderRadius: '20%' },
    'Square':          { borderRadius: '0' },
    'Glass Border':    { borderRadius: '50%' },
    'Gradient Border': { borderRadius: '50%' },
    'Shadow':          { borderRadius: '50%' },
    'No Border':       { borderRadius: '50%' },
  };
  return map[shape] || { borderRadius: '50%' };
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
  } else if (preset?.name === 'Aurora') {
    colors.background = '#ffffff';
    colors.text = '#0F172A';
    colors.primary = '#2563EB'; // Royal Blue
    colors.accent = '#4F46E5';  // Indigo
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

  // Setup drag reposition refs and hooks
  const store = useCardBuilderStore();
  const containerRef = React.useRef(null);
  const dragStartRef = React.useRef(null);
  const [imgRatio, setImgRatio] = React.useState(null);
  const layerRef = React.useRef(null);
  const [showVGuide, setShowVGuide] = React.useState(false);
  const [showHGuide, setShowHGuide] = React.useState(false);

  const getDragBounds = (containerWidth, containerHeight, scaleVal, headerStyle) => {
    let maxDragX = Math.max(0, (containerWidth * scaleVal - containerWidth) / 2);
    let maxDragY = Math.max(0, (containerHeight * scaleVal - containerHeight) / 2);

    if (imgRatio) {
      const containerRatio = containerWidth / containerHeight;
      if (imgRatio > containerRatio) {
        // Image is wider than container (relative to height)
        const renderedWidth = containerHeight * imgRatio;
        maxDragX = Math.max(0, (renderedWidth * scaleVal - containerWidth) / 2);
        maxDragY = Math.max(0, (containerHeight * scaleVal - containerHeight) / 2);
      } else {
        // Image is taller than container (relative to width)
        const renderedHeight = containerWidth / imgRatio;
        maxDragX = Math.max(0, (containerWidth * scaleVal - containerWidth) / 2);
        maxDragY = Math.max(0, (renderedHeight * scaleVal - containerHeight) / 2);
      }
    }

    if (headerStyle === 'Diagonal Split') {
      maxDragX = Math.max(maxDragX, containerWidth * 0.4);
    }

    return { maxDragX, maxDragY };
  };

  const handleStartDrag = (e) => {
    if (!previewMode || !store || store.cardId !== section.cardId) return;
    // Allow dragging unless admin preset disables it
    const activePreset = store.displayPreset || displayPreset || {};
    if (activePreset.allowDrag === false) return;

    if (store.activeSectionId !== section.sectionId) {
      store.setActiveSection(section.sectionId);
    }

    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initX: store.imagePositionX || 0,
      initY: store.imagePositionY || 0,
    };

    const handleMoveDrag = (moveEvent) => {
      if (!dragStartRef.current) return;
      const mX = moveEvent.clientX !== undefined ? moveEvent.clientX : (moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientX : 0);
      const mY = moveEvent.clientY !== undefined ? moveEvent.clientY : (moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientY : 0);

      const dx = mX - dragStartRef.current.startX;
      const dy = mY - dragStartRef.current.startY;

      const nextX = dragStartRef.current.initX + dx;
      const nextY = dragStartRef.current.initY + dy;

      let clampedX = nextX;
      let clampedY = nextY;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        const scaleVal = (store.imageScale || 100) / 100;

        const headerStyle = activePreset.headerStyle || 'Solid Color';
        const { maxDragX, maxDragY } = getDragBounds(containerWidth, containerHeight, scaleVal, headerStyle);

        clampedX = Math.max(-maxDragX, Math.min(maxDragX, nextX));
        clampedY = Math.max(-maxDragY, Math.min(maxDragY, nextY));
      }

      store.updateHeaderImageRealTime({
        imagePositionX: Math.round(clampedX),
        imagePositionY: Math.round(clampedY),
      });
    };

    const handleEndDrag = () => {
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMoveDrag);
      window.removeEventListener('mouseup', handleEndDrag);
      window.removeEventListener('touchmove', handleMoveDrag);
      window.removeEventListener('touchend', handleEndDrag);

      // Push final result to history with current fresh values
      const currentStoreState = useCardBuilderStore.getState();
      store.updateHeaderImage({
        imagePositionX: currentStoreState.imagePositionX,
        imagePositionY: currentStoreState.imagePositionY,
      });
    };

    window.addEventListener('mousemove', handleMoveDrag);
    window.addEventListener('mouseup', handleEndDrag);
    window.addEventListener('touchmove', handleMoveDrag, { passive: true });
    window.addEventListener('touchend', handleEndDrag);
  };

  const handleStartDragFree = (e) => {
    if (!previewMode || !store || store.cardId !== section.cardId) return;

    if (store.activeSectionId !== section.sectionId) {
      store.setActiveSection(section.sectionId);
    }

    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    const initX = store.imagePositionX !== undefined ? store.imagePositionX : 0;
    const initY = store.imagePositionY !== undefined ? store.imagePositionY : 0;
    const size = store.containerSize || 120;

    const parentEl = containerRef.current;
    if (!parentEl) return;
    const parentRect = parentEl.getBoundingClientRect();
    const parentW = parentRect.width;

    const handleMoveDragFree = (moveEvent) => {
      const mX = moveEvent.clientX !== undefined ? moveEvent.clientX : (moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientX : 0);
      const mY = moveEvent.clientY !== undefined ? moveEvent.clientY : (moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientY : 0);

      const dx = mX - clientX;
      const dy = mY - clientY;

      let nextX = initX + dx;
      let nextY = initY + dy;

      const threshold = 10;
      let snappedV = false;
      let snappedH = false;

      const cardCenter = parentW / 2;
      const containerCenter = nextX + size / 2;
      if (Math.abs(containerCenter - cardCenter) < threshold) {
        nextX = cardCenter - size / 2;
        snappedV = true;
      }

      const activePreset = store.displayPreset || displayPreset || {};
      const hHeight = activePreset.name === 'Minimal' ? 80 : parseFloat(getHeaderHeight(activePreset));
      const headerCenter = hHeight / 2;
      const containerMiddle = nextY + size / 2;
      if (Math.abs(containerMiddle - headerCenter) < threshold) {
        nextY = headerCenter - size / 2;
        snappedH = true;
      }

      setShowVGuide(snappedV);
      setShowHGuide(snappedH);

      store.updateHeaderImageRealTime({
        imagePositionX: Math.round(nextX),
        imagePositionY: Math.round(nextY),
      });
    };

    const handleEndDragFree = () => {
      window.removeEventListener('mousemove', handleMoveDragFree);
      window.removeEventListener('mouseup', handleEndDragFree);
      window.removeEventListener('touchmove', handleMoveDragFree);
      window.removeEventListener('touchend', handleEndDragFree);

      setShowVGuide(false);
      setShowHGuide(false);

      const currentStoreState = useCardBuilderStore.getState();
      store.updateHeaderImage({
        imagePositionX: currentStoreState.imagePositionX,
        imagePositionY: currentStoreState.imagePositionY,
      });
    };

    window.addEventListener('mousemove', handleMoveDragFree);
    window.addEventListener('mouseup', handleEndDragFree);
    window.addEventListener('touchmove', handleMoveDragFree, { passive: true });
    window.addEventListener('touchend', handleEndDragFree);
  };

  const handleStartResize = (e, corner) => {
    e.stopPropagation();
    e.preventDefault();

    if (!previewMode || !store || store.cardId !== section.cardId) return;

    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    const initSize = store.containerSize !== undefined ? store.containerSize : 120;
    const initX = store.imagePositionX !== undefined ? store.imagePositionX : 0;
    const initY = store.imagePositionY !== undefined ? store.imagePositionY : 0;

    const handleMoveResize = (moveEvent) => {
      const mX = moveEvent.clientX !== undefined ? moveEvent.clientX : (moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientX : 0);
      const mY = moveEvent.clientY !== undefined ? moveEvent.clientY : (moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientY : 0);

      const dx = mX - clientX;
      const dy = mY - clientY;

      let newSize = initSize;
      let newX = initX;
      let newY = initY;

      if (corner === 'bottom-right') {
        newSize = Math.max(40, initSize + dx);
      } else if (corner === 'bottom-left') {
        newSize = Math.max(40, initSize - dx);
        newX = initX + (initSize - newSize);
      } else if (corner === 'top-right') {
        newSize = Math.max(40, initSize + dx);
        newY = initY - (newSize - initSize);
      } else if (corner === 'top-left') {
        newSize = Math.max(40, initSize - dx);
        newX = initX + (initSize - newSize);
        newY = initY + (initSize - newSize);
      }

      store.updateHeaderImageRealTime({
        containerSize: Math.round(newSize),
        imagePositionX: Math.round(newX),
        imagePositionY: Math.round(newY),
      });
    };

    const handleEndResize = () => {
      window.removeEventListener('mousemove', handleMoveResize);
      window.removeEventListener('mouseup', handleEndResize);
      window.removeEventListener('touchmove', handleMoveResize);
      window.removeEventListener('touchend', handleEndResize);

      const currentStoreState = useCardBuilderStore.getState();
      store.updateHeaderImage({
        containerSize: currentStoreState.containerSize,
        imagePositionX: currentStoreState.imagePositionX,
        imagePositionY: currentStoreState.imagePositionY,
      });
    };

    window.addEventListener('mousemove', handleMoveResize);
    window.addEventListener('mouseup', handleEndResize);
    window.addEventListener('touchmove', handleMoveResize, { passive: true });
    window.addEventListener('touchend', handleEndResize);
  };

  const handleStartRotate = (e, containerRef) => {
    e.stopPropagation();
    e.preventDefault();

    if (!previewMode || !store || store.cardId !== section.cardId) return;

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMoveRotate = (moveEvent) => {
      const mX = moveEvent.clientX !== undefined ? moveEvent.clientX : (moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientX : 0);
      const mY = moveEvent.clientY !== undefined ? moveEvent.clientY : (moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0].clientY : 0);

      const angleRad = Math.atan2(mY - centerY, mX - centerX);
      let angleDeg = Math.round(angleRad * (180 / Math.PI)) + 90;
      if (angleDeg < 0) angleDeg += 360;
      angleDeg = angleDeg % 360;

      if (moveEvent.shiftKey) {
        angleDeg = Math.round(angleDeg / 15) * 15;
      }

      store.updateHeaderImageRealTime({ imageRotation: angleDeg });
    };

    const handleEndRotate = () => {
      window.removeEventListener('mousemove', handleMoveRotate);
      window.removeEventListener('mouseup', handleEndRotate);
      window.removeEventListener('touchmove', handleMoveRotate);
      window.removeEventListener('touchend', handleEndRotate);

      const currentStoreState = useCardBuilderStore.getState();
      store.updateHeaderImage({ imageRotation: currentStoreState.imageRotation });
    };

    window.addEventListener('mousemove', handleMoveRotate);
    window.addEventListener('mouseup', handleEndRotate);
    window.addEventListener('touchmove', handleMoveRotate, { passive: true });
    window.addEventListener('touchend', handleEndRotate);
  };

  switch (type) {
    case 'about': {
      const storeActive = previewMode && store?.cardId === section.cardId;

      // ── Resolve image values (store wins in builder; section props elsewhere) ──
      const currentImageUrl = storeActive
        ? store.imageUrl
        : (section.imageUrl || '');

      const currentIsVideo = storeActive
        ? store.isVideo
        : (section.isVideo || false);

      const currentImageScale = storeActive
        ? store.imageScale
        : (section.imageScale !== undefined ? section.imageScale : 100);

      const currentImagePositionX = storeActive
        ? store.imagePositionX
        : (section.imagePositionX !== undefined ? section.imagePositionX : 0);

      const currentImagePositionY = storeActive
        ? store.imagePositionY
        : (section.imagePositionY !== undefined ? section.imagePositionY : 0);

      const currentImageOpacity = storeActive
        ? (store.imageOpacity !== undefined ? store.imageOpacity : 80)
        : (section.imageOpacity !== undefined ? section.imageOpacity : 80);

      const currentOverlayType = storeActive
        ? (store.overlayType || 'None')
        : (section.overlayType || 'None');

      const currentImageRotation = storeActive
        ? (store.imageRotation || 0)
        : (section.imageRotation || 0);

      const currentImagePlacement = storeActive
        ? (store.imagePlacement || 'Inside Header')
        : (section.imagePlacement || 'Inside Header');

      const currentContainerStyle = storeActive
        ? (store.containerStyle || 'None')
        : (section.containerStyle || 'None');

      const currentContainerSize = storeActive
        ? (store.containerSize || 100)
        : (section.containerSize || 100);

      const currentContainerBorder = storeActive
        ? (store.containerBorder || false)
        : (section.containerBorder || false);

      const currentContainerShadow = storeActive
        ? (store.containerShadow || false)
        : (section.containerShadow || false);

      const currentContainerPadding = storeActive
        ? (store.containerPadding || 0)
        : (section.containerPadding || 0);

      const currentImageFit = storeActive
        ? (store.imageFit || 'Cover')
        : (section.imageFit || 'Cover');

      const currentImageBlur = storeActive
        ? (store.imageBlur || 0)
        : (section.imageBlur || 0);

      const currentImageBrightness = storeActive
        ? (store.imageBrightness || 100)
        : (section.imageBrightness || 100);

      const currentImageContrast = storeActive
        ? (store.imageContrast || 100)
        : (section.imageContrast || 100);

      const currentImageSaturation = storeActive
        ? (store.imageSaturation || 100)
        : (section.imageSaturation || 100);

      const currentAvatarUrl = storeActive
        ? store.avatarUrl
        : (section.data?.avatarUrl || '');

      const currentAvatarShape = storeActive
        ? (store.avatarShape || 'circle')
        : (section.data?.avatarShape || 'circle');

      const currentAvatarScale = storeActive
        ? (store.avatarScale || 100)
        : (section.data?.avatarScale || 100);

      const currentAvatarBorderWidth = storeActive
        ? (store.avatarBorderWidth !== undefined ? store.avatarBorderWidth : 3)
        : (section.data?.avatarBorderWidth !== undefined ? section.data.avatarBorderWidth : 3);

      const currentAvatarBorderColor = storeActive
        ? (store.avatarBorderColor || '#ffffff')
        : (section.data?.avatarBorderColor || '#ffffff');

      const currentAvatarShadow = storeActive
        ? (store.avatarShadow !== undefined ? store.avatarShadow : true)
        : (section.data?.avatarShadow !== undefined ? section.data.avatarShadow : true);

      const currentAvatarGlow = storeActive
        ? (store.avatarGlow || false)
        : (section.data?.avatarGlow || false);

      const currentAvatarOpacity = storeActive
        ? (store.avatarOpacity !== undefined ? store.avatarOpacity : 100)
        : (section.data?.avatarOpacity !== undefined ? section.data.avatarOpacity : 100);

      const currentAvatarFlipH = storeActive ? (store.avatarFlipH || false) : (section.data?.avatarFlipH || false);
      const currentAvatarFlipV = storeActive ? (store.avatarFlipV || false) : (section.data?.avatarFlipV || false);
      const currentAvatarRotation = storeActive ? (store.avatarRotation || 0) : (section.data?.avatarRotation || 0);

      // Avatar position offset from the bottom of the header (overlapping effect)
      const avatarShapeStyle = getAvatarShapeStyle(currentAvatarShape);
      const avatarBoxShadow = currentAvatarGlow
        ? `0 0 24px 4px ${currentAvatarBorderColor}80`
        : currentAvatarShadow
          ? '0 8px 24px rgba(0,0,0,0.22)'
          : 'none';

      // ── Header geometry ──────────────────────────────────────────
      const headerHeight = getHeaderHeight(preset);
      const profilePos    = getProfilePosition(preset?.profilePhotoPosition);
      const headerStyle   = preset?.headerStyle || 'Solid Color';
      const isSleek       = preset?.name === 'Sleek';
      const imgScale      = currentImageScale / 100;
      const showBannerImg = !!currentImageUrl;
      const isEditingHeader = previewMode && store?.activeSectionId === section.sectionId;

      // ── LAYER 1: Header design background ────────────────────────────
      let bgColor = colors.primary || '#2563EB';
      let bgImage = 'none';

      if (preset?.name === 'Blend') {
        bgColor = 'transparent';
        bgImage = `linear-gradient(to bottom, ${colors.primary || '#2563EB'}, ${colors.background || '#ffffff'})`;
      } else if (preset?.name === 'Luxury') {
        bgColor = 'transparent';
        bgImage = 'linear-gradient(135deg, #1A1A1A, #2D251E, #1A1A1A)';
      } else if (preset?.name === 'Aurora' || headerStyle === 'Aurora') {
        bgColor = 'transparent';
        bgImage = [
          `linear-gradient(to bottom, rgba(255,255,255,0) 70%, ${colors.background || '#ffffff'} 100%)`,
          'radial-gradient(circle at 10% 20%, rgba(56,189,248,0.85) 0%, transparent 55%)',
          'radial-gradient(circle at 90% 30%, rgba(124,58,237,0.85) 0%, transparent 60%)',
          'radial-gradient(circle at 50% 80%, rgba(79,70,229,0.95) 0%, transparent 70%)',
          'linear-gradient(135deg, #2563EB, #4F46E5)',
        ].join(', ');
      } else if (headerStyle === 'Gradient') {
        bgColor = 'transparent';
        bgImage = `linear-gradient(135deg, ${colors.primary || '#2563EB'}, ${colors.accent || '#D4A45B'})`;
      }

      // ── LAYER 3: overlay map ─────────────────────────────────────────
      const overlayStyles = {
        'None':             null,
        'Dark Overlay':     'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.25))',
        'Light Overlay':    'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.15))',
        'Gradient Overlay': `linear-gradient(to bottom, ${colors.primary || '#2563EB'}99, transparent)`,
        'Glass Overlay':    null, // handled via backdrop-filter below
      };
      const isGlassOverlay = currentOverlayType === 'Glass Overlay';
      const overlayBg = overlayStyles[currentOverlayType] || null;

      // ── File upload handler (builder only) ──────────────────────────
      const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file || !store) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          store.updateHeaderImage({
            imageUrl: ev.target.result,
            imageScale: preset?.defaultZoom || 100,
            imagePositionX: preset?.defaultPositionX || 0,
            imagePositionY: preset?.defaultPositionY || 0,
            imageOpacity: 80,
            overlayType: 'None',
          });
        };
        reader.readAsDataURL(file);
      };

      // Resolve container dimensions for Free Position
      const getFreePositionDimensions = (style, size) => {
        const baseWidth = size || 120;
        let baseHeight = baseWidth; // Square default

        if (style === 'Rounded Rectangle') {
          baseHeight = baseWidth * 0.625; // 16:10
        } else if (style === 'Capsule') {
          baseHeight = baseWidth * 0.5; // 2:1
        }
        
        return { width: baseWidth, height: baseHeight };
      };

      // Render Free Position Layer
      const renderFreePositionLayer = () => {
        if (!currentImageUrl) return null;

        const { width: layerW, height: layerH } = getFreePositionDimensions(currentContainerStyle, currentContainerSize);
        const imageFilter = `blur(${currentImageBlur}px) brightness(${currentImageBrightness}%) contrast(${currentImageContrast}%) saturate(${currentImageSaturation}%)`;
        
        // Shape clipping styles
        let shapeCls = '';
        let clipPathStyle = {};
        
        if (currentContainerStyle === 'Circle') {
          shapeCls = 'rounded-full';
        } else if (currentContainerStyle === 'Rounded Rectangle') {
          shapeCls = 'rounded-2xl';
        } else if (currentContainerStyle === 'Square') {
          shapeCls = 'rounded-none';
        } else if (currentContainerStyle === 'Capsule') {
          shapeCls = 'rounded-full';
        } else if (currentContainerStyle === 'Hexagon') {
          clipPathStyle.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
        } else if (currentContainerStyle === 'Blob') {
          clipPathStyle.clipPath = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
        } else if (currentContainerStyle === 'Diamond') {
          clipPathStyle.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
        } else {
          // No Container
          shapeCls = 'rounded-xl';
        }

        const borderStyle = currentContainerBorder ? { border: '4px solid white' } : {};
        const shadowStyle = currentContainerShadow ? { boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)' } : {};

        const layerStyle = {
          position: 'absolute',
          left: `${currentImagePositionX}px`,
          top: `${currentImagePositionY}px`,
          width: `${layerW}px`,
          height: `${layerH}px`,
          transform: `rotate(${currentImageRotation}deg)`,
          zIndex: 40,
          opacity: currentImageOpacity / 100,
          padding: `${currentContainerPadding}px`,
          backgroundColor: '#fff',
          cursor: isEditingHeader ? 'move' : 'default',
          ...borderStyle,
          ...shadowStyle,
          ...clipPathStyle
        };

        const imageTransform = `scale(${imgScale})`;

        return (
          <div
            ref={layerRef}
            style={layerStyle}
            className={`transition-shadow select-none group/layer ${shapeCls}`}
            onMouseDown={(e) => {
              if (isEditingHeader) {
                e.stopPropagation();
                handleStartDragFree(e);
              }
            }}
            onTouchStart={(e) => {
              if (isEditingHeader) {
                e.stopPropagation();
                handleStartDragFree(e);
              }
            }}
          >
            {/* The Image inside container */}
            <img
              src={currentImageUrl}
              alt="Profile avatar layer"
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{
                objectFit: currentImageFit.toLowerCase(),
                transform: imageTransform,
                filter: imageFilter,
              }}
            />

            {/* Resize & Rotate UI Controls (only when editing and active) */}
            {isEditingHeader && (
              <>
                {/* Visual Outline */}
                <div className="absolute -inset-[2px] border-2 border-blue-500 rounded-[inherit] pointer-events-none z-30" style={clipPathStyle} />

                {/* Corner Resize Handles */}
                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
                  <div
                    key={corner}
                    onMouseDown={(e) => handleStartResize(e, corner)}
                    onTouchStart={(e) => handleStartResize(e, corner)}
                    className={`absolute w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full z-40 shadow-md hover:scale-125 transition-transform ${
                      corner === 'top-left' ? '-top-1.5 -left-1.5 cursor-nwse-resize' :
                      corner === 'top-right' ? '-top-1.5 -right-1.5 cursor-nesw-resize' :
                      corner === 'bottom-left' ? '-bottom-1.5 -left-1.5 cursor-nesw-resize' :
                      '-bottom-1.5 -right-1.5 cursor-nwse-resize'
                    }`}
                  />
                ))}

                {/* Rotation Handle */}
                <div
                  onMouseDown={(e) => handleStartRotate(e, layerRef)}
                  onTouchStart={(e) => handleStartRotate(e, layerRef)}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center cursor-alias shadow-md hover:scale-125 transition-transform z-40"
                  title="Drag to rotate"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[1.5px] h-4 bg-blue-500 pointer-events-none z-30" />
              </>
            )}
          </div>
        );
      };

      return (
        <div className="pb-10 animate-fade-in relative overflow-hidden rounded-t-[inherit]" style={{ color: colors.text || '#212529' }}>

          {/* ═══════════════ HEADER STACK ═══════════════ */}
          <div
            ref={containerRef}
            className={`${isSleek ? 'mx-4 mt-4 rounded-2xl shadow-lg border border-white/10' : 'w-full'} relative z-0 rounded-t-[inherit]`}
            style={{
              height: headerHeight,
              /* LAYER 1 — header design is the base */
              backgroundColor: (headerStyle === 'Diagonal Split' && currentImagePositionX > 0)
                ? (colors.background || '#ffffff')
                : bgColor,
              backgroundImage: (headerStyle === 'Diagonal Split' && currentImagePositionX > 0)
                ? 'none'
                : bgImage,
              backdropFilter: isSleek ? 'blur(8px)' : 'none',
              overflow: currentImagePlacement === 'Floating Above Header' ? 'visible' : 'hidden',
            }}
          >

            {/* LAYER 2 — uploaded banner image (opacity-controlled & containerized) */}
            {showBannerImg && currentImagePlacement !== 'Free Position' && (() => {
              const imageFilter = `blur(${currentImageBlur}px) brightness(${currentImageBrightness}%) contrast(${currentImageContrast}%) saturate(${currentImageSaturation}%)`;
              const imageTransform = `translate(${currentImagePositionX}px, ${currentImagePositionY}px) scale(${imgScale}) rotate(${currentImageRotation}deg)`;
              
              if (currentContainerStyle !== 'None') {
                let shapeCls = '';
                let inlineStyle = {
                  width: `${currentContainerSize}%`,
                  height: `${currentContainerSize * 0.5}%`,
                  maxWidth: '95%',
                  maxHeight: '95%',
                  padding: `${currentContainerPadding}px`,
                  opacity: currentImageOpacity / 100,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                };
                
                if (currentContainerStyle === 'Circle') {
                  shapeCls = 'rounded-full aspect-square';
                  inlineStyle.height = inlineStyle.width;
                } else if (currentContainerStyle === 'Rounded Rectangle') {
                  shapeCls = 'rounded-2xl aspect-[16/10]';
                } else if (currentContainerStyle === 'Square') {
                  shapeCls = 'rounded-none aspect-square';
                  inlineStyle.height = inlineStyle.width;
                } else if (currentContainerStyle === 'Capsule') {
                  shapeCls = 'rounded-full aspect-[2/1]';
                } else if (currentContainerStyle === 'Hexagon') {
                  shapeCls = 'aspect-square';
                  inlineStyle.height = inlineStyle.width;
                  inlineStyle.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
                } else if (currentContainerStyle === 'Blob') {
                  shapeCls = 'aspect-square';
                  inlineStyle.height = inlineStyle.width;
                  inlineStyle.clipPath = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
                } else if (currentContainerStyle === 'Diamond') {
                  shapeCls = 'aspect-square';
                  inlineStyle.height = inlineStyle.width;
                  inlineStyle.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
                }

                if (currentContainerBorder) {
                  inlineStyle.border = '4px solid white';
                }
                if (currentContainerShadow) {
                  inlineStyle.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)';
                }

                return (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div 
                      className={`${shapeCls}`} 
                      style={inlineStyle}
                    >
                      {currentIsVideo ? (
                        <video
                          src={currentImageUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover select-none"
                          style={{
                            objectFit: currentImageFit.toLowerCase(),
                            transform: imageTransform,
                            transformOrigin: 'center center',
                            filter: imageFilter,
                          }}
                        />
                      ) : (
                        <img
                          src={currentImageUrl}
                          alt="Header banner"
                          onLoad={(e) => {
                            const { naturalWidth, naturalHeight } = e.target;
                            if (naturalWidth && naturalHeight) {
                              setImgRatio(naturalWidth / naturalHeight);
                            }
                          }}
                          className="absolute inset-0 w-full h-full select-none"
                          style={{
                            objectFit: currentImageFit.toLowerCase(),
                            transform: imageTransform,
                            transformOrigin: 'center center',
                            filter: imageFilter,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              }

              // Normal full-banner style
              return (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  {currentIsVideo ? (
                    <video
                      src={currentImageUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full select-none"
                      style={{
                        objectFit: currentImageFit.toLowerCase(),
                        transform: imageTransform,
                        transformOrigin: 'center center',
                        opacity: currentImageOpacity / 100,
                        filter: imageFilter,
                      }}
                    />
                  ) : (
                    <img
                      src={currentImageUrl}
                      alt="Header banner"
                      onLoad={(e) => {
                        const { naturalWidth, naturalHeight } = e.target;
                        if (naturalWidth && naturalHeight) {
                          setImgRatio(naturalWidth / naturalHeight);
                        }
                      }}
                      className="absolute inset-0 w-full h-full select-none"
                      style={{
                        objectFit: currentImageFit.toLowerCase(),
                        transform: imageTransform,
                        transformOrigin: 'center center',
                        opacity: currentImageOpacity / 100,
                        filter: imageFilter,
                      }}
                    />
                  )}
                </div>
              );
            })()}

            {/* LAYER 3 — optional overlay blend */}
            {currentOverlayType !== 'None' && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  zIndex: 2,
                  backgroundImage: overlayBg || undefined,
                  backdropFilter: isGlassOverlay ? 'blur(6px) saturate(1.4)' : undefined,
                  backgroundColor: isGlassOverlay ? 'rgba(255,255,255,0.12)' : undefined,
                }}
              />
            )}

            {/* SVG shape overlays — sit above image/overlay so the design shape always cuts through */}
            {headerStyle === 'Curved Wave' && (
              <svg className="absolute bottom-0 w-full z-10" style={{ fill: colors.background || '#ffffff' }} viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
              </svg>
            )}
            {headerStyle === 'Diagonal Split' && (
              currentImagePositionX > 0 ? (
                <svg className="absolute bottom-0 w-full z-10" style={{ fill: bgColor }} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon points="0,0 100,0 0,100" />
                </svg>
              ) : (
                <svg className="absolute bottom-0 w-full z-10" style={{ fill: colors.background || '#ffffff' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon points="0,100 100,0 100,100" />
                </svg>
              )
            )}
            {headerStyle === 'Organic Blob' && (
              <svg className="absolute bottom-0 w-full z-10" style={{ fill: colors.background || '#ffffff', transform: 'translateY(1px)' }} viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,22,150,75,321.39,56.44Z" />
              </svg>
            )}

            {/* ── Upload button (shown when no image & in builder & section active) ── */}
            {previewMode && !currentImageUrl && store?.activeSectionId === section.sectionId && (
              <div className="absolute inset-0 z-25 flex items-center justify-center select-none">
                <label className="cursor-pointer flex flex-col items-center gap-2 group">
                  <div className="w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg transition-all duration-200">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                  </div>
                  <span className="text-white text-[9px] font-black tracking-wider uppercase bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm shadow-md border border-white/10 transition-transform group-hover:scale-105">+ Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>
            )}

            {/* ── Header image editing overlay (drag reposition only, controls are floating outside) ── */}
            {isEditingHeader && showBannerImg && (
              <div
                className="absolute inset-0 z-30 flex flex-col justify-start select-none animate-fade-in"
                style={{ cursor: preset?.allowDrag === false ? 'default' : 'grab' }}
                onMouseDown={handleStartDrag}
                onTouchStart={handleStartDrag}
              >
                {/* Dim + drag hint */}
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                <div className="relative z-10 flex justify-center pt-2 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-semibold tracking-wide shadow flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 3v18M3 12h18" /></svg>
                    {preset?.allowDrag === false ? 'Drag locked for this layout' : 'Drag to reposition'}
                  </div>
                </div>
                {/* Canvas Editor trigger button */}
                {!store?.isWorkspaceOpen && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        store.openWorkspace();
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" /></svg>
                      Open Canvas Editor
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Upload button shown when no image, section active, builder mode ── */}
            {/* (already rendered above) */}
          </div>

          {/* Render Free Position image layer when placement is Free Position */}
          {currentImagePlacement === 'Free Position' && renderFreePositionLayer()}

          {/* Snapping Guide Lines */}
          {showVGuide && (
            <div className="absolute inset-y-0 left-1/2 w-[1.5px] bg-blue-500 z-50 pointer-events-none border-l border-dashed border-blue-400" />
          )}
          {showHGuide && (
            <div 
              className="absolute inset-x-0 h-[1.5px] bg-blue-500 z-50 pointer-events-none border-t border-dashed border-blue-400" 
              style={{ top: `${parseFloat(headerHeight) / 2}px` }}
            />
          )}

          {/* Card content — below the header */}
          <div className={`px-6 sm:px-10 space-y-4 flex flex-col ${profilePos} pt-6 relative z-10`}>
            {/* Avatar photo — independent from cover image */}
            {currentAvatarUrl && (
              <div
                className="overflow-hidden shrink-0"
                style={{
                  width: `${Math.round(72 * currentAvatarScale / 100)}px`,
                  height: `${Math.round(72 * currentAvatarScale / 100)}px`,
                  border: currentAvatarBorderWidth > 0 ? `${currentAvatarBorderWidth}px solid ${currentAvatarBorderColor}` : 'none',
                  boxShadow: avatarBoxShadow,
                  opacity: currentAvatarOpacity / 100,
                  transform: `rotate(${currentAvatarRotation}deg) scaleX(${currentAvatarFlipH ? -1 : 1}) scaleY(${currentAvatarFlipV ? -1 : 1})`,
                  marginTop: '-20px',
                  ...avatarShapeStyle,
                }}
              >
                <img
                  src={currentAvatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
            )}

            <div className="space-y-2">
              <h3
                className="text-lg sm:text-2xl font-black tracking-tight"
                style={{ fontFamily: headingFont, color: colors.primary || '#000000' }}
              >
                {data.headline || 'Profile Headline'}
              </h3>



              <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto pt-0.5" style={{ fontFamily: font.body || 'inherit' }}>
                {data.bio || 'Provide a short biography detailing your role and networking background.'}
              </p>
            </div>
          </div>
        </div>
      );
    }

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

    case 'video': {
      const rawUrl = data.url || '';
      const uploadedVideo = data.uploadedVideo || '';
      const getEmbedUrl = (raw) => {
        if (!raw) return '';
        const ytMatch = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
        if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
        const vimMatch = raw.match(/vimeo\.com\/(\d+)/);
        if (vimMatch) return `https://player.vimeo.com/video/${vimMatch[1]}`;
        if (raw.includes('youtube.com/embed') || raw.includes('player.vimeo.com')) return raw;
        return '';
      };
      const embedUrl = getEmbedUrl(rawUrl);
      return (
        <div className="px-4 py-5 w-full space-y-3" style={{ color: colors.text }}>
          {uploadedVideo ? (
            <div className="rounded-2xl overflow-hidden border shadow-sm aspect-video w-full bg-black" style={{ borderColor: colors.border || 'rgba(0,0,0,0.08)' }}>
              <video src={uploadedVideo} controls className="w-full h-full object-contain" />
            </div>
          ) : embedUrl ? (
            <div className="rounded-2xl overflow-hidden border shadow-sm aspect-video w-full" style={{ borderColor: colors.border || 'rgba(0,0,0,0.08)' }}>
              <iframe
                src={embedUrl}
                title="Video Embed"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="rounded-2xl bg-black/10 border-2 border-dashed border-black/10 aspect-video flex flex-col items-center justify-center gap-2 opacity-60">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              <p className="text-xs font-medium">Add a YouTube, Vimeo URL or upload a video</p>
            </div>
          )}
          {data.caption && (
            <p className="text-[11px] text-center opacity-60 font-medium" style={{ color: colors.text }}>{data.caption}</p>
          )}
        </div>
      );
    }

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
