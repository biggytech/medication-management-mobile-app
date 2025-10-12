import type { HealthTrackerFromApi } from "@/types/healthTrackers";

/**
 * Type guard to check if an item is a health tracker
 */
export const isHealthTracker = (item: any): item is HealthTrackerFromApi => {
  return Boolean(item.type);
};
