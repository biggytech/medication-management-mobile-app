import {useAuthSession} from "@/providers/AuthProvider";
import Uuid from "expo-modules-core/src/uuid";
import {ReactNode, useState, useEffect} from "react";
import {Button, Text, View, StyleSheet} from "react-native";
import { useTranslation } from "react-i18next";
import { Dropdown } from 'react-native-element-dropdown';
import {LanguageService} from "@/services/language/LanguageService";

// TODO: styles
// TODO: translations
export default function Login(): ReactNode {
    const {signIn} = useAuthSession();

    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        (async () => {
            const language = await (LanguageService.getInstance()).loadCurrentLanguage();
            if (language) {
                setSelectedLanguage(language)
            }
        })()
    }, []);

    useEffect(() => {
        (async () => {
            if (selectedLanguage) {
                await LanguageService.getInstance().changeLanguage(selectedLanguage)
            }
        })()
    }, [selectedLanguage])

    const renderLabel = () => {
        if (selectedLanguage || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };

    const login  = () => {
        // TODO: add authentication
        const random: string = Uuid.v4();
        signIn(random);
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View style={styles.container}>
                {renderLabel()}
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={[
                        {
                            label: '🇺🇸 English',
                            value: 'en-US'
                        },
                        {
                            label: '🇷🇺 Русский',
                            value: 'ru-RU'
                        }
                    ]}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={selectedLanguage}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setSelectedLanguage(item.value);
                        setIsFocus(false);
                    }}
                />
            </View>
            <Text>Login screen</Text>
            <Button title={LanguageService.getInstance().translate("Login")} onPress={login} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        width: 200
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
