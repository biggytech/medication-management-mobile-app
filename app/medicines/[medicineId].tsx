import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/common/markup/Screen";
import { Text } from "@/components/common/typography/Text";
import { APIService } from "@/services/APIService";
import { LanguageService } from "@/services/language/LanguageService";
import { AppScreens } from "@/constants/navigation";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { ddmmyyyyFromDate } from "@/utils/date/ddmmyyyyFromDate";
import { formatScheduleInfo } from "@/utils/entities/medicine/formatScheduleInfo";
import { getMedicineEmoji } from "@/utils/ui/getMedicineEmoji";
import { getMedicineDoseText } from "@/utils/ui/getMedicineDoseText";
import { fontSizesStyles } from "@/assets/styles/fonts";
import { Heading } from "@/components/common/typography/Heading";
import { Round } from "@/components/common/Round";
import type { DetailsCardItem } from "@/components/common/DetailsCard/types";
import { DetailsCard } from "@/components/common/DetailsCard";
import { GradientHeader } from "@/components/common/GradientHeader";
import { IconButton } from "@/components/common/buttons/IconButton";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import type { MedicineFromApi } from "@/types/medicines";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { useToaster } from "@/hooks/ui/useToaster";

const MedicineScreen: React.FC = () => {
  const { medicineId } = useLocalSearchParams<{
    medicineId: string;
  }>();
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToaster();

  const { data: medicine = null, isLoading: loading } =
    useQueryWithFocus<MedicineFromApi>({
      queryKey: ["medicine", medicineId],
      queryFn: () => APIService.medicines.get(parseInt(medicineId, 10)),
    });

  const handleEdit = () => {
    router.replace({
      pathname: AppScreens.MEDICINES_EDIT,
      params: { medicineId },
    });
  };

  /**
   * Handles the deletion of a medicine with confirmation dialog.
   * This function shows a confirmation alert, and if confirmed,
   * cancels all pending notifications and deletes the medicine from the API.
   */
  const handleDelete = () => {
    Alert.alert(
      LanguageService.translate("Delete Medicine"),
      LanguageService.translate(
        "Are you sure you want to delete this medicine?",
      ) +
        "\n\n" +
        LanguageService.translate(
          "This action cannot be undone and all scheduled notifications will be cancelled.",
        ),
      [
        {
          text: LanguageService.translate("Cancel"),
          style: "cancel",
        },
        {
          text: LanguageService.translate("Yes, delete"),
          style: "destructive",
          onPress: confirmDelete,
        },
      ],
      { cancelable: true },
    );
  };

  /**
   * Confirms and executes the medicine deletion.
   * This function handles the actual deletion process including
   * cancelling notifications and calling the API.
   */
  const confirmDelete = async () => {
    if (!medicine) return;

    setIsDeleting(true);
    try {
      // Cancel all pending notifications for this medicine
      await NotificationSchedulingService.cancelMedicineReminderNotifications(
        medicine.id,
      );

      // Delete the medicine from the API
      await APIService.medicines.delete(medicine.id);

      // Show success message
      showSuccess(LanguageService.translate("Medicine deleted successfully"));

      // Navigate back to medicines list
      router.replace(AppScreens.MEDICINES);
    } catch (error) {
      console.error("Failed to delete medicine:", error);
      showError(LanguageService.translate("Something went wrong"));
    } finally {
      setIsDeleting(false);
    }
  };

  const detailsItems: DetailsCardItem[] = useMemo(() => {
    if (!medicine) return [] as DetailsCardItem[];

    const items = [
      {
        key: "form",
        iconName: "medical",
        label: LanguageService.translate("Form"),
        value: LanguageService.translate(medicine.form),
      },
      {
        key: "schedule",
        iconName: "time",
        label: LanguageService.translate("Schedule"),
        value: formatScheduleInfo(medicine.schedule),
      },
      {
        key: "dose",
        iconName: "fitness",
        label: LanguageService.translate("Dose"),
        value: `${medicine.schedule.dose} ${getMedicineDoseText(medicine)}`,
      },
    ];

    if (medicine.schedule.endDate) {
      items.push({
        key: "endDate",
        iconName: "calendar",
        label: LanguageService.translate("End Date"),
        value: ddmmyyyyFromDate(new Date(medicine.schedule.endDate)),
      });
    }

    if (medicine.notes) {
      items.push({
        key: "notes",
        iconName: "document-text",
        label: LanguageService.translate("Notes"),
        value: medicine.notes,
      });
    }

    return items;
  }, [medicine]);

  if (loading || isDeleting) {
    return <BlockingLoader />;
  }

  if (!medicine) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text>{LanguageService.translate("Medicine not found")}</Text>
        </View>
      </Screen>
    );
  }

  return (
    medicine && (
      <Screen>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          <GradientHeader
            left={
              <IconButton
                onPress={() => router.back()}
                iconName={"arrow-back"}
              />
            }
            right={
              <IconButton onPress={handleEdit} iconName={"create-outline"} />
            }
          >
            <Round>
              <Text style={[fontSizesStyles.huge]}>
                {getMedicineEmoji(medicine)}
              </Text>
            </Round>
            <Heading style={styles.title}>{medicine.title}</Heading>
          </GradientHeader>

          <DetailsCard items={detailsItems} />

          <View style={styles.bottomActions}>
            <IconButton
              onPress={handleDelete}
              iconName={"trash"}
              color={AppColors.NEGATIVE}
              size={Spacings.STANDART}
            />
          </View>
        </ScrollView>
      </Screen>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: AppColors.WHITE,
    textAlign: "center",
    marginBottom: Spacings.SMALL,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacings.BIG,
    paddingHorizontal: Spacings.STANDART,
    marginTop: "auto",
    marginLeft: "auto",
  },
  deleteButton: {
    padding: Spacings.SMALL,
    borderRadius: Spacings.SMALL,
    backgroundColor: AppColors.GREY,
  },
});

export default MedicineScreen;
