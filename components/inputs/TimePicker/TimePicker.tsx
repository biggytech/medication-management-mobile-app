import React, { useState } from "react";
import { TouchableOpacity, View, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { styles } from "./styles";
import type { TimePickerProps } from "./types";
import { Text } from "@/components/typography/Text";
import { LanguageService } from "@/services/language/LanguageService";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { Link } from "@/components/buttons/Link";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";

// Renders a native time picker using @react-native-community/datetimepicker with configurable minute intervals.
const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder,
  allowClear = false,
  error,
  onBlur,
  label,
  minuteStep = FEATURE_FLAGS.TIME_PICKER_INTERVAL,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Convert string time to Date object
  const getDateFromTimeString = (timeString: string | null): Date => {
    if (!timeString) {
      return new Date();
    }
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Convert Date object to time string
  const getTimeStringFromDate = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const displayText =
    value ?? placeholder ?? LanguageService.translate("Select time");

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowPicker(Platform.OS === "ios");

    if (selectedDate) {
      const timeString = getTimeStringFromDate(selectedDate);
      onChange(timeString);
      onBlur?.();
    }
  };

  const handleClear = () => {
    onChange(null);
    onBlur?.();
  };

  const currentDate = getDateFromTimeString(value);

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>🕐 {label}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.control, error ? styles.errored : {}]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.controlText}>{displayText}</Text>
        {allowClear && value && (
          <View style={styles.clearButtonContainer}>
            <Link
              style={styles.clearButtonStyle}
              onPress={handleClear}
              text={
                <Ionicons
                  name={"close"}
                  size={FontSizes.STANDART}
                  color={AppColors.SECONDARY}
                />
              }
            />
          </View>
        )}
      </TouchableOpacity>

      <ErrorMessage text={error} />

      {showPicker && (
        <DateTimePicker
          {...({
            value: currentDate,
            mode: "time",
            is24Hour: true,
            display: Platform.OS === "ios" ? "spinner" : "spinner",
            onChange: handleTimeChange,
            minuteInterval: minuteStep,
          } as any)}
        />
      )}
    </View>
  );
};

export default React.memo(TimePicker);
