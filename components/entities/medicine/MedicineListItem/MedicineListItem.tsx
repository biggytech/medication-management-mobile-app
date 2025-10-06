import React from "react";
import type { MedicineListItemProps } from "@/components/entities/medicine/MedicineListItem/types";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/styling/colors";

import { styles } from "./styles";
import { Round } from "@/components/common/Round";
import { getMedicineEmoji } from "@/utils/ui/getMedicineEmoji";
import { formatNextDoseDate } from "@/utils/formatters/medicine/formatNextDoseDate";
import { isDoseOverdue } from "@/utils/formatters/medicine/isDoseOverdue";
import { formatNextDoseDateShort } from "@/utils/formatters/medicine/formatNextDoseDateShort";

const MedicineListItem: React.FC<MedicineListItemProps> = ({
  medicine,
  onPress,
  shortDoseDate = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(medicine.id)}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Round shadow small>
          <Text>{getMedicineEmoji(medicine)}</Text>
        </Round>
      </View>
      <View>
        <Text style={styles.title}>{medicine.title}</Text>
        <Text
          style={[
            styles.subTitle,
            isDoseOverdue(medicine) ? styles.overdue : {},
          ]}
        >
          {shortDoseDate
            ? formatNextDoseDateShort(medicine)
            : formatNextDoseDate(medicine)}
        </Text>
      </View>
      <View style={styles.right}>
        <Ionicons name="chevron-forward" size={20} color={AppColors.DARKGREY} />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MedicineListItem);
