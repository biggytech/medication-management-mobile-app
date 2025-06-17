import type React from "react";
import {
  type ButtonProps as NativeButtonProps,
  StyleSheet,
  Button as NativeButton,
} from "react-native";

type ButtonProps = NativeButtonProps;

export const Button: React.FC<ButtonProps> = ({ ...props }) => {
  return <NativeButton {...props} />;
};

const styles = StyleSheet.create({});
