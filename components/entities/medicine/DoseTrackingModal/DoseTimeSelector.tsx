import React, { useState } from "react";
import { Modal, View, TouchableOpacity, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text } from "@/components/common/typography/Text";
import { IconButton } from "@/components/common/buttons/IconButton";
import { Button } from "@/components/common/buttons/Button";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { getNextAvailableTimeSlot, getMaxRescheduleTime } from "./utils";
import { styles } from "./styles";
import type { DoseTimeSelectorProps } from "./types";

/**
 * Component for selecting a time for dose scheduling
 * Shows time picker with constraints for rescheduling (5-10 minutes)
 */
export const DoseTimeSelector: React.FC<DoseTimeSelectorProps & { isVisible: boolean }> = ({
  selectedTime,
  onTimeChange,
  onClose,
  isVisible,
}) => {
  const [tempTime, setTempTime] = useState(selectedTime || getNextAvailableTimeSlot());
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = () => {
    onTimeChange(tempTime);
    onClose();
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempTime(selectedDate);
    }
    setShowPicker(false);
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const minTime = getNextAvailableTimeSlot();
  const maxTime = getMaxRescheduleTime();

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
              {LanguageService.translate("Select Time")}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <IconButton iconName="close" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Current Selection */}
            <View style={styles.doseInfo}>
              <Text style={styles.doseInfoTitle}>
                {LanguageService.translate("Selected time")}
              </Text>
              <Text style={styles.doseInfoText}>
                {formatTime(tempTime)}
              </Text>
            </View>

            {/* Time Picker Button */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: AppColors.GREY }]}
              onPress={() => setShowPicker(true)}
            >
              <Text style={[styles.actionButtonText, { color: AppColors.FONT }]}>
                {LanguageService.translate("Change time")}
              </Text>
            </TouchableOpacity>

            {/* Time Constraints Info */}
            <View style={styles.doseInfo}>
              <Text style={styles.doseInfoTitle}>
                {LanguageService.translate("Available time range")}
              </Text>
              <Text style={styles.doseInfoText}>
                {formatTime(minTime)} - {formatTime(maxTime)}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                text={LanguageService.translate("Confirm")}
                onPress={handleConfirm}
                color={AppColors.POSITIVE}
                style={styles.actionButton}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Time Picker */}
      {showPicker && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour={true}
          display="default"
          minimumDate={minTime}
          maximumDate={maxTime}
          onChange={handleTimeChange}
        />
      )}
    </Modal>
  );
};
