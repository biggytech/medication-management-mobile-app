import { LanguageService } from "@/services/language/LanguageService";
import type { SelectableActionListOption } from "@/components/common/inputs/SelectableActionList/types";

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
