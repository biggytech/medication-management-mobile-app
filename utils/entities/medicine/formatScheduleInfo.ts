import type { MedicineFromApi } from "@/types/medicines";
import { LanguageService } from "@/services/language/LanguageService";
import {
  MEDICINE_SCHEDULE_TYPE_LABELS,
  MedicineScheduleTypes,
} from "@/constants/medicines";
import { ddmmyyyyFromDate } from "@/utils/date";

export const formatScheduleInfo = (schedule: MedicineFromApi["schedule"]) => {
  const scheduleTypeLabel = LanguageService.translate(
    MEDICINE_SCHEDULE_TYPE_LABELS[schedule.type],
  );

  switch (schedule.type) {
    case MedicineScheduleTypes.EVERY_DAY:
      return `${scheduleTypeLabel} - ${schedule.notificationTimes.length} ${LanguageService.translate("times")}`;
    case MedicineScheduleTypes.EVERY_OTHER_DAY:
    case MedicineScheduleTypes.EVERY_X_DAYS:
      return `${scheduleTypeLabel} - ${LanguageService.translate("Next dose")}: ${schedule.nextDoseDate ? ddmmyyyyFromDate(new Date(schedule.nextDoseDate)) : "N/A"}`;
    case MedicineScheduleTypes.SPECIFIC_WEEK_DAYS:
      return `${scheduleTypeLabel} - ${schedule.daysOfWeek?.length || 0} ${LanguageService.translate("days selected")}`;
    case MedicineScheduleTypes.ONLY_AS_NEEDED:
      return scheduleTypeLabel;
    default:
      return scheduleTypeLabel;
  }
};
