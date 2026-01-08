import { useAuthSession } from "@/providers/AuthProvider";
import { type ReactNode, useState } from "react";
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

export default function SignUpScreen(): ReactNode {
  const onSubmit = async (data: { email: string }) => {
    await APIService.users.forgotPassword({ email: data.email });
    showSuccess(
      LanguageService.translate("New password will be sent to your email"),
    );
  };

  return (
    <Screen>
      <Form
        getSchema={getForgotPasswordSchema}
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
