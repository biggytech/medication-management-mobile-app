import React from "react";
import type { MedicineListItemProps } from "@/components/entities/medicine/MedicineListItem/types";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/styling/colors";

import { styles } from "./styles";
import { Round } from "@/components/common/Round";
import { getMedicineEmoji } from "@/utils/ui/getMedicineEmoji";
import { formatNextDoseDate } from "@/utils/entities/medicine/formatNextDoseDate";
import { isOverdue } from "@/utils/entities/medicine/isOverdue";
import { formatNextDoseDateShort } from "@/utils/entities/medicine/formatNextDoseDateShort";
import { isDueOrOverdueToday } from "@/utils/entities/medicine/isDueOrOverdueToday";
import { isEndingToday } from "@/utils/entities/medicine/isEndingToday";
import { LanguageService } from "@/services/language/LanguageService";

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
        {isDueOrOverdueToday(medicine) && (
          <Text
            style={[styles.subTitle, isOverdue(medicine) ? styles.overdue : {}]}
          >
            {shortDoseDate
              ? formatNextDoseDateShort(medicine)
              : formatNextDoseDate(medicine)}
          </Text>
        )}
        {isEndingToday(medicine) && (
          <Text style={[styles.subTitle]}>
            {LanguageService.translate("Ending today")}
          </Text>
        )}
      </View>
      <View style={styles.right}>
        <Ionicons name="chevron-forward" size={20} color={AppColors.DARKGREY} />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MedicineListItem);
