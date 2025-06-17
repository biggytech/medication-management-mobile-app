import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { getDrawerHeaderTitle } from "@/utils/navigation/getDrawerHeaderTitle";
import { LanguageService } from "@/services/language/LanguageService";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)"
          options={({ route }) => ({
            headerTitle: getDrawerHeaderTitle(route),
            title: LanguageService.translate("Home"),
          })}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
