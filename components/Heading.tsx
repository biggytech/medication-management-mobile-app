import type React from "react";
import {
  type TextProps as NativeTextProps,
  StyleSheet,
  Text as NativeText,
} from "react-native";
import { Fonts, FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";

type HeadingProps = NativeTextProps;

export const Heading: React.FC<HeadingProps> = ({ style, ...props }) => {
  return <NativeText style={[styles.heading, style]} {...props} />;
};

const styles = StyleSheet.create({
  heading: {
    fontSize: FontSizes.BIG,
    color: AppColors.SECONDARY,
    fontFamily: Fonts.DEFAULT,
    fontWeight: "bold",
  },
});
