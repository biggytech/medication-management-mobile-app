import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Spacings } from "@/constants/styling/spacings";
import { AppColors } from "@/constants/styling/colors";
import React from "react";
import type { IconButtonProps } from "@/components/common/buttons/IconButton/types";
import { Text } from "@/components/common/typography/Text";

import { styles } from "./styles";

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  onPress,
  color = AppColors.WHITE,
  size = Spacings.BIG,
  text,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      {/*@ts-expect-error*/}
      <Ionicons name={iconName} size={size} color={color} />
      {text && (
        <Text
          style={[
            styles.text,
            {
              color,
            },
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(IconButton);
