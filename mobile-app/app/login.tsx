import { useAuthSession } from "@/providers/AuthProvider";
import type { ReactNode } from "react";
import { Button, View, StyleSheet } from "react-native";
import { LanguageService } from "@/services/language/LanguageService";
import { LanguagePicker } from "@/components/LanguagePicker";
import { Input } from "@/components/Input";
import { BASIC_STYLES } from "@/constants/styling/basic";

export default function Login(): ReactNode {
  const { signIn } = useAuthSession();

  const login = () => {
    // TODO: add authentication
    signIn("token");
  };

  return (
    <View style={BASIC_STYLES.screen}>
      <View style={styles.languagePickerContainer}>
        <LanguagePicker />
      </View>
      <View style={styles.form}>
        <Input autoFocus placeholder={LanguageService.translate("Username")} />
        <Input placeholder={LanguageService.translate("Password")} />
        <Button title={LanguageService.translate("Login")} onPress={login} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  languagePickerContainer: {
    marginLeft: "auto",
  },
  form: {
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
});
