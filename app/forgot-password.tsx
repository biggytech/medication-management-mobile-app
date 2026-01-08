import { useAuthSession } from "@/providers/AuthProvider";
import React, { type ReactNode, useState } from "react";
import { StyleSheet } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/common/inputs/Input";
import { AuthData, AuthType } from "@/services/auth/AuthService";
import { Title } from "@/components/common/typography/Title";
import { getForgotPasswordSchema, getNewUserSchema } from "@/validation/user";
import { Screen } from "@/components/common/markup/Screen";
import { Form } from "@/components/common/inputs/Form";
import { boolean } from "yup";
import { APIService } from "@/services/APIService";
import { showSuccess } from "@/utils/ui/showSuccess";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";

enum Steps {
  INITIAL = "INITIAL",
  CODE_SENT = "CODE_SENT",
  FINISH = "FINISH",
}

export default function SignUpScreen(): ReactNode {
  const [currentStep, setCurrentStep] = useState<Steps>(Steps.INITIAL);

  const onSubmit = async (data: {
    email: string;
    code?: string | null;
    password?: string | null;
    passwordConfirmation?: string | null;
  }) => {
    if (currentStep === Steps.INITIAL) {
      await APIService.users.forgotPassword({ email: data.email });
      showSuccess(
        LanguageService.translate(
          "Verification code has been sent to your email",
        ),
        LanguageService.translate(
          "Please, check your email and enter verification code here",
        ),
        3000,
      );
      setCurrentStep(Steps.CODE_SENT);
    } else if (currentStep === Steps.CODE_SENT) {
      await APIService.users.confirmVerificationCode({
        email: data.email,
        code: data.code!,
      });
      setCurrentStep(Steps.FINISH);
    } else if (currentStep === Steps.FINISH) {
      await APIService.users.updateForgottenPassword({
        email: data.email,
        code: data.code!,
        password: data.password!,
      });
      showSuccess(LanguageService.translate("Profile updated successfully"));
      router.replace(AppScreens.LOGIN);
    }
  };

  return (
    <Screen>
      <Form
        getSchema={() =>
          getForgotPasswordSchema(
            currentStep === Steps.CODE_SENT,
            currentStep === Steps.FINISH,
          )
        }
        onSubmit={onSubmit}
        submitText={LanguageService.translate("Send")}
        style={styles.form}
      >
        {({ data, setValue, setTouched, errors }) => (
          <>
            <Title>
              {LanguageService.translate("I don't remember password")}
            </Title>
            <Input
              autoFocus
              placeholder={LanguageService.translate("Email")}
              value={data["email"]}
              onChangeText={(text) => setValue("email", text.trim())}
              onBlur={() => setTouched("email")}
              error={errors["email"]}
              autoComplete="email"
            />
            {currentStep === Steps.CODE_SENT && (
              <Input
                placeholder={LanguageService.translate("Verification code")}
                value={data["code"] ?? undefined}
                onChangeText={(text) => setValue("code", text.trim())}
                onBlur={() => setTouched("code")}
                error={errors["code"]}
              />
            )}
            {currentStep === Steps.FINISH && (
              <>
                <Input
                  placeholder={LanguageService.translate("Password")}
                  value={data.password || ""}
                  onChangeText={(text) => setValue("password", text)}
                  onBlur={() => setTouched("password")}
                  error={errors.password}
                  secureTextEntry
                />
                <Input
                  placeholder={LanguageService.translate("Confirm Password")}
                  value={data.passwordConfirmation || ""}
                  onChangeText={(text) =>
                    setValue("passwordConfirmation", text)
                  }
                  onBlur={() => setTouched("passwordConfirmation")}
                  error={errors.passwordConfirmation}
                  secureTextEntry
                />
              </>
            )}
          </>
        )}
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: "auto",
    marginBottom: "auto",
  },
});
