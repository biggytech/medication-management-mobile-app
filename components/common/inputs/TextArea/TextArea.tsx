import React from "react";
import type { TextAreaProps } from "@/components/common/inputs/TextArea/types";
import { Input } from "@/components/common/inputs/Input";
import { styles } from "@/components/common/inputs/TextArea/styles";

const TextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <Input
      {...props}
      multiline
      numberOfLines={20}
      style={[styles.input, props.style]}
      containerStyle={styles.container}
    />
  );
};

export default React.memo(TextArea);
