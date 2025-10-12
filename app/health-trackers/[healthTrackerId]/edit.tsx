import React, { useCallback } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Screen } from "@/components/common/markup/Screen";
import { Wizard } from "@/components/common/Wizard";
import { HealthTrackerWizard } from "@/components/entities/healthTracker/HealthTrackerWizard";
import { APIService } from "@/services/APIService";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { useToaster } from "@/hooks/ui/useToaster";
import { LanguageService } from "@/services/language/LanguageService";
import type { HealthTrackerData } from "@/types/healthTrackers";

const EditHealthTrackerScreen: React.FC = () => {
  const { healthTrackerId } = useLocalSearchParams<{ healthTrackerId: string }>();
  const { showSuccess, showError } = useToaster();

  const { data: healthTracker, isFetching } = useQueryWithFocus({
    queryKey: ["healthTrackers", healthTrackerId],
    queryFn: () => APIService.healthTrackers.getById(healthTrackerId!),
    enabled: !!healthTrackerId,
  });

  const handleSubmit = useCallback(async (data: any) => {
    try {
      await APIService.healthTrackers.update(healthTrackerId!, data as HealthTrackerData);
      showSuccess(LanguageService.translate("Health Tracker updated successfully"));
      router.back();
    } catch (error) {
      showError(LanguageService.translate("Something went wrong"));
    }
  }, [healthTrackerId, showSuccess, showError]);

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  if (isFetching) {
    return <BlockingLoader />;
  }

  if (!healthTracker) {
    return null;
  }

  return (
    <Screen>
      <Wizard
        screens={HealthTrackerWizard.getScreens()}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={healthTracker}
      />
    </Screen>
  );
};

export default EditHealthTrackerScreen;
