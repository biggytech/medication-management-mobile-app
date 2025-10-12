import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { schedulePushNotification } from "@/utils/notifications/schedulePushNotification";
import type { MedicineFromApi } from "@/types/medicines";
import type { HealthTrackerFromApi } from "@/types/healthTrackers";
import { LanguageService } from "@/services/language/LanguageService";
import { SchedulableTriggerInputTypes } from "expo-notifications/src/Notifications.types";
import { checkNotificationsPermissions } from "@/utils/notifications/checkNotificationsPermissions";
import { getMedicineEmoji } from "@/utils/entities/medicine/getMedicineEmoji";
import { NotificationTypes } from "@/constants/notifications";
import { endOfDay } from "@/utils/date/endOfDay";
import { AppColors } from "@/constants/styling/colors";
import { getHealthTrackerName } from "@/utils/entities/healthTrackers/getHealthTrackerName";
import { getHealthTrackerEmoji } from "@/utils/entities/healthTrackers/getHealthTrackerEmoji";

/**
 * Service for scheduling local push notifications for medication reminders.
 * This service handles the complex logic of scheduling notifications based on
 * different medication schedule types and ensures notifications are properly
 * formatted with medication names and emojis.
 */
export class NotificationSchedulingService {
  private static readonly NOTIFICATION_CHANNEL_ID = "medication-reminders";
  private static readonly NOTIFICATION_CHANNEL_NAME = "Medication Reminders";

