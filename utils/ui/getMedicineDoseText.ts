import type { MedicineData, MedicineFromApi } from "@/types/medicines";
import type { MedicineForms } from "@/constants/medicines";
import { LanguageService } from "@/services/language/LanguageService";

export const getMedicineDoseText = ({
  form,
}: MedicineData | MedicineFromApi): string => {
  const doseTextMap: {
    [K in MedicineForms]: string;
  } = {
    tablet: "pcs",
    injection: "shot(s)",
    solution: "solution(s)",
    drops: "drop(s)",
    inhaler: "zilch(s)",
    powder: "spoon(s)",
    other: "pcs",
  };

  return doseTextMap[form]
    ? LanguageService.translate(doseTextMap[form])
    : LanguageService.translate("pcs");
};
