import type { MedicineData, MedicineFromApi } from "@/types/medicines";
import type { MedicineForms } from "@/constants/medicines";

export const getMedicineEmoji = ({
  form,
}: MedicineData | MedicineFromApi): string => {
  const emojiMap: {
    [K in MedicineForms]: string;
  } = {
    tablet: "💊",
    injection: "💉",
    solution: "🧪",
    drops: "💧",
    inhaler: "🌬️",
    powder: "🥄",
    other: "💊",
  };

  return emojiMap[form] || "💊";
};
