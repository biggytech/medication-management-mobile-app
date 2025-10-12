import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/common/markup/Screen";
import { Text } from "@/components/common/typography/Text";
import { APIService } from "@/services/APIService";
import { LanguageService } from "@/services/language/LanguageService";
import { AppScreens } from "@/constants/navigation";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { ddmmyyyyFromDate } from "@/utils/date/ddmmyyyyFromDate";
import { formatScheduleInfo } from "@/utils/schedules/formatScheduleInfo";
import { getHealthTrackerEmoji } from "@/utils/entities/healthTrackers/getHealthTrackerEmoji";
import { getHealthTrackerName } from "@/utils/entities/healthTrackers/getHealthTrackerName";
import { fontSizesStyles } from "@/assets/styles/fonts";
import { Heading } from "@/components/common/typography/Heading";
import type { DetailsCardItem } from "@/components/common/DetailsCard/types";
import { DetailsCard } from "@/components/common/DetailsCard";
import { IconButton } from "@/components/common/buttons/IconButton";
import { BlockingLoader } from "@/components/common/loaders/BlockingLoader";
import { useQueryWithFocus } from "@/hooks/queries/useQueryWithFocus";
import type { HealthTrackerFromApi } from "@/types/healthTrackers";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { useToaster } from "@/hooks/ui/useToaster";
import { truncate } from "@/utils/ui/truncate";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import { Centered } from "@/components/common/markup/Centered";
import { Header } from "@/components/common/Header";

const HealthTrackerDetailsScreen: React.FC = () => {
  const { healthTrackerId } = useLocalSearchParams<{
    healthTrackerId: string;
  }>();
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToaster();

  const { data: healthTracker = null, isLoading: loading } =
    useQueryWithFocus<HealthTrackerFromApi>({
      queryKey: [QUERY_KEYS.HEALTH_TRACKERS.SINGLE, healthTrackerId],
      queryFn: () => APIService.healthTrackers.getById(healthTrackerId!),
      enabled: !!healthTrackerId,
    });

  const handleEdit = () => {
    router.replace({
      pathname: AppScreens.HEALTH_TRACKERS_EDIT,
      params: { healthTrackerId },
    });
  };

  /**
   * Handles the deletion of a health tracker with confirmation dialog.
   * This function shows a confirmation alert, and if confirmed,
   * cancels all pending notifications and deletes the health tracker from the API.
   */
  const handleDelete = () => {
    Alert.alert(
      LanguageService.translate("Delete Health Tracker"),
      LanguageService.translate(
        "Are you sure you want to delete this health tracker?",
      ) +
        "\n\n" +
        LanguageService.translate(
          "This action cannot be undone and all scheduled notifications will be cancelled.",
        ),
      [
        {
          text: LanguageService.translate("Cancel"),
          style: "cancel",
        },
        {
          text: LanguageService.translate("Yes, delete"),
          style: "destructive",
          onPress: confirmDelete,
        },
      ],
      { cancelable: true },
    );
  };

  /**
   * Confirms and executes the health tracker deletion.
   * This function handles the actual deletion process including
   * cancelling notifications and calling the API.
   */
  const confirmDelete = async () => {
    if (!healthTracker) return;

    setIsDeleting(true);
    try {
      // Cancel all pending notifications for this health tracker
      await NotificationSchedulingService.cancelHealthTrackerReminderNotifications(
        healthTracker.id,
      );

      // Delete the health tracker from the API
      await APIService.healthTrackers.delete(healthTrackerId!);

      // Show success message
      showSuccess(
        LanguageService.translate("Health tracker deleted successfully"),
      );

      // Navigate back to health trackers list
      router.replace(AppScreens.HEALTH_TRACKERS);
    } catch (error) {
      console.error("Failed to delete health tracker:", error);
      showError(LanguageService.translate("Something went wrong"));
    } finally {
      setIsDeleting(false);
    }
  };

  const detailsItems: DetailsCardItem[] = useMemo(() => {
    if (!healthTracker) return [] as DetailsCardItem[];

    const items = [
      {
        key: "type",
        iconName: "fitness",
        label: LanguageService.translate("Type"),
        value: getHealthTrackerName(healthTracker.type),
      },
      {
        key: "schedule",
        iconName: "time",
        label: LanguageService.translate("Schedule"),
        value: formatScheduleInfo(healthTracker.schedule),
      },
    ];

    if (healthTracker.schedule.endDate) {
      items.push({
        key: "endDate",
        iconName: "calendar",
        label: LanguageService.translate("End Date"),
        value: ddmmyyyyFromDate(new Date(healthTracker.schedule.endDate)),
      });
    }

    if (healthTracker.notes) {
      items.push({
        key: "notes",
        iconName: "document-text",
        label: LanguageService.translate("Notes"),
        value: truncate(healthTracker.notes, 100),
      });
    }

    return items;
  }, [healthTracker]);

  if (loading || isDeleting) {
    return <BlockingLoader />;
  }

  if (!healthTracker) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text>{LanguageService.translate("Health Tracker not found")}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <>
      <Screen>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
          <Header
            left={
              <IconButton
                onPress={() => router.back()}
                iconName={"arrow-back"}
              />
            }
            right={
              <IconButton onPress={handleEdit} iconName={"create-outline"} />
            }
            color={AppColors.ACCENT}
          >
            <Centered style={styles.headerIconContainer}>
              <Text style={[fontSizesStyles.mega]}>
                {getHealthTrackerEmoji(healthTracker.type)}
              </Text>
            </Centered>
            <Heading style={styles.title}>
              {getHealthTrackerName(healthTracker.type)}
            </Heading>
          </Header>

          <DetailsCard items={detailsItems} />

          <View style={styles.bottomActions}>
            <IconButton
              onPress={handleDelete}
              iconName={"trash"}
              color={AppColors.NEGATIVE}
              size={Spacings.STANDART}
            />
          </View>
        </ScrollView>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerIconContainer: {
    padding: Spacings.STANDART,
  },
  content: {
    flexGrow: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: AppColors.WHITE,
    textAlign: "center",
    marginBottom: Spacings.SMALL,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacings.BIG,
    paddingHorizontal: Spacings.STANDART,
    marginTop: "auto",
    marginLeft: "auto",
  },
});

export default HealthTrackerDetailsScreen;
