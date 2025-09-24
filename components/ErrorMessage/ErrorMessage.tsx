import type { ErrorMessageProps } from "@/components/ErrorMessage/types";
import { Text } from "@/components/typography/Text";
import React from "react";
import { styles } from "@/components/ErrorMessage/styles";

const ErrorMessage: React.FC<ErrorMessageProps> = ({ text }) => {
  return text && <Text style={styles.error}>{text}</Text>;
};

export default React.memo(ErrorMessage);
