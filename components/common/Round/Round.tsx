import type { RoundProps } from "@/components/common/Round/types";
import { View } from "react-native";
import { backgroundColorStyles } from "@/assets/styles/colors";
import { marginStyles, paddingStyles } from "@/assets/styles/spacings";
import { borderRadiusStyles } from "@/assets/styles/borders";
import React from "react";
import { boxShadowStyles } from "@/assets/styles/shadows";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";

import { styles } from "./styles";

const Round: React.FC<RoundProps> = ({
  children,
  small = false,
  shadow = false,
  approved = false,
  rejected = false,
}) => {
  return (
    <View
      style={[
        backgroundColorStyles.white,
        paddingStyles.standart,
        borderRadiusStyles.full,
        marginStyles.standart,
        marginStyles.bottomSmall,
        small ? paddingStyles.small : {},
        small ? marginStyles.none : {},
        shadow ? boxShadowStyles.standart : {},
      ]}
    >
      {approved && (
        <View style={styles.status}>
          <Ionicons
            name={"checkmark-circle"}
            color={AppColors.POSITIVE}
            size={Spacings.STANDART - Spacings.SMALL}
          />
        </View>
      )}
      {rejected && (
        <View style={styles.status}>
          <Ionicons
            name={"close-circle"}
            color={AppColors.NEGATIVE}
            size={Spacings.STANDART - Spacings.SMALL}
          />
        </View>
      )}
      {children}
    </View>
  );
};

export default React.memo(Round);
