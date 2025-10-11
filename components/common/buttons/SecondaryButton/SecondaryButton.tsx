import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { FontSizes } from "@/constants/styling/fonts";

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

/**
 * Secondary button component with consistent styling
 * Used for secondary actions throughout the app
 */
export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: AppColors.PRIMARY,
    paddingVertical: Spacings.STANDART,
    paddingHorizontal: Spacings.BIG,
    borderRadius: Spacings.SMALL,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  disabledButton: {
    borderColor: AppColors.GREY,
    opacity: 0.6,
  },
  text: {
    color: AppColors.PRIMARY,
    fontSize: FontSizes.STANDART,
    fontWeight: "bold",
    textAlign: "center",
  },
});
