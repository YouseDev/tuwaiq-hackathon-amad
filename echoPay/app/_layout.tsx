import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "../global.css"
import {
    Beiruti_400Regular,
    Beiruti_700Bold,
    useFonts,
} from "@expo-google-fonts/beiruti"
import { TransactionProvider } from "../context/TransactionContext"
import { AccountProvider } from "../context/AccountContext"
import { CardProvider } from "../context/CardContext"
import { VoiceProvider } from "../context/VoiceContext"
import { BillsProvider } from "../context/BillsContext"

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
        <AccountProvider>
            <TransactionProvider>
                <CardProvider>
                    <BillsProvider>
                        <VoiceProvider>
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
                        </VoiceProvider>
                    </BillsProvider>
                </CardProvider>
            </TransactionProvider>
        </AccountProvider>
    )
}
