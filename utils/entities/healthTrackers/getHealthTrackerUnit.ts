import { HealthTrackerTypes } from "@/types/healthTrackers";
import { LanguageService } from "@/services/language/LanguageService";

/**
 * Get the unit label for a health tracker type
 * @param type - The health tracker type
 * @returns The translated unit label
 */
export const getHealthTrackerUnit = (type: HealthTrackerTypes): string => {
  switch (type) {
    case HealthTrackerTypes.BLOOD_PRESSURE:
      return LanguageService.translate("mmHg");
    case HealthTrackerTypes.HEART_RATE:
      return LanguageService.translate("BPM");
    case HealthTrackerTypes.WEIGHT:
      return LanguageService.translate("kg");
    case HealthTrackerTypes.BODY_TEMPERATURE:
      return LanguageService.translate("°C");
    case HealthTrackerTypes.MENSTRUAL_CYCLE:
      return LanguageService.translate("day");
    default:
      return "";
  }
};
