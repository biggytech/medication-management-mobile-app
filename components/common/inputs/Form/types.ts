import {
  type DataForValidation,
  validateObject,
} from "@/utils/validation/validateObject";
import type { ReactNode, RefObject } from "react";
import * as yup from "yup";
import type { StyleProp, ViewStyle } from "react-native";

export interface FormInterface<
  T extends DataForValidation = DataForValidation,
> {
  getData: () => Partial<T>;
}

export interface FormProps<T extends DataForValidation = DataForValidation> {
  ref?: RefObject<FormInterface<T> | null>;
  getSchema: () => yup.ObjectSchema<Partial<T>>;
  children: (
    params: {
      data: Partial<T>;
      setValue: (field: keyof T, value: any) => void;
      setTouched: (field: keyof T) => void;
    } & ReturnType<typeof validateObject>,
  ) => ReactNode;
  style?: StyleProp<ViewStyle>;
  onSubmit?: (data: T) => Promise<void>;
  onSubmitDisabled?: (isDisabled: boolean) => void;
  submitText?: string;
  isDisabled?: boolean;
  shouldShowLoader?: boolean;
  initialData?: Partial<T>;
}
