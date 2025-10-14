import React from "react";
import type { MedicineListItemProps } from "@/components/entities/medicine/MedicineListItem/types";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/styling/colors";

import { styles } from "./styles";
import { Round } from "@/components/common/Round";
import { getMedicineEmoji } from "@/utils/entities/medicine/getMedicineEmoji";
import { formatNextTakeDate } from "@/utils/schedules/formatNextTakeDate";
import { isOverdue } from "@/utils/schedules/isOverdue";
import { formatNextTakeDateShort } from "@/utils/schedules/formatNextTakeDateShort";
import { isDueOrOverdueToday } from "@/utils/schedules/isDueOrOverdueToday";
import { isEndingToday } from "@/utils/schedules/isEndingToday";
import { LanguageService } from "@/services/language/LanguageService";
import {
  getLowCountWarningText,
  getMedicineCountDisplayText,
  isLowCount,
} from "@/utils/entities/medicine/getMedicineCountText";
import { isNotNullish } from "@/utils/types/isNotNullish";

const MedicineListItem: React.FC<MedicineListItemProps> = ({
  medicine,
  onPress,
  shortDoseDate = false,
  alwaysShowDates = false,
  isPressable = true,
}) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={isPressable ? () => onPress(medicine.id) : undefined}
      activeOpacity={isPressable ? 0.7 : 1}
    >
      <View style={styles.left}>
        <Round shadow small>
          <Text>{getMedicineEmoji(medicine)}</Text>
        </Round>
      </View>
      <View>
        <Text style={styles.title}>{medicine.title}</Text>
        {(alwaysShowDates || isDueOrOverdueToday(medicine)) && (
          <Text
            style={[styles.subTitle, isOverdue(medicine) ? styles.overdue : {}]}
          >
            {shortDoseDate
              ? formatNextTakeDateShort(medicine)
              : formatNextTakeDate(medicine)}
          </Text>
        )}
        {isEndingToday(medicine) && (
          <Text style={[styles.subTitle]}>
            {LanguageService.translate("Ending today")}
          </Text>
        )}
        {isNotNullish(medicine.count) && (
          <>
            <Text
              style={[styles.subTitle, isLowCount(medicine) ? styles.warn : {}]}
            >
              {getMedicineCountDisplayText(medicine)}
            </Text>
            {isLowCount(medicine) && (
              <Text style={[styles.subTitle, styles.lowCount]}>
                {getLowCountWarningText(medicine)}
              </Text>
            )}
          </>
        )}
      </View>
      <View style={styles.right}>
        {isPressable && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={AppColors.DARKGREY}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MedicineListItem);
