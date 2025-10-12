import { HealthTrackerTypes } from "@/types/healthTrackers";
import { LanguageService } from "@/services/language/LanguageService";
import { titleCase } from "@/utils/strings/titleCase";

export const getHealthTrackerName = (type: HealthTrackerTypes): string => {
  return LanguageService.translate(titleCase(type.replace(/_/gi, " ")));
};
