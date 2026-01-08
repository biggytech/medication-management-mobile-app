import * as yup from "yup";
import { LanguageService } from "@/services/language/LanguageService";
import { SexTypes } from "@/constants/users";

export const getEmailSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Email is required"))
    .email(LanguageService.translate("Invalid email"));

export const getFullNameSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Full Name is required"))
    .min(1)
    .max(
      255,
      LanguageService.translate("Full Name cannot be long than 255 characters"),
    );

export const getPasswordSchema = ({
  isRequired = true,
}: {
  isRequired?: boolean;
} = {}) => {
  if (isRequired) {
    return yup
      .string()
      .min(
        8,
        LanguageService.translate(
          "Password must contain at least 8 characters",
        ),
      )
      .required(LanguageService.translate("Password is required"));
  } else {
    return yup
      .string()
      .nullable()
      .optional()
      .transform((value) => (value === "" ? null : value))
      .test(
        "min-length-if-provided",
        LanguageService.translate(
          "Password must contain at least 8 characters",
        ),
        (value) => {
          // If value is null/undefined/empty, it's valid (optional)
          if (!value || value.length === 0) {
            return true;
          }
          // If value is provided, it must be at least 8 characters
          return value.length >= 8;
        },
      );
  }
};

export const getNewUserSchema = () =>
  yup.object().shape({
    fullName: getFullNameSchema(),
    email: getEmailSchema(),
    password: getPasswordSchema(),
  });

export const getForgotPasswordSchema = () =>
  yup.object().shape({
    email: getEmailSchema(),
  });

export const getSignInDefaultSchema = () =>
  yup.object().shape({
    email: getEmailSchema(),
    password: getPasswordSchema(),
  });

export const getDateOfBirthSchema = () =>
  yup
    .date()
    .nullable()
    .optional()
    .max(
      new Date(),
      LanguageService.translate("Date of birth cannot be in the future"),
    );

export const getSexSchema = () =>
  yup
    .string()
    .nullable()
    .optional()
    .oneOf(
      Object.values(SexTypes),
      LanguageService.translate("Invalid sex value"),
    );

export const getUserProfileEditSchema = () =>
  yup.object().shape({
    fullName: getFullNameSchema(),
    email: getEmailSchema(),
    password: getPasswordSchema({
      isRequired: false,
    }),
    passwordConfirmation: yup
      .string()
      .nullable()
      .optional()
      .transform((value) => (value === "" ? null : value))
      .when("password", {
        is: (value: string | null | undefined) => value && value.length > 0,
        then: (schema) =>
          schema
            .required(LanguageService.translate("Confirm Password is required"))
            .oneOf(
              [yup.ref("password")],
              LanguageService.translate("Passwords do not match"),
            ),
        otherwise: (schema) => schema.nullable().optional(),
      }),
    sex: getSexSchema(),
    dateOfBirth: getDateOfBirthSchema(),
  });
