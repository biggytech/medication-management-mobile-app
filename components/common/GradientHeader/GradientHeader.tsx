import type { GradientHeaderProps } from "@/components/common/GradientHeader/types";

import { styles } from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "@/constants/styling/colors";
import React from "react";
import { View } from "react-native";

const GradientHeader: React.FC<GradientHeaderProps> = ({
  children,
  left,
  right,
}) => {
  return (
    <LinearGradient
      colors={[AppColors.PRIMARY, AppColors.SECONDARY]}
      style={styles.header}
    >
      <View style={[styles.action, styles.left]}>{left}</View>
      <View style={styles.center}>{children}</View>
      <View style={[styles.action, styles.right]}>{right}</View>
    </LinearGradient>
  );
};

export default React.memo(GradientHeader);
