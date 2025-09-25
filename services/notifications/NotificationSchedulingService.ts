import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { schedulePushNotification } from "@/utils/notifications/schedulePushNotification";
import type { NewMedicine, MedicationSchedule } from "@/types/medicines";
import { MedicineScheduleTypes } from "@/constants/medicines";
import { LanguageService } from "@/services/language/LanguageService";
import { SchedulableTriggerInputTypes } from "expo-notifications/src/Notifications.types";
import { checkNotificationsPermissions } from "@/utils/notifications/checkNotificationsPermissions";

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
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
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
          lightColor: "#80d6af", // Using app's primary color
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
    medicine: NewMedicine,
  ): Promise<void> {
    if (!(await checkNotificationsPermissions())) {
      alert(
        LanguageService.translate(
          "In order to receive notifications you must grant the permission",
        ),
      );
      return;
    }

    const { title, schedule, form } = medicine;

    // Get medication emoji based on form
    const emoji = this.getMedicationEmoji(form);

    // Create notification content
    const notificationContent = this.createNotificationContent(title, emoji);

    try {
      switch (schedule.type) {
        case MedicineScheduleTypes.EVERY_DAY:
          await this.scheduleEveryDayNotifications(
            schedule,
            notificationContent,
          );
          break;

        case MedicineScheduleTypes.EVERY_OTHER_DAY:
          await this.scheduleEveryOtherDayNotifications(
            schedule,
            notificationContent,
          );
          break;

        case MedicineScheduleTypes.EVERY_X_DAYS:
          await this.scheduleEveryXDaysNotifications(
            schedule,
            notificationContent,
          );
          break;

        case MedicineScheduleTypes.SPECIFIC_WEEK_DAYS:
          await this.scheduleSpecificWeekDaysNotifications(
            schedule,
            notificationContent,
          );
          break;

        case MedicineScheduleTypes.ONLY_AS_NEEDED:
          // No automatic scheduling for "as needed" medications
          console.log(
            `No notifications scheduled for "as needed" medication: ${title}`,
          );
          break;

        default:
          console.warn(`Unknown schedule type: ${schedule.type}`);
      }
    } catch (error) {
      console.error("Failed to schedule medication notifications:", error);
      throw new Error("Failed to schedule medication notifications");
    }
  }

  /**
   * Cancel all notifications for a specific medicine.
   * This is useful when a medicine is deleted or its schedule is changed.
   */
  public static async cancelMedicineNotifications(
    medicineId: number,
  ): Promise<void> {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      // Find and cancel notifications for this specific medicine
      const medicineNotifications = scheduledNotifications.filter(
        (notification) => notification.content.data?.medicineId === medicineId,
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

  /**
   * Schedule notifications for every day medication.
   * Creates daily recurring notifications at specified times.
   */
  private static async scheduleEveryDayNotifications(
    schedule: MedicationSchedule,
    content: Notifications.NotificationContentInput,
  ): Promise<void> {
    const { notificationTimes } = schedule;

    for (let i = 0; i < notificationTimes.length; i++) {
      const time = notificationTimes[i];
      const [hours, minutes] = time.split(":").map(Number);

      // Create daily recurring trigger
      const trigger: Notifications.DailyTriggerInput = {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      };

      await schedulePushNotification(content, trigger);
    }

    console.log(`Scheduled ${notificationTimes.length} daily notifications`);
  }

  /**
   * Schedule notifications for every other day medication.
   * Creates notifications starting from the next dose date.
   */
  private static async scheduleEveryOtherDayNotifications(
    schedule: MedicationSchedule,
    content: Notifications.NotificationContentInput,
  ): Promise<void> {
    const { nextDoseDate, notificationTimes } = schedule;

    if (!nextDoseDate || notificationTimes.length === 0) {
      throw new Error(
        "Next dose date and notification time are required for every other day schedule",
      );
    }

    const [hours, minutes] = notificationTimes[0].split(":").map(Number);

    // Calculate the date and time for the first notification
    const notificationDate = new Date(nextDoseDate);
    notificationDate.setHours(hours, minutes, 0, 0);

    // Schedule the first notification
    const firstTrigger: Notifications.DateTriggerInput = {
      type: SchedulableTriggerInputTypes.DATE,
      date: notificationDate,
    };

    await schedulePushNotification(content, firstTrigger);

    // Schedule subsequent notifications every other day
    // We'll schedule up to 30 days ahead to avoid too many notifications
    for (let day = 2; day <= 30; day += 2) {
      const futureDate = new Date(notificationDate);
      futureDate.setDate(futureDate.getDate() + day);

      const futureTrigger: Notifications.DateTriggerInput = {
        type: SchedulableTriggerInputTypes.DATE,
        date: futureDate,
      };

      await schedulePushNotification(content, futureTrigger);
    }

    console.log("Scheduled every other day notifications");
  }

  /**
   * Schedule notifications for every X days medication.
   * Creates notifications based on the specified interval.
   */
  private static async scheduleEveryXDaysNotifications(
    schedule: MedicationSchedule,
    content: Notifications.NotificationContentInput,
  ): Promise<void> {
    const { nextDoseDate, notificationTimes, everyXDays } = schedule;

    if (!nextDoseDate || notificationTimes.length === 0 || !everyXDays) {
      throw new Error(
        "Next dose date, notification time, and interval are required for every X days schedule",
      );
    }

    const [hours, minutes] = notificationTimes[0].split(":").map(Number);

    // Calculate the date and time for the first notification
    const notificationDate = new Date(nextDoseDate);
    notificationDate.setHours(hours, minutes, 0, 0);

    // Schedule the first notification
    const firstTrigger: Notifications.DateTriggerInput = {
      type: SchedulableTriggerInputTypes.DATE,
      date: notificationDate,
    };

    await schedulePushNotification(content, firstTrigger);

    // Schedule subsequent notifications every X days
    // We'll schedule up to 30 intervals ahead
    for (let interval = 1; interval <= 30; interval++) {
      const futureDate = new Date(notificationDate);
      futureDate.setDate(futureDate.getDate() + everyXDays * interval);

      const futureTrigger: Notifications.DateTriggerInput = {
        type: SchedulableTriggerInputTypes.DATE,
        date: futureDate,
      };

      await schedulePushNotification(content, futureTrigger);
    }

    console.log(`Scheduled every ${everyXDays} days notifications`);
  }

  /**
   * Schedule notifications for specific week days medication.
   * Creates weekly recurring notifications on specified days.
   */
  private static async scheduleSpecificWeekDaysNotifications(
    schedule: MedicationSchedule,
    content: Notifications.NotificationContentInput,
  ): Promise<void> {
    const { daysOfWeek, notificationTimes } = schedule;

    if (
      !daysOfWeek ||
      daysOfWeek.length === 0 ||
      notificationTimes.length === 0
    ) {
      throw new Error(
        "Days of week and notification time are required for specific week days schedule",
      );
    }

    const [hours, minutes] = notificationTimes[0].split(":").map(Number);

    // Schedule notifications for each selected day of the week
    for (const dayOfWeek of daysOfWeek) {
      const trigger: Notifications.WeeklyTriggerInput = {
        type: SchedulableTriggerInputTypes.WEEKLY,
        weekday: dayOfWeek + 1, // Convert from 0-6 (Sun-Sat) to 1-7 (Mon-Sun)
        hour: hours,
        minute: minutes,
      };

      await schedulePushNotification(content, trigger);
    }

    console.log(`Scheduled notifications for ${daysOfWeek.length} week days`);
  }

  /**
   * Create notification content with medication name and emoji.
   */
  private static createNotificationContent(
    medicationName: string,
    emoji: string,
  ): Notifications.NotificationContentInput {
    return {
      title: LanguageService.translate("Medication Reminder"),
      body: `Hey, you need to take ${medicationName}! ${emoji}`,
      data: {
        type: "medication_reminder",
        medicationName,
      },
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    };
  }

  /**
   * Get appropriate emoji for medication form.
   */
  private static getMedicationEmoji(form: string): string {
    const emojiMap: Record<string, string> = {
      tablet: "💊",
      injection: "💉",
      solution: "🧪",
      drops: "💧",
      inhaler: "🌬️",
      powder: "🥄",
      other: "💊",
    };

    return emojiMap[form] || "💊";
  }
}
