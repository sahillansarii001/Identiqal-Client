import * as yup from 'yup';

export const createOrgSchema = yup.object({
  name: yup
    .string()
    .required('Organization name is required')
    .min(2, 'Name must be at least 2 characters')
    .trim(),
  logoUrl: yup
    .string()
    .url('Logo URL must be a valid URL')
    .trim()
    .nullable()
    .optional(),
});

export const inviteMemberSchema = yup.object({
  email: yup
    .string()
    .email('Must be a valid email address')
    .required('Email is required'),
  role: yup
    .string()
    .oneOf(['owner', 'admin', 'member'], 'Invalid role')
    .default('member'),
});
