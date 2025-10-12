import React from "react";
import { View } from "react-native";
import { Text } from "@/components/common/typography/Text";

import { styles } from "./styles";
import { Round } from "@/components/common/Round";
import { getHealthTrackerEmoji } from "@/utils/entities/healthTrackers/getHealthTrackerEmoji";
import { getHealthTrackerName } from "@/utils/entities/healthTrackers/getHealthTrackerName";
import { formatHealthTrackerValue } from "@/utils/entities/healthTrackers/formatHealthTrackerValue";
import type { HealthTrackingLogListItemProps } from "./types";
import { LanguageService } from "@/services/language/LanguageService";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";

const HealthTrackingLogListItem: React.FC<HealthTrackingLogListItemProps> = ({
  healthTrackingLog,
}) => {
  const { healthTracker } = healthTrackingLog;

  const formatValue = () => {
    const { value1, value2 } = healthTrackingLog;
    return formatHealthTrackerValue(healthTracker.type, value1, value2);
  };

  return (
    <View style={styles.item}>
      <View style={styles.left}>
        <Round shadow small>
          <Text>{getHealthTrackerEmoji(healthTracker.type)}</Text>
        </Round>
      </View>
      <View>
        <Text style={styles.title}>
          {getHealthTrackerName(healthTracker.type)}
        </Text>
        <Text style={[styles.subTitle, styles.valueText]}>
          {LanguageService.translate("Recorded")}: {formatValue()} -{" "}
          {hhmmFromDate(new Date(healthTrackingLog.date))}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(HealthTrackingLogListItem);
