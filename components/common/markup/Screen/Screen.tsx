import React from "react";
import { View } from "react-native";
import { styles } from "@/components/common/markup/Screen/styles";
import type { ScreenProps } from "@/components/common/markup/Screen/types";

const Screen: React.FC<ScreenProps> = ({ style, children }) => {
  return <View style={[styles.screen, style]}>{children}</View>;
};

export default React.memo(Screen);
