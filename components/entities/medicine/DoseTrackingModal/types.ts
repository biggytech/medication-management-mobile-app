import type { MedicineFromApi } from "@/types/medicines";
import type { MissedDoseReason } from "@/types/doseTracking";

export interface DoseTrackingModalProps {
  medicine: MedicineFromApi;
  onClose: () => void;
  onDoseAction: (
    action: "take" | "skip" | "reschedule",
    data?: any,
  ) => Promise<void>;
}

export interface TakeDoseModalProps {
  medicine: MedicineFromApi;
  isVisible: boolean;
  onClose: () => void;
  onTakeDose: (takenAt?: Date, notes?: string) => Promise<void>;
}

export interface SkipDoseModalProps {
  medicine: MedicineFromApi;
  isVisible: boolean;
  onClose: () => void;
  onSkipDose: (reason: MissedDoseReason, notes?: string) => Promise<void>;
}

export interface RescheduleDoseModalProps {
  medicine: MedicineFromApi;
  isVisible: boolean;
  onClose: () => void;
  onRescheduleDose: (rescheduledTo: Date, notes?: string) => Promise<void>;
}

export interface DoseStatusBadgeProps {
  status: "taken" | "missed" | "rescheduled" | "pending";
}

export interface DoseTimeSelectorProps {
  selectedTime: Date | null;
  onTimeChange: (time: Date) => void;
  onClose: () => void;
}

export interface MissedReasonSelectorProps {
  selectedReason: MissedDoseReason | null;
  onReasonChange: (reason: MissedDoseReason) => void;
  onClose: () => void;
}
