import { View, Text, ActivityIndicator } from "react-native"
import { useState, useEffect, useRef } from "react"
import TTSService from "../services/TTSService"

const LoginReadySection = ({
    fontsLoaded,
    onLoginSuccess,
    stt,
}: {
    fontsLoaded: boolean
    onLoginSuccess?: () => void
    stt: {
        startListening: () => Promise<boolean>
        stopListening: () => Promise<void>
        isListening: boolean
        recovering: boolean
        transcript: string
        error: string
        confidence: number
        isActive: boolean
    }
}) => {
    /* ---------- State ---------- */
    const [pin, setPin] = useState("")
    const [isWelcomeComplete, setIsWelcomeComplete] = useState(false)
    const [isProcessingPin, setIsProcessingPin] = useState(false)
    const maxPinLength = 4

    /* ---------- Voice Services (passed from parent) ---------- */

    /* ---------- Private Refs ---------- */
    const isProcessingRef = useRef(false) // Prevent double processing
    const accumulatedDigits = useRef<string[]>([]) // Track all digits spoken so far

    /* ---------- Auto-start voice and welcome message ---------- */
    useEffect(() => {
        const initializeLogin = async () => {
            // Play welcome message first (PRE-RECORDED - no cost!)
            await TTSService.speak("welcome", true)

            console.log("🔊 Welcome finished - ready for PIN")

            // Wait 7 seconds for audio to clear completely, then start listening
            setTimeout(() => {
                setIsWelcomeComplete(true)
                stt.startListening()
            }, 7000)
        }

        initializeLogin()
    }, [])

    /* ---------- Arabic Number Word Mapping ---------- */
    const arabicToDigit: { [key: string]: string } = {
        // Primary Arabic number words
        صفر: "0",
        واحد: "1",
        اثنين: "2",
        ثلاثة: "3",
        أربعة: "4",
        خمسة: "5",
        ستة: "6",
        سبعة: "7",
        ثمانية: "8",
        تسعة: "9",

        // Alternative pronunciations/spellings
        واحده: "1",
        اثنان: "2",
        اتنين: "2",
        تلاتة: "3",
        اربعة: "4",
        اربعه: "4",
        خمسه: "5",
        سته: "6",
        سبعه: "7",
        تمانية: "8",
        تسعه: "9",

        // Colloquial variations
        وحدة: "1",
        وحده: "1",
        تنين: "2",
        تلاته: "3",
        اربع: "4",
        خمس: "5",
        ست: "6",
        سبع: "7",
        تمانه: "8",
        تسع: "9",
    }

    /* ---------- Enhanced Number Extraction ---------- */
    const extractNumbers = (transcript: string): string[] => {
        const foundDigits: string[] = []

        // 1. Extract actual digits first
        const digitMatches = transcript.match(/\d/g) || []
        foundDigits.push(...digitMatches)

        // 2. Extract Arabic number words
        const words = transcript.split(/\s+/)

        for (const word of words) {
            const cleanWord = word.trim()
            if (arabicToDigit[cleanWord]) {
                foundDigits.push(arabicToDigit[cleanWord])
            }
        }

        return foundDigits
    }

    /* ---------- Simple PIN processing ---------- */
    useEffect(() => {
        if (!stt.transcript || !isWelcomeComplete || isProcessingRef.current) {
            return
        }

        const transcript = stt.transcript.trim()

        // Skip welcome message echoes
        if (
            transcript.includes("ادخل") ||
            transcript.includes("رمز") ||
            transcript.includes("أهلاً")
        ) {
            return
        }

        // Extract all numbers from current transcript (digits + Arabic words)
        const numbers = extractNumbers(transcript)

        console.log("📝 Current transcript:", transcript)
        console.log("🔢 Found numbers:", numbers)

        // Just add digits until we have 4
        if (
            numbers.length > 0 &&
            accumulatedDigits.current.length < maxPinLength
        ) {
            for (const digit of numbers) {
                if (accumulatedDigits.current.length < maxPinLength) {
                    accumulatedDigits.current.push(digit)
                    console.log(
                        "➕ Added digit:",
                        digit,
                        "PIN:",
                        accumulatedDigits.current.join(""),
                    )
                }
            }

            // Update UI
            setPin(accumulatedDigits.current.join(""))

            // Login when we have 4 digits
            if (accumulatedDigits.current.length >= maxPinLength) {
                const completedPin = accumulatedDigits.current
                    .slice(0, maxPinLength)
                    .join("")
                console.log(
                    "🎯 4 digits complete, logging in with:",
                    completedPin,
                )
                handlePinComplete(completedPin)
            }
        }
    }, [stt.transcript, isWelcomeComplete])

    /* ---------- Handle PIN completion ---------- */
    const handlePinComplete = async (completedPin: string) => {
        if (isProcessingRef.current) return

        isProcessingRef.current = true
        setIsProcessingPin(true)

        console.log("🔐 Processing PIN:", completedPin)

        // Show processing for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Play success and notify parent (keep STT running)
        await TTSService.speak("login_success", true)
        console.log("✅ Login successful!")

        onLoginSuccess?.()
    }

    /* ---------- PIN Display Component ---------- */
    const PinDisplay = () => (
        <View className="flex-row gap-6 justify-center items-center">
            {Array.from({ length: maxPinLength }).map((_, index) => (
                <View
                    key={index}
                    className={`w-16 h-16 rounded-full border-2 justify-center items-center ${
                        index < pin.length
                            ? "bg-blue-500 border-blue-500"
                            : "bg-transparent border-gray-400"
                    }`}
                >
                    {index < pin.length && (
                        <Text className="text-white text-xl font-bold">
                            {pin[index]}
                        </Text>
                    )}
                </View>
            ))}
        </View>
    )

    /* ---------- Processing Screen ---------- */
    if (isProcessingPin) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <ActivityIndicator
                    size="large"
                    color="#3b82f6"
                    className="mb-6"
                />
                <Text
                    className="text-white text-xl text-center"
                    style={{
                        fontFamily: fontsLoaded ? "AppFontBold" : "System",
                    }}
                >
                    جاري معالجة الرقم السري...
                </Text>
            </View>
        )
    }

    return (
        <View className="flex-1 justify-center items-center px-6">
            {/* PIN Display */}
            <View className="mb-8">
                <PinDisplay />
            </View>
        </View>
    )
}

export default LoginReadySection
