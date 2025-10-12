import { type HealthTrackerFromApi } from "@/types/healthTrackers";

export interface HealthTrackerListItemProps {
  healthTracker: HealthTrackerFromApi;
  onPress: (id: string) => void;
  shortDate?: boolean;
  alwaysShowDates?: boolean;
  isPressable?: boolean;
}
