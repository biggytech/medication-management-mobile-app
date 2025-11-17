import type React from "react";
import type { ReactNode } from "react";
import {
  type ButtonProps as NativeButtonProps,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { AppColors } from "@/constants/styling/colors";
import type { TouchableHighlightProps } from "react-native/Libraries/Components/Touchable/TouchableHighlight";
import { Text } from "@/components/common/typography/Text";
import { FontSizes } from "@/constants/styling/fonts";

interface ButtonProps extends TouchableHighlightProps {
  text: NativeButtonProps["title"] | ReactNode;
  color?: NativeButtonProps["color"];
  size?: number;
  disabled?: NativeButtonProps["disabled"];
  rounded?: boolean;
  elevated?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  color = AppColors.ACCENT,
  size = FontSizes.STANDART,
  disabled = false,
  rounded = false,
  elevated = false,
  ...props
}) => {
  return (
    <TouchableHighlight
      {...props}
      onPress={(...args) => (disabled ? null : props.onPress?.(...args))}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: color,
          },
          disabled ? styles.disabledButton : {},
          rounded ? styles.roundedButton : {},
          elevated ? styles.elevatedButton : {},
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
          {text}
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
    boxShadow: `0px 3px 5px ${AppColors.GREY}`,
  },
  disabledButton: {
    backgroundColor: AppColors.GREY,
  },
  roundedButton: {
    borderRadius: "50%",
  },
  elevatedButton: {
    boxShadow: `2px 3px 7px ${AppColors.GREY}`,
  },
  text: {
    color: AppColors.WHITE,
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
