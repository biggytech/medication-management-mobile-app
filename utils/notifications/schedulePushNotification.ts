import {
  scheduleNotificationAsync,
  SchedulableTriggerInputTypes,
  type NotificationContentInput,
  type NotificationTriggerInput,
} from "expo-notifications";

export async function schedulePushNotification(
  notification: NotificationContentInput,
  trigger: NotificationTriggerInput,
) {
  await scheduleNotificationAsync({
    // content: {
    //   title: "You've got mail! 📬",
    //   body: "Here is the notification body",
    //   data: { data: "goes here", test: { test1: "more data" } },
    // },
    content: notification,
    // trigger: {
    //   type: SchedulableTriggerInputTypes.TIME_INTERVAL,
    //   seconds: 2,
    // },
    trigger,
  });
}
