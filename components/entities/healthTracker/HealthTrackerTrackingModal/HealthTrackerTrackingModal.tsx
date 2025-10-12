import React, { useCallback, useState } from "react";
import { Alert, Keyboard, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { ModalWithBackDrop } from "@/components/common/ModalWithBackDrop";
import { Text } from "@/components/common/typography/Text";
import { Input } from "@/components/common/inputs/Input";
import { Button } from "@/components/common/buttons/Button";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { APIService } from "@/services/APIService";
import { queryClient } from "@/providers/QueryProvider";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import { getHealthTrackerEmoji } from "@/utils/entities/healthTrackers/getHealthTrackerEmoji";
import { getHealthTrackerName } from "@/utils/entities/healthTrackers/getHealthTrackerName";
import {
  getFieldConfig,
  validateHealthTrackerInput,
} from "./utils";
import { styles } from "./styles";
import type { HealthTrackerTrackingModalProps } from "./types";
import type { HealthTrackingLogDataForInsert } from "@/types/healthTrackingLogs";

export const HealthTrackerTrackingModal: React.FC<
  HealthTrackerTrackingModalProps
> = ({ healthTracker, onClose }) => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fieldConfig = getFieldConfig(healthTracker.type);

  // Check if form is valid for button state
  const isFormValid = useCallback(() => {
    const validation = validateHealthTrackerInput(
      healthTracker.type,
      value1,
      fieldConfig.hasSecondField ? value2 : undefined,
    );
    return validation.isValid;
  }, [healthTracker.type, value1, value2, fieldConfig.hasSecondField]);

  const { mutateAsync: recordHealthTracker, isPending: isRecording } =
    useMutation({
      mutationFn: async (data: HealthTrackingLogDataForInsert) => {
        await APIService.healthTrackingLogs.record(healthTracker, data);

        // Invalidate relevant queries to refresh the UI
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.HEALTH_TRACKERS.BY_DATE],
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.HEALTH_TRACKER_LOGS.BY_DATE],
          }),
        ]);
      },
    });

  const handleValue1Change = useCallback(
    (text: string) => {
      setValue1(text);
      setErrors([]);
    },
    [],
  );

  const handleValue2Change = useCallback(
    (text: string) => {
      setValue2(text);
      setErrors([]);
    },
    [],
  );

  const handleValue1Blur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const handleValue2Blur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const handleRecord = useCallback(async () => {
    // Dismiss keyboard first
    Keyboard.dismiss();

    // Small delay to ensure keyboard is dismissed
    setTimeout(async () => {
      // Validate inputs
      const validation = validateHealthTrackerInput(
        healthTracker.type,
        value1,
        fieldConfig.hasSecondField ? value2 : undefined,
      );

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      try {
        const data: HealthTrackingLogDataForInsert = {
          date: new Date(),
          value1: parseFloat(value1),
          value2:
            fieldConfig.hasSecondField && value2 ? parseFloat(value2) : null,
        };

        await recordHealthTracker(data);
        onClose();
      } catch (error) {
        console.error("Error recording health tracker:", error);
        Alert.alert(
          LanguageService.translate("Something went wrong"),
          "Failed to record health tracker data. Please try again.",
        );
      }
    }, 100);
  }, [
    healthTracker,
    value1,
    value2,
    fieldConfig.hasSecondField,
    recordHealthTracker,
    onClose,
  ]);

  const handleCancel = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  return (
    <ModalWithBackDrop
      onClose={onClose}
      title={`${getHealthTrackerEmoji(healthTracker.type)} ${getHealthTrackerName(healthTracker.type)} ${LanguageService.translate("Now").toLowerCase()}`}
      isLoading={isRecording}
    >
      <View style={styles.form}>
        {/* Primary Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            {LanguageService.translate(fieldConfig.label1Key)}
          </Text>
          <View style={styles.fieldRow}>
            <Input
              value={value1}
              onChangeText={handleValue1Change}
              onFocus={() => setFocusedField("value1")}
              onBlur={handleValue1Blur}
              placeholder={fieldConfig.placeholder1}
              keyboardType="numeric"
              returnKeyType={fieldConfig.hasSecondField ? "next" : "done"}
              onSubmitEditing={() => {
                if (fieldConfig.hasSecondField) {
                  // Focus on second field if available
                } else {
                  handleRecord();
                }
              }}
              error={errors.length > 0 ? errors[0] : null}
            />
            {fieldConfig.unit1Key && (
              <Text style={styles.unitLabel}>
                {LanguageService.translate(fieldConfig.unit1Key)}
              </Text>
            )}
          </View>
        </View>

        {/* Secondary Field (for blood pressure) */}
        {fieldConfig.hasSecondField && (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {LanguageService.translate(fieldConfig.label2Key!)}
            </Text>
            <View style={styles.fieldRow}>
              <Input
                value={value2}
                onChangeText={handleValue2Change}
                onFocus={() => setFocusedField("value2")}
                onBlur={handleValue2Blur}
                placeholder={fieldConfig.placeholder2 || ""}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleRecord}
                error={errors.length > 1 ? errors[1] : null}
              />
              {fieldConfig.unit2Key && (
                <Text style={styles.unitLabel}>
                  {LanguageService.translate(fieldConfig.unit2Key)}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          text={LanguageService.translate("Cancel")}
          onPress={handleCancel}
          disabled={isRecording}
          color={AppColors.GREY}
          style={styles.button}
        />
        <Button
          text={LanguageService.translate("Record")}
          onPress={handleRecord}
          disabled={isRecording || !isFormValid()}
          color={AppColors.PRIMARY}
          style={styles.button}
        />
      </View>

      {/* Loading Overlay */}
    </ModalWithBackDrop>
  );
};
