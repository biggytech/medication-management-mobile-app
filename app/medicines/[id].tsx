import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Screen } from "../../components/common/Screen";
import { Text } from "@/components/common/typography/Text";
import { Title } from "@/components/common/typography/Title";
import { Button } from "@/components/common/Button";
import { APIService } from "@/services/APIService";
import { LanguageService } from "@/services/language/LanguageService";
import { AppScreens } from "@/constants/navigation";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";
import {
  MedicineScheduleTypes,
  MEDICINE_SCHEDULE_TYPE_LABELS,
} from "@/constants/medicines";
import { type Medicine } from "@/types/medicines";
import { ddmmyyyyFromDate } from "@/utils/date/ddmmyyyyFromDate";
import Ionicons from "@expo/vector-icons/Ionicons";

const MedicineScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [medicineData, setMedicineData] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        if (id && typeof id === "string") {
          const medicineId = parseInt(id, 10);
          const data = await APIService.medicines.get(medicineId);
          setMedicineData(data);
        }
      } catch (error) {
        console.error("Failed to fetch medicine:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  const handleEdit = () => {
    if (id && typeof id === "string") {
      router.push({
        pathname: AppScreens.MEDICINES_EDIT,
        params: { id },
      });
    }
  };

  const formatScheduleInfo = (schedule: Medicine["schedule"]) => {
    const scheduleTypeLabel = LanguageService.translate(
      MEDICINE_SCHEDULE_TYPE_LABELS[schedule.type],
    );

    switch (schedule.type) {
      case MedicineScheduleTypes.EVERY_DAY:
        return `${scheduleTypeLabel} - ${schedule.notificationTimes.length} ${LanguageService.translate("times")}`;
      case MedicineScheduleTypes.EVERY_OTHER_DAY:
      case MedicineScheduleTypes.EVERY_X_DAYS:
        return `${scheduleTypeLabel} - ${LanguageService.translate("Next dose")}: ${schedule.nextDoseDate ? ddmmyyyyFromDate(schedule.nextDoseDate) : "N/A"}`;
      case MedicineScheduleTypes.SPECIFIC_WEEK_DAYS:
        return `${scheduleTypeLabel} - ${schedule.daysOfWeek?.length || 0} ${LanguageService.translate("days selected")}`;
      case MedicineScheduleTypes.ONLY_AS_NEEDED:
        return scheduleTypeLabel;
      default:
        return scheduleTypeLabel;
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <Text>{LanguageService.translate("Loading...")}</Text>
        </View>
      </Screen>
    );
  }

  if (!medicineData) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text>{LanguageService.translate("Medicine not found")}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Title style={styles.title}>{medicineData.title}</Title>
          <Text style={styles.subtitle}>
            {LanguageService.translate("Medicine Details")}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="medical" size={20} color={AppColors.PRIMARY} />
              <Text style={styles.detailLabelText}>
                {LanguageService.translate("Form")}
              </Text>
            </View>
            <Text style={styles.detailValue}>
              {LanguageService.translate(medicineData.form)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="time" size={20} color={AppColors.PRIMARY} />
              <Text style={styles.detailLabelText}>
                {LanguageService.translate("Schedule")}
              </Text>
            </View>
            <Text style={styles.detailValue}>
              {formatScheduleInfo(medicineData.schedule)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="fitness" size={20} color={AppColors.PRIMARY} />
              <Text style={styles.detailLabelText}>
                {LanguageService.translate("Dose")}
              </Text>
            </View>
            <Text style={styles.detailValue}>
              {medicineData.schedule.dose} {LanguageService.translate("mg")}
            </Text>
          </View>

          {medicineData.schedule.endDate && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Ionicons name="calendar" size={20} color={AppColors.PRIMARY} />
                <Text style={styles.detailLabelText}>
                  {LanguageService.translate("End Date")}
                </Text>
              </View>
              <Text style={styles.detailValue}>
                {ddmmyyyyFromDate(medicineData.schedule.endDate)}
              </Text>
            </View>
          )}

          {medicineData.notes && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color={AppColors.PRIMARY}
                />
                <Text style={styles.detailLabelText}>
                  {LanguageService.translate("Notes")}
                </Text>
              </View>
              <Text style={styles.detailValue}>{medicineData.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <Button
            color={AppColors.PRIMARY}
            onPress={handleEdit}
            text={LanguageService.translate("Edit")}
            style={styles.editButton}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacings.STANDART,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: Spacings.BIG,
    alignItems: "center",
  },
  title: {
    color: AppColors.WHITE,
    textAlign: "center",
    marginBottom: Spacings.SMALL,
  },
  subtitle: {
    color: AppColors.GREY,
    fontSize: FontSizes.STANDART,
  },
  detailsContainer: {
    backgroundColor: AppColors.SECONDARY,
    borderRadius: 12,
    padding: Spacings.STANDART,
    marginBottom: Spacings.BIG,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacings.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.GREY,
  },
  detailLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailLabelText: {
    color: AppColors.WHITE,
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    marginLeft: Spacings.SMALL,
  },
  detailValue: {
    color: AppColors.WHITE,
    fontSize: FontSizes.STANDART,
    flex: 1,
    textAlign: "right",
  },
  actionsContainer: {
    marginTop: Spacings.BIG,
  },
  editButton: {
    width: "100%",
  },
});

export default MedicineScreen;
