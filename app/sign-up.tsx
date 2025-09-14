import { useAuthSession } from "@/providers/AuthProvider";
import { type ReactNode, useState } from "react";
import { StyleSheet } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { AppColors } from "@/constants/styling/colors";
import { AuthType } from "@/services/auth/AuthService";
import { Title } from "@/components/typography/Title";
import { InlineLoader } from "@/components/loaders/InlineLoader";
import { getNewUserSchema } from "@/validation/user";
import { validateObject } from "@/utils/validation/validateObject";
import { Screen } from "@/components/Screen";
import { Form } from "@/components/Form";

export default function SignUp(): ReactNode {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { signIn, getIsAuthenticated } = useAuthSession();

  const onSignUpPress = async () => {
    if (getIsAuthenticated()) {
      await signIn(AuthType.ANONYMOUS_FINISH_SIGN_UP, {
        fullName,
        email,
        password,
      });
    } else {
      await signIn(AuthType.DEFAULT_SIGN_UP, {
        fullName,
        email,
        password,
      });
    }
  };

  return (
    <Screen>
      <Form
        getSchema={getNewUserSchema}
        data={{ fullName, email, password }}
        onSubmit={onSignUpPress}
        submitText={
          getIsAuthenticated()
            ? LanguageService.translate("Finish sign up")
            : LanguageService.translate("Sign Up")
        }
        style={styles.form}
      >
        {({ errors }) => (
          <>
            <Title>{LanguageService.translate("Sign Up")}</Title>
            <Input
              autoFocus
              placeholder={LanguageService.translate("Full Name")}
              value={fullName}
              onChangeText={(text) => setFullName(text.trim())}
              error={errors["fullName"]}
            />
            <Input
              autoFocus
              placeholder={LanguageService.translate("Email")}
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              error={errors["email"]}
            />
            <Input
              placeholder={LanguageService.translate("Password")}
              enterKeyHint={"done"}
              returnKeyType={"done"}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors["password"]}
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
