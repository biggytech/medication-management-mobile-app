import type { HealthTrackingLogFromApi } from "@/types/healthTrackingLogs";

/**
 * Type guard to check if an item is a health tracking log
 */
export const isHealthTrackingLog = (
  item: any,
): item is HealthTrackingLogFromApi => {
  return Boolean(item.healthTracker && item.value1 !== undefined);
};
