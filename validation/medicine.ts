import * as yup from "yup";
import { LanguageService } from "@/services/language/LanguageService";

export const getTitleSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Title is required"))
    .max(
      255,
      LanguageService.translate("Title cannot be long than 255 characters"),
    );

export const getNewMedicineSchema = () =>
  yup.object().shape({
    title: getTitleSchema(),
  });
