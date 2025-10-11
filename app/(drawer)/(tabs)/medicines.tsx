import React, { useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, StyleSheet } from "react-native";
import { Button } from "@/components/common/buttons/Button";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { Screen } from "@/components/common/markup/Screen";
import { APIService } from "@/services/APIService";
import type { MedicineFromApi } from "@/types/medicines";
import { LocalNotificationsDebugger } from "@/components/common/notifications/LocalNotificationsDebugger";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { MedicineListItem } from "@/components/entities/medicine/MedicineListItem";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import { paddingStyles } from "@/assets/styles/spacings";

const MedicinesScreen: React.FC = () => {
  const { data: medicines, isLoading } = useQueryWithFocus<MedicineFromApi[]>({
    queryKey: ["medicines"],
    queryFn: () => APIService.medicines.list(),
  });

  const handleAddNewMedicinePress = useCallback(() => {
    router.push(AppScreens.MEDICINES_NEW);
  }, []);

  const handleMedicinePress = useCallback((id: MedicineFromApi["id"]) => {
    router.push({
      pathname: AppScreens.MEDICINES_SINGLE,
      params: { medicineId: id },
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MedicineFromApi }) => (
      <MedicineListItem
        alwaysShowDates
        medicine={item}
        onPress={handleMedicinePress}
      />
    ),
    [handleMedicinePress],
  );

  if (isLoading) {
    return <BlockingLoader />;
  }

  return (
    medicines && (
      <Screen>
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={paddingStyles.small}
          ListHeaderComponent={
            FEATURE_FLAGS.SHOW_LOCAL_NOTIFICATIONS_DEBUGGER ? (
              <LocalNotificationsDebugger />
            ) : null
          }
        />

        <Button
          color={AppColors.POSITIVE}
          style={styles.floatingButton}
          onPress={handleAddNewMedicinePress}
          text={<Ionicons size={FontSizes.HUGE} name="add" />}
          rounded
          elevated
        />
      </Screen>
    )
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});

export default MedicinesScreen;
