import * as yup from "yup";

/**
 * Dynamically builds a Yup validation schema based on custom form fields.
 * @param {Array} fields - Configured fields of the lead capture form.
 * @returns {import('yup').ObjectSchema} A Yup schema.
 */
export const buildLeadFormSchema = (fields = []) => {
  const shape = {};

  fields.forEach((field) => {
    let fieldValidator = yup.string().trim();

    if (field.type === "email") {
      fieldValidator = fieldValidator.email("Must be a valid email address");
    }

    if (field.required) {
      fieldValidator = fieldValidator.required(`${field.label} is required`);
    } else {
      fieldValidator = fieldValidator.nullable().optional();
    }

    shape[field.fieldId] = fieldValidator;
  });

  // Always require consent checkbox for GDPR compliance
  shape.consentGiven = yup
    .boolean()
    .oneOf([true], "You must give consent to submit your details")
    .required();

  return yup.object(shape);
};
