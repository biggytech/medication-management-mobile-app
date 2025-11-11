import React from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import {
  createDayData,
  generateLast7Days,
  getRelativeDateText,
  getTranslatedDayName,
} from "./utils";
import type { Last7DaysProps } from "./types";
import { Text } from "@/components/common/typography/Text";
import { boxShadowStyles } from "@/assets/styles/shadows";

/**
 * Last7Days component displays a row of 7 days (including today and 6 previous days)
 * with the ability to select an active date. The active date is highlighted with
 * the app's accent color, and below the days row shows the relative date text.
 */
export const Last7Days: React.FC<Last7DaysProps> = ({
  activeDate,
  onActiveDateChange,
}) => {
  const days = generateLast7Days();

  const handleDayPress = (date: Date) => {
    onActiveDateChange(date);
  };

  return (
    <View style={[boxShadowStyles.small, styles.container]}>
      <View style={styles.daysRow}>
        {days.map((date) => {
          const dayData = createDayData(date, activeDate);
          const translatedDayName = getTranslatedDayName(dayData.dayName);

          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={styles.dayContainer}
              onPress={() => handleDayPress(date)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayName,
                  dayData.isActive && styles.dayNameActive,
                ]}
              >
                {translatedDayName}
              </Text>

              <View
                style={[
                  styles.dayNumberContainer,
                  dayData.isActive && styles.dayNumberContainerActive,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    dayData.isActive && styles.dayNumberActive,
                  ]}
                >
                  {dayData.dayNumber}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.activeDateText}>
        {getRelativeDateText(activeDate)}
      </Text>
    </View>
  );
};
