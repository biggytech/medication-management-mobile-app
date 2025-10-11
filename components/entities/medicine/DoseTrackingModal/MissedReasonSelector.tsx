import React, { useState } from "react";
import { Modal, View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { IconButton } from "@/components/common/buttons/IconButton";
import { Button } from "@/components/common/buttons/Button";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { MISSED_DOSE_REASONS } from "./constants";
import { styles } from "./styles";
import type { MissedReasonSelectorProps } from "./types";

/**
 * Component for selecting a reason for missing a dose
 * Shows list of predefined reasons for missing medication
 */
export const MissedReasonSelector: React.FC<MissedReasonSelectorProps & { isVisible: boolean }> = ({
  selectedReason,
  onReasonChange,
  onClose,
  isVisible,
}) => {
  const [tempReason, setTempReason] = useState(selectedReason);

  const handleConfirm = () => {
    if (tempReason) {
      onReasonChange(tempReason);
    }
    onClose();
  };

  const handleReasonSelect = (reason: any) => {
    setTempReason(reason);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {LanguageService.translate("Reason for Missing")}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <IconButton iconName="close" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Reason Options */}
            {MISSED_DOSE_REASONS.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.doseItem,
                  tempReason?.value === reason.value && {
                    backgroundColor: AppColors.PRIMARY,
                  },
                ]}
                onPress={() => handleReasonSelect(reason)}
              >
                <Text
                  style={[
                    styles.doseInfoText,
                    tempReason?.value === reason.value && {
                      color: AppColors.WHITE,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {LanguageService.translate(reason.label)}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                text={LanguageService.translate("Confirm")}
                onPress={handleConfirm}
                color={AppColors.POSITIVE}
                style={styles.actionButton}
                disabled={!tempReason}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
