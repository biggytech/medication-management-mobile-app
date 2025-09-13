import type React from "react";
import {
  type ButtonProps as NativeButtonProps,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { AppColors } from "@/constants/styling/colors";
import type { TouchableHighlightProps } from "react-native/Libraries/Components/Touchable/TouchableHighlight";
import { Text } from "@/components/typography/Text";
import { FontSizes } from "@/constants/styling/fonts";

interface ButtonProps extends TouchableHighlightProps {
  title: NativeButtonProps["title"];
  color?: NativeButtonProps["color"];
  size?: number;
  disabled?: NativeButtonProps["disabled"];
}

export const Button: React.FC<ButtonProps> = ({
  title,
  color = AppColors.ACCENT,
  size = FontSizes.STANDART,
  disabled,
  ...props
}) => {
  return (
    <TouchableHighlight {...props}>
      <View
        style={[
          styles.button,
          {
            backgroundColor: color,
          },
          disabled ? styles.disabledButton : {},
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: size,
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    padding: 10,
    borderRadius: 4,
    boxShadow: `0px 3px 5px ${AppColors.DISABLED}`,
  },
  disabledButton: {
    backgroundColor: AppColors.DISABLED,
  },
  text: {
    color: AppColors.WHITE,
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
