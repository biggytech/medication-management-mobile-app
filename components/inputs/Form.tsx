import React, {
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import * as yup from "yup";
import {
  validateObject,
  type DataForValidation,
} from "@/utils/validation/validateObject";
import { AppColors } from "@/constants/styling/colors";
import { Button } from "@/components/Button";
import { InlineLoader } from "@/components/loaders/InlineLoader";

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
}

export const Form = <T extends DataForValidation = DataForValidation>({
  ref,
  getSchema,
  children,
  style,
  onSubmit,
  onSubmitDisabled,
  submitText,
  isDisabled = false,
  shouldShowLoader = true,
}: FormProps<T>) => {
  const [data, setData] = useState<Partial<T>>({});
  const [touchedFields, setTouchedFields] = useState<
    Partial<{
      [key in keyof T]: boolean;
    }>
  >({});

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationResult = validateObject(getSchema(), touchedFields, data);

  const isButtonDisabled = isDisabled || isLoading || !validationResult.isValid;

  const setValue = useCallback((field: keyof T, value: any) => {
    setData((data) => ({ ...data, [field]: value }));
  }, []);

  const setTouched = useCallback((field: keyof T) => {
    setTouchedFields((data) => ({ ...data, [field]: true }));
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      await onSubmit?.(data as Required<T>);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onSubmitDisabled?.(isButtonDisabled);
  }, [isButtonDisabled, onSubmitDisabled]);

  useImperativeHandle(ref, () => {
    return {
      getData() {
        return data;
      },
    };
  }, [data]);

  return (
    <View style={[styles.form, style]}>
      {children({ data, setValue, setTouched, ...validationResult })}
      {onSubmit && submitText && (
        <Button
          text={submitText}
          onPress={handleSubmit}
          disabled={isButtonDisabled}
          color={AppColors.POSITIVE}
        />
      )}
      {shouldShowLoader && <InlineLoader isLoading={isLoading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
});
