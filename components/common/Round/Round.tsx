import type { RoundProps } from "@/components/common/Round/types";
import { View } from "react-native";
import { backgroundColorStyles } from "@/assets/styles/colors";
import { marginStyles, paddingStyles } from "@/assets/styles/spacings";
import { borderRadiusStyles } from "@/assets/styles/borders";
import React from "react";

const Round: React.FC<RoundProps> = ({ children }) => {
  return (
    <View
      style={[
        backgroundColorStyles.white,
        paddingStyles.standart,
        borderRadiusStyles.full,
        marginStyles.standart,
        marginStyles.bottomSmall,
      ]}
    >
      {children}
    </View>
  );
};

export default React.memo(Round);
