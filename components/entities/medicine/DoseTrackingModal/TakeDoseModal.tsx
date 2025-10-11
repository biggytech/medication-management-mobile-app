import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { Button } from "@/components/common/buttons/Button";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { getMedicineEmoji } from "@/utils/ui/getMedicineEmoji";
import { getMedicineDoseText } from "@/utils/ui/getMedicineDoseText";
import { styles } from "./styles";
import type { TakeDoseModalProps } from "./types";
import { DoseTimeSelector } from "./DoseTimeSelector";
import { ModalWithBackDrop } from "@/components/common/ModalWithBackDrop";

/**
 * Modal for taking a medication dose
 * Allows user to take dose now or schedule for later
 */
export const TakeDoseModal: React.FC<TakeDoseModalProps> = ({
  medicine,
  isVisible,
  onClose,
  onTakeDose,
}) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [notes, setNotes] = useState("");

  const handleTakeNow = async () => {
    try {
      await onTakeDose();
      onClose();
    } catch (error) {
      console.error("Error taking dose:", error);
    }
  };

  const handleTakeLater = () => {
    setShowTimeSelector(true);
  };

  const handleTimeSelected = (time: Date) => {
    setSelectedTime(time);
    setShowTimeSelector(false);
  };

  const handleSubmit = async () => {
    try {
      await onTakeDose(selectedTime || undefined, notes || undefined);
      onClose();
    } catch (error) {
      console.error("Error taking dose:", error);
    }
  };

  const formatSelectedTime = () => {
    if (!selectedTime) return "";
    return selectedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <ModalWithBackDrop
        onClose={onClose}
        title={LanguageService.translate("Take Dose")}
      >
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineEmoji}>{getMedicineEmoji(medicine)}</Text>
          <View style={styles.medicineDetails}>
            <Text style={styles.medicineTitle}>{medicine.title}</Text>
            <Text style={styles.medicineDose}>
              {medicine.schedule.dose} {getMedicineDoseText(medicine)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            text={LanguageService.translate("Take Now")}
            onPress={handleTakeNow}
            color={AppColors.POSITIVE}
            style={styles.actionButton}
          />
          <Button
            text={LanguageService.translate("Take Later")}
            onPress={handleTakeLater}
            color={AppColors.ACCENT}
            style={styles.actionButton}
          />
        </View>

        {/* Selected Time Display */}
        {selectedTime && (
          <View style={styles.doseInfo}>
            <Text style={styles.doseInfoTitle}>
              {LanguageService.translate("Scheduled for")}
            </Text>
            <Text style={styles.doseInfoText}>{formatSelectedTime()}</Text>
          </View>
        )}

        {/* Submit Button */}
        {selectedTime && (
          <Button
            text={LanguageService.translate("Confirm")}
            onPress={handleSubmit}
            color={AppColors.POSITIVE}
            style={styles.actionButton}
          />
        )}
      </ModalWithBackDrop>

      {/* Time Selector Modal */}
      <DoseTimeSelector
        selectedTime={selectedTime}
        onTimeChange={handleTimeSelected}
        onClose={() => setShowTimeSelector(false)}
        isVisible={showTimeSelector}
      />
    </>
  );
};
