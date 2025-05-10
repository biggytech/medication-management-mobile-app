import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { Text } from "@/components/Text";
import { AppColors } from "@/constants/styling/colors";

interface LinkProps {
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
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {},
  text: {
    color: AppColors.PRIMARY,
  },
});
