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

export class NotificationSchedulingService {
  private static readonly NOTIFICATION_CHANNEL_ID = "medication-reminders";
  private static readonly NOTIFICATION_CHANNEL_NAME = "Medication Reminders";

  public static async initialize(): Promise<void> {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldShowAlert: true,
      }),
    });

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

  public static async scheduleMedicineNotifications(
    medicine: MedicineFromApi,
  ): Promise<void> {
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

    const emoji = getMedicineEmoji(medicine);

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

  public static async cancelMedicineReminderNotifications(
    medicineId: number,
  ): Promise<void> {
    try {
      const scheduledNotifications =
        await NotificationSchedulingService.getScheduledNotifications();

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

  public static async scheduleHealthTrackerNotifications(
    healthTracker: HealthTrackerFromApi,
  ): Promise<void> {
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

    const trackerName = getHealthTrackerName(healthTracker.type).toLowerCase();

    const emoji = getHealthTrackerEmoji(healthTracker.type);

    const notificationContent: Notifications.NotificationContentInput = {
      title: LanguageService.translate("Health Tracker Reminder"),
      body: `${LanguageService.translate("It's time to track")} ${trackerName}! ${emoji}`,
      data: {
        type: NotificationTypes.HEALTH_TRACKER_REMINDER,
        healthTrackerId: healthTracker.id,
      },
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: AppColors.ACCENT,
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

  public static async cancelHealthTrackerReminderNotifications(
    healthTrackerId: number,
  ): Promise<void> {
    try {
      const scheduledNotifications =
        await NotificationSchedulingService.getScheduledNotifications();

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
