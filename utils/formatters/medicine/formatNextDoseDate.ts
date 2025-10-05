import type { MedicineFromApi } from "@/types/medicines";
import { LanguageService } from "@/services/language/LanguageService";
import { ddmmyyyyFromDate } from "@/utils/date";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";
import { isDoseOverdue } from "@/utils/formatters/medicine/isDoseOverdue";

export const formatNextDoseDate = (medicine: MedicineFromApi) => {
  const {
    schedule: { nextDoseDate },
  } = medicine;

  if (!nextDoseDate) {
    return LanguageService.translate("Only as needed");
  }

  const nextDoseDateAsDate = new Date(nextDoseDate);

  if (isDoseOverdue(medicine)) {
    return LanguageService.translate("Overdue");
  }

  return `${LanguageService.translate("Next dose")}: ${ddmmyyyyFromDate(nextDoseDateAsDate)} ${hhmmFromDate(nextDoseDateAsDate)}`;
};
