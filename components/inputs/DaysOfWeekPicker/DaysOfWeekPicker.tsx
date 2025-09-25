import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import type { DaysOfWeekPickerProps } from "./types";
import { Text } from "@/components/typography/Text";
import { LanguageService } from "@/services/language/LanguageService";

const DaysOfWeekPicker: React.FC<DaysOfWeekPickerProps> = ({
  values,
  onChange,
}) => {
  const days = useMemo(
    () => [
      LanguageService.translate("Sun"),
      LanguageService.translate("Mon"),
      LanguageService.translate("Tue"),
      LanguageService.translate("Wed"),
      LanguageService.translate("Thu"),
      LanguageService.translate("Fri"),
      LanguageService.translate("Sat"),
    ],
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {days.map((d, idx) => {
          const selected = values.includes(idx);
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.day, selected ? styles.selected : {}]}
              onPress={() => {
                const next = selected
                  ? values.filter((v) => v !== idx)
                  : [...values, idx];
                onChange(next.sort());
              }}
            >
              <Text>{d}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(DaysOfWeekPicker);
