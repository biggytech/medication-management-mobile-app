import type { GradientHeaderProps } from "@/components/common/GradientHeader/types";

import { styles } from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "@/constants/styling/colors";
import React from "react";

const GradientHeader: React.FC<GradientHeaderProps> = ({ children }) => {
  return (
    <LinearGradient
      colors={[AppColors.PRIMARY, AppColors.SECONDARY]}
      style={styles.header}
    >
      {children}
    </LinearGradient>
  );
};

export default React.memo(GradientHeader);
