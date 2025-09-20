import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import * as yup from "yup";
import {
  validateObject,
  type DataForValidation,
} from "@/utils/validation/validateObject";
import { AppColors } from "@/constants/styling/colors";
import { Button } from "@/components/Button";
import { InlineLoader } from "@/components/loaders/InlineLoader";

interface FormProps<T extends DataForValidation = DataForValidation> {
  getSchema: () => yup.ObjectSchema<Partial<T>>;
  children: (
    params: {
      data: Partial<T>;
      setValue: (field: keyof T, value: any) => void;
    } & ReturnType<typeof validateObject>,
  ) => ReactNode;
  style?: StyleProp<ViewStyle>;
  onSubmit?: (data: T) => Promise<void>;
  onSubmitDisabled?: (isDisabled: boolean) => void;
  submitText?: string;
  isDisabled?: boolean;
}

export const Form = <T extends DataForValidation = DataForValidation>({
  getSchema,
  children,
  style,
  onSubmit,
  onSubmitDisabled,
  submitText,
  isDisabled = false,
}: FormProps<T>) => {
  const [data, setData] = useState<Partial<T>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationResult = validateObject(getSchema(), data);

  const isButtonDisabled = isDisabled || isLoading || !validationResult.isValid;

  const setValue = (field: keyof T, value: any) => {
    setData((data) => ({ ...data, [field]: value }));
  };

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

  return (
    <View style={[styles.form, style]}>
      {children({ data, setValue, ...validationResult })}
      {onSubmit && submitText && (
        <Button
          text={submitText}
          onPress={handleSubmit}
          disabled={isButtonDisabled}
          color={AppColors.POSITIVE}
        />
      )}
      <InlineLoader isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    alignSelf: "center",
  },
});
