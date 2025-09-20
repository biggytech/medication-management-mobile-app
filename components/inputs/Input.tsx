import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  type TextInputProps,
  View,
  Keyboard,
} from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Fonts, FontSizes } from "@/constants/styling/fonts";
import { Text } from "@/components/typography/Text";

interface InputProps extends TextInputProps {
  error?: string | null;
}

export const Input: React.FC<InputProps> = ({
  style,
  onFocus,
  onBlur,
  error,
  onSubmitEditing,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          isFocused ? styles.focused : {},
          error ? styles.errored : {},
          style,
        ]}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onSubmitEditing={(event) => {
          Keyboard.dismiss();
          onSubmitEditing?.(event);
        }}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: 200,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: AppColors.SECONDARY,
    padding: 10,
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    fontFamily: Fonts.DEFAULT,
    backgroundColor: AppColors.WHITE,
  },
  focused: {
    borderColor: AppColors.ACCENT,
  },
  errored: {
    borderColor: AppColors.NEGATIVE,
  },
  error: {
    color: AppColors.NEGATIVE,
    fontSize: FontSizes.SMALL,
  },
});
