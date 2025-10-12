import React, { useCallback, useMemo } from "react";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Wizard } from "@/components/common/Wizard";
import { Screen } from "@/components/common/markup/Screen";
import { type MedicineData } from "@/types/medicines";
import { MedicineWizard } from "@/components/entities/medicine/MedicineWizard/MedicineWizard";
import { ScheduleService } from "@/services/schedules/ScheduleService";

const NewMedicineScreen: React.FC = () => {
  const handleSubmit = useCallback(async (data: Record<string, unknown>) => {
    // Add medicine to backend
    const medicineData = data as unknown as MedicineData;

    await APIService.medicines.add(medicineData);

    router.replace(AppScreens.MEDICINES);
  }, []);

  const screens = MedicineWizard.getScreens();

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const initialData = useMemo(
    () => ({
      schedule: ScheduleService.getDefaultSchedule(),
    }),
    [],
  );

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

export default NewMedicineScreen;
