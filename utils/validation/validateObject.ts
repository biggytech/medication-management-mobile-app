import * as yup from "yup";
import { type AnyObject, ValidationError } from "yup";

export type DataForValidation = AnyObject;

export type ValidationOutput<T extends DataForValidation = DataForValidation> =
  {
    [key in keyof T]: string | null;
  };

export const validateObject = <T extends DataForValidation = DataForValidation>(
  schema: yup.ObjectSchema<Partial<T>>,
  value: T,
): {
  isValid: boolean;
  errors: ValidationOutput<T>;
} => {
  let isValid = true;
  const errors: ValidationOutput<T> = Object.keys(schema.fields).reduce<
    ValidationOutput<T>
  >((acc, curr) => ({ ...acc, [curr]: null }), {} as ValidationOutput<T>);

  try {
    schema.validateSync(value);
  } catch (error) {
    if (error instanceof ValidationError) {
      isValid = false;

      const { path, message } = error;
      const field = path?.split(".")[0];
      if (field && field in errors) {
        errors[field as keyof ValidationOutput<T>] = message;
      }
    }
  }

  return {
    isValid,
    errors,
  };
};
