import { useAuthSession } from "@/providers/AuthProvider";
import { type ReactNode, useState } from "react";
import { Image, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { LanguagePicker } from "@/components/common/inputs/LanguagePicker";
import { Input } from "@/components/common/inputs/Input";
import { Button } from "@/components/common/buttons/Button";
import { AppColors } from "@/constants/styling/colors";
import { Spacings } from "@/constants/styling/spacings";
import { Link } from "@/components/common/buttons/Link";
import { AuthType } from "@/services/auth/AuthService";
import { router } from "expo-router";
import { AppScreens } from "@/constants/navigation";
import { getSignInDefaultSchema } from "@/validation/user";
import { Screen } from "@/components/common/markup/Screen";
import { Form } from "@/components/common/inputs/Form";

export default function LoginScreen(): ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { signIn } = useAuthSession();

  const onLoginPress = async (data: { email: string; password: string }) => {
    await signIn(AuthType.DEFAULT_SIGN_IN, data);
  };

  const onWithoutLoginClick = async () => {
    try {
      setIsLoading(true);

      await signIn(AuthType.ANONYMOUS_SIGN_UP);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={"height"}
      >
        <View style={styles.languagePickerContainer}>
          <LanguagePicker />
        </View>
        <Form
          getSchema={getSignInDefaultSchema}
          style={styles.form}
          submitText={LanguageService.translate("Login")}
          onSubmit={onLoginPress}
          isDisabled={isLoading}
        >
          {({ data, setValue, setTouched, errors }) => (
            <>
              <Image
                alt={"Медика"}
                source={require("../assets/images/logo/logo.png")}
                style={styles.logo}
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
                autoComplete="password"
              />
            </>
          )}
        </Form>
        <Link
          text={LanguageService.translate("I don't have account")}
          onPress={() => {
            router.push(AppScreens.SIGN_UP);
          }}
          style={styles.registerLink}
          textStyle={styles.registerLinkText}
          disabled={isLoading}
        />
        <View style={styles.bottom}>
          <View style={styles.withoutLoginButtonContainer}>
            <Button
              text={LanguageService.translate("Continue without login")}
              onPress={onWithoutLoginClick}
              color={AppColors.ACCENT}
              disabled={isLoading}
            />
          </View>
          {/*<Link*/}
          {/*  text={LanguageService.translate("I forgot my password")}*/}
          {/*  onPress={() => {*/}
          {/*    // TODO: open forgot password screen*/}
          {/*  }}*/}
          {/*  textStyle={styles.forgotPasswordLinkText}*/}
          {/*  disabled={isLoading}*/}
          {/*/>*/}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: Spacings.STANDART,
    flex: 1,
  },
  languagePickerContainer: {
    marginLeft: "auto",
    elevation: 1,
    zIndex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    marginBottom: Spacings.SMALL,
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  registerLink: {
    marginTop: "auto",
    marginBottom: Spacings.BIG,
  },
  registerLinkText: {
    textAlign: "center",
  },
  bottom: {
    alignItems: "center",
  },
  withoutLoginButtonContainer: {
    marginBottom: Spacings.STANDART,
  },
  forgotPasswordLinkText: {
    textAlign: "center",
  },
});
