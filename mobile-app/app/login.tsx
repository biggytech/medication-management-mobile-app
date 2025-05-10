import { useAuthSession } from "@/providers/AuthProvider";
import { type ReactNode, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { LanguagePicker } from "@/components/LanguagePicker";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { BASIC_STYLES } from "@/constants/styling/basic";
import { APIService } from "@/services/APIService";
import { AppColors } from "@/constants/styling/colors";
import { Loader } from "@/components/Loader";
import { Spacings } from "@/constants/styling/spacings";
import { Link } from "@/components/Link";

export default function Login(): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { signIn } = useAuthSession();

  const login = async () => {
    // TODO: loading, errors, toasts
    const { token } = await APIService.login({
      username,
      password,
    });
    signIn(token);
  };

  const isButtonDisabled = isLoading || !username || !password;

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
          placeholder={LanguageService.translate("Username")}
          value={username}
          onChangeText={(text) => setUsername(text.trim())}
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
          onPress={login}
          disabled={isButtonDisabled}
          color={AppColors.POSITIVE}
        />
        <Link
          text={LanguageService.translate("I don't have account")}
          onPress={() => {
            // TODO: open registration screen
          }}
          style={styles.registerLink}
          textStyle={styles.registerLinkText}
        />
        <View
          style={[
            styles.loaderContainer,
            isLoading ? styles.loaderContainerVisible : {},
          ]}
          aria-hidden={!isLoading}
        >
          <Loader />
        </View>
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
  loaderContainer: {
    opacity: 0,
  },
  loaderContainerVisible: {
    opacity: 1,
  },
  registerLink: {
    marginTop: Spacings.STANDART,
  },
  registerLinkText: {
    textAlign: "center",
  },
});
