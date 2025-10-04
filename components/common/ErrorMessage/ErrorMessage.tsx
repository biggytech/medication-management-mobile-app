import type { ErrorMessageProps } from "@/components/common/ErrorMessage/types";
import { Text } from "@/components/common/typography/Text";
import React from "react";
import { styles } from "@/components/common/ErrorMessage/styles";

const ErrorMessage: React.FC<ErrorMessageProps> = ({ text }) => {
  return text && <Text style={styles.error}>{text}</Text>;
};

export default React.memo(ErrorMessage);
