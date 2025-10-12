import { HealthTrackerTypes } from "@/types/healthTrackers";

/**
 * Health tracker field configurations for different types
 */
export const HEALTH_TRACKER_FIELD_CONFIGS = {
  [HealthTrackerTypes.BLOOD_PRESSURE]: {
    label1Key: "Systolic",
    label2Key: "Diastolic",
    placeholder1: "120",
    placeholder2: "80",
    hasSecondField: true,
    unit1Key: "mmHg",
    unit2Key: "mmHg",
  },
  [HealthTrackerTypes.HEART_RATE]: {
    label1Key: "Heart Rate (BPM)",
    label2Key: null,
    placeholder1: "72",
    placeholder2: null,
    hasSecondField: false,
    unit1Key: "BPM",
    unit2Key: null,
  },
  [HealthTrackerTypes.WEIGHT]: {
    label1Key: "Weight",
    label2Key: null,
    placeholder1: "70.5",
    placeholder2: null,
    hasSecondField: false,
    unit1Key: "kg",
    unit2Key: null,
  },
  [HealthTrackerTypes.BODY_TEMPERATURE]: {
    label1Key: "Temperature",
    label2Key: null,
    placeholder1: "36.6",
    placeholder2: null,
    hasSecondField: false,
    unit1Key: "°C",
    unit2Key: null,
  },
  [HealthTrackerTypes.MENSTRUAL_CYCLE]: {
    label1Key: "Cycle Day",
    label2Key: null,
    placeholder1: "1",
    placeholder2: null,
    hasSecondField: false,
    unit1Key: "day",
    unit2Key: null,
  },
} as const;
