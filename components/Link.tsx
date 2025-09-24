import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  type TouchableOpacityProps,
} from "react-native";
import { Text } from "@/components/typography/Text";
import { AppColors } from "@/constants/styling/colors";

interface LinkProps extends TouchableOpacityProps {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Link: React.FC<LinkProps> = ({
  text,
  onPress,
  style,
  textStyle,
  disabled,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
      {...rest}
    >
      <Text
        style={[styles.text, disabled ? styles.disabledText : {}, textStyle]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {},
  text: {
    color: AppColors.SECONDARY,
    textAlign: "center",
  },
  disabledText: {
    color: AppColors.GREY,
  },
});
