import * as yup from "yup";
import { LanguageService } from "@/services/language/LanguageService";

export const getEmailSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Email is required"))
    .email(LanguageService.translate("Invalid email"))
    .max(
      255,
      LanguageService.translate("Email cannot be long than 255 characters"),
    );

export const getFullNameSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Full Name is required"))
    .max(
      255,
      LanguageService.translate("Full Name cannot be long than 255 characters"),
    );

export const getPasswordSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Password is required"))
    .min(
      8,
      LanguageService.translate("Password must contain at least 8 characters"),
    );

export const getNewUserSchema = () =>
  yup.object().shape({
    fullName: getFullNameSchema(),
    email: getEmailSchema(),
    password: getPasswordSchema(),
  });

export const getSignInDefaultSchema = () =>
  yup.object().shape({
    email: getEmailSchema(),
    password: getPasswordSchema(),
  });
