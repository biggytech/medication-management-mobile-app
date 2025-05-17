import { Toast } from "toastify-react-native";
import { View, StyleSheet } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { FontSizes } from "@/constants/styling/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/Text";

const TOAST_MANAGER_CONFIG = {
  custom: ({
    text1,
    text2,
    backgroundColor,
    iconColor,
    textColor,
    icon,
  }: {
    text1: string;
    text2?: string;
    backgroundColor: string;
    iconColor: string;
    textColor: string;
    icon: string;
  }) => (
    <View
      style={[
        styles.toast,
        {
          backgroundColor,
        },
      ]}
    >
      {/* @ts-expect-error - Expo icons do not export icon names for typing */}
      <Ionicons name={icon} size={24} color={iconColor} />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: textColor,
            },
          ]}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={[
              styles.message,
              {
                color: textColor,
              },
            ]}
          >
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),
};

export const TOAST_MANAGER_OPTIONS = {
  showProgressBar: false,
  position: "top",
  theme: "light",
  duration: 1000,
  showCloseIcon: false,
  topOffset: 10,
  config: TOAST_MANAGER_CONFIG,
};

export const useToaster = () => {
  const showError = (message: string, details?: string) => {
    Toast.show({
      // @ts-expect-error - Toast doesn't recognize custom type
      type: "custom",
      text1: message,
      text2: details,
      backgroundColor: AppColors.NEGATIVE,
      textColor: AppColors.WHITE,
      iconColor: AppColors.WHITE,
      icon: "alert-circle",
    });
  };

  const showSuccess = (message: string, details?: string) => {
    Toast.show({
      // @ts-expect-error - Toast doesn't recognize custom type
      type: "custom",
      text1: message,
      text2: details,
      backgroundColor: AppColors.POSITIVE,
      textColor: AppColors.WHITE,
      iconColor: AppColors.WHITE,
      icon: "checkmark-circle",
    });
  };

  return {
    showError,
    showSuccess,
  };
};

const styles = StyleSheet.create({
  toast: {
    width: "90%",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: FontSizes.STANDART,
  },
  message: {
    fontSize: FontSizes.SMALL,
    marginTop: 4,
  },
});
