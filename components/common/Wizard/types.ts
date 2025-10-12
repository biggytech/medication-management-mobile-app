import type { ReactNode } from "react";
import * as yup from "yup";
import { type DataForValidation } from "@/utils/validation/validateObject";

import type { FormProps } from "@/components/common/inputs/Form/types";

export interface WizardScreen<T extends DataForValidation = DataForValidation> {
  key: string;
  title: string;
  getValidationSchema: () => yup.ObjectSchema<Partial<T>>;
  node: (
    params: Parameters<FormProps<T>["children"]>[0] & {
      onScreenSubmit: (formData?: Partial<T>) => void;
    },
  ) => ReactNode;
}

export interface WizardProps<T extends DataForValidation = DataForValidation> {
  screens: WizardScreen<T>[];
  onCancel: () => void;
  onSubmit: (data: T) => void | Promise<void>;
  initialData?: Partial<T>;
  /**
   * Optional callback when submission starts
   */
  onSubmissionStart?: () => void;
  /**
   * Optional callback when submission completes (success or error)
   */
  onSubmissionComplete?: (success: boolean) => void;
}
