import type { HeaderProps } from "@/components/common/Header/types";

import { styles } from "./styles";
import { AppColors } from "@/constants/styling/colors";
import React from "react";
import { View } from "react-native";

const Header: React.FC<HeaderProps> = ({
  children,
  left,
  right,
  color = AppColors.PRIMARY,
}) => {
  return (
    <View style={[styles.header, { backgroundColor: color }]}>
      <View style={[styles.action, styles.left]}>{left}</View>
      <View style={styles.center}>{children}</View>
      <View style={[styles.action, styles.right]}>{right}</View>
    </View>
  );
};

export default React.memo(Header);
