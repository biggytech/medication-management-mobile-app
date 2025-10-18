import React, { useState } from "react";
import { View } from "react-native";
import { ModalWithBackDrop } from "@/components/common/ModalWithBackDrop";
import { DatePicker } from "@/components/common/inputs/DatePicker";
import { PrimaryButton } from "@/components/common/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/common/buttons/SecondaryButton";
import { Text } from "@/components/common/typography/Text";
import { LanguageService } from "@/services/language/LanguageService";
import { styles } from "./styles";
import type { PatientReportModalProps } from "./types";

const PatientReportModal: React.FC<PatientReportModalProps> = ({
  visible,
  onClose,
  onSendReport,
  patientName,
  isLoading = false,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);

  const handleSendReport = () => {
    let hasError = false;

    // Validate start date
    if (!startDate) {
      setStartDateError(LanguageService.translate("Start date is required"));
      hasError = true;
    } else {
      setStartDateError(null);
    }

    // Validate end date
    if (!endDate) {
      setEndDateError(LanguageService.translate("End date is required"));
      hasError = true;
    } else {
      setEndDateError(null);
    }

    // Validate date range
    if (startDate && endDate && startDate > endDate) {
      setEndDateError(
        LanguageService.translate("End date must be after start date"),
      );
      hasError = true;
    }

    if (!hasError && startDate && endDate) {
      onSendReport(startDate, endDate);
    }
  };

  const handleClose = () => {
    setStartDate(null);
    setEndDate(null);
    setStartDateError(null);
    setEndDateError(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <ModalWithBackDrop
      title={LanguageService.translate("Generate Patient Report")}
      onClose={handleClose}
      isLoading={isLoading}
    >
      <View style={styles.container}>
        <Text style={styles.patientName}>{patientName}</Text>

        <View style={styles.datePickerContainer}>
          <DatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder={LanguageService.translate("Select start date")}
            error={startDateError}
            onBlur={() => setStartDateError(null)}
            minDate={new Date(2020, 0, 1)} // Allow historical data
          />
        </View>

        <View style={styles.datePickerContainer}>
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder={LanguageService.translate("Select end date")}
            minDate={startDate || undefined}
            error={endDateError}
            onBlur={() => setEndDateError(null)}
          />
        </View>

        <View style={styles.buttonContainer}>
          <SecondaryButton
            style={styles.button}
            title={LanguageService.translate("Cancel")}
            onPress={handleClose}
          />
          <PrimaryButton
            style={styles.button}
            title={LanguageService.translate("Send Report")}
            onPress={handleSendReport}
            disabled={isLoading}
          />
        </View>
      </View>
    </ModalWithBackDrop>
  );
};

export default React.memo(PatientReportModal);
