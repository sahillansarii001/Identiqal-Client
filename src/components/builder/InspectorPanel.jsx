'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { useCardBuilderStore } from '@/store/cardBuilderStore';
import { Settings, AlignLeft, AlignCenter, AlignRight, Trash2, Plus, ChevronLeft, GripVertical, Eye, EyeOff, Layers, Palette, User, Link as LinkIcon, MessageSquare, FormInput, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

              {/* Theme Customizer Preview */}
              <div className="pt-4 space-y-4">
                <ThemeCustomizer />
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
      {['testimonials', 'form'].includes(section.type) && (
        <div className="text-sm text-gray-400 text-center py-12 border border-gray-100 rounded-2xl bg-gray-50/50">
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

const ThemeCustomizer = () => {
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
        // Controller returns the array directly (not wrapped in { data: [...] })
        setDisplayPresets(Array.isArray(dRes) ? dRes : (dRes.data || []));
        setColorThemes(Array.isArray(cRes) ? cRes : (cRes.data || []));
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
        <div className="grid grid-cols-2 gap-3">
          {displayPresets.map(preset => (
            <button
              key={preset._id}
              onClick={() => setDesignPreset('displayPreset', preset)}
              className={`relative h-[84px] rounded-[14px] border flex flex-col p-2.5 transition-all duration-300 overflow-hidden group ${
                displayPreset?._id === preset._id ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-black/10 dark:border-white/10 hover:border-black/20 hover:shadow-sm'
              }`}
            >
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-gray-500 to-gray-800"></div>
              <div className="relative z-10 flex flex-col h-full justify-between w-full">
                <div className="flex justify-between items-start w-full">
                  <div className="text-[10px] font-semibold text-gray-800 dark:text-gray-200">{preset.name}</div>
                  {displayPreset?._id === preset._id && (
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                </div>
                <div className="text-[9px] text-gray-500 text-left line-clamp-2 mt-1">
                  {preset.description || preset.headerStyle}
                </div>
              </div>
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
                footerPreset?._id === footer._id ? 'border-primary bg-primary/5 text-primary' : 'border-black/5 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 text-gray-700 dark:text-gray-300'
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

const AboutSettings = ({ data, onUpdate }) => (
  <>
    <SettingGroup title="Content">
      <RealtimeInput label="Name / Headline" value={data.headline} onChange={(val) => onUpdate('headline', val)} />
      <RealtimeInput label="Bio / Description" value={data.bio} onChange={(val) => onUpdate('bio', val)} as="textarea" />
      <RealtimeInput label="Profile Photo URL" value={data.avatarUrl} onChange={(val) => onUpdate('avatarUrl', val)} />
    </SettingGroup>
    
    <SettingGroup title="Header Image">
      <RealtimeInput label="Header Image URL" value={data.headerUrl} onChange={(val) => onUpdate('headerUrl', val)} />
      
      {data.headerUrl && (
        <div className="space-y-4 pt-3 border-t border-gray-100 dark:border-white/10">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <label className="font-semibold text-gray-700 dark:text-gray-300">Zoom</label>
              <span className="text-gray-500 font-mono">{data.headerZoom || 100}%</span>
            </div>
            <input type="range" min="100" max="250" value={data.headerZoom || 100} onChange={e => onUpdate('headerZoom', e.target.value)} className="w-full accent-primary" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Pan X</label>
                <span className="text-gray-500 font-mono">{data.headerPanX || 0}%</span>
              </div>
              <input type="range" min="-100" max="100" value={data.headerPanX || 0} onChange={e => onUpdate('headerPanX', e.target.value)} className="w-full accent-primary" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Pan Y</label>
                <span className="text-gray-500 font-mono">{data.headerPanY || 0}%</span>
              </div>
              <input type="range" min="-100" max="100" value={data.headerPanY || 0} onChange={e => onUpdate('headerPanY', e.target.value)} className="w-full accent-primary" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <label className="font-semibold text-gray-700 dark:text-gray-300">Blur</label>
              <span className="text-gray-500 font-mono">{data.headerBlur || 0}px</span>
            </div>
            <input type="range" min="0" max="20" value={data.headerBlur || 0} onChange={e => onUpdate('headerBlur', e.target.value)} className="w-full accent-primary" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <label className="font-semibold text-gray-700 dark:text-gray-300">Brightness</label>
              <span className="text-gray-500 font-mono">{data.headerBrightness || 100}%</span>
            </div>
            <input type="range" min="20" max="200" value={data.headerBrightness || 100} onChange={e => onUpdate('headerBrightness', e.target.value)} className="w-full accent-primary" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <label className="font-semibold text-gray-700 dark:text-gray-300">Overlay Opacity</label>
              <span className="text-gray-500 font-mono">{data.headerOverlay || 0}%</span>
            </div>
            <input type="range" min="0" max="100" value={data.headerOverlay || 0} onChange={e => onUpdate('headerOverlay', e.target.value)} className="w-full accent-primary" />
          </div>
        </div>
      )}
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

