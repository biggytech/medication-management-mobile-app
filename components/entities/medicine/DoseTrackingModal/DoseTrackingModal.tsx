import React, { useCallback, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { AppColors } from "@/constants/styling/colors";
import { LanguageService } from "@/services/language/LanguageService";
import { getMedicineEmoji } from "@/utils/entities/medicine/getMedicineEmoji";
import { styles } from "./styles";
import type { DoseTrackingModalProps } from "./types";
import { ModalWithBackDrop } from "@/components/common/ModalWithBackDrop";
import type { DetailsCardItem } from "@/components/common/DetailsCard/types";
import { DetailsCard } from "@/components/common/DetailsCard";
import { hhmmFromDate } from "@/utils/date/hhmmFromDate";
import { isNotNullish } from "@/utils/types/isNotNullish";
import { isDueOrOverdueToday } from "@/utils/schedules/isDueOrOverdueToday";
import { getMedicineDoseText } from "@/utils/entities/medicine/getMedicineDoseText";
import { IconButton } from "@/components/common/buttons/IconButton";
import { truncate } from "@/utils/ui/truncate";
import type { SelectableActionListInterface } from "@/components/common/inputs/SelectableActionList/types";
import { SelectableActionList } from "@/components/common/inputs/SelectableActionList";
import {
  getRescheduleOptions,
  getSkipDoseReasonOptions,
  getTakeDoseTimeSelectableOptions,
  type RescheduleOptionMinutes,
  TakeDoseTimeOptions,
} from "@/components/entities/medicine/DoseTrackingModal/constants";
import { useMutation } from "@tanstack/react-query";
import {
  type MedicationLogDataForInsert,
  MedicationLogSkipReasons,
} from "@/types/medicationLogs";
import { APIService } from "@/services/APIService";
import { queryClient } from "@/providers/QueryProvider";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { FEATURE_FLAGS } from "@/constants/featureFlags";
import type { RequiredField } from "@/utils/types/RequiredField";
import type { MedicineData } from "@/types/medicines";
import { addMinutes } from "@/utils/date/addMinutes";
import { prepareMedicineDataForEditing } from "@/utils/entities/medicine/prepareMedicineDataForEditing";

export const DoseTrackingModal: React.FC<DoseTrackingModalProps> = ({
  medicine,
  onClose,
}) => {
  const [showTakeDoseTimePicker, setShowTakeDoseTimePicker] =
    useState<boolean>(false);

  const { mutateAsync: takeMedicine, isPending: isTakingDoseRequestPending } =
    useMutation({
      mutationFn: async (data: MedicationLogDataForInsert) => {
        await APIService.medicationLogs.take(medicine, data);

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.MEDICINES.BY_DATE],
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.MEDICATION_LOGS.BY_DATE],
          }),
        ]);
      },
    });

  const { mutateAsync: skipMedicine, isPending: isSkippingDoseRequestPending } =
    useMutation({
      mutationFn: async (
        data: RequiredField<MedicationLogDataForInsert, "skipReason">,
      ) => {
        await APIService.medicationLogs.skip(medicine, data);

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.MEDICINES.BY_DATE],
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.MEDICATION_LOGS.BY_DATE],
          }),
        ]);
      },
    });

  const {
    mutateAsync: updateMedicine,
    isPending: isUpdateMedicineRequestPending,
  } = useMutation({
    mutationFn: async (data: MedicineData) => {
      await APIService.medicines.update(medicine.id, data);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEDICINES.BY_DATE],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEDICATION_LOGS.BY_DATE],
        }),
      ]);
    },
  });

  const takeDoseDateListRef = useRef<SelectableActionListInterface | null>(
    null,
  );
  const skipDoseReasonsListRef = useRef<SelectableActionListInterface | null>(
    null,
  );
  const rescheduleListRef = useRef<SelectableActionListInterface | null>(null);

  const handleTakeDose = useCallback(() => {
    takeDoseDateListRef.current?.show();
  }, []);

  const handleSkipDose = useCallback(() => {
    skipDoseReasonsListRef.current?.show();
  }, []);

  const handleRescheduleDose = useCallback(() => {
    rescheduleListRef.current?.show();
  }, []);

  const detailsItems: DetailsCardItem[] = useMemo(() => {
    return [
      isDueOrOverdueToday(medicine) && medicine.schedule.nextTakeDate
        ? {
            key: "planned",
            iconName: "calendar-outline",
            label: `${LanguageService.translate("Planned to")} ${hhmmFromDate(new Date(medicine.schedule.nextTakeDate))}`,
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
            value: "",
          }
        : null,
    ].filter(isNotNullish);
  }, [medicine]);

  const timeSelectableOptions = useMemo(
    () => getTakeDoseTimeSelectableOptions(),
    [],
  );

  const skipDoseReasonOptions = useMemo(() => getSkipDoseReasonOptions(), []);

  const rescheduleOptions = useMemo(() => getRescheduleOptions(), []);

  const handleTimeOptionSelected = useCallback(
    async (id: TakeDoseTimeOptions) => {
      if (id === TakeDoseTimeOptions.now) {
        await takeMedicine({
          date: new Date(),
        });
        onClose();
      } else if (id === TakeDoseTimeOptions.time) {
        setShowTakeDoseTimePicker(true);
        takeDoseDateListRef.current?.close();
      }
    },
    [onClose, takeMedicine],
  );

  const handleSkipReasonOptionSelected = useCallback(
    async (id: MedicationLogSkipReasons) => {
      await skipMedicine({
        date: new Date(),
        skipReason: id,
      });
      onClose();
    },
    [onClose, skipMedicine],
  );

  const handleRescheduleOptionSelected = useCallback(
    async (id: RescheduleOptionMinutes) => {
      const updatedMedicine = prepareMedicineDataForEditing(medicine);
      if (updatedMedicine.schedule.nextTakeDate) {
        updatedMedicine.schedule.nextTakeDate = addMinutes(
          updatedMedicine.schedule.nextTakeDate,
          id,
        );

        await updateMedicine(updatedMedicine);
      }

      onClose();
    },
    [medicine, onClose, updateMedicine],
  );

  const handleTakeDoseTimeChange = useCallback(
    async (event: DateTimePickerEvent, selectedDate?: Date) => {
      setShowTakeDoseTimePicker(false);

      if (selectedDate) {
        await takeMedicine({
          date: selectedDate,
        });
      }

      onClose();
    },
    [onClose, takeMedicine],
  );

  const isLoading =
    isTakingDoseRequestPending ||
    isSkippingDoseRequestPending ||
    isUpdateMedicineRequestPending;

  return (
    <>
      <ModalWithBackDrop
        onClose={onClose}
        title={`${getMedicineEmoji(medicine)} ${medicine.title}`}
        isLoading={isLoading}
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

          <SelectableActionList
            title={LanguageService.translate(
              "When did you take this medicine?",
            )}
            options={timeSelectableOptions}
            ref={takeDoseDateListRef}
            onSelect={handleTimeOptionSelected}
          />

          <SelectableActionList
            title={LanguageService.translate(
              "Why did you miss taking your medication?",
            )}
            options={skipDoseReasonOptions}
            ref={skipDoseReasonsListRef}
            onSelect={handleSkipReasonOptionSelected}
          />

          <SelectableActionList
            title={LanguageService.translate("What time should reschedule to?")}
            options={rescheduleOptions}
            ref={rescheduleListRef}
            onSelect={handleRescheduleOptionSelected}
          />
        </View>

        {showTakeDoseTimePicker && (
          <DateTimePicker
            {...({
              value: new Date(),
              mode: "time",
              is24Hour: true,
              display: Platform.OS === "ios" ? "spinner" : "spinner",
              onChange: handleTakeDoseTimeChange,
              minuteInterval: FEATURE_FLAGS.TIME_PICKER_INTERVAL,
            } as any)}
          />
        )}
      </ModalWithBackDrop>
    </>
  );
};
