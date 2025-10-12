import type { SchedulableEntity, Schedule } from "@/types/common/schedules";
import { NotableEntity } from "@/types/common/notes";
import { IdableEntity } from "@/types/common/ids";

/**
 * Health tracker types available in the app
 */
export enum HealthTrackerTypes {
  BLOOD_PRESSURE = "blood_pressure",
  HEART_RATE = "heart_rate",
  WEIGHT = "weight",
  BODY_TEMPERATURE = "body_temperature",
  MENSTRUAL_CYCLE = "menstrual_cycle",
}

/**
 * Main health tracker data interface
 * Extends schedulable entity for tracking schedules and notable entity for notes
 */
export interface HealthTrackerData<DateType = Date>
  extends SchedulableEntity<DateType>,
    NotableEntity {
  type: HealthTrackerTypes;
  schedule: HealthTrackerSchedule<DateType>;
}

/**
 * Health tracker with ID for database operations
 */
export type HealthTrackerDataWithId<DateType = Date> =
  HealthTrackerData<DateType> & IdableEntity;

/**
 * Health tracker data from API (dates as strings)
 */
export type HealthTrackerFromApi = HealthTrackerDataWithId<string>;

/**
 * Health tracker schedule interface
 * Extends base schedule with health tracker specific properties
 */
export type HealthTrackerSchedule<DateType = Date> = Schedule<DateType>;