  /**
   * Initialize the notification service by setting up the notification channel
   * and configuring notification behavior.
   */
  public static async initialize(): Promise<void> {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldShowAlert: true,
      }),
    });

    // Create notification channel for Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        this.NOTIFICATION_CHANNEL_ID,
        {
          name: this.NOTIFICATION_CHANNEL_NAME,
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: AppColors.PRIMARY,
          sound: "default",
        },
      );
    }
  }

  /**
   * Schedule notifications for a new medicine based on its schedule configuration.
   * This method handles all different schedule types and creates appropriate
   * notification triggers for each case.
   */
  public static async scheduleMedicineNotifications(
    medicine: MedicineFromApi,
  ): Promise<void> {
    // unschedule previous notifications
    await NotificationSchedulingService.cancelMedicineReminderNotifications(
      medicine.id,
    );

    if (medicine.schedule.endDate && medicine.schedule.nextTakeDate) {
      if (
        endOfDay(new Date(medicine.schedule.endDate)) <
        new Date(medicine.schedule.nextTakeDate)
      ) {
        console.log("Skipping schedule due to ending date", {
          endDate: endOfDay(new Date(medicine.schedule.endDate)),
          nextTakeDate: new Date(medicine.schedule.nextTakeDate),
        });

        // do not schedule if dose date is bigger than ending date
        return;
      }
    }

    if (!(await checkNotificationsPermissions())) {
      alert(
        LanguageService.translate(
          "In order to receive notifications you must grant the permission",
        ),
      );
      return;
    }

    const { title } = medicine;

    // Get medication emoji based on form
    const emoji = getMedicineEmoji(medicine);

    // Create notification content
    const notificationContent: Notifications.NotificationContentInput = {
      title: LanguageService.translate("Medication Reminder"),
      body: `${LanguageService.translate("It's time to take")} ${title}! ${emoji}`,
      data: {
        type: NotificationTypes.MEDICINE_REMINDER,
        medicineId: medicine.id,
      },
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };

    try {
      if (medicine.schedule.nextTakeDate) {
        await this.scheduleSpecificDateNotification(
          new Date(medicine.schedule.nextTakeDate),
          notificationContent,
        );
        console.log("✅ Medication notifications rescheduled successfully");
      }
      return;
    } catch (error) {
      console.error("Failed to schedule medication notifications:", error);
      throw new Error("Failed to schedule medication notifications");
    }
  }

  /**
   * Cancel all notifications for a specific medicine.
   * This is useful when a medicine is deleted or its schedule is changed.
   */
  public static async cancelMedicineReminderNotifications(
    medicineId: number,
  ): Promise<void> {
    try {
      const scheduledNotifications =
        await NotificationSchedulingService.getScheduledNotifications();

      // Find and cancel notifications for this specific medicine
      const medicineNotifications = scheduledNotifications.filter(
        ({ content: { data } }) =>
          data?.type === NotificationTypes.MEDICINE_REMINDER &&
          data?.medicineId === medicineId,
      );

      for (const notification of medicineNotifications) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier,
        );
      }

      console.log(
        `Cancelled ${medicineNotifications.length} notifications for medicine ${medicineId}`,
      );
    } catch (error) {
      console.error("Failed to cancel medicine notifications:", error);
      throw new Error("Failed to cancel medicine notifications");
    }
  }

  /**
   * Schedule notifications for a health tracker based on its schedule configuration.
   * Similar to medicine notifications but for health tracking reminders.
   */
  public static async scheduleHealthTrackerNotifications(
    healthTracker: HealthTrackerFromApi,
  ): Promise<void> {
    // unschedule previous notifications
    await NotificationSchedulingService.cancelHealthTrackerReminderNotifications(
      healthTracker.id,
    );

    if (healthTracker.schedule.endDate && healthTracker.schedule.nextTakeDate) {
      if (
        endOfDay(new Date(healthTracker.schedule.endDate)) <
        new Date(healthTracker.schedule.nextTakeDate)
      ) {
        console.log("Skipping schedule due to ending date", {
          endDate: endOfDay(new Date(healthTracker.schedule.endDate)),
          nextTakeDate: new Date(healthTracker.schedule.nextTakeDate),
        });

        // do not schedule if tracking date is bigger than ending date
        return;
      }
    }

    if (!(await checkNotificationsPermissions())) {
      alert(
        LanguageService.translate(
          "In order to receive notifications you must grant the permission",
        ),
      );
      return;
    }

    const trackerName = getHealthTrackerName(healthTracker.type);

    // Get health tracker emoji based on type
    const emoji = getHealthTrackerEmoji(healthTracker.type);

    // Create notification content
    const notificationContent: Notifications.NotificationContentInput = {
      title: LanguageService.translate("Health Tracker Reminder"),
      body: `${LanguageService.translate("It's time to track")} ${trackerName}! ${emoji}`,
      data: {
        type: NotificationTypes.HEALTH_TRACKER_REMINDER,
        healthTrackerId: healthTracker.id,
      },
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };

    try {
      if (healthTracker.schedule.nextTakeDate) {
        await this.scheduleSpecificDateNotification(
          new Date(healthTracker.schedule.nextTakeDate),
          notificationContent,
        );
        console.log("✅ Health tracker notifications scheduled successfully");
      }
      return;
    } catch (error) {
      console.error("Failed to schedule health tracker notifications:", error);
      throw new Error("Failed to schedule health tracker notifications");
    }
  }

  /**
   * Cancel all notifications for a specific health tracker.
   * This is useful when a health tracker is deleted or its schedule is changed.
   */
  public static async cancelHealthTrackerReminderNotifications(
    healthTrackerId: number,
  ): Promise<void> {
    try {
      const scheduledNotifications =
        await NotificationSchedulingService.getScheduledNotifications();

      // Find and cancel notifications for this specific health tracker
      const healthTrackerNotifications = scheduledNotifications.filter(
        ({ content: { data } }) =>
          data?.type === NotificationTypes.HEALTH_TRACKER_REMINDER &&
          data?.healthTrackerId === healthTrackerId,
      );

      for (const notification of healthTrackerNotifications) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier,
        );
      }

      console.log(
        `Cancelled ${healthTrackerNotifications.length} notifications for health tracker ${healthTrackerId}`,
      );
    } catch (error) {
      console.error("Failed to cancel health tracker notifications:", error);
      throw new Error("Failed to cancel health tracker notifications");
    }
  }

  /**
   * Get all scheduled notifications for debugging purposes.
   */
  public static async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  private static async scheduleSpecificDateNotification(
    date: Date,
    content: Notifications.NotificationContentInput,
  ) {
    const firstTrigger: Notifications.DateTriggerInput = {
      type: SchedulableTriggerInputTypes.DATE,
      date,
    };

    await schedulePushNotification(content, firstTrigger);
  }
}
