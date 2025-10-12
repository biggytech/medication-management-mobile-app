import React from "react";
import { Screen } from "@/components/common/markup/Screen";
import { Wizard } from "@/components/common/Wizard";
import { HealthTrackerWizard } from "@/components/entities/healthTracker/HealthTrackerWizard";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { useToaster } from "@/hooks/ui/useToaster";
import { LanguageService } from "@/services/language/LanguageService";
import type { HealthTrackerData } from "@/types/healthTrackers";

const NewHealthTrackerScreen: React.FC = () => {
  const { showSuccess, showError } = useToaster();

  const handleSubmit = async (data: any) => {
    try {
      await APIService.healthTrackers.create(data as HealthTrackerData);
      showSuccess(
        LanguageService.translate("Health Tracker created successfully"),
      );
      router.back();
    } catch (error) {
      showError(LanguageService.translate("Something went wrong"));
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Screen>
      <Wizard
        screens={HealthTrackerWizard.getScreens()}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Screen>
  );
};

export default NewHealthTrackerScreen;
