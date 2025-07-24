import { useCallback, useEffect, useRef, useState } from "react"
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition"

const MAX_RETRIES = 5

/**
 * STT Service for EchoPay - handles Arabic speech-to-text with robust error handling
 * Features:
 * - Arabic language support (ar-SA)
 * - Automatic retry logic with exponential backoff
 * - Network error recovery
 * - Proper permission handling
 */
const useSTTService = () => {
    /* ---------- Public State ---------- */
    const [isListening, setIsListening] = useState(false) // engine status
    const [recovering, setRecovering] = useState(false) // auto-retry loop
    const [transcript, setTranscript] = useState("")
    const [error, setError] = useState<string>("")
    const [confidence, setConfidence] = useState<number>(0)

    /* ---------- Private Refs ---------- */
    const wantListening = useRef(false) // user intent
    const retryCounter = useRef(0) // exponential back-off retries
    const retryTimerId = useRef<ReturnType<typeof setTimeout> | null>(null)

    /* ─────────── Availability / Permission ─────────── */

    const checkAvailability = useCallback(async () => {
        try {
            const available =
                ExpoSpeechRecognitionModule.isRecognitionAvailable()
            console.log("🔍 STT availability:", available)
            return available
        } catch (err) {
            console.error("❌ Failed to check STT availability:", err)
            return false
        }
    }, [])

    const requestPermissions = useCallback(async () => {
        try {
            const { granted } =
                await ExpoSpeechRecognitionModule.requestPermissionsAsync()
            console.log(`🎤 Mic permission ${granted ? "granted" : "denied"}`)
            if (!granted) {
                setError("Microphone permission denied")
            }
            return granted
        } catch (err) {
            console.error("❌ Failed to request permissions:", err)
            setError("Permission request failed")
            return false
        }
    }, [])

    /* ─────────────── Low-level Start / Stop ─────────────── */

    const startEngine = useCallback(async () => {
        try {
            await ExpoSpeechRecognitionModule.start({
                lang: "ar-SA", // Saudi Arabic
                interimResults: true,
                maxAlternatives: 0,
                continuous: true,
                requiresOnDeviceRecognition: false,
            })
            console.log("▶️ STT engine started")
            return true
        } catch (err) {
            console.error("❌ Failed to start STT engine:", err)
            return false
        }
    }, [])

    const stopEngine = useCallback(async () => {
        try {
            await ExpoSpeechRecognitionModule.stop()
            console.log("⏹️ STT engine stopped")
            return true
        } catch (err) {
            console.error("❌ Failed to stop STT engine:", err)
            return false
        }
    }, [])

    /* ─────────────── Auto-recovery Logic ─────────────── */

    const clearRetryTimer = () => {
        if (retryTimerId.current) {
            clearTimeout(retryTimerId.current)
            retryTimerId.current = null
        }
    }

    const scheduleRetry = useCallback(() => {
        clearRetryTimer()

        if (retryCounter.current >= MAX_RETRIES) {
            wantListening.current = false
            setRecovering(false)
            const msg = "Microphone unavailable. Please try again later."
            setError(msg)
            console.log("🚫 Max retries reached:", msg)
            return
        }

        const delay = Math.min(retryCounter.current, 4) ** 2 * 1000 // 0-16s exponential backoff
        console.log(`⏳ STT retry in ${delay / 1000}s...`)
        setRecovering(true)

        retryTimerId.current = setTimeout(async () => {
            retryCounter.current += 1
            if (await startEngine()) {
                retryCounter.current = 0
                setRecovering(false)
            } else {
                scheduleRetry() // recurse until success or max retries
            }
        }, delay)
    }, [startEngine])

    /* ─────────────── Public Controls ─────────────── */

    const startListening = useCallback(async () => {
        console.log("🎤 Starting STT listening...")
        wantListening.current = true
        setError("")
        setTranscript("")

        if (!(await checkAvailability())) {
            setError("Speech recognition not available on this device")
            return false
        }

        if (!(await requestPermissions())) {
            return false
        }

        // Try immediate start
        if (!(await startEngine())) {
            retryCounter.current = 1
            scheduleRetry()
        }
        return true
    }, [checkAvailability, requestPermissions, startEngine, scheduleRetry])

    const stopListening = useCallback(async () => {
        console.log("🛑 Stopping STT listening...")
        wantListening.current = false
        clearRetryTimer()
        setRecovering(false)
        await stopEngine()
    }, [stopEngine])

    /* ─────────────── Speech Recognition Event Handlers ─────────────── */

    useSpeechRecognitionEvent("start", () => {
        setIsListening(true)
        setRecovering(false)
        setError("")
        console.log("🎙️ STT session started")
    })

    useSpeechRecognitionEvent("end", () => {
        setIsListening(false)
        console.log("🔚 STT session ended")

        // In continuous mode, "end" events are normal after silence periods
        // Immediately restart to keep listening (no retry delay needed)
        if (wantListening.current) {
            console.log("🔄 Restarting STT for continuous listening...")
            // Reset retry counter since this is normal behavior
            retryCounter.current = 0
            startEngine()
        }
    })

    useSpeechRecognitionEvent("result", (e) => {
        const text = e.results?.[0]?.transcript ?? ""
        const conf = e.results?.[0]?.confidence ?? 0

        setTranscript(text)
        setConfidence(conf)

        console.log("📝 STT transcript:", text)
        console.log("🎯 STT confidence:", conf)
    })

    useSpeechRecognitionEvent("error", (e: any) => {
        console.log("⚠️ STT error:", e)

        if (e.code === "network") {
            console.log("📡 Network error - reconnecting...")
            setIsListening(false)
            scheduleRetry()
        } else {
            // Fatal error: stop retries
            wantListening.current = false
            clearRetryTimer()
            setRecovering(false)
            const msg = `Speech recognition error: ${e.message || e.code || "Unknown error"}`
            setError(msg)
            console.error("❌ Fatal STT error:", msg)
        }
    })

    /* ---------- Cleanup on Unmount ---------- */
    useEffect(() => {
        return () => {
            stopListening() // Ensure mic is released
        }
    }, [stopListening])

    /* ---------------- Public API ---------------- */
    return {
        // Controls
        startListening,
        stopListening,

        // State
        isListening,
        recovering,
        transcript,
        error,
        confidence,

        // Computed
        hasError: !!error,
        isActive: isListening || recovering,
    }
}

export default useSTTService
