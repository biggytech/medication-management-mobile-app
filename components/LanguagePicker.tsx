import { useState, useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { LanguageService } from "@/services/language/LanguageService";
import { useScreenReload } from "@/hooks/navigation/useScreenReload";
import { AvailableLanguages, DEFAULT_LANGUAGE } from "@/constants/languages";
import { Spacings } from "@/constants/styling/spacings";
import { Fonts, FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";

interface LanguageOption {
  label: string;
  value: AvailableLanguages;
}

const LANGUAGES_OPTIONS: {
  [K in AvailableLanguages]: Omit<LanguageOption, "value">;
} = {
  [AvailableLanguages.EN]: { label: "🇺🇸  English" },
  [AvailableLanguages.RU]: { label: "🇷🇺  Русский" },
};

export const LanguagePicker = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    DEFAULT_LANGUAGE,
  );
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const { reloadScreen } = useScreenReload();

  useEffect(() => {
    (async () => {
      const language = await LanguageService.loadCurrentLanguage();
      if (language) {
        setSelectedLanguage(language);
      } else {
        await LanguageService.changeLanguage(DEFAULT_LANGUAGE);
      }
    })();
  }, []);

  const handleLanguageUpdated = async (option: LanguageOption) => {
    const language = option.value;

    setSelectedLanguage(language);
    setIsFocus(false);

    await LanguageService.changeLanguage(language);
    reloadScreen();
  };

  const options: LanguageOption[] = useMemo(() => {
    const keys = Object.keys(
      LANGUAGES_OPTIONS,
    ) as unknown as (keyof typeof LANGUAGES_OPTIONS)[];
    return keys.map((key) => ({
      value: key,
      ...LANGUAGES_OPTIONS[key],
    }));
  }, []);

  return (
    <View>
      {selectedLanguage && (
        <Dropdown
          style={[styles.dropdown, isFocus && styles.focusedDropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainer}
          iconStyle={styles.iconStyle}
          itemContainerStyle={styles.itemContainerStyle}
          itemTextStyle={styles.itemTextStyle}
          data={options}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? LanguageService.translate("Select") : "..."}
          value={selectedLanguage}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={handleLanguageUpdated}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {},
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: Spacings.SMALL,
    width: 120,
  },
  focusedDropdown: {
    borderColor: "blue",
  },
  placeholderStyle: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    fontFamily: Fonts.DEFAULT,
  },
  selectedTextStyle: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    fontFamily: Fonts.DEFAULT,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  itemContainerStyle: {},
  itemTextStyle: {
    fontSize: FontSizes.STANDART,
    color: AppColors.FONT,
    fontFamily: Fonts.DEFAULT,
  },
});
