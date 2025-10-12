import type { HealthTrackerFromApi } from "@/types/healthTrackers";
import { HealthTrackerTypes } from "@/types/healthTrackers";

/**
 * Get available health tracker types that don't already exist
 * @param existingTrackers - Array of existing health trackers
 * @returns Array of available health tracker types
 */
export const getAvailableHealthTrackerTypes = (
  existingTrackers: HealthTrackerFromApi[] = [],
): HealthTrackerTypes[] => {
  const existingTypes = new Set(
    existingTrackers.map((tracker) => tracker.type),
  );

  return Object.values(HealthTrackerTypes).filter(
    (type) => !existingTypes.has(type),
  );
};

/**
 * Check if a specific health tracker type is available
 * @param type - Health tracker type to check
 * @param existingTrackers - Array of existing health trackers
 * @returns True if the type is available, false otherwise
 */
export const isHealthTrackerTypeAvailable = (
  type: HealthTrackerTypes,
  existingTrackers: HealthTrackerFromApi[] = [],
): boolean => {
  return !existingTrackers.some((tracker) => tracker.type === type);
};
