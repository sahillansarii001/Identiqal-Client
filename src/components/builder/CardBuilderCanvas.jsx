'use client';

import React from 'react';
import { useCardBuilderStore } from '@/store/cardBuilderStore.js';
import { Button } from '@/components/ui/Button.jsx';
import {
  Eye,
  EyeOff,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
  Sparkles,
} from 'lucide-react';

export const CardBuilderCanvas = () => {
  const {
    sections,
    activeSectionId,
    setActiveSection,
    addSection,
    removeSection,
    toggleSectionVisibility,
    setSections,
  } = useCardBuilderStore();

  const handleMoveUp = (index, e) => {
    e.stopPropagation();
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    // Set order fields
    newSections.forEach((sec, idx) => {
      sec.order = idx + 1;
    });
    setSections(newSections);
  };

  const handleMoveDown = (index, e) => {
    e.stopPropagation();
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    // Set order fields
    newSections.forEach((sec, idx) => {
      sec.order = idx + 1;
    });
    setSections(newSections);
  };

  const addNewSection = (type) => {
    const sectionId = `${type}-${Math.random().toString(36).substring(2, 9)}`;
    const newSection = {
      sectionId,
      type,
      order: sections.length + 1,
      isVisible: true,
      data: {
        about: { headline: 'My Professional Title', bio: 'Tell visitors details about your work...', avatarUrl: '' },
        links: { links: [{ label: 'Personal Website', url: 'https://example.com' }] },
        testimonials: { quote: 'John is an excellent engineer...', authorName: 'Sarah Smith', authorTitle: 'Director, TechCorp' },
        form: { title: 'Book a Consultation', emailRecipient: 'you@company.com', submitButtonText: 'Submit Inquiry', fields: [{ fieldId: 'field-1', label: 'Full Name', type: 'text', required: true }] },
        gallery: { title: 'Product Portfolio', images: [] },
      }[type],
    };
    addSection(newSection);
  };

  const sectionTypes = [
    { type: 'about', label: 'About Block' },
    { type: 'links', label: 'Links List' },
    { type: 'testimonials', label: 'Testimonial' },
    { type: 'form', label: 'Inquiry Form' },
    { type: 'gallery', label: 'Image Gallery' },
  ];

  return (
    <div className="space-y-6">
      {/* Add Section controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center space-x-1.5">
          <Sparkles size={14} className="text-indigo-650 animate-pulse" />
          <span>Add Section Component</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {sectionTypes.map((item) => (
            <Button
              key={item.type}
              variant="outline"
              size="sm"
              onClick={() => addNewSection(item.type)}
              className="space-x-1 py-1.5"
            >
              <Plus size={12} />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          Sections Hierarchy ({sections.length})
        </h4>

        {sections.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs">
            No sections added to this card. Click a button above to add one.
          </div>
        ) : (
          <div className="space-y-2">
            {sections.map((sec, index) => {
              const isActive = activeSectionId === sec.sectionId;
              return (
                <div
                  key={sec.sectionId}
                  onClick={() => setActiveSection(sec.sectionId)}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/50 border-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-350 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-400 font-bold w-4">
                      {index + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 capitalize">
                        {sec.type} Section
                      </h5>
                      <p className="text-[10px] text-slate-500">ID: {sec.sectionId}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Move Controls */}
                    <button
                      onClick={(e) => handleMoveUp(index, e)}
                      disabled={index === 0}
                      className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={(e) => handleMoveDown(index, e)}
                      disabled={index === sections.length - 1}
                      className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ArrowDown size={12} />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSectionVisibility(sec.sectionId);
                      }}
                      className="p-1.5 text-slate-500 hover:text-indigo-650 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {sec.isVisible ? <Eye size={14} /> : <EyeOff size={14} className="text-slate-400" />}
                    </button>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this section block?')) {
                          removeSection(sec.sectionId);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
