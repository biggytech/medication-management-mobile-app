import React, { useState, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import {
  createDayData,
  generateLast7Days,
  getRelativeDateText,
  getTranslatedDayName,
  isCurrentWeek,
} from "./utils";
import type { Last7DaysProps } from "./types";
import { Text } from "@/components/common/typography/Text";
import { boxShadowStyles } from "@/assets/styles/shadows";
import { IconButton } from "@/components/common/buttons/IconButton";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { getMondayOfWeek } from "@/utils/date/getMondayOfWeek";
import { addDays } from "@/utils/date/addDays";
import { LanguageService } from "@/services/language/LanguageService";

/**
 * Last7Days component displays a row of 7 days starting from Monday of the week
 * with the ability to select an active date. The active date is highlighted with
 * the app's accent color, and below the days row shows the relative date text.
 * Includes arrow buttons to navigate 7 days back or forward, and a "Today" button
 * to quickly return to the current week when viewing a different week.
 */
export const Last7Days: React.FC<Last7DaysProps> = ({
  activeDate,
  onActiveDateChange,
}) => {
  // Initialize start date to Monday of current week
  const getInitialStartDate = () => {
    const today = new Date();
    return getMondayOfWeek(today);
  };

  const [windowStartDate, setWindowStartDate] =
    useState<Date>(getInitialStartDate);

  const days = useMemo(
    () => generateLast7Days(windowStartDate),
    [windowStartDate],
  );

  const isShowingCurrentWeek = useMemo(
    () => isCurrentWeek(windowStartDate),
    [windowStartDate],
  );

  const handleDayPress = (date: Date) => {
    onActiveDateChange(date);
  };

  const handlePreviousWeek = () => {
    const newStartDate = addDays(windowStartDate, -7);
    setWindowStartDate(newStartDate);
    // Automatically select the first day (Monday) of the new week
    onActiveDateChange(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = addDays(windowStartDate, 7);
    setWindowStartDate(newStartDate);
    // Automatically select the first day (Monday) of the new week
    onActiveDateChange(newStartDate);
  };

  const handleReturnToToday = () => {
    const today = new Date();
    const mondayOfCurrentWeek = getMondayOfWeek(today);
    setWindowStartDate(mondayOfCurrentWeek);
    onActiveDateChange(today);
  };

  return (
    <View style={[boxShadowStyles.small, styles.container]}>
      <View style={styles.daysRow}>
        <View style={styles.arrowButton}>
          <IconButton
            iconName="chevron-back"
            onPress={handlePreviousWeek}
            color={AppColors.ACCENT}
            size={Spacings.STANDART}
          />
        </View>
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
        <View style={styles.arrowButton}>
          <IconButton
            iconName="chevron-forward"
            onPress={handleNextWeek}
            color={AppColors.ACCENT}
            size={Spacings.STANDART}
          />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.activeDateText}>
          {getRelativeDateText(activeDate)}
        </Text>
        {!isShowingCurrentWeek && (
          <TouchableOpacity
            onPress={handleReturnToToday}
            style={styles.returnBackButton}
            activeOpacity={0.7}
          >
            <Text style={styles.returnBackButtonText}>
              {LanguageService.translate("return to today")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
