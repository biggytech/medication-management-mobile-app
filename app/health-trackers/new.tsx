import React, { useMemo } from "react";
import { Screen } from "@/components/common/markup/Screen";
import { Wizard } from "@/components/common/Wizard";
import { HealthTrackerWizard } from "@/components/entities/healthTracker/HealthTrackerWizard";
import { APIService } from "@/services/APIService";
import { router } from "expo-router";
import { useToaster } from "@/hooks/ui/useToaster";
import { LanguageService } from "@/services/language/LanguageService";
import type {
  HealthTrackerData,
  HealthTrackerFromApi,
} from "@/types/healthTrackers";
import { ScheduleService } from "@/services/schedules/ScheduleService";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import { getAvailableHealthTrackerTypes } from "@/utils/entities/healthTrackers/getAvailableHealthTrackerTypes";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { Text } from "@/components/common/typography/Text";
import { View } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";
import { Button } from "@/components/common/buttons/Button";

const NewHealthTrackerScreen: React.FC = () => {
  const { showSuccess, showError } = useToaster();

  // Fetch existing health trackers to check for duplicates
  const { data: existingTrackers, isFetching } = useQueryWithFocus<
    HealthTrackerFromApi[]
  >({
    queryKey: [QUERY_KEYS.HEALTH_TRACKERS.LIST],
    queryFn: () => APIService.healthTrackers.list(),
  });

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

  const initialData = useMemo(
    () => ({
      schedule: ScheduleService.getDefaultSchedule(),
    }),
    [],
  );

  // Check if all health tracker types are already used
  const availableTypes = useMemo(() => {
    return getAvailableHealthTrackerTypes(existingTrackers || []);
  }, [existingTrackers]);

  const screens = useMemo(
    () => [
      HealthTrackerWizard.getTypeScreen(existingTrackers || []),
      ...HealthTrackerWizard.getScheduleAndNotesScreens(),
    ],
    [existingTrackers],
  );

  // Show loading state while fetching existing trackers
  if (isFetching) {
    return <BlockingLoader />;
  }

  // Show message if all types are already used
  if (availableTypes.length === 0) {
    return (
      <Screen>
        <View style={styles.allTypesUsedContainer}>
          <Text style={styles.allTypesUsedTitle}>
            {LanguageService.translate(
              "All health tracker types already exist",
            )}
          </Text>
          <Button
            color={AppColors.ACCENT}
            style={styles.backButton}
            onPress={handleCancel}
            text={LanguageService.translate("Back")}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Wizard
        screens={screens}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={initialData}
      />
    </Screen>
  );
};

const styles = {
  allTypesUsedContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 40,
  },
  allTypesUsedTitle: {
    fontSize: FontSizes.SUPER_BIG,
    fontWeight: "600" as const,
    color: AppColors.DARKGREY,
    marginBottom: 8,
    textAlign: "center" as const,
  },
  backButton: {
    marginTop: 16,
  },
};

export default NewHealthTrackerScreen;
