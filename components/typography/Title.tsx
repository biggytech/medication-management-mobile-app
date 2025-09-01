import type React from "react";
import {
  type TextProps as NativeTextProps,
  StyleSheet,
  Text as NativeText,
} from "react-native";
import { Fonts, FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

type TitleProps = NativeTextProps;

export const Title: React.FC<TitleProps> = ({ style, ...props }) => {
  return <NativeText style={[styles.title, style]} {...props} />;
};

const styles = StyleSheet.create({
  title: {
    fontSize: FontSizes.HUGE,
    color: AppColors.PRIMARY,
    fontFamily: Fonts.DEFAULT,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: Spacings.STANDART,
  },
});
