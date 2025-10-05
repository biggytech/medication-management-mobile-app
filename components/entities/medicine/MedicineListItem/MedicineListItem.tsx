import React from "react";
import type { MedicineListItemProps } from "@/components/entities/medicine/MedicineListItem/types";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/styling/colors";

import { styles } from "./styles";
import { LanguageService } from "@/services/language/LanguageService";
import { ddmmyyyyFromDate } from "@/utils/date";
import { Round } from "@/components/common/Round";
import { getMedicineEmoji } from "@/utils/ui/getMedicineEmoji";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";

const MedicineListItem: React.FC<MedicineListItemProps> = ({
  medicine,
  onPress,
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
        <Text style={styles.subTitle}>
          {medicine.schedule.nextDoseDate
            ? `${LanguageService.translate("Next dose")}: ${ddmmyyyyFromDate(new Date(medicine.schedule.nextDoseDate))} ${hhmmFromDate(new Date(medicine.schedule.nextDoseDate))}`
            : LanguageService.translate("Only as needed")}
        </Text>
      </View>
      <View style={styles.right}>
        <Ionicons name="chevron-forward" size={20} color={AppColors.DARKGREY} />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MedicineListItem);
