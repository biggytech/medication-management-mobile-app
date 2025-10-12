import { LanguageService } from "@/services/language/LanguageService";
import { ddmmyyyyFromDate } from "@/utils/date";
import { SCHEDULE_TYPE_LABELS, ScheduleTypes } from "@/constants/schedules";
import type { Schedule } from "@/types/common/schedules";

export const formatScheduleInfo = (schedule: Schedule<string>) => {
  const scheduleTypeLabel = LanguageService.translate(
    SCHEDULE_TYPE_LABELS[schedule.type],
  );

  switch (schedule.type) {
    case ScheduleTypes.EVERY_DAY:
      return `${scheduleTypeLabel} - ${schedule.notificationTimes.length} ${LanguageService.translate("times")}`;
    case ScheduleTypes.EVERY_OTHER_DAY:
    case ScheduleTypes.EVERY_X_DAYS:
      return `${scheduleTypeLabel} - ${LanguageService.translate("Next dose")}: ${schedule.nextTakeDate ? ddmmyyyyFromDate(new Date(schedule.nextTakeDate)) : "N/A"}`;
    case ScheduleTypes.SPECIFIC_WEEK_DAYS:
      return `${scheduleTypeLabel} - ${schedule.daysOfWeek?.length || 0} ${LanguageService.translate("days selected")}`;
    case ScheduleTypes.ONLY_AS_NEEDED:
      return scheduleTypeLabel;
    default:
      return scheduleTypeLabel;
  }
};
