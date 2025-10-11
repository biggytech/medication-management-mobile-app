import { MissedDoseReason } from "@/types/doseTracking";

export const MISSED_DOSE_REASONS = [
  { value: MissedDoseReason.FORGOT, label: "I forgot" },
  { value: MissedDoseReason.RAN_OUT, label: "Ran out of medication" },
  { value: MissedDoseReason.NO_NEED, label: "No need to take it" },
  { value: MissedDoseReason.SIDE_EFFECTS, label: "Side effects" },
  { value: MissedDoseReason.COST_CONCERNS, label: "Cost concerns" },
  { value: MissedDoseReason.NOT_AVAILABLE, label: "Medication not available" },
  { value: MissedDoseReason.OTHER, label: "Other" },
];

export const DOSE_STATUS_COLORS = {
  taken: "#6ebc5f", // POSITIVE
  missed: "#ff784f", // NEGATIVE
  rescheduled: "#88b4e8", // ACCENT
  pending: "#72b9bf", // SECONDARY
};

export const DOSE_STATUS_ICONS = {
  taken: "checkmark-circle",
  missed: "close-circle",
  rescheduled: "time",
  pending: "hourglass",
};
