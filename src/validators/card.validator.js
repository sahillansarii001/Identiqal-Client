import * as yup from 'yup';

export const createCardSchema = yup.object({
  slug: yup
    .string()
    .required('Slug is required')
    .matches(/^[a-z0-9-_]+$/, 'Slug must only contain lowercase letters, numbers, hyphens, and underscores')
    .trim(),
  title: yup
    .string()
    .required('Title is required')
    .trim(),
});

export const updateCardSchema = yup.object({
  title: yup.string().trim(),
  seo: yup.object({
    metaTitle: yup.string().trim().default(''),
    metaDescription: yup.string().trim().default(''),
    ogImageUrl: yup.string().url('Must be a valid URL').trim().default(''),
  }).default({}),
});
