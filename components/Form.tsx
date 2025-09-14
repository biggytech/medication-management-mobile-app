import React, { useState } from "react";
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
  getSchema: () => yup.ObjectSchema<T>;
  data: T;
  children: (validation: ReturnType<typeof validateObject>) => ReactNode;
  style?: StyleProp<ViewStyle>;
  onSubmit: () => Promise<void>;
  submitText: string;
  isDisabled?: boolean;
}

export const Form = <T extends DataForValidation = DataForValidation>({
  getSchema,
  data,
  children,
  style,
  onSubmit,
  submitText,
  isDisabled = false,
}: FormProps<T>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validationResult = validateObject(getSchema(), data);

  const isButtonDisabled = isDisabled || isLoading || !validationResult.isValid;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      await onSubmit();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.form, style]}>
      {children(validationResult)}
      <Button
        text={submitText}
        onPress={handleSubmit}
        disabled={isButtonDisabled}
        color={AppColors.POSITIVE}
      />
      <InlineLoader isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    alignSelf: "center",
  },
});
