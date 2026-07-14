'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  aboutSchema,
  linksSchema,
  formSectionSchema,
  testimonialSchema,
  gallerySchema,
} from '@/validators/section.validator.js';
import { useCardBuilderStore } from '@/store/cardBuilderStore.js';
import { Input } from '@/components/ui/Input.jsx';
import { Button } from '@/components/ui/Button.jsx';
import { Trash2, Plus, Edit3 } from 'lucide-react';

export const SectionEditorPanel = () => {
  const { activeSectionId, sections, updateSection } = useCardBuilderStore();
  const activeSection = sections.find((s) => s.sectionId === activeSectionId);

  if (!activeSection) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs shadow-sm">
        Select a section on the canvas to configure fields.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5 capitalize">
          <Edit3 size={16} className="text-indigo-650" />
          <span>Edit {activeSection.type} Section</span>
        </h4>
        <p className="text-[10px] text-slate-500 mt-1">Configure layout properties for ID: {activeSection.sectionId}</p>
      </div>

      {activeSection.type === 'about' && (
        <AboutEditor section={activeSection} onUpdate={(data) => updateSection(activeSection.sectionId, data)} />
      )}
      {activeSection.type === 'links' && (
        <LinksEditor section={activeSection} onUpdate={(data) => updateSection(activeSection.sectionId, data)} />
      )}
      {activeSection.type === 'testimonials' && (
        <TestimonialEditor section={activeSection} onUpdate={(data) => updateSection(activeSection.sectionId, data)} />
      )}
      {activeSection.type === 'form' && (
        <FormSectionEditor section={activeSection} onUpdate={(data) => updateSection(activeSection.sectionId, data)} />
      )}
      {activeSection.type === 'gallery' && (
        <GalleryEditor section={activeSection} onUpdate={(data) => updateSection(activeSection.sectionId, data)} />
      )}
    </div>
  );
};

// Sub-editor for 'about'
const AboutEditor = ({ section, onUpdate }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(aboutSchema),
    defaultValues: section.data,
  });

  const onSubmit = (data) => {
    onUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Headline"
        error={errors.headline?.message}
        {...register('headline')}
      />
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-650">Biography</label>
        <textarea
          className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:ring-2 focus:ring-indigo-500 rounded-xl text-slate-905 placeholder-slate-400 text-sm focus:outline-none"
          rows={4}
          {...register('bio')}
        />
        {errors.bio && <span className="text-xs text-red-500">{errors.bio?.message}</span>}
      </div>
      <Input
        label="Avatar / Profile Image URL"
        placeholder="https://example.com/avatar.jpg"
        error={errors.avatarUrl?.message}
        {...register('avatarUrl')}
      />
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
};

// Sub-editor for 'links'
const LinksEditor = ({ section, onUpdate }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(linksSchema),
    defaultValues: section.data,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  const onSubmit = (data) => {
    onUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        {fields.map((field, idx) => (
          <div key={field.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500">Link #{idx + 1}</span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-red-655 hover:text-red-750"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <Input
              label="Label"
              placeholder="Website Name"
              error={errors.links?.[idx]?.label?.message}
              {...register(`links.${idx}.label`)}
            />
            <Input
              label="URL"
              placeholder="https://company.com"
              error={errors.links?.[idx]?.url?.message}
              {...register(`links.${idx}.url`)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ label: '', url: '', icon: 'link' })}
          className="space-x-1 py-2 text-xs"
        >
          <Plus size={12} />
          <span>Add Link</span>
        </Button>
        <Button type="submit" className="w-full">Save Changes</Button>
      </div>
    </form>
  );
};

// Sub-editor for 'testimonials'
const TestimonialEditor = ({ section, onUpdate }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(testimonialSchema),
    defaultValues: section.data,
  });

  const onSubmit = (data) => {
    onUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-655">Quote</label>
        <textarea
          className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:ring-2 focus:ring-indigo-500 rounded-xl text-slate-905 placeholder-slate-400 text-sm focus:outline-none"
          rows={3}
          {...register('quote')}
        />
        {errors.quote && <span className="text-xs text-red-500">{errors.quote?.message}</span>}
      </div>
      <Input
        label="Author Name"
        error={errors.authorName?.message}
        {...register('authorName')}
      />
      <Input
        label="Author Title"
        placeholder="CEO, Skynet"
        error={errors.authorTitle?.message}
        {...register('authorTitle')}
      />
      <Input
        label="Author Avatar URL"
        placeholder="https://example.com/avatar.jpg"
        error={errors.authorAvatarUrl?.message}
        {...register('authorAvatarUrl')}
      />
      <Button type="submit" className="w-full">Save Changes</Button>
    </form>
  );
};

// Sub-editor for 'form'
const FormSectionEditor = ({ section, onUpdate }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(formSectionSchema),
    defaultValues: section.data,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const onSubmit = (data) => {
    onUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Form Title"
        error={errors.title?.message}
        {...register('title')}
      />
      <Input
        label="Recipient Email"
        description="Leads captured by this form will trigger alerts here."
        error={errors.emailRecipient?.message}
        {...register('emailRecipient')}
      />
      <Input
        label="Submit Button Text"
        error={errors.submitButtonText?.message}
        {...register('submitButtonText')}
      />

      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-650 block border-b border-slate-150 pb-2">
          Form Fields Setup
        </label>
        {fields.map((field, idx) => (
          <div key={field.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500">Field #{idx + 1}</span>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-red-655 hover:text-red-750"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <Input
              label="Field Label"
              placeholder="eg. Company Name"
              error={errors.fields?.[idx]?.label?.message}
              {...register(`fields.${idx}.label`)}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-slate-550">Type</label>
                <select
                  className="bg-white border border-slate-250 rounded-lg text-xs p-2 text-slate-700 focus:outline-none"
                  {...register(`fields.${idx}.type`)}
                >
                  <option value="text">Short Text</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="textarea">Paragraph Text</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 pt-5">
                <input
                  type="checkbox"
                  id={`req-${field.id}`}
                  {...register(`fields.${idx}.required`)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={`req-${field.id}`} className="text-[10px] text-slate-550 font-bold">
                  Required
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ fieldId: `field-${Math.random().toString(36).substring(2, 6)}`, label: '', type: 'text', required: false })}
          className="space-x-1 py-2 text-xs"
        >
          <Plus size={12} />
          <span>Add Form Field</span>
        </Button>
        <Button type="submit" className="w-full">Save Changes</Button>
      </div>
    </form>
  );
};

// Sub-editor for 'gallery'
const GalleryEditor = ({ section, onUpdate }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(gallerySchema),
    defaultValues: section.data,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const onSubmit = (data) => {
    onUpdate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Gallery Title (Optional)"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-650 block border-b border-slate-150 pb-2">
          Image Items
        </label>
        {fields.map((field, idx) => (
          <div key={field.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500">Image #{idx + 1}</span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-red-655 hover:text-red-750"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <Input
              label="Image URL"
              placeholder="https://example.com/photo.jpg"
              error={errors.images?.[idx]?.url?.message}
              {...register(`images.${idx}.url`)}
            />
            <Input
              label="Caption"
              placeholder="Optional photo caption"
              error={errors.images?.[idx]?.caption?.message}
              {...register(`images.${idx}.caption`)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ url: '', caption: '' })}
          className="space-x-1 py-2 text-xs"
        >
          <Plus size={12} />
          <span>Add Image</span>
        </Button>
        <Button type="submit" className="w-full">Save Changes</Button>
      </div>
    </form>
  );
};
