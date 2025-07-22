import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { getDrawerHeaderTitle } from "@/utils/navigation/getDrawerHeaderTitle";
import { LanguageService } from "@/services/language/LanguageService";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useAuthSession } from "@/providers/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/styling/colors";

const FOCUSED_COLOR = AppColors.SECONDARY;

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { signOut } = useAuthSession();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label={LanguageService.translate("Logout")}
        onPress={signOut}
        icon={({ focused, size, color }) => (
          <Ionicons
            name={"exit"}
            size={size}
            color={focused ? FOCUSED_COLOR : color}
          />
        )}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="(tabs)"
          options={({ route }) => ({
            headerTitle: getDrawerHeaderTitle(route),
            title: LanguageService.translate("Home"),
            drawerIcon: ({ focused, size, color }) => (
              <Ionicons
                name={"home"}
                size={size}
                color={focused ? FOCUSED_COLOR : color}
              />
            ),
            drawerActiveTintColor: FOCUSED_COLOR,
          })}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
