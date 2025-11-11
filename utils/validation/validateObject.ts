import * as yup from "yup";
import { type AnyObject, ValidationError } from "yup";

export type DataForValidation = AnyObject;

export type ValidationOutput<T extends DataForValidation = DataForValidation> =
  {
    [key in keyof T]: string | null;
  };

export const validateObject = <T extends DataForValidation = DataForValidation>(
  schema: yup.ObjectSchema<any>,
  touchedFields: Partial<{
    [key in keyof T]: boolean;
  }>,
  data: Partial<T>,
): {
  isValid: boolean;
  errors: ValidationOutput<T>;
} => {
  let isValid = true;
  const errors: ValidationOutput<T> = Object.keys(schema.fields).reduce<
    ValidationOutput<T>
  >((acc, curr) => ({ ...acc, [curr]: null }), {} as ValidationOutput<T>);

  try {
    schema.validateSync(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      isValid = false;

      const { path, message } = error;
      if (path && touchedFields[path]) {
        errors[path as keyof ValidationOutput<T>] = message;
      } else {
        // console.log("error", error);
      }
    }
  }

  return {
    isValid,
    errors,
  };
};
