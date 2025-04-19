import {useAuthSession} from "@/providers/AuthProvider";
import Uuid from "expo-modules-core/src/uuid";
import {ReactNode} from "react";
import {Button, Text, View} from "react-native";

// TODO: styles
// TODO: translations
export default function Login(): ReactNode {
    const {signIn} = useAuthSession();

    const login = () => {
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
            <Text>Login screen</Text>
            <Button title={"Login"} onPress={login} />
        </View>
    );
}
