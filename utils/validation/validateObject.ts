import * as yup from "yup";
import { type AnyObject, type Maybe, ValidationError } from "yup";

type YupSchemaObject = AnyObject;

type Output<T extends YupSchemaObject = YupSchemaObject> = {
  [key in keyof T]: string | null;
};

export const validateObject = <T extends YupSchemaObject = YupSchemaObject>(
  schema: yup.ObjectSchema<T>,
  value: T,
): {
  isValid: boolean;
  errors: Output<T>;
} => {
  let isValid = true;
  const errors: Output<T> = Object.keys(schema.fields).reduce<Output<T>>(
    (acc, curr) => ({ ...acc, [curr]: null }),
    {} as Output<T>,
  );

  try {
    schema.validateSync(value);
  } catch (error) {
    if (error instanceof ValidationError) {
      isValid = false;

      const { path, message } = error;
      const field = path?.split(".")[0];
      if (field && field in errors) {
        errors[field as keyof Output<T>] = message;
      }
    }
  }

  return {
    isValid,
    errors,
  };
};
