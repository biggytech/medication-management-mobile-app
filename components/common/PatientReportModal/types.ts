export interface PatientReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSendReport: (startDate: Date, endDate: Date) => void;
  patientName: string;
  isLoading?: boolean;
}
