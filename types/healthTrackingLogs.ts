import { IdableEntity } from "@/types/common/ids";

/**
 * Health tracking log data for inserting new records
 */
export interface HealthTrackingLogData {
  date: Date;
  value1: number; // float - primary value (required for all types)
  value2: number | null; // float - secondary value (used for blood pressure)
}

/**
 * Health tracking log data for API insertion
 */
export type HealthTrackingLogDataForInsert = HealthTrackingLogData;

/**
 * Health tracking log with ID for database operations
 */
export type HealthTrackingLogWithId = HealthTrackingLogData & IdableEntity;

/**
 * Health tracking log data from API (dates as strings)
 */
export type HealthTrackingLogFromApi = HealthTrackingLogWithId & {
  date: string;
};
