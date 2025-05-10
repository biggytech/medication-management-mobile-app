import type React from "react";
import {
  type TextProps as NativeTextProps,
  StyleSheet,
  Text as NativeText,
} from "react-native";
import { Fonts, FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";

type TextProps = NativeTextProps;

export const Text: React.FC<TextProps> = ({ style, ...props }) => {
  return <NativeText style={[styles.text, style]} {...props} />;
};

const styles = StyleSheet.create({
  text: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    fontFamily: Fonts.DEFAULT,
  },
});
