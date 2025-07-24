import { useState } from "react"
import LoginScreen from "./screens/LoginScreen"
import { SafeAreaView } from "react-native"
import AppScreen from "./screens/AppScreen"
import TestScreen from "./screens/TestScreen"

export default function App() {
    const [ready, setReady] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TestScreen />
        </SafeAreaView>
    )
    // ---------------- Render ----------------
    if (!ready) {
        return <LoginScreen isLoading={isLoading} />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <AppScreen />
        </SafeAreaView>
    )
}
