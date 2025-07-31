import { View, StyleSheet } from "react-native";
import { FontSizes } from "@/constants/styling/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/components/Text";

export interface ToasterProps {
  text1: string;
  text2?: string;
  backgroundColor: string;
  iconColor: string;
  textColor: string;
  icon: string;
}

export const Toaster: React.FC<ToasterProps> = ({
  text1,
  text2,
  backgroundColor,
  iconColor,
  textColor,
  icon,
}) => {
  return (
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
  );
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
