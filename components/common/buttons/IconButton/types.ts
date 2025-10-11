import type { AppColors } from "@/constants/styling/colors";
import type { Spacings } from "@/constants/styling/spacings";

export interface IconButtonProps {
  iconName: string;
  onPress: () => void;
  color?: AppColors;
  size?: Spacings;
  text?: string;
}
