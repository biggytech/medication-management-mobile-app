import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { styles } from "./styles";
import type { ToggleProps } from "./types";

const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  label,
  error,
  onBlur,
}) => {
  const handleToggle = () => {
    onChange(!value);
    onBlur?.();
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.toggle,
          value ? styles.toggleActive : styles.toggleInactive,
        ]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.thumb,
            value ? styles.thumbActive : styles.thumbInactive,
          ]}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default React.memo(Toggle);
