import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/common/typography/Text";
import { Button } from "@/components/common/buttons/Button";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { getMedicineEmoji } from "@/utils/ui/getMedicineEmoji";
import { getMedicineDoseText } from "@/utils/ui/getMedicineDoseText";
import {
  formatDoseDate,
  formatDoseTime,
  getDoseStatusText,
  isDoseOverdue,
} from "./utils";
import { DOSE_STATUS_COLORS } from "./constants";
import { styles } from "./styles";
import type { DoseTrackingModalProps } from "./types";
import { TakeDoseModal } from "./TakeDoseModal";
import { SkipDoseModal } from "./SkipDoseModal";
import { RescheduleDoseModal } from "./RescheduleDoseModal";
import { ModalWithBackDrop } from "@/components/common/ModalWithBackDrop";

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

  const renderDoseItem = (dose: any, index: number) => {
    const isOverdue = isDoseOverdue(dose);
    const statusColor =
      DOSE_STATUS_COLORS[dose.status] || DOSE_STATUS_COLORS.pending;
    const statusText = getDoseStatusText(dose.status);

    return (
      <View key={index} style={styles.doseItem}>
        <Text style={styles.doseTime}>{formatDoseTime(dose)}</Text>
        <Text style={[styles.doseTime, { flex: 1, marginLeft: 8 }]}>
          {formatDoseDate(dose)}
        </Text>
        <View style={styles.doseStatus}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <ModalWithBackDrop
        onClose={onClose}
        title={LanguageService.translate("Dose Tracking")}
      >
        {/* Medicine Information */}
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineEmoji}>{getMedicineEmoji(medicine)}</Text>
          <View style={styles.medicineDetails}>
            <Text style={styles.medicineTitle}>{medicine.title}</Text>
            <Text style={styles.medicineDose}>
              {medicine.schedule.dose} {getMedicineDoseText(medicine)}
            </Text>
          </View>
        </View>

        {/* Last Dose Information */}
        {/*{trackingData.lastDose && (*/}
        {/*  <View style={styles.doseInfo}>*/}
        {/*    <Text style={styles.doseInfoTitle}>*/}
        {/*      {LanguageService.translate("Last Dose")}*/}
        {/*    </Text>*/}
        {/*    <Text style={styles.doseInfoText}>*/}
        {/*      {formatDoseDate(trackingData.lastDose)} at{" "}*/}
        {/*      {formatDoseTime(trackingData.lastDose)}*/}
        {/*    </Text>*/}
        {/*  </View>*/}
        {/*)}*/}

        {/* Next Dose Information */}
        {/*{trackingData.nextDose && (*/}
        {/*  <View style={styles.doseInfo}>*/}
        {/*    <Text style={styles.doseInfoTitle}>*/}
        {/*      {LanguageService.translate("Next Dose")}*/}
        {/*    </Text>*/}
        {/*    <Text style={styles.doseInfoText}>*/}
        {/*      {formatDoseDate(trackingData.nextDose)} at {formatDoseTime(trackingData.nextDose)}*/}
        {/*    </Text>*/}
        {/*  </View>*/}
        {/*)}*/}

        {/*/!* Overdue Doses *!/*/}
        {/*{trackingData.overdueDoses.length > 0 && (*/}
        {/*  <View style={styles.doseList}>*/}
        {/*    <Text style={styles.doseInfoTitle}>*/}
        {/*      {LanguageService.translate("Overdue doses")}*/}
        {/*    </Text>*/}
        {/*    {trackingData.overdueDoses.map(renderDoseItem)}*/}
        {/*  </View>*/}
        {/*)}*/}

        {/*/!* Today's Doses *!/*/}
        {/*{trackingData.todayDoses.length > 0 && (*/}
        {/*  <View style={styles.doseList}>*/}
        {/*    <Text style={styles.doseInfoTitle}>*/}
        {/*      {LanguageService.translate("Today's doses")}*/}
        {/*    </Text>*/}
        {/*    {trackingData.todayDoses.map(renderDoseItem)}*/}
        {/*  </View>*/}
        {/*)}*/}

        {/*/!* Empty State *!/*/}
        {/*{trackingData.overdueDoses.length === 0 && trackingData.todayDoses.length === 0 && (*/}
        {/*  renderEmptyState(LanguageService.translate("No doses today"))*/}
        {/*)}*/}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            text={LanguageService.translate("Take Dose")}
            onPress={handleTakeDose}
            color={AppColors.POSITIVE}
            style={styles.actionButton}
          />
          <Button
            text={LanguageService.translate("Skip Dose")}
            onPress={handleSkipDose}
            color={AppColors.NEGATIVE}
            style={styles.actionButton}
          />
          <Button
            text={LanguageService.translate("Reschedule Dose")}
            onPress={handleRescheduleDose}
            color={AppColors.ACCENT}
            style={styles.actionButton}
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
