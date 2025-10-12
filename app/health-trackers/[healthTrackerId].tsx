import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/common/markup/Screen";
import { APIService } from "@/services/APIService";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import type { HealthTrackerFromApi } from "@/types/healthTrackers";
import { Text } from "@/components/common/typography/Text";
import { Button } from "@/components/common/buttons/Button";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { paddingStyles } from "@/assets/styles/spacings";
import { FontSizes } from "@/constants/styling/fonts";
import { getHealthTrackerName } from "@/utils/entities/healthTrackers/getHealthTrackerName";
import { getHealthTrackerEmoji } from "@/utils/entities/healthTrackers/getHealthTrackerEmoji";

const HealthTrackerDetailsScreen: React.FC = () => {
  const { healthTrackerId } = useLocalSearchParams<{
    healthTrackerId: string;
  }>();

  const { data: healthTracker, isFetching } =
    useQueryWithFocus<HealthTrackerFromApi>({
      queryKey: ["healthTrackers", healthTrackerId],
      queryFn: () => APIService.healthTrackers.getById(healthTrackerId!),
      enabled: !!healthTrackerId,
    });

  const handleEditPress = useCallback(() => {
    router.push({
      pathname: "/health-trackers/[healthTrackerId]/edit" as any,
      params: { healthTrackerId },
    });
  }, [healthTrackerId]);

  if (isFetching) {
    return <BlockingLoader />;
  }

  if (!healthTracker) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {LanguageService.translate("Health Tracker not found")}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={[styles.container, paddingStyles.standart]}>
        <View style={styles.header}>
          <Text style={styles.icon}>
            {getHealthTrackerEmoji(healthTracker.type)}
          </Text>
          <Text style={styles.title}>
            {getHealthTrackerName(healthTracker.type)}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {LanguageService.translate("Schedule")}
            </Text>
            <Text style={styles.detailValue}>
              {LanguageService.translate("No schedule details")}
            </Text>
          </View>

          {healthTracker.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {LanguageService.translate("Notes")}
              </Text>
              <Text style={styles.detailValue}>{healthTracker.notes}</Text>
            </View>
          )}
        </View>

        <Button
          color={AppColors.ACCENT}
          onPress={handleEditPress}
          text={LanguageService.translate("Edit Health Tracker")}
          style={styles.editButton}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: FontSizes.SUPER_BIG,
    fontWeight: "600",
    color: AppColors.DARKGREY,
    textAlign: "center",
  },
  details: {
    flex: 1,
  },
  detailRow: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: FontSizes.STANDART,
    fontWeight: "600",
    color: AppColors.DARKGREY,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: FontSizes.STANDART,
    color: AppColors.GREY,
    lineHeight: 22,
  },
  editButton: {
    marginTop: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: FontSizes.STANDART,
    color: AppColors.NEGATIVE,
    textAlign: "center",
  },
});

export default HealthTrackerDetailsScreen;
