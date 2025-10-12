import React from "react";
import type { HealthTrackerListItemProps } from "@/components/entities/healthTracker/HealthTrackerListItem/types";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/styling/colors";

import { styles } from "./styles";
import { Round } from "@/components/common/Round";
import { formatNextTakeDate } from "@/utils/schedules/formatNextTakeDate";
import { isOverdue } from "@/utils/schedules/isOverdue";
import { formatNextTakeDateShort } from "@/utils/schedules/formatNextTakeDateShort";
import { isDueOrOverdueToday } from "@/utils/schedules/isDueOrOverdueToday";
import { isEndingToday } from "@/utils/schedules/isEndingToday";
import { LanguageService } from "@/services/language/LanguageService";
import { getHealthTrackerName } from "@/utils/entities/healthTrackers/getHealthTrackerName";
import { getHealthTrackerEmoji } from "@/utils/entities/healthTrackers/getHealthTrackerEmoji";

const HealthTrackerListItem: React.FC<HealthTrackerListItemProps> = ({
  healthTracker,
  onPress,
  shortDate = false,
  alwaysShowDates = false,
  isPressable = true,
  squared = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.item, squared ? styles.itemSquared : {}]}
      onPress={
        isPressable ? () => onPress(healthTracker.id.toString()) : undefined
      }
      activeOpacity={isPressable ? 0.7 : 1}
    >
      <View style={styles.left}>
        <Round shadow small>
          <Text>{getHealthTrackerEmoji(healthTracker.type)}</Text>
        </Round>
      </View>
      <View>
        <Text style={styles.title}>
          {getHealthTrackerName(healthTracker.type)}
        </Text>
        {(alwaysShowDates || isDueOrOverdueToday(healthTracker)) && (
          <Text
            style={[
              styles.subTitle,
              isOverdue(healthTracker) ? styles.overdue : {},
            ]}
          >
            {shortDate
              ? formatNextTakeDateShort(healthTracker)
              : formatNextTakeDate(healthTracker)}
          </Text>
        )}
        {isEndingToday(healthTracker) && (
          <Text style={[styles.subTitle]}>
            {LanguageService.translate("Ending today")}
          </Text>
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

export default React.memo(HealthTrackerListItem);
