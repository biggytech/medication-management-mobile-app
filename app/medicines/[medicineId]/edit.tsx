import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../../../components/common/Screen";
import { Wizard } from "../../../components/common/Wizard";
import { APIService } from "@/services/APIService";
import { AppScreens } from "@/constants/navigation";
import { type MedicineData, type MedicineFromApi } from "@/types/medicines";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { MedicineWizard } from "@/components/entities/medicine/MedicineWizard/MedicineWizard";
import { LanguageService } from "@/services/language/LanguageService";
import { showSuccess } from "@/utils/ui/showSuccess";
import { Text } from "@/components/common/typography/Text";

const EditMedicineScreen: React.FC = () => {
  const { medicineId } = useLocalSearchParams();
  const [medicineData, setMedicineData] = useState<MedicineFromApi | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        if (medicineId && typeof medicineId === "string") {
          const data = await APIService.medicines.get(parseInt(medicineId, 10));
          setMedicineData(data);
        }
      } catch (error) {
        console.error("Failed to fetch medicine:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [medicineId]);

  const handleSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      if (!medicineData) return;

      try {
        // Update medicine in backend
        const medicineUpdateData = data as unknown as MedicineData;
        await APIService.medicines.update(medicineData.id, medicineUpdateData);

        // Reschedule local push notifications for the medicine
        // Only schedule notifications for emulated devices as per requirements
        if (FEATURE_FLAGS.SCHEDULE_LOCAL_PUSH_NOTIFICATIONS) {
          await NotificationSchedulingService.scheduleMedicineNotifications(
            medicineUpdateData,
          );
          console.log("✅ Medication notifications rescheduled successfully");
        }

        showSuccess(
          LanguageService.translate("MedicineFromApi updated successfully"),
        );
        router.replace({
          pathname: AppScreens.MEDICINES_SINGLE,
          params: { medicineId: medicineData.id.toString() },
        });
      } catch (error) {
        console.error("Failed to update medicine:", error);
      }
    },
    [medicineData],
  );

  const handleGoBack = useCallback(() => {
    if (medicineData) {
      router.back();
    }
  }, [medicineData]);

  const screens = MedicineWizard.getScreens();

  if (loading) {
    return (
      <Screen>
        <Text>{LanguageService.translate("Loading...")}</Text>
      </Screen>
    );
  }

  if (!medicineData) {
    return (
      <Screen>
        <Text>{LanguageService.translate("Medicine not found")}</Text>
      </Screen>
    );
  }

  // Prepare initial data for the wizard
  const initialData: Partial<MedicineData> = {
    title: medicineData.title,
    form: medicineData.form,
    schedule: {
      ...medicineData.schedule,
      endDate: medicineData.schedule.endDate
        ? new Date(medicineData.schedule.endDate)
        : null,
      nextDoseDate: medicineData.schedule.nextDoseDate
        ? new Date(medicineData.schedule.nextDoseDate)
        : null,
    },
    notes: medicineData.notes || "",
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
