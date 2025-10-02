import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "@/components/typography/Text";
import type { LinkProps } from "@/components/buttons/Link/types";
import { styles } from "@/components/buttons/Link/styles";

const Link: React.FC<LinkProps> = ({
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

export default React.memo(Link);
