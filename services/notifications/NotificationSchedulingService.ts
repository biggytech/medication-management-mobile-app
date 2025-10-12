import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { schedulePushNotification } from "@/utils/notifications/schedulePushNotification";
import type { MedicineFromApi } from "@/types/medicines";
import { LanguageService } from "@/services/language/LanguageService";
import { SchedulableTriggerInputTypes } from "expo-notifications/src/Notifications.types";
import { checkNotificationsPermissions } from "@/utils/notifications/checkNotificationsPermissions";
import { getMedicineEmoji } from "@/utils/entities/medicine/getMedicineEmoji";
import { NotificationTypes } from "@/constants/notifications";
import { endOfDay } from "@/utils/date/endOfDay";
import { AppColors } from "@/constants/styling/colors";

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

    if (medicine.schedule.endDate && medicine.schedule.nextDoseDate) {
      if (
        endOfDay(new Date(medicine.schedule.endDate)) <
        new Date(medicine.schedule.nextDoseDate)
      ) {
        console.log("Skipping schedule due to ending date", {
          endDate: endOfDay(new Date(medicine.schedule.endDate)),
          nextDoseDate: new Date(medicine.schedule.nextDoseDate),
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
      if (medicine.schedule.nextDoseDate) {
        await this.scheduleSpecificDateNotification(
          new Date(medicine.schedule.nextDoseDate),
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
