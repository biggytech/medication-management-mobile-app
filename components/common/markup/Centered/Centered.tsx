import type { CenteredProps } from "@/components/common/markup/Centered/types";
import { View } from "react-native";
import { styles } from "@/components/common/markup/Centered/styles";
import React from "react";

const Centered: React.FC<CenteredProps> = ({ children, style }) => {
  return <View style={[styles.centered, style]}>{children}</View>;
};

export default React.memo(Centered);
