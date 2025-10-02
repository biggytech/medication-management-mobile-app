import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider } from "@/providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/i18n"; // localization
import ToastManager from "toastify-react-native";
import { Fonts } from "@/constants/styling/fonts";
import { QueryProvider } from "@/providers/QueryProvider";
import { TOAST_MANAGER_OPTIONS } from "@/constants/toaster";
import * as Notifications from "expo-notifications";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { FEATURE_FLAGS } from "@/constants/featureFlags";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [loaded] = useFonts({
    [Fonts.DEFAULT]: require("../assets/fonts/Roboto-VariableFont_wdth,wght.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      if (FEATURE_FLAGS.SCHEDULE_LOCAL_PUSH_NOTIFICATIONS) {
        // Initialize notification service
        NotificationSchedulingService.initialize().catch((error) => {
          console.error("Failed to initialize notification service:", error);
        });
      }

      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"index"} />
            <Stack.Screen name={"login"} />
            <Stack.Screen name="(drawer)" />
            <Stack.Screen name={"+not-found"} />
          </Stack>
        </SafeAreaView>

        <ToastManager {...TOAST_MANAGER_OPTIONS} />
      </AuthProvider>
    </QueryProvider>
  );
}
