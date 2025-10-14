import type { MedicineData, MedicineFromApi } from "@/types/medicines";
import { LanguageService } from "@/services/language/LanguageService";
import { getMedicineDoseText } from "@/utils/entities/medicine/getMedicineDoseText";
import { isNotNullish } from "@/utils/types/isNotNullish";

/**
 * Get the display text for medicine count
 * @param medicine - The medicine object
 * @returns Formatted count text or empty string if no count
 */
export const getMedicineCountText = (
  medicine: MedicineData | MedicineFromApi,
): string => {
  if (!isNotNullish(medicine.count)) {
    return "";
  }

  return `${LanguageService.translate("Remaining")}: ${medicine.count} ${getMedicineDoseText(medicine)}`;
};

/**
 * Check if medicine has low count (≤3 doses)
 * @param medicine - The medicine object
 * @returns True if count is low
 */
export const isLowCount = (
  medicine: MedicineData | MedicineFromApi,
): boolean => {
  if (!isNotNullish(medicine.count)) {
    return false;
  }

  const remainingDoses = Math.floor(medicine.count / medicine.schedule.dose);
  return remainingDoses <= 3;
};

/**
 * Get low count warning text with emojis
 * @param medicine - The medicine object
 * @returns Warning text or empty string if not low count
 */
export const getLowCountWarningText = (
  medicine: MedicineData | MedicineFromApi,
): string => {
  if (!isLowCount(medicine) || !isNotNullish(medicine.count)) {
    return "";
  }

  const remainingDoses = Math.floor(medicine.count / medicine.schedule.dose);

  if (medicine.count <= 0) {
    return `⚠️ ${LanguageService.translate("The medicine is gone!")}`;
  }

  if (remainingDoses <= 0) {
    return `⚠️ ${LanguageService.translate("Not enough for one dose!")}`;
  }

  return `⚠️ ${LanguageService.translate("Only {count} doses left!").replace("{count}", remainingDoses.toString())}`;
};

/**
 * Get count display text for medicine list items
 * @param medicine - The medicine object
 * @returns Formatted count display text
 */
export const getMedicineCountDisplayText = (
  medicine: MedicineData | MedicineFromApi,
): string => {
  if (!isNotNullish(medicine.count)) {
    return "";
  }

  return getMedicineCountText(medicine);
};
