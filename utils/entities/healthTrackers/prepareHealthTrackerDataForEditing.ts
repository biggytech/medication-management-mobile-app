import {
  HealthTrackerData,
  HealthTrackerFromApi,
} from "@/types/healthTrackers";

export const prepareHealthTrackerDataForEditing = (
  healthTracker: HealthTrackerFromApi,
): HealthTrackerData => {
  return {
    ...healthTracker,
    schedule: {
      ...healthTracker.schedule,
      endDate: healthTracker.schedule.endDate
        ? new Date(healthTracker.schedule.endDate)
        : null,
      nextTakeDate: healthTracker.schedule.nextTakeDate
        ? new Date(healthTracker.schedule.nextTakeDate)
        : null,
    },
    notes: healthTracker.notes || "",
  };
};
