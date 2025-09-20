import type { ReactNode } from "react";
import * as yup from "yup";
import {
  type DataForValidation,
  validateObject,
} from "@/utils/validation/validateObject";

export interface WizardScreen<T extends DataForValidation = DataForValidation> {
  key: string;
  title: string;
  getValidationSchema: () => yup.ObjectSchema<Partial<T>>;
  node: (
    params: {
      data: Partial<T>;
      setValue: (field: keyof T, value: any) => void;
    } & ReturnType<typeof validateObject>,
  ) => ReactNode;
}

export interface WizardProps {
  screens: WizardScreen[];
}
