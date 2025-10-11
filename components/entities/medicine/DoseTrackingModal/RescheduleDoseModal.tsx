import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { Button } from "@/components/common/buttons/Button";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { getMedicineEmoji } from "@/utils/ui/getMedicineEmoji";
import { getMedicineDoseText } from "@/utils/ui/getMedicineDoseText";
import { getNextAvailableTimeSlot } from "./utils";
import { styles } from "./styles";
import type { RescheduleDoseModalProps } from "./types";
import { DoseTimeSelector } from "./DoseTimeSelector";
import { ModalWithBackDrop } from "@/components/common/ModalWithBackDrop";

/**
 * Modal for rescheduling a medication dose
 * Allows user to reschedule dose for 5-10 minutes later
 */
export const RescheduleDoseModal: React.FC<RescheduleDoseModalProps> = ({
  medicine,
  isVisible,
  onClose,
  onRescheduleDose,
}) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(
    getNextAvailableTimeSlot(),
  );
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [notes, setNotes] = useState("");

  const handleReschedule = async () => {
    if (!selectedTime) return;

    try {
      await onRescheduleDose(selectedTime, notes || undefined);
      onClose();
    } catch (error) {
      console.error("Error rescheduling dose:", error);
    }
  };

  const handleTimeSelected = (time: Date) => {
    setSelectedTime(time);
    setShowTimeSelector(false);
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
        title={LanguageService.translate("Reschedule Dose")}
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

        {/* Time Selection */}
        <View style={styles.doseInfo}>
          <Text style={styles.doseInfoTitle}>
            {LanguageService.translate("Reschedule to")}
          </Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: AppColors.GREY }]}
            onPress={() => setShowTimeSelector(true)}
          >
            <Text style={[styles.actionButtonText, { color: AppColors.FONT }]}>
              {selectedTime
                ? formatSelectedTime()
                : LanguageService.translate("Select Date & Time")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Time Display */}
        {selectedTime && (
          <View style={styles.doseInfo}>
            <Text style={styles.doseInfoTitle}>
              {LanguageService.translate("New time")}
            </Text>
            <Text style={styles.doseInfoText}>{formatSelectedTime()}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            text={LanguageService.translate("Reschedule Dose")}
            onPress={handleReschedule}
            color={AppColors.ACCENT}
            style={styles.actionButton}
          />
        </View>
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
