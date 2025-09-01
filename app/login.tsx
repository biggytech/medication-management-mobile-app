import { useAuthSession } from "@/providers/AuthProvider";
import { type ReactNode, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { LanguagePicker } from "@/components/LanguagePicker";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { BASIC_STYLES } from "@/constants/styling/basic";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { Link } from "@/components/Link";
import { AuthType } from "@/services/auth/AuthService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { InlineLoader } from "@/components/loaders/InlineLoader";

export default function Login(): ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { signIn } = useAuthSession();

  const onLoginPress = async () => {
    try {
      setIsLoading(true);

      await signIn(AuthType.DEFAULT, {
        email,
        password,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onWithoutLoginClick = async () => {
    try {
      setIsLoading(true);

      await signIn(AuthType.ANONYMOUS);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = isLoading || !email || !password;

  return (
    <View style={BASIC_STYLES.screen}>
      <View style={styles.languagePickerContainer}>
        <LanguagePicker />
      </View>
      <View style={styles.form}>
        <Image
          alt={"Медика"}
          source={require("../assets/images/logo/logo.png")}
          style={styles.logo}
        />
        <Input
          autoFocus
          placeholder={LanguageService.translate("Email")}
          value={email}
          onChangeText={(text) => setEmail(text.trim())}
        />
        <Input
          placeholder={LanguageService.translate("Password")}
          enterKeyHint={"done"}
          returnKeyType={"done"}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title={LanguageService.translate("Login")}
          onPress={onLoginPress}
          disabled={isButtonDisabled}
          color={AppColors.POSITIVE}
        />
        <Link
          text={LanguageService.translate("I don't have account")}
          onPress={async () => {
            router.replace(AppScreens.SIGN_UP);
          }}
          style={styles.registerLink}
          textStyle={styles.registerLinkText}
          disabled={isLoading}
        />
        <InlineLoader isLoading={isLoading} />
      </View>
      <View style={styles.bottom}>
        <View style={styles.withoutLoginButtonContainer}>
          <Button
            title={LanguageService.translate("Continue without login")}
            onPress={onWithoutLoginClick}
            color={AppColors.ACCENT}
            disabled={isLoading}
          />
        </View>
        <Link
          text={LanguageService.translate("I forgot my password")}
          onPress={() => {
            // TODO: open forgot password screen
          }}
          textStyle={styles.forgotPasswordLinkText}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  languagePickerContainer: {
    marginLeft: "auto",
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginBottom: Spacings.SMALL,
  },
  form: {
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  registerLink: {
    marginTop: Spacings.STANDART,
  },
  registerLinkText: {
    textAlign: "center",
  },
  bottom: {
    marginTop: "auto",
    alignItems: "center",
  },
  withoutLoginButtonContainer: {
    marginBottom: Spacings.STANDART,
  },
  forgotPasswordLinkText: {
    textAlign: "center",
  },
});
