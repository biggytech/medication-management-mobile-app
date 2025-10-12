import { HealthTrackerTypes } from "@/types/healthTrackers";
import { HEALTH_TRACKER_TYPE_OPTIONS } from "@/constants/healthTrackers";

/**
 * Get emoji for health tracker type
 */
export const getHealthTrackerEmoji = (type: HealthTrackerTypes): string => {
  const option = HEALTH_TRACKER_TYPE_OPTIONS.find((opt) => opt.id === type);
  return option?.icon || "🏥";
};
