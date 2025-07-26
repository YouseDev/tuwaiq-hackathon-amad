import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "../global.css"
import {
    Beiruti_400Regular,
    Beiruti_700Bold,
    useFonts,
} from "@expo-google-fonts/beiruti"

export default function RootLayout() {
    /* -------- Fonts -------- */
    const [fontsLoaded] = useFonts({
        AppFontRegular: Beiruti_400Regular,
        AppFontBold: Beiruti_700Bold,
    })

    return (
        <>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="dark" />
        </>
    )
}
