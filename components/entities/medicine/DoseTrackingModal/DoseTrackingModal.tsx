import React, { useCallback, useMemo, useRef } from "react";
import { View } from "react-native";
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
import { isDueOrOverdueToday } from "@/utils/entities/medicine/isDueOrOverdueToday";
import { getMedicineDoseText } from "@/utils/entities/medicine/getMedicineDoseText";
import { IconButton } from "@/components/common/buttons/IconButton";
import { truncate } from "@/utils/ui/truncate";
import type { SelectableActionListInterface } from "@/components/common/inputs/SelectableActionList/types";
import { SelectableActionList } from "@/components/common/inputs/SelectableActionList";
import {
  getTakeDoseTimeSelectableOptions,
  TakeDoseTimeOptions,
} from "@/components/entities/medicine/DoseTrackingModal/constants";
import { useMutation } from "@tanstack/react-query";
import type { MedicationLogDataForInsert } from "@/types/medicationLogs";
import { APIService } from "@/services/APIService";
import { queryClient } from "@/providers/QueryProvider";
import { QUERY_KEYS } from "@/constants/queries/queryKeys";

export const DoseTrackingModal: React.FC<DoseTrackingModalProps> = ({
  medicine,
  onClose,
}) => {
  const { mutateAsync: takeMedicine, isPending: isTakingDoseRequestPending } =
    useMutation({
      mutationFn: async (data: MedicationLogDataForInsert) => {
        await APIService.medicationLogs.take(medicine, data);

        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.MEDICINES.BY_DATE],
        });
      },
    });

  const takeDoseDateListRef = useRef<SelectableActionListInterface | null>(
    null,
  );

  const handleTakeDose = useCallback(() => {
    takeDoseDateListRef.current?.show();
  }, []);

  const handleSkipDose = useCallback(() => {}, []);

  const handleRescheduleDose = useCallback(() => {}, []);

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
            value: "",
          }
        : null,
      // TODO: add last medication log item
    ].filter(isNotNullish);
  }, [medicine]);

  const timeSelectableOptions = useMemo(
    () => getTakeDoseTimeSelectableOptions(),
    [],
  );

  const handleTimeOptionSelected = useCallback(
    async (id: TakeDoseTimeOptions) => {
      if (id === TakeDoseTimeOptions.now) {
        await takeMedicine({
          date: new Date(),
        });
        onClose();
      } else if (id === TakeDoseTimeOptions.time) {
      }
    },
    [onClose, takeMedicine],
  );

  const isLoading = isTakingDoseRequestPending;

  return (
    <>
      <ModalWithBackDrop
        onClose={onClose}
        title={`${getMedicineEmoji(medicine)} ${medicine.title}`}
        isLoading={isLoading}
      >
        <DetailsCard items={detailsItems} noValues noPadding />

        <View style={styles.actionButtons}>
          {/*TODO: undo skipping*/}
          <IconButton
            iconName={"close"}
            text={LanguageService.translate("Skip")}
            onPress={handleSkipDose}
            color={AppColors.NEGATIVE}
          />
          {/*TODO: undo taking*/}
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
        </View>
      </ModalWithBackDrop>
    </>
  );
};
