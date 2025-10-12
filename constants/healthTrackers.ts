import { HealthTrackerTypes } from "@/types/healthTrackers";

/**
 * Health tracker type options for selection in the wizard
 */
export const HEALTH_TRACKER_TYPE_OPTIONS = [
  {
    id: HealthTrackerTypes.BLOOD_PRESSURE,
    label: "Blood Pressure",
    icon: "💓",
    description: "Track your blood pressure readings",
  },
  {
    id: HealthTrackerTypes.HEART_RATE,
    label: "Heart Rate",
    icon: "❤️",
    description: "Monitor your heart rate",
  },
  {
    id: HealthTrackerTypes.WEIGHT,
    label: "Weight",
    icon: "⚖️",
    description: "Track your weight changes",
  },
  {
    id: HealthTrackerTypes.BODY_TEMPERATURE,
    label: "Body Temperature",
    icon: "🌡️",
    description: "Monitor your body temperature",
  },
  {
    id: HealthTrackerTypes.MENSTRUAL_CYCLE,
    label: "Menstrual Cycle",
    icon: "🌸",
    description: "Track your menstrual cycle",
  },
] as const;
