import * as yup from "yup";

export const themeSchema = yup.object({
  colors: yup
    .object({
      primary: yup
        .string()
        .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color")
        .required(),
      secondary: yup
        .string()
        .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color")
        .required(),
      background: yup
        .string()
        .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color")
        .required(),
      text: yup
        .string()
        .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color")
        .required(),
      accent: yup
        .string()
        .matches(/^#([0-9a-fA-F]{3}){1,2}$/, "Must be a valid hex color")
        .required(),
    })
    .required(),
  font: yup
    .object({
      heading: yup.string().required(),
      body: yup.string().required(),
    })
    .required(),
  layoutStyle: yup
    .string()
    .oneOf(["minimal", "bold", "corporate", "creative"], "Invalid layout style")
    .required(),
  buttonStyle: yup
    .string()
    .oneOf(["rounded", "square", "outline"], "Invalid button style")
    .required(),
  isLockedByOrg: yup.boolean().default(false),
  backgroundImage: yup.string().url("Must be a valid URL").trim().default(""),
  backgroundVideo: yup.string().url("Must be a valid URL").trim().default(""),
});
