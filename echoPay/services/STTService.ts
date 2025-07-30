import { useCallback, useEffect, useState } from "react"
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition"
import { useVoice } from "../context/VoiceContext"

/**
 * Simple STT Service for EchoPay
 * --------------------------------
 * • Arabic speech-to-text (ar-SA)
 * • Uses VoiceContext for state management
 * • Two-trigger processing system
 */
const useSTTService = () => {
    // Context states
    const {
        isSTTProcessing,
        setIsSTTProcessing,
        setFinalText,
        checkAndProcess,
        resetVoiceSession,
    } = useVoice()

    // Local STT states (for UI feedback only)
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [confidence, setConfidence] = useState<number>(0)
    const [error, setError] = useState<string>("")

    const continuous = true // keep session alive after silence

    /* ---------- Helpers ---------- */
    const checkAvailability = useCallback(async () => {
        try {
            return ExpoSpeechRecognitionModule.isRecognitionAvailable()
        } catch (err) {
            console.log("❌ STT availability check failed:", err)
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
            console.log("❌ Permission request failed:", err)
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
            console.log("✅ STT engine started")
            return true
        } catch (err) {
            console.log("❌ STT start failed:", err)
            setError("Failed to start speech recognition")
            return false
        }
    }, [])

    const stopEngine = useCallback(async () => {
        try {
            await ExpoSpeechRecognitionModule.stop()
            return true
        } catch (err) {
            console.log("❌ STT stop failed:", err)
            return false
        }
    }, [])

    /* ---------- Public API ---------- */
    const startListening = useCallback(async () => {
        console.log("🎯 STT: Starting listening session")

        // Reset context and local states
        resetVoiceSession()
        setError("")
        setTranscript("")

        // Mark STT as processing
        setIsSTTProcessing(true)

        if (!(await checkAvailability())) {
            setError("Speech recognition not available")
            setIsSTTProcessing(false)
            return false
        }
        if (!(await requestPermissions())) {
            setIsSTTProcessing(false)
            return false
        }

        return startEngine()
    }, [
        checkAvailability,
        requestPermissions,
        startEngine,
        resetVoiceSession,
        setIsSTTProcessing,
    ])

    const stopListening = useCallback(async () => {
        console.log("🎯 STT: Stopping listening session")
        await stopEngine()
        setIsListening(false)

        // STT engine stopped, but we might still be waiting for final result
        // Don't set isSTTProcessing = false here, let the result handler do it
    }, [stopEngine])

    /* ---------- Event Handlers ---------- */
    useSpeechRecognitionEvent("start", () => {
        setIsListening(true)
        setError("")
        console.log("🎙️ STT engine started listening")
    })

    useSpeechRecognitionEvent("end", () => {
        console.log("🔚 STT engine ended")
        setIsListening(false)

        // Don't mark processing as done here - let button release handler control this
        // This allows accumulation of multiple STT segments until button is released
        console.log(
            "⏳ STT engine ended, waiting for button release to complete processing",
        )
    })

    useSpeechRecognitionEvent("result", (e) => {
        const text = e.results?.[0]?.transcript ?? ""
        const conf = e.results?.[0]?.confidence ?? 0
        const isFinal = e.isFinal || false

        // Always update interim transcript for UI
        setTranscript(text)
        setConfidence(conf)

        if (conf > 0) {
            console.log(
                `🎙️ STT ${isFinal ? "(FINAL)" : "(interim)"}:`,
                text.slice(0, 30) + (text.length > 30 ? "..." : ""),
            )
        }

        if (isFinal && text.trim()) {
            console.log(
                "🎯 STT: Got final segment, accumulating:",
                text.slice(0, 30),
            )

            // Accumulate text instead of replacing (for continuous speech)
            setFinalText((prev) => {
                const accumulated = ((prev || "") + " " + text).trim()
                console.log(
                    "📝 Accumulated text:",
                    accumulated.slice(0, 50) + "...",
                )
                return accumulated
            })

            // Don't mark STT processing as done yet - wait for button release
            // The button release handler will call checkAndProcess()
            console.log(
                "⏳ STT segment complete, waiting for button release...",
            )
        }
    })

    useSpeechRecognitionEvent("error", (e: any) => {
        console.log("⚠️ STT error:", e)
        setError(`Speech recognition error: ${e.message || e.code}`)
        setIsListening(false)

        // Only mark processing as done for actual errors, not no-speech
        if (e.error !== "no-speech") {
            console.log("🚫 STT error - marking processing complete")
            setIsSTTProcessing(false)
        } else {
            console.log(
                "🤫 No speech detected - waiting for button release to complete",
            )
        }
    })

    /* ---------- Cleanup ---------- */
    useEffect(() => {
        return () => {
            void stopListening()
        }
    }, [stopListening])

    return {
        // Controls
        startListening,
        stopListening,
        // Local UI states
        isListening,
        transcript,
        confidence,
        error,
        hasError: !!error,
        isActive: isListening,
        // Context states (for debugging)
        isSTTProcessing,
    }
}

export default useSTTService
