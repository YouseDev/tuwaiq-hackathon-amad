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

    if (!fontsLoaded) {
        return null
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen 
                    name="assistant" 
                    options={{ 
                        headerShown: false,
                        presentation: 'fullScreenModal',
                        animation: 'slide_from_bottom'
                    }} 
                />
            </Stack>
            <StatusBar style="dark" />
        </>
    )
}
