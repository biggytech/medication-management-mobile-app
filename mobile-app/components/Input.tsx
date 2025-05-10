import React, { useState } from "react";
import { TextInput, StyleSheet, type TextInputProps } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Fonts, FontSizes } from "@/constants/styling/fonts";

type InputProps = TextInputProps;

export const Input: React.FC<InputProps> = ({
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <TextInput
      style={[styles.input, isFocused ? styles.focused : {}, style]}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AppColors.SECONDARY,
    padding: 10,
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    fontFamily: Fonts.DEFAULT,
  },
  focused: {
    borderColor: AppColors.ACCENT,
  },
});
