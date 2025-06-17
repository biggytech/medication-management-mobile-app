import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AppColors.ACCENT,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: LanguageService.translate("Home"),
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medicines"
        options={{
          title: LanguageService.translate("Medicines"),
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="medkit" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
