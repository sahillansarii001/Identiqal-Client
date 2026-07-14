import * as yup from 'yup';

export const aboutSchema = yup.object({
  headline: yup.string().required('Headline is required').trim(),
  bio: yup.string().required('Bio is required').trim(),
  avatarUrl: yup.string().url('Must be a valid image URL').trim().nullable(),
});

export const linksSchema = yup.object({
  links: yup.array().of(
    yup.object({
      label: yup.string().required('Link label is required').trim(),
      url: yup.string().url('Must be a valid URL (include http/https)').required('URL is required').trim(),
      icon: yup.string().trim().default('link'),
    })
  ).min(1, 'Add at least one link'),
});

export const formSectionSchema = yup.object({
  title: yup.string().required('Form title is required').trim(),
  emailRecipient: yup.string().email('Must be a valid recipient email').required('Recipient email is required').trim(),
  submitButtonText: yup.string().required('Button label is required').default('Send Message').trim(),
  fields: yup.array().of(
    yup.object({
      fieldId: yup.string().required(),
      label: yup.string().required('Field label is required').trim(),
      type: yup.string().oneOf(['text', 'email', 'phone', 'textarea']).required(),
      required: yup.boolean().default(false),
    })
  ).min(1, 'Form must have at least one field'),
});

export const testimonialSchema = yup.object({
  quote: yup.string().required('Quote text is required').trim(),
  authorName: yup.string().required('Author name is required').trim(),
  authorTitle: yup.string().trim().default(''),
  authorAvatarUrl: yup.string().url('Must be a valid image URL').trim().nullable(),
});

export const gallerySchema = yup.object({
  title: yup.string().trim().default(''),
  images: yup.array().of(
    yup.object({
      url: yup.string().url('Must be a valid image URL').required('Image URL is required').trim(),
      caption: yup.string().trim().default(''),
    })
  ).min(1, 'Add at least one image to the gallery'),
});
