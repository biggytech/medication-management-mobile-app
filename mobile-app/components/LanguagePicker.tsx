import {useState, useEffect} from "react";
import { View, StyleSheet} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import {LanguageService} from "@/services/language/LanguageService";

interface LanguageOption {
    label: string;
    value: string;
}

const LANGUAGES_OPTIONS: LanguageOption[] = [
    {
        label: '🇺🇸  English',
        value: 'en-US'
    },
    {
        label: '🇷🇺  Русский',
        value: 'ru-RU'
    }
]

export const LanguagePicker = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(LanguageService.DEFAULT_LANGUAGE);
    const [isFocus, setIsFocus] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const language = await LanguageService.loadCurrentLanguage();
            if (language) {
                setSelectedLanguage(language)
            } else {
                await LanguageService.changeLanguage(LanguageService.DEFAULT_LANGUAGE);
            }
        })()
    }, []);

    const handleLanguageUpdated = async (option: LanguageOption) => {
        const language = option.value;

        setSelectedLanguage(language);
        setIsFocus(false)

        await LanguageService.changeLanguage(language)
    }

    return <View>
        {selectedLanguage && <Dropdown
            style={[styles.dropdown, isFocus && styles.focusedDropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.dropdownContainer}
            iconStyle={styles.iconStyle}
            itemContainerStyle={styles.itemContainerStyle}
            itemTextStyle={styles.itemTextStyle}
            data={LANGUAGES_OPTIONS}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? LanguageService.translate('Select') : '...'}
            value={selectedLanguage}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={handleLanguageUpdated}
        />}
    </View>
}

const styles = StyleSheet.create({
    dropdownContainer: {

    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: 120,
    },
    focusedDropdown: {
        borderColor: 'blue'
    },
    placeholderStyle: {
        fontSize: 14,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    itemContainerStyle: {
    },
    itemTextStyle: {
        fontSize: 14,
    }
});
