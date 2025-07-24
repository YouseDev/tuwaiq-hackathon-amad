import React, { useEffect, useState } from "react"
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition"
import { Beiruti_400Regular, Beiruti_700Bold } from "@expo-google-fonts/beiruti"
import { useFonts } from "expo-font"
import LoginTopSection from "./components/LoginTopSection"
import AppContainer from "./components/AppContainer"
import AppTopContainer from "./components/AppTopContainer"
import AppBottomContainer from "./components/AppBottomContainer"
import LoginLoadingSection from "./components/LoginLoadingSection"
import LoginReadySection from "./components/LoginReadySection"
import BankContainer from "./components/BankContainer"
import useSTTService from "./services/STTService"

export default function App() {
    // ---------------- App Core State  ----------------
    const [ready, setReady] = useState(false)
    const [hasLoggedIn, setHasLoggedIn] = useState(false)

    // Load fonts - Custom names for better organization
    const [fontsLoaded] = useFonts({
        AppFontRegular: Beiruti_400Regular,
        AppFontBold: Beiruti_700Bold,
    })

    // ---------------- STT Service (App-level) ----------------
    const stt = useSTTService()

    // ---------------- Login Success Handler ----------------
    const handleLoginSuccess = () => {
        console.log("🎉 Login success callback received!")
        setHasLoggedIn(true)
    }

    // ---------------- Initialization Logic ----------------
    const initialize = async () => {
        try {
            await requestMicrophonePermissions()

            // Fake loading for 2 seconds (better UX - not too fast)
            console.log("⏳ Starting 2 second loading delay...")
            await new Promise((resolve) => setTimeout(resolve, 2000))

            setReady(true)
            console.log("✅ EchoPay initialized successfully")
            
            // Start STT service after initialization
            console.log("🎤 Starting STT service at app level...")
        } catch (err) {
            console.error("❌ Initialization failed:", err)
        }
    }

    const requestMicrophonePermissions = async () => {
        try {
            console.log("🎤 Requesting microphone permissions...")
            const { granted } =
                await ExpoSpeechRecognitionModule.requestPermissionsAsync()

            if (granted) {
                console.log("✅ Microphone permission granted")
            } else {
                console.log(
                    "❌ Microphone permission denied - STT features may not work",
                )
                // Don't throw error - let user try manually in STT service
            }
        } catch (permError) {
            console.error("❌ Permission request failed:", permError)
            // Don't block initialization - user can grant later in STT service
        }
    }

    useEffect(() => {
        initialize()
    }, [])

    // ---------------- Main App ----------------
    return (
        <AppContainer>
            <AppTopContainer hasLoggedIn={hasLoggedIn}>
                <LoginTopSection fontsLoaded={fontsLoaded} />
            </AppTopContainer>

            {/* Bottom Section - 60% with Curved Top and Dark Background */}
            <AppBottomContainer hasLoggedIn={hasLoggedIn}>
                {!ready ? (
                    <LoginLoadingSection fontsLoaded={fontsLoaded} />
                ) : hasLoggedIn ? (
                    <BankContainer fontsLoaded={fontsLoaded} stt={stt} />
                ) : (
                    <LoginReadySection
                        fontsLoaded={fontsLoaded}
                        onLoginSuccess={handleLoginSuccess}
                        stt={stt}
                    />
                )}
            </AppBottomContainer>
        </AppContainer>
    )
}
