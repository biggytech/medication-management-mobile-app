import type { MedicineFromApi } from "@/types/medicines";
import { LanguageService } from "@/services/language/LanguageService";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";
import { isOverdue } from "@/utils/entities/medicine/isOverdue";
import { ddmmyyyyFromDate } from "@/utils/date";

export const formatNextDoseDateShort = (medicine: MedicineFromApi) => {
  const {
    schedule: { nextDoseDate },
  } = medicine;

  if (!nextDoseDate) {
    return LanguageService.translate("Only as needed");
  }

  const nextDoseDateAsDate = new Date(nextDoseDate);

  if (isOverdue(medicine)) {
    const dueDateString = ddmmyyyyFromDate(nextDoseDateAsDate);
    const todayDateString = ddmmyyyyFromDate(new Date());

    if (dueDateString === todayDateString) {
      // show time only
      return `${LanguageService.translate("Overdue")}: ${hhmmFromDate(nextDoseDateAsDate)}`;
    }

    // show full overdue date
    return `${LanguageService.translate("Overdue")}: ${ddmmyyyyFromDate(nextDoseDateAsDate)} ${hhmmFromDate(nextDoseDateAsDate)}`;
  }

  return `${LanguageService.translate("Next dose")}: ${hhmmFromDate(nextDoseDateAsDate)}`;
};
