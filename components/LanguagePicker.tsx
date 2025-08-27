import { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { LanguageService } from "@/services/language/LanguageService";
import { AvailableLanguages } from "@/constants/language";
import { Spacings } from "@/constants/styling/spacings";
import { Fonts, FontSizes } from "@/constants/styling/fonts";
import { AppColors } from "@/constants/styling/colors";
import { useCurrentLanguage } from "@/hooks/language/useCurrentLanguage";

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
  const { currentLanguage, updateCurrentLanguage } = useCurrentLanguage();

  const [isFocus, setIsFocus] = useState<boolean>(false);

  const handleLanguageUpdated = async (option: LanguageOption) => {
    const language = option.value;

    setIsFocus(false);

    await updateCurrentLanguage(language);
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
      {currentLanguage && (
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
          value={currentLanguage}
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
