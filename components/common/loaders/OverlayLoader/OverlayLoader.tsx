import React from "react";
import type { OverlayLoaderProps } from "@/components/common/loaders/OverlayLoader/types";
import { Centered } from "@/components/common/markup/Centered";
import { Loader } from "@/components/common/loaders/Loader";

import { styles } from "./styles";

const OverlayLoader: React.FC<OverlayLoaderProps> = ({ style }) => {
  return (
    <Centered style={[styles.container, style]}>
      <Loader />
    </Centered>
  );
};

export default React.memo(OverlayLoader);
