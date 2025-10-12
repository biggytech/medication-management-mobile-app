import type { HealthTrackerFromApi } from "@/types/healthTrackers";

export interface HealthTrackerTrackingModalProps {
  healthTracker: HealthTrackerFromApi;
  onClose: () => void;
}
