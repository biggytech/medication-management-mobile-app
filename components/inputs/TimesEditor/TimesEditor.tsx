import React, { useCallback } from "react";
import { View, ScrollView } from "react-native";
import type { TimesEditorProps } from "./types";
import { styles } from "./styles";
import { Button } from "@/components/Button";
import { Link } from "@/components/buttons/Link";
import { TimePicker } from "@/components/inputs/TimePicker";
import { LanguageService } from "@/services/language/LanguageService";
import { Text } from "@/components/typography/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";

const TimesEditor: React.FC<TimesEditorProps> = ({
  values,
  onChange,
  min = 1,
  max = 12,
  allowDuplicates = false,
  label,
  style,
  showAddButton = false,
}) => {
  const updateAt = useCallback(
    (idx: number, val: string | null) => {
      const next = [...values];
      if (val === null) {
        next.splice(idx, 1);
      } else {
        next[idx] = val;
      }
      onChange(dedupe(next, allowDuplicates));
    },
    [values, onChange, allowDuplicates],
  );

  const addTime = useCallback(() => {
    if (values.length >= max) return;
    onChange([...values, "08:00"]);
  }, [values, onChange, max]);

  const removeAt = useCallback(
    (idx: number) => {
      const next = values.filter((_, i) => i !== idx);
      onChange(next);
    },
    [values, onChange],
  );

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>🕐 {label}</Text>
        </View>
      )}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator>
        {values.map((t, idx) => (
          <View key={`${t}-${idx}`} style={styles.row}>
            <View style={styles.time}>
              <TimePicker
                value={t}
                onChange={(v: string | null) => updateAt(idx, v)}
              />
            </View>
            {values.length > min && (
              <Link
                style={styles.removeButton}
                text={
                  <Ionicons
                    name={"trash"}
                    size={FontSizes.BIG}
                    color={AppColors.NEGATIVE}
                  />
                }
                onPress={() => removeAt(idx)}
              />
            )}
          </View>
        ))}
      </ScrollView>
      {showAddButton && values.length < max && (
        <View style={styles.addButtonContainer}>
          <Button
            text={LanguageService.translate("Add time")}
            onPress={addTime}
          />
        </View>
      )}
    </View>
  );
};

function dedupe(list: string[], allowDuplicates: boolean): string[] {
  if (allowDuplicates) return list;
  const set = new Set(list);
  return Array.from(set);
}

export default React.memo(TimesEditor);
