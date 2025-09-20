import * as yup from "yup";
import { LanguageService } from "@/services/language/LanguageService";
import { MedicineForms } from "@/constants/medicines";

export const getTitleSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Title is required"))
    .max(
      255,
      LanguageService.translate("Title cannot be long than 255 characters"),
    );

export const getFormSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Form is required"))
    .oneOf(Object.values(MedicineForms));

export const getNewMedicineTitleSchema = () =>
  yup.object().shape({
    title: getTitleSchema(),
  });

export const getNewMedicineFormSchema = () =>
  yup.object().shape({
    form: getFormSchema(),
  });
