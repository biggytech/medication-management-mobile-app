import { HealthTrackerTypes } from "@/types/healthTrackers";
import { getHealthTrackerUnit } from "./getHealthTrackerUnit";
import { LanguageService } from "@/services/language/LanguageService";

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
  // For menstrual cycle, show translated "Yes" or "No" instead of numeric values
  if (type === HealthTrackerTypes.MENSTRUAL_CYCLE) {
    return value1 === 1
      ? LanguageService.translate("Yes")
      : LanguageService.translate("No");
  }

  const unit = getHealthTrackerUnit(type);

  // For blood pressure, show both values with unit
  if (type === HealthTrackerTypes.BLOOD_PRESSURE && value2 !== null) {
    return `${value1}/${value2} ${unit}`;
  }

  // For other types, show just the primary value with unit
  return `${value1} ${unit}`;
};
