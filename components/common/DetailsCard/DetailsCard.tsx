import type { DetailsCardProps } from "@/components/common/DetailsCard/types";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/styling/colors";
import { Text } from "@/components/common/typography/Text";
import React from "react";

import { styles } from "./styles";

const DetailsCard: React.FC<DetailsCardProps> = ({ items }) => {
  return (
    <View style={styles.detailsContainer}>
      {items.map(({ key, iconName, label, value }) => (
        <View style={styles.detailRow} key={key}>
          <View style={styles.detailLabel}>
            {/*@ts-expect-error*/}
            <Ionicons name={iconName} size={20} color={AppColors.PRIMARY} />
            <Text style={styles.detailLabelText}>{label}</Text>
          </View>
          <Text style={styles.detailValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
};

export default React.memo(DetailsCard);
