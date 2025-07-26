import { useCallback, useEffect, useRef, useState } from "react"
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition"

/**
 * Minimal STT Service for EchoPay
 * --------------------------------
 * • Arabic speech‑to‑text (ar‑SA)
 * • Permission + availability checks
 * • No automatic retries / recovery
 */
const useSTTService = () => {
    /* ------------- State ------------- */
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [confidence, setConfidence] = useState<number>(0)
    const [error, setError] = useState<string>("")

    /* ------------- Refs ------------- */
    const wantListening = useRef(false) // whether the caller still wants STT
    const continuous = true // keep session alive after silence

    /* ---------- Helpers ---------- */
    const checkAvailability = useCallback(async () => {
        try {
            return ExpoSpeechRecognitionModule.isRecognitionAvailable()
        } catch (err) {
            console.error("❌ STT availability check failed:", err)
            return false
        }
    }, [])

    const requestPermissions = useCallback(async () => {
        try {
            const { granted } =
                await ExpoSpeechRecognitionModule.requestPermissionsAsync()
            if (!granted) setError("Microphone permission denied")
            return granted
        } catch (err) {
            console.error("❌ Permission request failed:", err)
            setError("Permission request failed")
            return false
        }
    }, [])

    const startEngine = useCallback(async () => {
        try {
            await ExpoSpeechRecognitionModule.start({
                lang: "ar-SA",
                interimResults: true,
                maxAlternatives: 0,
                continuous,
                requiresOnDeviceRecognition: false,
            })
            return true
        } catch (err) {
            console.error("❌ STT start failed:", err)
            setError("Failed to start speech recognition")
            return false
        }
    }, [])

    const stopEngine = useCallback(async () => {
        try {
            await ExpoSpeechRecognitionModule.stop()
            return true
        } catch (err) {
            console.error("❌ STT stop failed:", err)
            return false
        }
    }, [])

    /* ---------- Public API ---------- */
    const startListening = useCallback(async () => {
        setError("")
        setTranscript("")
        wantListening.current = true

        if (!(await checkAvailability())) {
            setError("Speech recognition not available")
            return false
        }
        if (!(await requestPermissions())) return false

        return startEngine()
    }, [checkAvailability, requestPermissions, startEngine])

    const stopListening = useCallback(async () => {
        wantListening.current = false
        await stopEngine()
        setIsListening(false)
    }, [stopEngine])

    /* ---------- Event Handlers ---------- */
    useSpeechRecognitionEvent("start", () => {
        setIsListening(true)
        setError("")
        console.log("🎙️ STT started")
    })

    useSpeechRecognitionEvent("end", () => {
        setIsListening(false)
        console.log("🔚 STT ended")
        // Auto‑restart only if user is still holding / requesting
        if (continuous && wantListening.current) startEngine()
    })

    useSpeechRecognitionEvent("result", (e) => {
        const text = e.results?.[0]?.transcript ?? ""
        const conf = e.results?.[0]?.confidence ?? 0
        setTranscript(text)
        setConfidence(conf)
    })

    useSpeechRecognitionEvent("error", (e: any) => {
        console.error("⚠️ STT error:", e)
        setError(`Speech recognition error: ${e.message || e.code}`)
        stopListening() // no recovery ‑ just stop
    })

    /* ---------- Cleanup ---------- */
    useEffect(() => {
        return () => {
            void stopListening() // <- fire‑and‑forget, returns undefined (void)
        }
    }, [stopListening])

    return {
        // Controls
        startListening,
        stopListening,
        // State
        isListening,
        transcript,
        confidence,
        error,
        hasError: !!error,
        isActive: isListening,
    }
}

export default useSTTService
