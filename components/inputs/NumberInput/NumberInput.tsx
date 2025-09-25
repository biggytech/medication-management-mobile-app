import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";
import type { NumberInputProps } from "./types";
import { ErrorMessage } from "@/components/ErrorMessage";

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  placeholder,
  error,
  onBlur,
  label,
  keyboardType = "numeric",
  inputMode = "numeric",
}) => {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleTextChange = (text: string) => {
    setInputValue(text);
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onChange(clampedValue);
    }
  };

  const handleBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < min) {
      const clampedValue = Math.max(min, value);
      onChange(clampedValue);
      setInputValue(clampedValue.toString());
    } else if (numValue > max) {
      const clampedValue = Math.min(max, value);
      onChange(clampedValue);
      setInputValue(clampedValue.toString());
    }
    onBlur?.();
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>🔢 {label}</Text>
        </View>
      )}
      <View style={[styles.inputContainer, error ? styles.errored : {}]}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDecrement}
          disabled={value <= min}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          keyboardType={keyboardType}
          inputMode={inputMode}
          selectTextOnFocus
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleIncrement}
          disabled={value >= max}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <ErrorMessage text={error} />
    </View>
  );
};

export default React.memo(NumberInput);
