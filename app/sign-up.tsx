import { useAuthSession } from "@/providers/AuthProvider";
import { type ReactNode, useState } from "react";
import { View, StyleSheet } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { BASIC_STYLES } from "@/constants/styling/basic";
import { AppColors } from "@/constants/styling/colors";
import { AuthType } from "@/services/auth/AuthService";
import { Title } from "@/components/typography/Title";
import { InlineLoader } from "@/components/loaders/InlineLoader";
import { getNewUserSchema } from "@/validation/user";
import { validateObject } from "@/utils/validation/validateObject";

export default function SignUp(): ReactNode {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { signIn, getIsAuthenticated } = useAuthSession();

  const onSignUpPress = async () => {
    try {
      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const { isValid, errors } = validateObject(getNewUserSchema(), {
    fullName,
    email,
    password,
  });

  const isButtonDisabled = isLoading || !isValid;

  return (
    <View style={BASIC_STYLES.screen}>
      <View style={styles.form}>
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
        <Button
          title={
            getIsAuthenticated()
              ? LanguageService.translate("Finish sign up")
              : LanguageService.translate("Sign Up")
          }
          onPress={onSignUpPress}
          disabled={isButtonDisabled}
          color={AppColors.POSITIVE}
        />
        <InlineLoader isLoading={isLoading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
});
