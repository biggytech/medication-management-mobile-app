import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { Button } from "@/components/common/buttons/Button";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { getMedicineEmoji } from "@/utils/entities/medicine/getMedicineEmoji";
import { getMedicineDoseText } from "@/utils/entities/medicine/getMedicineDoseText";
import { styles } from "./styles";
import type { SkipDoseModalProps } from "./types";
import { MissedReasonSelector } from "./MissedReasonSelector";
import { ModalWithBackDrop } from "@/components/common/ModalWithBackDrop";

/**
 * Modal for skipping a medication dose
 * Allows user to select reason for missing the dose
 */
export const SkipDoseModal: React.FC<SkipDoseModalProps> = ({
  medicine,
  isVisible,
  onClose,
  onSkipDose,
}) => {
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [showReasonSelector, setShowReasonSelector] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSkipDose = () => {
    if (!selectedReason) {
      setShowReasonSelector(true);
      return;
    }

    onSkipDose(selectedReason, notes || undefined);
    onClose();
  };

  const handleReasonSelected = (reason: any) => {
    setSelectedReason(reason);
    setShowReasonSelector(false);
  };

  const getSelectedReasonText = () => {
    if (!selectedReason) return "";
    return LanguageService.translate(selectedReason.label);
  };

  return (
    <>
      <ModalWithBackDrop
        onClose={onClose}
        title={LanguageService.translate("Skip Dose")}
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

        {/* Reason Selection */}
        <View style={styles.doseInfo}>
          <Text style={styles.doseInfoTitle}>
            {LanguageService.translate("Reason for Missing")}
          </Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: AppColors.GREY }]}
            onPress={() => setShowReasonSelector(true)}
          >
            <Text style={[styles.actionButtonText, { color: AppColors.FONT }]}>
              {selectedReason
                ? getSelectedReasonText()
                : LanguageService.translate("Select reason")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Reason Display */}
        {selectedReason && (
          <View style={styles.doseInfo}>
            <Text style={styles.doseInfoTitle}>
              {LanguageService.translate("Selected reason")}
            </Text>
            <Text style={styles.doseInfoText}>{getSelectedReasonText()}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            text={LanguageService.translate("Skip Dose")}
            onPress={handleSkipDose}
            color={AppColors.NEGATIVE}
            style={styles.actionButton}
          />
        </View>
      </ModalWithBackDrop>

      {/* Reason Selector Modal */}
      <MissedReasonSelector
        selectedReason={selectedReason}
        onReasonChange={handleReasonSelected}
        onClose={() => setShowReasonSelector(false)}
        isVisible={showReasonSelector}
      />
    </>
  );
};
