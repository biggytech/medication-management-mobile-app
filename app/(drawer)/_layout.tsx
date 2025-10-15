import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { getDrawerHeaderTitle } from "@/utils/navigation/getDrawerHeaderTitle";
import { LanguageService } from "@/services/language/LanguageService";
import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useAuthSession } from "@/providers/AuthProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/constants/styling/colors";
import { Text } from "@/components/common/typography/Text";
import { Alert, StyleSheet, View } from "react-native";
import { AuthService } from "@/services/auth/AuthService";
import { Button } from "@/components/common/buttons/Button";
import { FontSizes } from "@/constants/styling/fonts";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { DoctorSearchHeader } from "@/components/common/DoctorSearchHeader";

const FOCUSED_COLOR = AppColors.SECONDARY;

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { signOut } = useAuthSession();

  const handleSignOutClick = () => {
    if (AuthService.isGuest) {
      Alert.alert(
        LanguageService.translate("You're logged in as a guest"),
        LanguageService.translate(
          "You will lose all your data if you log out as a guest user. Are you sure to logout?",
        ),
        [
          {
            text: LanguageService.translate("Cancel"),
            onPress: () => {},
            style: "cancel",
          },
          {
            text: LanguageService.translate("Yes, logout"),
            onPress: () => signOut(),
          },
        ],
      );
    } else {
      signOut();
    }
  };

  return (
    <View style={styles.drawerContent}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label={LanguageService.translate("Logout")}
          onPress={handleSignOutClick}
          icon={({ focused, size, color }) => (
            <Ionicons
              name={"exit"}
              size={size}
              color={focused ? FOCUSED_COLOR : color}
            />
          )}
        />
      </DrawerContentScrollView>
      <View style={styles.userNameView}>
        <Text style={styles.userName}>{AuthService.fullName}</Text>
        {AuthService.isGuest && (
          <Button
            text={LanguageService.translate("Finish sign up")}
            size={FontSizes.SMALL}
            onPress={() => {
              router.push(AppScreens.SIGN_UP);
            }}
          />
        )}
      </View>
    </View>
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
            headerStyle: {
              backgroundColor: AppColors.PRIMARY,
            },
            headerTintColor: AppColors.WHITE,
            headerRight: () => <DoctorSearchHeader />,
          })}
        />
        <Drawer.Screen
          name="doctors"
          options={{
            headerTitle: LanguageService.translate("My Doctors"),
            title: LanguageService.translate("My Doctors"),
            drawerIcon: ({ focused, size, color }) => (
              <Ionicons
                name={"people"}
                size={size}
                color={focused ? FOCUSED_COLOR : color}
              />
            ),
            drawerActiveTintColor: FOCUSED_COLOR,
            headerStyle: {
              backgroundColor: AppColors.PRIMARY,
            },
            headerTintColor: AppColors.WHITE,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userNameView: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: {},
});
