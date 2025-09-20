import React, { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

interface ScreenProps {
  children: ReactNode;
}

export const SCREEN_PADDING = 0;

export const Screen: React.FC<ScreenProps> = ({ children }) => {
  return <View style={styles.screen}>{children}</View>;
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: AppColors.BACKGROUND,
    // padding: SCREEN_PADDING,
    flex: 1,
  },
});
