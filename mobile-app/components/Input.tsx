import type React from "react";
import { TextInput, StyleSheet, type TextInputProps } from "react-native";
import { AppColors } from "@/constants/styling/colors";

type InputProps = TextInputProps;

export const Input: React.FC<InputProps> = ({ style, ...props }) => {
  return <TextInput style={[styles.input, style]} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AppColors.SECONDARY,
    padding: 10,
  },
});
