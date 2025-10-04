import React from "react";
import { View } from "react-native";
import { Spacings } from "@/constants/styling/spacings";

interface GapProps {
  size?: Spacings;
}

export const Gap: React.FC<GapProps> = ({ size = Spacings.STANDART }) => {
  return (
    <View
      style={{
        marginTop: size,
      }}
    />
  );
};
