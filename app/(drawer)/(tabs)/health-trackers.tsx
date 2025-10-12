import React, { useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, StyleSheet, View } from "react-native";
import { Button } from "@/components/common/buttons/Button";
import { FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";
import { router } from "expo-router";
import { Screen } from "@/components/common/markup/Screen";
import { APIService } from "@/services/APIService";
import type { HealthTrackerFromApi } from "@/types/healthTrackers";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { HealthTrackerListItem } from "@/components/entities/healthTracker/HealthTrackerListItem";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import { paddingStyles } from "@/assets/styles/spacings";
import { Text } from "@/components/common/typography/Text";
import { LanguageService } from "@/services/language/LanguageService";
import { AppScreens } from "@/constants/navigation";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";

const HealthTrackersScreen: React.FC = () => {
  const { data: healthTrackers, isFetching } = useQueryWithFocus<
    HealthTrackerFromApi[]
  >({
    queryKey: [QUERY_KEYS.HEALTH_TRACKERS.LIST],
    queryFn: () => APIService.healthTrackers.list(),
  });

  const handleAddNewHealthTrackerPress = useCallback(() => {
    router.push(AppScreens.HEALTH_TRACKERS_NEW);
  }, []);

  const handleHealthTrackerPress = useCallback((id: string) => {
    router.push({
      pathname: AppScreens.HEALTH_TRACKERS_SINGLE,
      params: { healthTrackerId: id },
    });
  }, []);

  const renderHealthTrackerItem = useCallback(
    ({ item }: { item: HealthTrackerFromApi }) => (
      <HealthTrackerListItem
        alwaysShowDates
        healthTracker={item}
        onPress={handleHealthTrackerPress}
      />
    ),
    [handleHealthTrackerPress],
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>
          {LanguageService.translate("No health trackers")}
        </Text>
        <Text style={styles.emptySubtitle}>
          {LanguageService.translate("Add your first health tracker")}
        </Text>
        <Text style={styles.emptyDescription}>
          {LanguageService.translate("Start tracking your health metrics")}
        </Text>
      </View>
    ),
    [],
  );

  if (isFetching) {
    return <BlockingLoader />;
  }

  return (
    <Screen>
      {healthTrackers && healthTrackers.length > 0 ? (
        <FlatList
          data={healthTrackers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHealthTrackerItem}
          contentContainerStyle={paddingStyles.small}
        />
      ) : (
        renderEmptyState()
      )}

      <Button
        color={AppColors.POSITIVE}
        style={styles.floatingButton}
        onPress={handleAddNewHealthTrackerPress}
        text={<Ionicons size={FontSizes.HUGE} name="add" />}
        rounded
        elevated
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: FontSizes.SUPER_BIG,
    fontWeight: "600",
    color: AppColors.DARKGREY,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: FontSizes.STANDART,
    color: AppColors.GREY,
    marginBottom: 16,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: FontSizes.SMALL,
    color: AppColors.GREY,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HealthTrackersScreen;
