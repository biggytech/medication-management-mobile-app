import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import type { DaysOfWeekPickerProps } from "./types";
import { Text } from "@/components/common/typography/Text";
import { LanguageService } from "@/services/language/LanguageService";

const DaysOfWeekPicker: React.FC<DaysOfWeekPickerProps> = ({
  values,
  onChange,
}) => {
  const days = useMemo(
    () => [
      { label: LanguageService.translate("Mon"), value: 1 },
      { label: LanguageService.translate("Tue"), value: 2 },
      { label: LanguageService.translate("Wed"), value: 3 },
      { label: LanguageService.translate("Thu"), value: 4 },
      { label: LanguageService.translate("Fri"), value: 5 },
      { label: LanguageService.translate("Sat"), value: 6 },
      { label: LanguageService.translate("Sun"), value: 0 },
    ],
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {days.map(({ label, value }) => {
          const selected = values.includes(value);
          return (
            <TouchableOpacity
              key={value}
              style={[styles.day, selected ? styles.selected : {}]}
              onPress={() => {
                const next = selected
                  ? values.filter((v) => v !== value)
                  : [...values, value];
                onChange(next.sort());
              }}
            >
              <Text>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(DaysOfWeekPicker);
