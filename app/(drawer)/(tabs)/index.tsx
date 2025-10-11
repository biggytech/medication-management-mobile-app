import React, { useCallback, useState } from "react";
import { RemoteNotificationsDebugger } from "@/components/common/notifications/RemoteNotificationsDebugger";
import { Screen } from "@/components/common/markup/Screen";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { FlatList, View } from "react-native";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import type { MedicineFromApi } from "@/types/medicines";
import { APIService } from "@/services/APIService";
import { MedicineListItem } from "@/components/entities/medicine/MedicineListItem";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { paddingStyles } from "@/assets/styles/spacings";
import { Last7Days } from "@/components/common/Last7Days";
import { Text } from "@/components/common/typography/Text";
import { LanguageService } from "@/services/language/LanguageService";
import { positioningStyles } from "@/assets/styles/positioning";
import { DoseTrackingModal } from "@/components/entities/medicine/DoseTrackingModal";

const HomeScreen: React.FC = () => {
  const [activeDate, setActiveDate] = useState<Date>(new Date());
  const [activeMedicine, setActiveMedicine] = useState<MedicineFromApi | null>(
    null,
  );

  const { data: medicines, isLoading } = useQueryWithFocus<MedicineFromApi[]>({
    queryKey: ["medicines-by-date", activeDate],
    queryFn: () => APIService.medicines.listByDate(activeDate),
  });

  const renderItem = useCallback(
    ({ item }: { item: MedicineFromApi }) => (
      <MedicineListItem
        medicine={item}
        onPress={(pressedId) =>
          setActiveMedicine(
            medicines?.find(({ id }) => id === pressedId) ?? null,
          )
        }
        shortDoseDate
      />
    ),
    [medicines],
  );

  /**
   * Handles dose actions (take, skip, reschedule)
   */
  const handleDoseAction = async (
    action: "take" | "skip" | "reschedule",
    data?: any,
  ) => {
    // if (!medicine) return;
    //
    // try {
    //   switch (action) {
    //     case "take":
    //       await APIService.medicationLogs.takeDose({
    //         medicineId: medicine.id,
    //         takenAt: data?.takenAt?.toISOString(),
    //         notes: data?.notes,
    //       });
    //       showSuccess(LanguageService.translate("Dose taken successfully"));
    //       break;
    //     case "skip":
    //       await APIService.medicationLogs.skipDose({
    //         medicineId: medicine.id,
    //         reason: data?.reason,
    //         notes: data?.notes,
    //       });
    //       showSuccess(LanguageService.translate("Dose skipped successfully"));
    //       break;
    //     case "reschedule":
    //       await APIService.medicationLogs.rescheduleDose({
    //         medicineId: medicine.id,
    //         rescheduledTo: data?.rescheduledTo.toISOString(),
    //         notes: data?.notes,
    //       });
    //       showSuccess(
    //         LanguageService.translate("Dose rescheduled successfully"),
    //       );
    //       break;
    //   }
    //
    //   // Refresh tracking data
    //   setTrackingData(null);
    //   setShowDoseTracking(false);
    // } catch (error) {
    //   console.error("Error performing dose action:", error);
    //   showError(LanguageService.translate("Something went wrong"));
    // }
  };

  return (
    <Screen>
      <Last7Days activeDate={activeDate} onActiveDateChange={setActiveDate} />
      {isLoading && <BlockingLoader />}
      {medicines && !isLoading && (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={[paddingStyles.small]}
          ListHeaderComponent={
            FEATURE_FLAGS.SHOW_REMOTE_NOTIFICATIONS_DEBUGGER ? (
              <RemoteNotificationsDebugger />
            ) : null
          }
          ListEmptyComponent={
            <View style={positioningStyles.centered}>
              <Text>{LanguageService.translate("No records")}</Text>
            </View>
          }
        />
      )}
      {activeMedicine && (
        <DoseTrackingModal
          medicine={activeMedicine}
          onClose={() => setActiveMedicine(null)}
          onDoseAction={handleDoseAction}
        />
      )}
    </Screen>
  );
};

export default HomeScreen;
