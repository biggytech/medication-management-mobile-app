import { HealthTrackerTypes } from "@/types/healthTrackers";
import { HEALTH_TRACKER_FIELD_CONFIGS } from "./constants";
import { LanguageService } from "@/services/language/LanguageService";

/**
 * Get field configuration for a specific health tracker type
 */
export const getFieldConfig = (type: HealthTrackerTypes) => {
  return HEALTH_TRACKER_FIELD_CONFIGS[type];
};

/**
 * Validate health tracker input values
 */
export const validateHealthTrackerInput = (
  type: HealthTrackerTypes,
  value1: string,
  value2?: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate value1 (always required)
  if (!value1.trim()) {
    errors.push(LanguageService.translate("Primary value is required"));
  } else {
    // Check if the string contains only valid numeric characters (digits, decimal point, optional minus)
    const numericRegex = /^-?\d*\.?\d+$/;
    if (!numericRegex.test(value1.trim())) {
      errors.push(
        LanguageService.translate("Primary value must be a valid number"),
      );
    } else {
      const numValue1 = parseFloat(value1);
      if (isNaN(numValue1)) {
        errors.push(
          LanguageService.translate("Primary value must be a number"),
        );
      } else {
        // Type-specific validation for value1
        switch (type) {
          case HealthTrackerTypes.BLOOD_PRESSURE:
            if (numValue1 < 50 || numValue1 > 300) {
              errors.push(
                LanguageService.translate(
                  "Systolic pressure should be between 50-300 mmHg",
                ),
              );
            }
            break;
          case HealthTrackerTypes.HEART_RATE:
            if (numValue1 < 30 || numValue1 > 300) {
              errors.push(
                LanguageService.translate(
                  "Heart rate should be between 30-300 BPM",
                ),
              );
            }
            break;
          case HealthTrackerTypes.WEIGHT:
            if (numValue1 < 10 || numValue1 > 500) {
              errors.push(
                LanguageService.translate("Weight should be between 10-500 kg"),
              );
            }
            break;
          case HealthTrackerTypes.BODY_TEMPERATURE:
            if (numValue1 < 30 || numValue1 > 45) {
              errors.push(
                LanguageService.translate(
                  "Temperature should be between 30-45°C",
                ),
              );
            }
            break;
          case HealthTrackerTypes.MENSTRUAL_CYCLE:
            if (numValue1 < 0 || numValue1 > 1) {
              errors.push(
                LanguageService.translate(
                  "Cycle day should be 0 (no) or 1 (yes)",
                ),
              );
            }
            break;
        }
      }
    }
  }

  // Validate value2 (only for blood pressure)
  if (type === HealthTrackerTypes.BLOOD_PRESSURE && value2 !== undefined) {
    if (!value2.trim()) {
      errors.push(
        LanguageService.translate(
          "Diastolic pressure is required for blood pressure",
        ),
      );
    } else {
      // Check if the string contains only valid numeric characters
      const numericRegex = /^-?\d*\.?\d+$/;
      if (!numericRegex.test(value2.trim())) {
        errors.push(
          LanguageService.translate(
            "Diastolic pressure must be a valid number",
          ),
        );
      } else {
        const numValue2 = parseFloat(value2);
        if (isNaN(numValue2)) {
          errors.push(
            LanguageService.translate("Diastolic pressure must be a number"),
          );
        } else if (numValue2 < 30 || numValue2 > 200) {
          errors.push(
            LanguageService.translate(
              "Diastolic pressure should be between 30-200 mmHg",
            ),
          );
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
