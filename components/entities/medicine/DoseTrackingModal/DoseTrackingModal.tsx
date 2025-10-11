import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { getMedicineEmoji } from "@/utils/entities/medicine/getMedicineEmoji";
import { styles } from "./styles";
import type { DoseTrackingModalProps } from "./types";
import { TakeDoseModal } from "./TakeDoseModal";
import { SkipDoseModal } from "./SkipDoseModal";
import { RescheduleDoseModal } from "./RescheduleDoseModal";
import { ModalWithBackDrop } from "@/components/common/ModalWithBackDrop";
import type { DetailsCardItem } from "@/components/common/DetailsCard/types";
import { DetailsCard } from "@/components/common/DetailsCard";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";
import { isNotNullish } from "@/utils/types/isNotNullish";
import { isDueOrOverdueToday } from "@/utils/entities/medicine/isDueOrOverdueToday";
import { getMedicineDoseText } from "@/utils/entities/medicine/getMedicineDoseText";
import { IconButton } from "@/components/common/buttons/IconButton";
import { truncate } from "@/utils/ui/truncate";

/**
 * Modal component for tracking medication doses
 * Shows medicine information, dose history, and action buttons
 */
export const DoseTrackingModal: React.FC<DoseTrackingModalProps> = ({
  medicine,
  onClose,
  onDoseAction,
}) => {
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const handleTakeDose = () => {
    setShowTakeModal(true);
  };

  const handleSkipDose = () => {
    setShowSkipModal(true);
  };

  const handleRescheduleDose = () => {
    setShowRescheduleModal(true);
  };

  const handleTakeDoseSubmit = async (takenAt?: Date, notes?: string) => {
    setShowTakeModal(false);
    await onDoseAction("take", { takenAt, notes });
  };

  const handleSkipDoseSubmit = async (reason: any, notes?: string) => {
    setShowSkipModal(false);
    await onDoseAction("skip", { reason, notes });
  };

  const handleRescheduleDoseSubmit = async (
    rescheduledTo: Date,
    notes?: string,
  ) => {
    setShowRescheduleModal(false);
    await onDoseAction("reschedule", { rescheduledTo, notes });
  };

  const detailsItems: DetailsCardItem[] = useMemo(() => {
    return [
      isDueOrOverdueToday(medicine) && medicine.schedule.nextDoseDate
        ? {
            key: "planned",
            iconName: "calendar-outline",
            label: `${LanguageService.translate("Planned to")} ${hhmmFromDate(new Date(medicine.schedule.nextDoseDate))}`,
            value: "",
          }
        : null,
      isDueOrOverdueToday(medicine)
        ? {
            key: "dose",
            iconName: "information-circle-outline",
            label: `${LanguageService.translate("Take Dose")} ${medicine.schedule.dose} ${getMedicineDoseText(medicine)}`,
            value: "",
          }
        : null,
      Boolean(medicine.notes)
        ? {
            key: "notes",
            iconName: "clipboard-outline",
            label: truncate(medicine.notes!, 100),
          }
        : null,
      // TODO: add last medication log item
    ].filter(isNotNullish);
  }, [medicine]);

  return (
    <>
      <ModalWithBackDrop
        onClose={onClose}
        title={`${getMedicineEmoji(medicine)} ${medicine.title}`}
      >
        <DetailsCard items={detailsItems} noValues noPadding />

        <View style={styles.actionButtons}>
          <IconButton
            iconName={"close"}
            text={LanguageService.translate("Skip")}
            onPress={handleSkipDose}
            color={AppColors.NEGATIVE}
          />
          <IconButton
            iconName={"checkmark"}
            text={LanguageService.translate("Take")}
            onPress={handleTakeDose}
            color={AppColors.POSITIVE}
          />
          <IconButton
            iconName={"alarm-outline"}
            text={LanguageService.translate("Reschedule")}
            onPress={handleRescheduleDose}
            color={AppColors.ACCENT}
          />
        </View>
      </ModalWithBackDrop>

      {/* Sub-modals */}
      {showTakeModal && (
        <TakeDoseModal
          medicine={medicine}
          isVisible={showTakeModal}
          onClose={() => setShowTakeModal(false)}
          onTakeDose={handleTakeDoseSubmit}
        />
      )}

      {showSkipModal && (
        <SkipDoseModal
          medicine={medicine}
          isVisible={showSkipModal}
          onClose={() => setShowSkipModal(false)}
          onSkipDose={handleSkipDoseSubmit}
        />
      )}

      {showRescheduleModal && (
        <RescheduleDoseModal
          medicine={medicine}
          isVisible={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          onRescheduleDose={handleRescheduleDoseSubmit}
        />
      )}
    </>
  );
};
