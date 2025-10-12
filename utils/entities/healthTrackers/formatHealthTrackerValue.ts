import { HealthTrackerTypes } from "@/types/healthTrackers";
import { getHealthTrackerUnit } from "./getHealthTrackerUnit";

/**
 * Format health tracker values with appropriate units
 * @param type - The health tracker type
 * @param value1 - Primary value
 * @param value2 - Secondary value (for blood pressure)
 * @returns Formatted string with values and units
 */
export const formatHealthTrackerValue = (
  type: HealthTrackerTypes,
  value1: number,
  value2: number | null,
): string => {
  const unit = getHealthTrackerUnit(type);

  // For blood pressure, show both values with unit
  if (type === HealthTrackerTypes.BLOOD_PRESSURE && value2 !== null) {
    return `${value1}/${value2} ${unit}`;
  }

  // For other types, show just the primary value with unit
  return `${value1} ${unit}`;
};
