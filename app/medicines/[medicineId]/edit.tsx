import React, { useCallback } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/common/markup/Screen";
import { Wizard } from "@/components/common/Wizard";
import { APIService } from "@/services/APIService";
import { AppScreens } from "@/constants/navigation";
import { type MedicineData, type MedicineFromApi } from "@/types/medicines";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { MedicineWizard } from "@/components/entities/medicine/MedicineWizard/MedicineWizard";
import { LanguageService } from "@/services/language/LanguageService";
import { Text } from "@/components/common/typography/Text";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { MedicineScheduleService } from "@/services/medicines/MedicineScheduleService";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";

const EditMedicineScreen: React.FC = () => {
  const { medicineId } = useLocalSearchParams<{
    medicineId: string;
  }>();

  const { data: medicine = null, isLoading } =
    useQueryWithFocus<MedicineFromApi>({
      queryKey: ["medicine", medicineId],
      queryFn: () => APIService.medicines.get(parseInt(medicineId, 10)),
    });

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      if (!medicine) return;

      try {
        // Update medicine in backend
        const medicineUpdateData = data as unknown as MedicineData;

        if (FEATURE_FLAGS.USE_V2_NOTIFICATION_SYSTEM) {
          medicineUpdateData.schedule.nextDoseDate =
            MedicineScheduleService.getNextDoseDateForSchedule(
              medicineUpdateData.schedule,
            );
        }

        await APIService.medicines.update(medicine.id, medicineUpdateData);

        // Reschedule local push notifications for the medicine
        // Only schedule notifications for emulated devices as per requirements
        if (FEATURE_FLAGS.SCHEDULE_LOCAL_PUSH_NOTIFICATIONS) {
          await NotificationSchedulingService.scheduleMedicineNotifications(
            medicineUpdateData,
          );
          console.log("✅ Medication notifications rescheduled successfully");
        }

        router.replace({
          pathname: AppScreens.MEDICINES_SINGLE,
          params: { medicineId: medicine.id.toString() },
        });
      } catch (error) {
        console.error("Failed to update medicine:", error);
      }
    },
    [medicine],
  );

  const handleGoBack = useCallback(() => {
    if (medicine) {
      router.back();
    }
  }, [medicine]);

  const screens = MedicineWizard.getScreens();

  if (isLoading) {
    return <BlockingLoader />;
  }

  if (!medicine) {
    return (
      <Screen>
        <Text>{LanguageService.translate("Medicine not found")}</Text>
      </Screen>
    );
  }

  // Prepare initial data for the wizard
  const initialData: Partial<MedicineData> = {
    title: medicine.title,
    form: medicine.form,
    schedule: {
      ...medicine.schedule,
      endDate: medicine.schedule.endDate
        ? new Date(medicine.schedule.endDate)
        : null,
      nextDoseDate: medicine.schedule.nextDoseDate
        ? new Date(medicine.schedule.nextDoseDate)
        : null,
    },
    notes: medicine.notes || "",
  };

  return (
    <Screen>
      <Wizard
        onCancel={handleGoBack}
        onSubmit={handleSubmit}
        screens={screens}
        initialData={initialData}
      />
    </Screen>
  );
};

export default EditMedicineScreen;
