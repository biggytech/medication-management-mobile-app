import { LanguageService } from "@/services/language/LanguageService";
import type { SelectableActionListOption } from "@/components/common/inputs/SelectableActionList/types";
import { MedicationLogSkipReasons } from "@/types/medicationLogs";

export enum TakeDoseTimeOptions {
  now = "now",
  time = "time",
}

export const getTakeDoseTimeSelectableOptions =
  (): SelectableActionListOption<TakeDoseTimeOptions>[] => [
    {
      id: TakeDoseTimeOptions.now,
      title: LanguageService.translate("Now"),
    },
    {
      id: TakeDoseTimeOptions.time,
      title: LanguageService.translate("Time"),
    },
  ];

export const getSkipDoseReasonOptions =
  (): SelectableActionListOption<MedicationLogSkipReasons>[] => [
    {
      id: MedicationLogSkipReasons.FORGOT,
      title: LanguageService.translate(MedicationLogSkipReasons.FORGOT),
    },
    {
      id: MedicationLogSkipReasons.RAN_OUT,
      title: LanguageService.translate(MedicationLogSkipReasons.RAN_OUT),
    },
    {
      id: MedicationLogSkipReasons.NO_NEED,
      title: LanguageService.translate(MedicationLogSkipReasons.NO_NEED),
    },
    {
      id: MedicationLogSkipReasons.SIDE_EFFECTS,
      title: LanguageService.translate(MedicationLogSkipReasons.SIDE_EFFECTS),
    },
    {
      id: MedicationLogSkipReasons.COST_CONCERNS,
      title: LanguageService.translate(MedicationLogSkipReasons.COST_CONCERNS),
    },
    {
      id: MedicationLogSkipReasons.NOT_AVAILABLE,
      title: LanguageService.translate(MedicationLogSkipReasons.NOT_AVAILABLE),
    },
    {
      id: MedicationLogSkipReasons.OTHER,
      title: LanguageService.translate(MedicationLogSkipReasons.OTHER),
    },
  ];
