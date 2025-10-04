import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Spacings } from "@/constants/styling/spacings";
import { AppColors } from "@/constants/styling/colors";
import React from "react";
import type { IconButtonProps } from "@/components/common/buttons/IconButton/types";

const IconButton: React.FC<IconButtonProps> = ({ iconName, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {/*@ts-expect-error*/}
      <Ionicons name={iconName} size={Spacings.BIG} color={AppColors.WHITE} />
    </TouchableOpacity>
  );
};

export default React.memo(IconButton);
