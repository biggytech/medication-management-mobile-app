import * as Notifications from "expo-notifications";

const GRANTED_PERMISSION_STATUS = "granted";

export const checkNotificationsPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== GRANTED_PERMISSION_STATUS) {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== GRANTED_PERMISSION_STATUS) {
    return false;
  }

  return true;
};
