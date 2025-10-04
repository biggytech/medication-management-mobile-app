import React, { useMemo, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { styles } from "./styles";
import type { DatePickerProps } from "./types";
import { Text } from "@/components/common/typography/Text";
import { Button } from "@/components/common/buttons/Button";
import { Link } from "@/components/common/buttons/Link";
import { LanguageService } from "@/services/language/LanguageService";
import { clampToDateOnly, ddmmyyyyFromDate } from "@/utils/date";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  placeholder,
  style,
  allowSkip = true,
  onSkipClick,
  error,
  onBlur,
}) => {
  const valueAsDate = value ?? null;

  const displayText = useMemo(() => {
    if (!value) return placeholder ?? LanguageService.translate("Select date");
    try {
      return ddmmyyyyFromDate(clampToDateOnly(value));
    } catch {
      return placeholder ?? LanguageService.translate("Select date");
    }
  }, [placeholder, value]);

  const minimumDate = useMemo(
    () => clampToDateOnly(minDate ?? new Date()),
    [minDate],
  );

  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const handlePickerChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      const clamped = clampToDateOnly(selected);
      onChange(clamped);
      setIsPickerVisible(false);
    }
    onBlur?.();
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.control, error ? styles.errored : {}]}
        onPress={() => setIsPickerVisible((v) => !v)}
      >
        <Text style={styles.controlText}>{displayText}</Text>
      </TouchableOpacity>
      <ErrorMessage text={error} />
      <View style={styles.actions}>
        <Button
          style={styles.action}
          text={LanguageService.translate("Today")}
          onPress={() => {
            const today = clampToDateOnly(new Date());
            onChange(today);
            setIsPickerVisible(false);
          }}
        />
        {allowSkip && (
          <Link
            style={styles.action}
            text={LanguageService.translate("Skip")}
            onPress={() => {
              onChange(null);
              setIsPickerVisible(false);
              onSkipClick?.();
            }}
          />
        )}
      </View>
      {isPickerVisible && (
        <DateTimePicker
          value={clampToDateOnly(valueAsDate ?? new Date())}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          mode="date"
          minimumDate={minimumDate}
          onChange={handlePickerChange}
        />
      )}
    </View>
  );
};

export default React.memo(DatePicker);
