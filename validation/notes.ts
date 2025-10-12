import * as yup from "yup";
import { LanguageService } from "@/services/language/LanguageService";

export const getNotesSchema = () =>
  yup
    .string()
    .nullable()
    .max(
      255,
      LanguageService.translate("Notes cannot be long than 255 characters"),
    );

export const getNotableEntityNotesSchema = () =>
  yup.object().shape({
    notes: getNotesSchema(),
  });
