import React, { useCallback } from "react";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Wizard } from "@/components/common/Wizard";
import { Screen } from "@/components/common/Screen";
import { type MedicineData } from "@/types/medicines";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { MedicineWizard } from "@/components/entities/medicine/MedicineWizard/MedicineWizard";

const NewMedicineScreen: React.FC = () => {
  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    // Add medicine to backend
    const medicineData = data as unknown as MedicineData;
    await APIService.medicines.add(medicineData);

    // Schedule local push notifications for the medicine
    // Only schedule notifications for emulated devices as per requirements
    if (FEATURE_FLAGS.SCHEDULE_LOCAL_PUSH_NOTIFICATIONS) {
      await NotificationSchedulingService.scheduleMedicineNotifications(
        medicineData,
      );
      console.log("✅ Medication notifications scheduled successfully");
    }

    router.replace(AppScreens.MEDICINES);
  }, []);

  const screens = MedicineWizard.getScreens();

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen>
      <Wizard
        onCancel={handleGoBack}
        onSubmit={handleSubmit}
        screens={screens}
      />
    </Screen>
  );
};

export default NewMedicineScreen;
