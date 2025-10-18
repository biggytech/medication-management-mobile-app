import React from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Text } from "@/components/common/typography/Text";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

/**
 * Primary button component with consistent styling
 * Used for main actions throughout the app
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: AppColors.PRIMARY,
    paddingVertical: Spacings.STANDART,
    paddingHorizontal: Spacings.BIG,
    borderRadius: Spacings.SMALL,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  disabledButton: {
    backgroundColor: AppColors.GREY,
    opacity: 0.6,
  },
  text: {
    color: AppColors.WHITE,
    fontSize: FontSizes.STANDART,
    fontWeight: "bold",
    textAlign: "center",
  },
});
