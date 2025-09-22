import { useAuthSession } from "@/providers/AuthProvider";
import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/inputs/Input";
import { AuthType } from "@/services/auth/AuthService";
import { Title } from "@/components/typography/Title";
import { getNewUserSchema } from "@/validation/user";
import { Screen } from "@/components/Screen";
import { Form } from "@/components/inputs/Form";

export default function SignUpScreen(): ReactNode {
  const { signIn, getIsAuthenticated } = useAuthSession();

  const onSignUpPress = async (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    if (getIsAuthenticated()) {
      await signIn(AuthType.ANONYMOUS_FINISH_SIGN_UP, data);
    } else {
      await signIn(AuthType.DEFAULT_SIGN_UP, data);
    }
  };

  return (
    <Screen>
      <Form
        getSchema={getNewUserSchema}
        onSubmit={onSignUpPress}
        submitText={
          getIsAuthenticated()
            ? LanguageService.translate("Finish sign up")
            : LanguageService.translate("Sign Up")
        }
        style={styles.form}
      >
        {({ data, setValue, setTouched, errors }) => (
          <>
            <Title>{LanguageService.translate("Sign Up")}</Title>
            <Input
              autoFocus
              placeholder={LanguageService.translate("Full Name")}
              value={data["fullName"]}
              onChangeText={(text) => setValue("fullName", text.trim())}
              onBlur={() => setTouched("fullName")}
              error={errors["fullName"]}
            />
            <Input
              autoFocus
              placeholder={LanguageService.translate("Email")}
              value={data["email"]}
              onChangeText={(text) => setValue("email", text.trim())}
              onBlur={() => setTouched("email")}
              error={errors["email"]}
              autoComplete="email"
            />
            <Input
              placeholder={LanguageService.translate("Password")}
              enterKeyHint={"done"}
              returnKeyType={"done"}
              secureTextEntry
              value={data["password"]}
              onChangeText={(text) => setValue("password", text)}
              onBlur={() => setTouched("password")}
              error={errors["password"]}
              autoComplete="password-new"
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
