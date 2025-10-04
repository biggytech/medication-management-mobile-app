import React, { useState } from "react";
import { Keyboard, TextInput, View } from "react-native";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { styles } from "@/components/common/inputs/Input/styles";
import type { InputProps } from "@/components/common/inputs/Input/types";

const Input: React.FC<InputProps> = ({
  style,
  onFocus,
  onBlur,
  error,
  onSubmitEditing,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[
          styles.input,
          isFocused ? styles.focused : {},
          error ? styles.errored : {},
          style,
        ]}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        onSubmitEditing={(event) => {
          Keyboard.dismiss();
          onSubmitEditing?.(event);
        }}
        {...props}
      />
      <ErrorMessage text={error} />
    </View>
  );
};

export default React.memo(Input);
