import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "@/components/common/buttons/Button";
import { Text } from "@/components/common/typography/Text";
import { Title } from "@/components/common/typography/Title";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { MedicineForms, MedicineScheduleTypes } from "@/constants/medicines";
import { MILLISECONDS_IN_MINUTE } from "@/constants/dates";

/**
 * Debug component for testing local push notifications.
 * This component is only shown in development mode and provides
 * tools to test notification scheduling and management.
 */
export const LocalNotificationsDebugger: React.FC = () => {
  const [scheduledCount, setScheduledCount] = useState<number>(0);

  useEffect(() => {
    loadScheduledNotifications();
  }, []);

  const loadScheduledNotifications = async () => {
    try {
      const notifications =
        await NotificationSchedulingService.getScheduledNotifications();
      setScheduledCount(notifications.length);
    } catch (error) {
      console.error("Failed to load scheduled notifications:", error);
    }
  };

  const handleTestNotification = async () => {
    try {
      // Create a test medicine for notification testing
      const testMedicine = {
        title: "Test Medicine",
        form: MedicineForms.TABLET,
        schedule: {
          dose: 1,
          type: MedicineScheduleTypes.EVERY_DAY,
          everyXDays: 1,
          notificationTimes: ["08:00", "20:00"],
          userTimeZone: "Europe/Berlin",
          nextDoseDate: new Date(new Date().valueOf() + MILLISECONDS_IN_MINUTE), // 1 minute later,
        },
      };

      await NotificationSchedulingService.scheduleMedicineNotifications(
        testMedicine,
      );
      await loadScheduledNotifications();

      Alert.alert(
        "Success",
        "Test notification scheduled! You should receive it at the specified times.",
        [{ text: "OK" }],
      );
    } catch (error) {
      console.error("Failed to schedule test notification:", error);
      Alert.alert(
        "Error",
        "Failed to schedule test notification. Check console for details.",
        [{ text: "OK" }],
      );
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      const notifications =
        await NotificationSchedulingService.getScheduledNotifications();

      for (const notification of notifications) {
        await NotificationSchedulingService.cancelMedicineNotifications(
          typeof notification.content.data?.medicineId === "number"
            ? notification.content.data.medicineId
            : 0,
        );
      }

      await loadScheduledNotifications();

      Alert.alert("Success", "All notifications cleared!", [{ text: "OK" }]);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      Alert.alert(
        "Error",
        "Failed to clear notifications. Check console for details.",
        [{ text: "OK" }],
      );
    }
  };

  // Only show in development mode
  if (!__DEV__) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>🔔 Notification Debugger</Title>
      <Text style={styles.subtitle}>
        Debug tools for testing local push notifications
      </Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Scheduled Notifications: {scheduledCount}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          text="Schedule Test Notification"
          onPress={handleTestNotification}
          style={styles.button}
        />

        <Button
          text="Refresh Count"
          onPress={loadScheduledNotifications}
          style={[styles.button, styles.secondaryButton]}
        />

        <Button
          text="Clear All Notifications"
          onPress={handleClearAllNotifications}
          style={[styles.button, styles.dangerButton]}
        />
      </View>

      <Text style={styles.note}>
        💡 This component is only visible in development mode. Test
        notifications will be scheduled for 8:00 AM and 8:00 PM daily.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacings.STANDART,
    backgroundColor: AppColors.BACKGROUND,
    borderRadius: 12,
    margin: Spacings.SMALL,
    borderWidth: 2,
    borderColor: AppColors.ACCENT,
    borderStyle: "dashed",
  },
  title: {
    color: AppColors.FONT,
    textAlign: "center",
    marginBottom: Spacings.SMALL,
  },
  subtitle: {
    color: AppColors.FONT,
    textAlign: "center",
    marginBottom: Spacings.STANDART,
    opacity: 0.7,
  },
  statsContainer: {
    backgroundColor: AppColors.GREY,
    padding: Spacings.SMALL,
    borderRadius: 8,
    marginBottom: Spacings.STANDART,
  },
  statsText: {
    color: AppColors.FONT,
    textAlign: "center",
    fontWeight: "600",
  },
  buttonContainer: {
    gap: Spacings.SMALL,
  },
  button: {
    marginBottom: Spacings.SMALL,
  },
  secondaryButton: {
    backgroundColor: AppColors.SECONDARY,
  },
  dangerButton: {
    backgroundColor: AppColors.NEGATIVE,
  },
  note: {
    color: AppColors.FONT,
    textAlign: "center",
    fontSize: 12,
    opacity: 0.6,
    marginTop: Spacings.SMALL,
    fontStyle: "italic",
  },
});
