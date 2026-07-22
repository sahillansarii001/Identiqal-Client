'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { Settings, AlignLeft, AlignCenter, AlignRight, Trash2, Plus, ChevronLeft, GripVertical, Eye, EyeOff, Layers, Palette, User, Link as LinkIcon, MessageSquare, FormInput, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImageSystemPanel from './editors/ImageSystemPanel';
import CoverEditorPanel from './editors/CoverEditorPanel';
import AvatarEditorPanel from './editors/AvatarEditorPanel';

const ICONS = {
  about: User,
  links: LinkIcon,
  gallery: ImageIcon,
  testimonials: MessageSquare,
  form: FormInput,
};

export const InspectorPanel = () => {
  const { activeSectionId, sections, setActiveSection, setBlockPickerOpen } = useCardBuilderStore();
  const activeSection = sections.find((s) => s.sectionId === activeSectionId);

  return (
    <div className="flex flex-col h-full bg-white dark:!bg-[#181518] relative z-10 w-full overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="p-4 border-b border-gray-100 dark:!border-white/10 bg-white/90 dark:!bg-[#181518]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        {activeSection ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveSection(null)}
              className="p-1.5 hover:bg-gray-100 dark:hover:!bg-white/10 rounded-full transition-colors text-gray-500 dark:!text-gray-300 hover:text-gray-900 dark:hover:!text-white -ml-2"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-semibold text-gray-900 dark:!text-white capitalize flex items-center gap-2 text-[15px]">
              {activeSection.type} Settings
            </h3>
          </div>
        ) : (
          <h3 className="font-bold text-gray-900 dark:!text-white text-lg">Card Settings</h3>
        )}

        {!activeSection && (
          <button 
            onClick={() => setBlockPickerOpen(true)}
            className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white hover:bg-gray-800 dark:!bg-white dark:!text-black dark:hover:!bg-gray-200 rounded-full transition-colors shadow-sm"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeSection ? (
              <motion.div
              key="contextual-editor"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <ContextualEditor section={activeSection} />
            </motion.div>
          ) : (
            <motion.div
              key="hierarchy-view"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Hierarchy List */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-1.5 h-4 bg-primary/30 rounded-full"></div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Blocks</h4>
                </div>
                <SectionHierarchyList />
                
                {sections.length === 0 && (
                  <div className="text-center py-10 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-[20px]">
                    <div className="w-10 h-10 mx-auto bg-white dark:bg-[#181518] shadow-sm rounded-xl flex items-center justify-center text-gray-300 mb-3 border border-gray-100 dark:border-white/5">
                      <Layers size={18} />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-4">Your card is empty.</p>
                    <button 
                      onClick={() => setBlockPickerOpen(true)}
                      className="px-5 py-2.5 bg-white dark:bg-[#181518] text-primary dark:text-white border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-[12px] text-sm font-semibold transition-all inline-flex items-center gap-2"
                    >
                      <Plus size={16} /> Add First Block
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* CONTEXTUAL EDITOR                                                          */
/* -------------------------------------------------------------------------- */

const ContextualEditor = ({ section }) => {
  const { updateSectionRealTime } = useCardBuilderStore();

  const handleUpdate = (field, value) => {
    updateSectionRealTime(section.sectionId, { [field]: value });
  };

  const data = section.data || {};

  return (
    <>
      {section.type === 'about' && (
        <AboutSettings data={data} onUpdate={handleUpdate} />
      )}
      {section.type === 'links' && (
        <LinksSettings data={data} onUpdate={handleUpdate} />
      )}
      {section.type === 'gallery' && (
        <GallerySettings data={data} onUpdate={handleUpdate} />
      )}
      {section.type === 'video' && (
        <VideoSettings data={data} onUpdate={handleUpdate} />
      )}
      {['testimonials', 'form'].includes(section.type) && (
        <div className="text-sm text-gray-400 dark:text-zinc-500 text-center py-12 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-white/5">
          Settings for {section.type} coming soon.
        </div>
      )}
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* SECTION HIERARCHY (DRAG & DROP)                                            */
/* -------------------------------------------------------------------------- */

const SortableHierarchyItem = ({ section, setActiveSection, removeSection, toggleSectionVisibility }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.sectionId });
  const Icon = ICONS[section.type] || Layers;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white dark:bg-[#151215] border ${isDragging ? 'border-primary shadow-[0_12px_32px_rgba(var(--color-primary-rgb),0.15)] scale-[1.02]' : 'border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]'} rounded-[16px] p-3.5 flex items-center gap-3 transition-all`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-900 p-1"
      >
        <GripVertical size={16} />
      </div>
      
      <div 
        className="flex-1 flex items-center gap-3 cursor-pointer"
        onClick={() => setActiveSection(section.sectionId)}
      >
        <div className="w-10 h-10 rounded-[12px] bg-gray-50/80 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-primary dark:text-white shadow-sm">
          <Icon size={18} />
        </div>
        <div>
          <h5 className="text-[13px] font-bold text-gray-900 dark:text-white capitalize">{section.type}</h5>
          <p className="text-[11px] text-gray-500 font-medium">
            {section.data?.headline || section.data?.title || `${section.data?.links?.length || 0} items`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(section.sectionId); }}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors tooltip-trigger" 
          title={section.isVisible ? 'Hide' : 'Show'}
        >
          {section.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); removeSection(section.sectionId); }}
          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors tooltip-trigger" 
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

const SectionHierarchyList = () => {
  const { sections, setSections, setActiveSection, removeSection, toggleSectionVisibility } = useCardBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((sec) => sec.sectionId === active.id);
      const newIndex = sections.findIndex((sec) => sec.sectionId === over.id);
      const reordered = arrayMove(sections, oldIndex, newIndex);
      reordered.forEach((sec, idx) => { sec.order = idx + 1; });
      setSections(reordered);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map(s => s.sectionId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sections.map((section) => (
            <SortableHierarchyItem 
              key={section.sectionId} 
              section={section}
              setActiveSection={setActiveSection}
              removeSection={removeSection}
              toggleSectionVisibility={toggleSectionVisibility}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

/* -------------------------------------------------------------------------- */
/* THEME CUSTOMIZER (UI ONLY)                                                 */
/* -------------------------------------------------------------------------- */

const HeaderPresetThumbnail = ({ preset, activeTheme }) => {
  const primaryColor = activeTheme?.primary || '#2563EB';
  const accentColor = activeTheme?.accent || '#3B82F6';
  const name = preset?.name || '';

  // Determine header area background and SVGs
  let headerBg = primaryColor;
  let headerHeight = 'h-[44px]';
  const isLuxury = name === 'Luxury' || preset?.headerStyle === 'Luxury';
  const isAurora = name === 'Aurora' || preset?.headerStyle === 'Aurora';
  const isMinimal = name === 'Minimal' || preset?.headerStyle === 'Minimal';
  const isSleek = name === 'Sleek' || preset?.headerStyle === 'Sleek';
  const isBlend = name === 'Blend' || preset?.headerStyle === 'Blend';

  if (isLuxury) {
    headerBg = 'linear-gradient(135deg, #1A1A1A, #2A2520, #1A1A1A)';
  } else if (isAurora) {
    headerBg = 'radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.8) 0%, transparent 55%), radial-gradient(circle at 90% 30%, rgba(124, 58, 237, 0.8) 0%, transparent 60%), radial-gradient(circle at 50% 80%, rgba(79, 70, 229, 0.9) 0%, transparent 70%), linear-gradient(135deg, #2563EB, #4F46E5)';
  } else if (isBlend) {
    headerBg = `linear-gradient(to bottom, ${primaryColor}, transparent)`;
  } else if (preset?.headerStyle === 'Gradient') {
    headerBg = `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
  }

  if (isAurora) {
    headerHeight = 'h-[75px]';
  } else if (isMinimal) {
    headerHeight = 'h-[8px]';
  }

  return (
    <div className="w-full h-full bg-white dark:bg-[#1C191D] relative flex flex-col">
      {/* Header Artwork */}
      {!isSleek ? (
        <div 
          className={`w-full ${headerHeight} relative overflow-hidden shrink-0`}
          style={{ 
            background: headerBg,
            boxShadow: isAurora ? '0 10px 30px -10px rgba(79, 70, 229, 0.15)' : 'none'
          }}
        >
          {/* Bottom natural fade for Aurora */}
          {isAurora && (
            <div className="absolute bottom-0 left-0 w-full h-[18px] bg-gradient-to-b from-transparent to-white dark:to-[#1C191D]" />
          )}
          {/* Classic Wave Shape */}
          {name === 'Classic' && (
            <svg className="absolute bottom-0 w-full text-white dark:text-[#1C191D] fill-current" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
            </svg>
          )}
          {/* Modern Diagonal Shape */}
          {name === 'Modern' && (
            <svg className="absolute bottom-0 w-full text-white dark:text-[#1C191D] fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,100 100,0 100,100"></polygon>
            </svg>
          )}
          {/* Creative Blob Shape */}
          {name === 'Creative' && (
            <svg className="absolute bottom-0 w-full text-white dark:text-[#1C191D] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,22,150,75,321.39,56.44Z"></path>
            </svg>
          )}
          {/* Luxury Gold Border */}
          {isLuxury && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#D4A45B] via-[#F4E0A5] to-[#D4A45B]" />
          )}
        </div>
      ) : (
        /* Sleek Floating Pill Header */
        <div className="w-full h-[50px] flex items-center justify-center pt-2 px-2 shrink-0">
          <div 
            className="w-full h-7 rounded-full border border-white/20 shadow-sm"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
            }}
          />
        </div>
      )}

      {/* Rest of tile is empty space */}
      <div className="flex-1 bg-white dark:bg-[#1C191D]" />
    </div>
  );
};

export const ThemeCustomizer = () => {
  const { displayPreset, colorTheme, footerPreset, setDesignPreset } = useCardBuilderStore();
  
  const [displayPresets, setDisplayPresets] = useState([]);
  const [colorThemes, setColorThemes] = useState([]);
  const [footerPresets, setFooterPresets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const [dRes, cRes, fRes] = await Promise.all([
          axiosInstance.get('/presets/display'),
          axiosInstance.get('/presets/colors'),
          axiosInstance.get('/presets/footers')
        ]);
        
        // Filter out 'Colorful' and 'Professional' display layouts
        const allDisplays = Array.isArray(dRes) ? dRes : (dRes.data || []);
        const filteredDisplays = allDisplays.filter(d => {
          const name = (d.name || '').toLowerCase();
          return !name.includes('colorful') && !name.includes('professional');
        });
        setDisplayPresets(filteredDisplays);
        
        // Filter to only include Light and Dark themes
        const allColors = Array.isArray(cRes) ? cRes : (cRes.data || []);
        const filteredColors = allColors.filter(t => {
          const name = (t.name || '').toLowerCase();
          return name.includes('light') || name.includes('dark');
        });
        setColorThemes(filteredColors.length > 0 ? filteredColors : allColors.slice(0, 2)); // Fallback if no matching names
        
        setFooterPresets(Array.isArray(fRes) ? fRes : (fRes.data || []));
      } catch (error) {
        console.error('Failed to load presets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPresets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SettingGroup title="Display Layouts">
        <div className="flex md:flex-wrap gap-4 overflow-x-auto md:overflow-visible pb-3 md:pb-0 scroll-smooth no-scrollbar">
          {displayPresets.map(preset => (
            <button
              key={preset._id}
              onClick={() => setDesignPreset('displayPreset', preset)}
              className="flex flex-col items-center focus:outline-none shrink-0"
            >
              <div 
                className={`relative w-[96px] h-[120px] rounded-[18px] overflow-hidden border-2 flex-shrink-0 transition-all duration-300 group shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-1 ${
                  displayPreset?._id === preset._id 
                    ? 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]' 
                    : 'border-black/10 dark:border-white/10 hover:border-black/20'
                }`}
              >
                {/* Header Artwork Preview */}
                <HeaderPresetThumbnail preset={preset} activeTheme={colorTheme} />

                {/* Selected Checkmark Overlay */}
                {displayPreset?._id === preset._id && (
                  <div className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-blue-500 flex items-center justify-center text-white z-20 shadow-sm">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 mt-2 capitalize text-center">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </SettingGroup>

      <SettingGroup title="Color Themes">
        <div className="grid grid-cols-2 gap-3">
          {colorThemes.map(theme => (
            <button
              key={theme._id}
              onClick={() => setDesignPreset('colorTheme', theme)}
              className={`relative rounded-[14px] border flex flex-col transition-all duration-300 overflow-hidden group ${
                colorTheme?._id === theme._id ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]' : 'border-black/10 dark:border-white/10 hover:border-black/20 hover:shadow-sm'
              }`}
              style={{ backgroundColor: theme.background }}
            >
              <div className="p-3 w-full flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="text-[11px] font-bold text-left truncate flex-1" style={{ color: theme.text }}>
                    {theme.name}
                  </div>
                  {colorTheme?._id === theme._id && (
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-sm ml-2">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: theme.primary }} />
                  <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: theme.secondary }} />
                  <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: theme.accent }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </SettingGroup>

      <SettingGroup title="Footer Style">
        <div className="grid grid-cols-1 gap-2">
          {footerPresets.map(footer => (
            <button
              key={footer._id}
              onClick={() => setDesignPreset('footerPreset', footer)}
              className={`text-left p-3 rounded-xl border transition-all text-xs font-medium ${
                footerPreset?._id === footer._id ? 'border-primary bg-primary/5 text-primary' : 'border-black/5 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{footer.name}</span>
                {footerPreset?._id === footer._id && <Check size={14} className="text-primary" />}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 truncate max-w-[200px] font-mono">
                {footer.contentTemplate}
              </div>
            </button>
          ))}
        </div>
      </SettingGroup>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/* SETTINGS COMPONENTS                                                        */
/* -------------------------------------------------------------------------- */

const SettingGroup = ({ title, children }) => (
  <div className="space-y-5 p-5 bg-white dark:bg-[#151215] border border-black/5 dark:border-white/10 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden">
    {title && (
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-4 bg-primary/30 rounded-full"></div>
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">{title}</h4>
      </div>
    )}
    <div className="space-y-5 relative z-10">{children}</div>
  </div>
);

const RealtimeInput = ({ label, value, onChange, placeholder, as = 'input', rows = 3 }) => (
  <div className="space-y-1.5">
    <label className="text-[12px] font-semibold text-gray-700 dark:text-gray-300 block">{label}</label>
    {as === 'textarea' ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3.5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-900 dark:text-white resize-none shadow-sm"
      />
    ) : (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-900 dark:text-white shadow-sm"
      />
    )}
  </div>
);

// ── Render the floating editor panels globally so they slide in over the sidebar ──
export const ImageEditorPanels = () => (
  <>
    <CoverEditorPanel />
    <AvatarEditorPanel />
  </>
);

const AboutSettings = ({ data, onUpdate }) => (
  <>
    <SettingGroup title="Content">
      <RealtimeInput label="Name" value={data.headline} onChange={(val) => onUpdate('headline', val)} />
      <RealtimeInput label="Headline" value={data.bio} onChange={(val) => onUpdate('bio', val)} as="textarea" />
    </SettingGroup>

    <SettingGroup title="Images">
      <ImageSystemPanel />
    </SettingGroup>
    
    <SettingGroup title="Design">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-gray-700 block">Text Alignment</label>
        <div className="flex bg-gray-50/80 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/10 shadow-sm">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              onClick={() => onUpdate('alignment', align)}
              className={`flex-1 flex justify-center py-2 rounded-lg text-gray-500 dark:text-gray-400 transition-all cursor-pointer ${
                (data.alignment || 'center') === align ? 'bg-white shadow text-gray-900 dark:text-white font-medium' : 'hover:bg-gray-100/50 dark:hover:bg-white/5'
              }`}
            >
              {align === 'left' && <AlignLeft size={16} />}
              {align === 'center' && <AlignCenter size={16} />}
              {align === 'right' && <AlignRight size={16} />}
            </button>
          ))}
        </div>
      </div>
    </SettingGroup>
  </>
);

const LinksSettings = ({ data, onUpdate }) => {
  const links = data.links || [];

  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onUpdate('links', newLinks);
  };

  const addLink = () => onUpdate('links', [...links, { label: 'New Link', url: 'https://' }]);
  
  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    onUpdate('links', newLinks);
  };

  return (
    <SettingGroup title="Social & Custom Links">
      <AnimatePresence>
        {links.map((link, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-4 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider">LINK {index + 1}</span>
              <button 
                onClick={() => removeLink(index)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 p-1.5 rounded-lg"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <RealtimeInput label="Label" value={link.label} onChange={(val) => updateLink(index, 'label', val)} />
            <RealtimeInput label="URL" value={link.url} onChange={(val) => updateLink(index, 'url', val)} />
          </motion.div>
        ))}
      </AnimatePresence>

      <button 
        onClick={addLink}
        className="w-full py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={16} /> Add Another Link
      </button>
    </SettingGroup>
  );
};

/* -------------------------------------------------------------------------- */
/* GALLERY SETTINGS                                                           */
/* -------------------------------------------------------------------------- */

const GallerySettings = ({ data, onUpdate }) => {
  const images = data.images || [];

  const updateImage = (index, field, value) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    onUpdate('images', newImages);
  };

  const addImage = () => onUpdate('images', [...images, { url: '', caption: '' }]);
  
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onUpdate('images', newImages);
  };

  return (
    <SettingGroup title="Gallery Configuration">
      <RealtimeInput label="Gallery Title" value={data.title || ''} onChange={(val) => onUpdate('title', val)} />
      
      <div className="pt-6 mt-4 border-t border-gray-100 dark:border-white/10 space-y-4">
        <h4 className="text-[11px] font-bold text-gray-500 tracking-wider">IMAGES</h4>
        
        <AnimatePresence>
          {images.map((img, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-2xl space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 tracking-wider">IMAGE {index + 1}</span>
                <button 
                  onClick={() => removeImage(index)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 dark:bg-white/10 p-1.5 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <RealtimeInput label="Image URL" value={img.url} onChange={(val) => updateImage(index, 'url', val)} />
              <RealtimeInput label="Caption (Optional)" value={img.caption || ''} onChange={(val) => updateImage(index, 'caption', val)} />
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          onClick={addImage}
          className="w-full py-3 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/20 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>
    </SettingGroup>
  );
};

/* -------------------------------------------------------------------------- */
/* VIDEO SETTINGS                                                              */
/* -------------------------------------------------------------------------- */

const VideoSettings = ({ data, onUpdate }) => {
  const url = data.url || '';
  const uploadedVideo = data.uploadedVideo || '';

  // Derive embed URL from YouTube / Vimeo share links
  const getEmbedUrl = (raw) => {
    if (!raw) return '';
    const ytMatch = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
    const vimMatch = raw.match(/vimeo\.com\/(\d+)/);
    if (vimMatch) return `https://player.vimeo.com/video/${vimMatch[1]}`;
    if (raw.includes('youtube.com/embed') || raw.includes('player.vimeo.com')) return raw;
    return '';
  };

  const embedUrl = getEmbedUrl(url);

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Clear the URL field so uploaded video takes priority
    onUpdate('url', '');
    const reader = new FileReader();
    reader.onload = (ev) => onUpdate('uploadedVideo', ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onUpdate('url', '');
    onUpdate('uploadedVideo', '');
  };

  const hasContent = embedUrl || uploadedVideo;

  return (
    <>
      <SettingGroup title="Video">

        {/* ── Upload Button ── */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-gray-700 dark:text-gray-300 block">Upload Video File</label>
          <label className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-all shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            Upload Video
            <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
          </label>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
        </div>

        {/* ── URL Input ── */}
        <RealtimeInput
          label="YouTube or Vimeo URL"
          value={url}
          onChange={(val) => { onUpdate('url', val); onUpdate('uploadedVideo', ''); }}
          placeholder="https://youtu.be/abc123"
        />

        {/* ── Preview area ── */}
        {uploadedVideo ? (
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm bg-black aspect-video mt-2 relative group">
            <video src={uploadedVideo} controls className="w-full h-full object-contain" />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/60 hover:bg-red-500 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
              title="Remove video"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ) : embedUrl ? (
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm bg-black aspect-video mt-2 relative group">
            <iframe
              src={embedUrl}
              title="Video Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/60 hover:bg-red-500 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
              title="Remove video"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ) : url ? (
          <p className="text-xs text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-3 py-2">
            Could not parse URL. Paste a valid YouTube or Vimeo link.
          </p>
        ) : (
          <div className="rounded-2xl bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/10 aspect-video flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-zinc-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            <p className="text-xs font-medium">Upload a file or paste a URL above</p>
          </div>
        )}
      </SettingGroup>

      <SettingGroup title="Options">
        <RealtimeInput
          label="Caption (optional)"
          value={data.caption || ''}
          onChange={(val) => onUpdate('caption', val)}
          placeholder="Short description shown below the video"
        />
      </SettingGroup>
    </>
  );
};
