import * as yup from "yup";
import { LanguageService } from "@/services/language/LanguageService";
import { HealthTrackerTypes } from "@/types/healthTrackers";

/**
 * Validation schema for health tracker type selection
 */
export const getHealthTrackerTypeSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Health tracker type is required"))
    .oneOf(Object.values(HealthTrackerTypes));

/**
 * Validation schema for the health tracker type screen
 */
export const getNewHealthTrackerTypeSchema = () =>
  yup.object().shape({
    type: getHealthTrackerTypeSchema(),
  });
