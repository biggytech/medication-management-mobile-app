import React, { useState } from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { DatePicker } from "@/components/common/inputs/DatePicker";
import { PrimaryButton } from "@/components/common/buttons/PrimaryButton";
import { LanguageService } from "@/services/language/LanguageService";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";
import { Spacings } from "@/constants/styling/spacings";
import { APIService } from "@/services/APIService";
import { useCurrentLanguage } from "@/hooks/language/useCurrentLanguage";
import { yyyymmddFromDate } from "@/utils/date/yyyymmddFromDate";
import { clampToDateOnly } from "@/utils/date/clampToDateOnly";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { DEFAULT_LANGUAGE } from "@/constants/language";
import FileViewer from "react-native-file-viewer";

interface ReportFormData {
  startDate: Date | null;
  endDate: Date | null;
}

export default function ReportsPage() {
  const [formData, setFormData] = useState<ReportFormData>({
    startDate: null,
    endDate: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { currentLanguage } = useCurrentLanguage();

  const handleStartDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, endDate: date }));
  };

  const validateForm = (): boolean => {
    if (!formData.startDate) {
      Alert.alert(
        LanguageService.translate("Validation Error"),
        LanguageService.translate("Start date is required"),
      );
      return false;
    }

    if (!formData.endDate) {
      Alert.alert(
        LanguageService.translate("Validation Error"),
        LanguageService.translate("End date is required"),
      );
      return false;
    }

    if (formData.startDate > formData.endDate) {
      Alert.alert(
        LanguageService.translate("Validation Error"),
        LanguageService.translate("Start date cannot be after end date"),
      );
      return false;
    }

    return true;
  };

  const generateReport = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    try {
      const startDate = yyyymmddFromDate(clampToDateOnly(formData.startDate!));
      const endDate = yyyymmddFromDate(clampToDateOnly(formData.endDate!));

      const pdfBlob = await APIService.patientReports.generate({
        startDate,
        endDate,
        language: currentLanguage ?? DEFAULT_LANGUAGE,
      });

      // Save PDF to device
      const fileName = `patient-report-${startDate}-to-${endDate}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write the base64 data to file
      await FileSystem.writeAsStringAsync(fileUri, pdfBlob, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Verify the file was written correctly
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      // Show options to view or share
      Alert.alert(
        LanguageService.translate("Report Generated"),
        LanguageService.translate(
          "Your report has been generated successfully. What would you like to do?",
        ),
        [
          {
            text: LanguageService.translate("View Report"),
            onPress: () => viewPDF(fileUri),
          },
          {
            text: LanguageService.translate("Share Report"),
            onPress: () => sharePDF(fileUri, fileName),
          },
          {
            text: LanguageService.translate("Cancel"),
            style: "cancel",
          },
        ],
      );
    } catch (error) {
      console.error("Error generating report:", error);
      Alert.alert(
        LanguageService.translate("Error"),
        LanguageService.translate(
          "Failed to generate report. Please try again.",
        ),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const viewPDF = async (fileUri: string) => {
    try {
      // Use FileSystem to get a shareable URI
      const shareableUri = await FileSystem.getContentUriAsync(fileUri);
      const canOpen = await Linking.canOpenURL(shareableUri);
      console.log("share uri", fileUri);
      console.log("canOpen", canOpen);
      if (canOpen) {
        await FileViewer.open(fileUri, {
          showOpenWithDialog: true,
          showAppsSuggestions: true,
        });
        // await Linking.openURL(shareableUri);
      } else {
        Alert.alert(
          LanguageService.translate("Error"),
          LanguageService.translate(
            "Cannot open PDF file. Please install a PDF viewer app.",
          ),
        );
      }
    } catch (error) {
      console.error("Error opening PDF:", error);
      Alert.alert(
        LanguageService.translate("Error"),
        LanguageService.translate("Failed to open PDF file."),
      );
    }
  };

  const sharePDF = async (fileUri: string, fileName: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // Use FileSystem to get a shareable URI
        const shareableUri = await FileSystem.getContentUriAsync(fileUri);
        await Sharing.shareAsync(shareableUri, {
          mimeType: "application/pdf",
          dialogTitle: LanguageService.translate("Share Report"),
        });
      } else {
        Alert.alert(
          LanguageService.translate("Error"),
          LanguageService.translate("Sharing is not available on this device."),
        );
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert(
        LanguageService.translate("Error"),
        LanguageService.translate("Failed to share PDF file."),
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {LanguageService.translate("Generate Report")}
        </Text>

        <Text style={styles.description}>
          {LanguageService.translate(
            "Select a date range to generate your health report",
          )}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {LanguageService.translate("Start Date")}
            </Text>
            <DatePicker
              value={formData.startDate}
              onChange={handleStartDateChange}
              placeholder={LanguageService.translate("Select start date")}
              minDate={new Date(2020, 0, 1)} // Allow historical data
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {LanguageService.translate("End Date")}
            </Text>
            <DatePicker
              value={formData.endDate}
              onChange={handleEndDateChange}
              placeholder={LanguageService.translate("Select end date")}
              minDate={formData.startDate || new Date(2020, 0, 1)}
            />
          </View>
        </View>

        <PrimaryButton
          title={
            isGenerating
              ? LanguageService.translate("Generating...")
              : LanguageService.translate("Generate Report")
          }
          onPress={generateReport}
          disabled={isGenerating}
          style={styles.generateButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.BACKGROUND,
  },
  content: {
    flex: 1,
    padding: Spacings.BIG,
  },
  title: {
    fontSize: FontSizes.HUGE,
    fontWeight: "bold",
    color: AppColors.PRIMARY,
    marginBottom: Spacings.SMALL,
    textAlign: "center",
  },
  description: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    marginBottom: Spacings.BIG,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    marginBottom: Spacings.BIG,
  },
  inputContainer: {
    marginBottom: Spacings.STANDART,
  },
  label: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    color: AppColors.FONT,
    marginBottom: Spacings.SMALL,
  },
  generateButton: {
    marginTop: Spacings.STANDART,
  },
});
